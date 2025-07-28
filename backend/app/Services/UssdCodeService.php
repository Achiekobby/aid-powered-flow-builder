<?php

namespace App\Services;

use App\Models\UssdCode;
use App\Models\Flow;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class UssdCodeService
{
    /**
     * Create a new USSD code.
     */
    public function createUssdCode(array $data): UssdCode
    {
        $this->validateUssdCode($data['code']);

        if ($this->isCodeTaken($data['code'])) {
            throw new \Exception('USSD code is already taken');
        }

        $this->checkUserCodeLimit($data['user_id']);

        $ussdCode = UssdCode::create([
            'user_id' => $data['user_id'],
            'flow_id' => $data['flow_id'] ?? null,
            'code' => $data['code'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'status' => 'pending',
            'telco' => $data['telco'] ?? 'all',
            'settings' => $data['settings'] ?? [],
        ]);

        Log::info('USSD code created', [
            'user_id' => $data['user_id'],
            'code' => $data['code'],
            'name' => $data['name'],
        ]);

        return $ussdCode;
    }

    /**
     * Get USSD code by ID.
     */
    public function getUssdCode(int $id): ?UssdCode
    {
        return UssdCode::find($id);
    }

    /**
     * Get USSD code by code string.
     */
    public function getUssdCodeByCode(string $code): ?UssdCode
    {
        return UssdCode::where('code', $code)->first();
    }

    /**
     * Get user's USSD codes.
     */
    public function getUserUssdCodes(int $userId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = UssdCode::where('user_id', $userId);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['telco'])) {
            $query->where('telco', $filters['telco']);
        }

        if (isset($filters['flow_id'])) {
            $query->where('flow_id', $filters['flow_id']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Update USSD code.
     */
    public function updateUssdCode(UssdCode $ussdCode, array $data): UssdCode
    {
        if (isset($data['code']) && $data['code'] !== $ussdCode->code) {
            $this->validateUssdCode($data['code']);

            if ($this->isCodeTaken($data['code'])) {
                throw new \Exception('USSD code is already taken');
            }
        }

        $ussdCode->update($data);

        Log::info('USSD code updated', [
            'ussd_code_id' => $ussdCode->id,
            'code' => $ussdCode->code,
            'updated_fields' => array_keys($data),
        ]);

        return $ussdCode;
    }

    /**
     * Delete USSD code.
     */
    public function deleteUssdCode(UssdCode $ussdCode): bool
    {
        if ($ussdCode->sessions()->where('status', 'active')->exists()) {
            throw new \Exception('Cannot delete USSD code with active sessions');
        }

        $code = $ussdCode->code;
        $userId = $ussdCode->user_id;

        $ussdCode->delete();

        Log::info('USSD code deleted', [
            'user_id' => $userId,
            'code' => $code,
        ]);

        return true;
    }

    /**
     * Activate USSD code.
     */
    public function activateUssdCode(UssdCode $ussdCode): UssdCode
    {
        if (!$ussdCode->flow_id) {
            throw new \Exception('Cannot activate USSD code without assigned flow');
        }

        $ussdCode->activate();

        Log::info('USSD code activated', [
            'ussd_code_id' => $ussdCode->id,
            'code' => $ussdCode->code,
        ]);

        return $ussdCode;
    }

    /**
     * Deactivate USSD code.
     */
    public function deactivateUssdCode(UssdCode $ussdCode): UssdCode
    {
        $ussdCode->deactivate();

        Log::info('USSD code deactivated', [
            'ussd_code_id' => $ussdCode->id,
            'code' => $ussdCode->code,
        ]);

        return $ussdCode;
    }

    /**
     * Suspend USSD code.
     */
    public function suspendUssdCode(UssdCode $ussdCode, string $reason = null): UssdCode
    {
        $ussdCode->suspend();

        Log::info('USSD code suspended', [
            'ussd_code_id' => $ussdCode->id,
            'code' => $ussdCode->code,
            'reason' => $reason,
        ]);

        return $ussdCode;
    }

    /**
     * Assign flow to USSD code.
     */
    public function assignFlow(UssdCode $ussdCode, int $flowId): UssdCode
    {
        $flow = Flow::where('id', $flowId)
            ->where('user_id', $ussdCode->user_id)
            ->first();

        if (!$flow) {
            throw new \Exception('Flow not found or does not belong to user');
        }

        $ussdCode->update(['flow_id' => $flowId]);

        Log::info('Flow assigned to USSD code', [
            'ussd_code_id' => $ussdCode->id,
            'code' => $ussdCode->code,
            'flow_id' => $flowId,
        ]);

        return $ussdCode;
    }

    /**
     * Unassign flow from USSD code.
     */
    public function unassignFlow(UssdCode $ussdCode): UssdCode
    {
        $ussdCode->update(['flow_id' => null]);

        Log::info('Flow unassigned from USSD code', [
            'ussd_code_id' => $ussdCode->id,
            'code' => $ussdCode->code,
        ]);

        return $ussdCode;
    }

    /**
     * Get available USSD codes for assignment.
     */
    public function getAvailableCodes(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return UssdCode::where('user_id', $userId)
            ->where('status', 'active')
            ->whereNull('flow_id')
            ->get();
    }

    /**
     * Generate suggested USSD codes.
     */
    public function generateSuggestedCodes(int $count = 5): array
    {
        $suggestions = [];

        for ($i = 0; $i < $count; $i++) {
            do {
                $code = $this->generateRandomCode();
            } while ($this->isCodeTaken($code));

            $suggestions[] = $code;
        }

        return $suggestions;
    }

    /**
     * Get USSD code statistics for a user.
     */
    public function getUserCodeStats(int $userId): array
    {
        $codes = UssdCode::where('user_id', $userId)->get();

        return [
            'total_codes' => $codes->count(),
            'active_codes' => $codes->where('status', 'active')->count(),
            'pending_codes' => $codes->where('status', 'pending')->count(),
            'inactive_codes' => $codes->where('status', 'inactive')->count(),
            'suspended_codes' => $codes->where('status', 'suspended')->count(),
            'assigned_codes' => $codes->whereNotNull('flow_id')->count(),
            'unassigned_codes' => $codes->whereNull('flow_id')->count(),
            'total_usage' => $codes->sum('usage_count'),
            'mtn_codes' => $codes->where('telco', 'mtn')->count(),
            'telecel_codes' => $codes->where('telco', 'telecel')->count(),
            'airteltigo_codes' => $codes->where('telco', 'AirtelTigo')->count(),
            'all_telco_codes' => $codes->where('telco', 'all')->count(),
        ];
    }

    /**
     * Get USSD code usage analytics.
     */
    public function getCodeUsageAnalytics(int $ussdCodeId, array $filters = []): array
    {
        $ussdCode = UssdCode::findOrFail($ussdCodeId);

        $query = $ussdCode->analytics();

        if (isset($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date']);
        }

        $analytics = $query->get();

        return [
            'total_events' => $analytics->count(),
            'session_events' => $analytics->whereIn('event_type', ['session_started', 'session_completed'])->count(),
            'node_events' => $analytics->where('event_type', 'node_visited')->count(),
            'input_events' => $analytics->where('event_type', 'input_received')->count(),
            'error_events' => $analytics->where('event_type', 'error_occurred')->count(),
            'payment_events' => $analytics->whereIn('event_type', ['payment_initiated', 'payment_completed'])->count(),
            'unique_phones' => $analytics->unique('phone_number')->count(),
            'average_duration' => $analytics->where('event_type', 'session_completed')->avg('duration'),
        ];
    }

    /**
     * Validate USSD code format.
     */
    private function validateUssdCode(string $code): void
    {
        if (!preg_match('/^\d{3,6}$/', $code)) {
            throw new \Exception('USSD code must be 3-6 digits');
        }

        $reservedCodes = ['000', '111', '999', '911', '112', '100', '101', '102'];
        if (in_array($code, $reservedCodes)) {
            throw new \Exception('USSD code is reserved and cannot be used');
        }
    }

    /**
     * Check if USSD code is already taken.
     */
    private function isCodeTaken(string $code): bool
    {
        return UssdCode::where('code', $code)->exists();
    }

    /**
     * Check user's USSD code limit based on subscription.
     */
    private function checkUserCodeLimit(int $userId): void
    {
        $user = User::findOrFail($userId);
        $subscription = $user->subscriptions()->active()->first();

        if (!$subscription) {
            throw new \Exception('Active subscription required to create USSD codes');
        }

        $features = $subscription->getPlanFeatures();
        $maxCodes = $features['ussd_codes'] ?? 1;

        $currentCodes = UssdCode::where('user_id', $userId)->count();

        if ($currentCodes >= $maxCodes) {
            throw new \Exception("Maximum USSD codes limit reached ({$maxCodes})");
        }
    }

    /**
     * Generate random USSD code.
     */
    private function generateRandomCode(): string
    {
        return str_pad(rand(100, 999999), 3, '0', STR_PAD_LEFT);
    }

    /**
     * Bulk update USSD code statuses.
     */
    public function bulkUpdateStatus(array $codeIds, string $status): int
    {
        $updated = UssdCode::whereIn('id', $codeIds)->update(['status' => $status]);

        Log::info('Bulk USSD code status update', [
            'code_ids' => $codeIds,
            'status' => $status,
            'updated_count' => $updated,
        ]);

        return $updated;
    }

    /**
     * Get USSD codes by telco.
     */
    public function getCodesByTelco(string $telco): \Illuminate\Database\Eloquent\Collection
    {
        return UssdCode::where('telco', $telco)
            ->orWhere('telco', 'all')
            ->where('status', 'active')
            ->get();
    }

    /**
     * Search USSD codes.
     */
    public function searchCodes(string $search, int $userId = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = UssdCode::query();

        if ($userId) {
            $query->where('user_id', $userId);
        }

        return $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
              ->orWhere('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        })->get();
    }
}
