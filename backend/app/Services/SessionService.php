<?php

namespace App\Services;

use App\Models\Session;
use App\Models\Flow;
use App\Models\Analytics;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SessionService
{
    /**
     * Create a new USSD session.
     */
    public function createSession(array $data): Session
    {
        $flow = Flow::findOrFail($data['flow_id']);

        $sessionId = $this->generateSessionId();

        $expiresAt = now()->addMinutes(30);

        $session = Session::create([
            'flow_id' => $data['flow_id'],
            'session_id' => $sessionId,
            'phone_number' => $data['phone_number'],
            'ussd_code' => $data['ussd_code'],
            'status' => 'active',
            'session_data' => $this->initializeSessionData($flow),
            'user_inputs' => [],
            'current_node' => $flow->flow_data['nodes'][0]['id'] ?? null,
            'step_count' => 0,
            'started_at' => now(),
            'last_activity_at' => now(),
            'expires_at' => $expiresAt,
        ]);

        // Log session start analytics
        $this->logAnalytics($session, 'session_started', [
            'flow_name' => $flow->name,
            'ussd_code' => $data['ussd_code'],
        ]);

        return $session;
    }

    /**
     * Get session by session ID.
     */
    public function getSession(string $sessionId): ?Session
    {
        return Session::where('session_id', $sessionId)->first();
    }

    /**
     * Get active session for phone number and USSD code.
     */
    public function getActiveSession(string $phoneNumber, string $ussdCode): ?Session
    {
        return Session::where('phone_number', $phoneNumber)
            ->where('ussd_code', $ussdCode)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->first();
    }

    /**
     * Process user input and update session.
     */
    public function processInput(Session $session, string $input): array
    {
        // Update session activity
        $session->update([
            'last_activity_at' => now(),
            'step_count' => $session->step_count + 1,
        ]);

        // Add input to history
        $userInputs = $session->user_inputs ?? [];
        $userInputs[] = [
            'input' => $input,
            'timestamp' => now()->toISOString(),
            'step' => $session->step_count,
        ];
        $session->update(['user_inputs' => $userInputs]);

        // Log input analytics
        $this->logAnalytics($session, 'input_received', [
            'input' => $input,
            'step' => $session->step_count,
        ]);

        // Process the input based on current node
        return $this->processNodeInput($session, $input);
    }

    /**
     * Navigate to next node in flow.
     */
    public function navigateToNode(Session $session, string $nodeId): array
    {
        $flow = $session->flow;
        $flowData = $flow->flow_data;

        // Find the target node
        $targetNode = collect($flowData['nodes'])->firstWhere('id', $nodeId);

        if (!$targetNode) {
            return $this->handleError($session, 'Node not found: ' . $nodeId);
        }

        // Update session with new node
        $session->update([
            'current_node' => $nodeId,
            'last_activity_at' => now(),
        ]);

        // Log node visit analytics
        $this->logAnalytics($session, 'node_visited', [
            'node_id' => $nodeId,
            'node_type' => $targetNode['type'] ?? 'unknown',
        ]);

        return [
            'success' => true,
            'node' => $targetNode,
            'session_id' => $session->session_id,
        ];
    }

    /**
     * Complete the session.
     */
    public function completeSession(Session $session): void
    {
        $session->update([
            'status' => 'completed',
            'completed_at' => now(),
            'last_activity_at' => now(),
        ]);

        // Log session completion analytics
        $this->logAnalytics($session, 'session_completed', [
            'duration' => $session->started_at->diffInSeconds(now()),
            'steps' => $session->step_count,
        ]);

        // Increment flow usage
        $session->flow->incrementUsage();
    }

    /**
     * Terminate the session.
     */
    public function terminateSession(Session $session, string $reason = 'user_terminated'): void
    {
        $session->update([
            'status' => 'terminated',
            'last_activity_at' => now(),
        ]);

        // Log session termination analytics
        $this->logAnalytics($session, 'session_terminated', [
            'reason' => $reason,
            'duration' => $session->started_at->diffInSeconds(now()),
        ]);
    }

    /**
     * Expire old sessions.
     */
    public function expireOldSessions(): int
    {
        $expiredSessions = Session::where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expiredSessions as $session) {
            $session->update(['status' => 'expired']);

            // Log session expiration analytics
            $this->logAnalytics($session, 'session_expired', [
                'duration' => $session->started_at->diffInSeconds($session->expires_at),
            ]);
        }

        return $expiredSessions->count();
    }

    /**
     * Get session statistics for a user.
     */
    public function getUserSessionStats(int $userId, array $filters = []): array
    {
        $query = Session::whereHas('flow', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });

        // Apply date filters
        if (isset($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date']);
        }

        $sessions = $query->get();

        return [
            'total_sessions' => $sessions->count(),
            'completed_sessions' => $sessions->where('status', 'completed')->count(),
            'active_sessions' => $sessions->where('status', 'active')->count(),
            'expired_sessions' => $sessions->where('status', 'expired')->count(),
            'terminated_sessions' => $sessions->where('status', 'terminated')->count(),
            'average_duration' => $sessions->where('status', 'completed')->avg('duration'),
            'average_steps' => $sessions->avg('step_count'),
        ];
    }

    /**
     * Generate unique session ID.
     */
    private function generateSessionId(): string
    {
        do {
            $sessionId = 'sess_' . Str::random(16);
        } while (Session::where('session_id', $sessionId)->exists());

        return $sessionId;
    }

    /**
     * Initialize session data from flow.
     */
    private function initializeSessionData(Flow $flow): array
    {
        return [
            'flow_id' => $flow->id,
            'flow_name' => $flow->name,
            'variables' => $flow->variables ?? [],
            'session_variables' => [],
            'navigation_history' => [],
        ];
    }

    /**
     * Process input based on current node.
     */
    private function processNodeInput(Session $session, string $input): array
    {
        $flow = $session->flow;
        $currentNode = $this->getCurrentNode($session);

        if (!$currentNode) {
            return $this->handleError($session, 'Current node not found');
        }

        // Handle different node types
        switch ($currentNode['type'] ?? 'menu') {
            case 'input':
                return $this->handleInputNode($session, $currentNode, $input);
            case 'menu':
                return $this->handleMenuNode($session, $currentNode, $input);
            case 'payment':
                return $this->handlePaymentNode($session, $currentNode, $input);
            default:
                return $this->handleDefaultNode($session, $currentNode, $input);
        }
    }

    /**
     * Get current node data.
     */
    private function getCurrentNode(Session $session): ?array
    {
        $flowData = $session->flow->flow_data;
        return collect($flowData['nodes'])->firstWhere('id', $session->current_node);
    }

    /**
     * Handle input node processing.
     */
    private function handleInputNode(Session $session, array $node, string $input): array
    {
        // Validate input based on node configuration
        $validation = $node['validation'] ?? [];

        if (isset($validation['required']) && $validation['required'] && empty($input)) {
            return $this->handleError($session, 'Input is required');
        }

        if (isset($validation['pattern']) && !preg_match($validation['pattern'], $input)) {
            return $this->handleError($session, 'Invalid input format');
        }

        // Store input in session variables
        $sessionData = $session->session_data;
        $sessionData['session_variables'][$node['variable'] ?? 'input'] = $input;
        $session->update(['session_data' => $sessionData]);

        // Navigate to next node
        $nextNodeId = $node['next_node'] ?? null;
        if ($nextNodeId) {
            return $this->navigateToNode($session, $nextNodeId);
        }

        return $this->completeSession($session);
    }

    /**
     * Handle menu node processing.
     */
    private function handleMenuNode(Session $session, array $node, string $input): array
    {
        $options = $node['options'] ?? [];
        $selectedOption = collect($options)->firstWhere('value', $input);

        if (!$selectedOption) {
            return $this->handleError($session, 'Invalid option selected');
        }

        // Navigate to selected option's next node
        $nextNodeId = $selectedOption['next_node'] ?? null;
        if ($nextNodeId) {
            return $this->navigateToNode($session, $nextNodeId);
        }

        return $this->completeSession($session);
    }

    /**
     * Handle payment node processing.
     */
    private function handlePaymentNode(Session $session, array $node, string $input): array
    {
        // Log payment initiation
        $this->logAnalytics($session, 'payment_initiated', [
            'amount' => $node['amount'] ?? 0,
            'currency' => $node['currency'] ?? 'GHS',
        ]);

        // For now, simulate payment processing
        // In real implementation, integrate with payment gateways
        $nextNodeId = $node['success_node'] ?? null;
        if ($nextNodeId) {
            return $this->navigateToNode($session, $nextNodeId);
        }

        return $this->completeSession($session);
    }

    /**
     * Handle default node processing.
     */
    private function handleDefaultNode(Session $session, array $node, string $input): array
    {
        // Default behavior - navigate to next node or complete
        $nextNodeId = $node['next_node'] ?? null;
        if ($nextNodeId) {
            return $this->navigateToNode($session, $nextNodeId);
        }

        return $this->completeSession($session);
    }

    /**
     * Handle errors in session processing.
     */
    private function handleError(Session $session, string $errorMessage): array
    {
        // Log error analytics
        $this->logAnalytics($session, 'error_occurred', [
            'error_message' => $errorMessage,
            'current_node' => $session->current_node,
        ]);

        return [
            'success' => false,
            'error' => $errorMessage,
            'session_id' => $session->session_id,
        ];
    }

    /**
     * Log analytics event.
     */
    private function logAnalytics(Session $session, string $eventType, array $eventData = []): void
    {
        try {
            Analytics::create([
                'user_id' => $session->flow->user_id,
                'flow_id' => $session->flow_id,
                'session_id' => $session->session_id,
                'phone_number' => $session->phone_number,
                'event_type' => $eventType,
                'event_data' => $eventData,
                'node_id' => $session->current_node,
                'telco' => $this->detectTelco($session->phone_number),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log analytics', [
                'session_id' => $session->session_id,
                'event_type' => $eventType,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Detect telco from phone number.
     */
    private function detectTelco(string $phoneNumber): string
    {
        $phoneNumber = preg_replace('/[^0-9]/', '', $phoneNumber);

        if (preg_match('/^(233|0)24/', $phoneNumber)) {
            return 'mtn';
        } elseif (preg_match('/^(233|0)20/', $phoneNumber)) {
            return 'telecel';
        } elseif (preg_match('/^(233|0)27/', $phoneNumber)) {
            return 'AirtelTigo';
        }

        return 'unknown';
    }
}
