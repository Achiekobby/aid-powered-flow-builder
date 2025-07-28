<?php

namespace App\Http\Controllers\Session;

use App\Http\Controllers\Controller;
use App\Http\Requests\Session\CreateSessionRequest;
use App\Http\Requests\Session\ProcessInputRequest;
use App\Http\Resources\SessionResource;
use App\Services\SessionService;
use App\Models\Session;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SessionController extends Controller
{
    public function __construct(
        private SessionService $sessionService
    ) {}

    /**
     * Create a new USSD session.
     */
    public function create(CreateSessionRequest $request): JsonResponse
    {
        try {
            $session = $this->sessionService->createSession($request->validated());

            return response()->json([
                'success' => true,
                'data' => new SessionResource($session),
                'message' => 'Session created successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create session', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get session by session ID.
     */
    public function show(Request $request, string $sessionId): JsonResponse
    {
        try {
            $session = $this->sessionService->getSession($sessionId);

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found'
                ], 404);
            }

            // Check if user owns the session
            if ($session->flow->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to session'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new SessionResource($session)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve session', [
                'session_id' => $sessionId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve session'
            ], 500);
        }
    }

    /**
     * Process user input in session.
     */
    public function processInput(ProcessInputRequest $request, string $sessionId): JsonResponse
    {
        try {
            $session = $this->sessionService->getSession($sessionId);

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found'
                ], 404);
            }

            // Check if user owns the session
            if ($session->flow->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to session'
                ], 403);
            }

            // Check if session is active
            if (!$session->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session is not active'
                ], 400);
            }

            $result = $this->sessionService->processInput($session, $request->input('input'));

            return response()->json([
                'success' => $result['success'],
                'data' => $result,
                'session' => new SessionResource($session->fresh())
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process session input', [
                'session_id' => $sessionId,
                'user_id' => $request->user()->id,
                'input' => $request->input('input'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process input: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Navigate to a specific node in session.
     */
    public function navigate(Request $request, string $sessionId, string $nodeId): JsonResponse
    {
        try {
            $session = $this->sessionService->getSession($sessionId);

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found'
                ], 404);
            }

            // Check if user owns the session
            if ($session->flow->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to session'
                ], 403);
            }

            $result = $this->sessionService->navigateToNode($session, $nodeId);

            return response()->json([
                'success' => $result['success'],
                'data' => $result,
                'session' => new SessionResource($session->fresh())
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to navigate session', [
                'session_id' => $sessionId,
                'node_id' => $nodeId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to navigate: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete a session.
     */
    public function complete(Request $request, string $sessionId): JsonResponse
    {
        try {
            $session = $this->sessionService->getSession($sessionId);

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found'
                ], 404);
            }

            // Check if user owns the session
            if ($session->flow->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to session'
                ], 403);
            }

            $this->sessionService->completeSession($session);

            return response()->json([
                'success' => true,
                'message' => 'Session completed successfully',
                'data' => new SessionResource($session->fresh())
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to complete session', [
                'session_id' => $sessionId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to complete session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Terminate a session.
     */
    public function terminate(Request $request, string $sessionId): JsonResponse
    {
        try {
            $session = $this->sessionService->getSession($sessionId);

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found'
                ], 404);
            }

            // Check if user owns the session
            if ($session->flow->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to session'
                ], 403);
            }

            $reason = $request->input('reason', 'user_terminated');
            $this->sessionService->terminateSession($session, $reason);

            return response()->json([
                'success' => true,
                'message' => 'Session terminated successfully',
                'data' => new SessionResource($session->fresh())
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to terminate session', [
                'session_id' => $sessionId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to terminate session: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's sessions.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'flow_id', 'start_date', 'end_date']);
            $sessions = Session::whereHas('flow', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })->with(['flow:id,name']);

            // Apply filters
            if (isset($filters['status'])) {
                $sessions->where('status', $filters['status']);
            }

            if (isset($filters['flow_id'])) {
                $sessions->where('flow_id', $filters['flow_id']);
            }

            if (isset($filters['start_date'])) {
                $sessions->where('created_at', '>=', $filters['start_date']);
            }

            if (isset($filters['end_date'])) {
                $sessions->where('created_at', '<=', $filters['end_date']);
            }

            $sessions = $sessions->orderBy('created_at', 'desc')
                ->paginate($request->input('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => SessionResource::collection($sessions),
                'pagination' => [
                    'current_page' => $sessions->currentPage(),
                    'last_page' => $sessions->lastPage(),
                    'per_page' => $sessions->perPage(),
                    'total' => $sessions->total(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve sessions', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve sessions'
            ], 500);
        }
    }

    /**
     * Get session statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['start_date', 'end_date']);
            $stats = $this->sessionService->getUserSessionStats($request->user()->id, $filters);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve session statistics', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve session statistics'
            ], 500);
        }
    }

    /**
     * Get active session for phone number and USSD code.
     */
    public function getActiveSession(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'phone_number' => 'required|string',
                'ussd_code' => 'required|string',
            ]);

            $session = $this->sessionService->getActiveSession(
                $request->input('phone_number'),
                $request->input('ussd_code')
            );

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active session found'
                ], 404);
            }

            // Check if user owns the session
            if ($session->flow->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to session'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new SessionResource($session)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get active session', [
                'user_id' => $request->user()->id,
                'phone_number' => $request->input('phone_number'),
                'ussd_code' => $request->input('ussd_code'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get active session'
            ], 500);
        }
    }

    /**
     * Expire old sessions (admin only).
     */
    public function expireOldSessions(Request $request): JsonResponse
    {
        try {
            // Check if user is admin
            if (!$request->user()->isAdmin()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access'
                ], 403);
            }

            $expiredCount = $this->sessionService->expireOldSessions();

            return response()->json([
                'success' => true,
                'message' => "Expired {$expiredCount} sessions",
                'data' => [
                    'expired_count' => $expiredCount
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to expire old sessions', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to expire old sessions'
            ], 500);
        }
    }
} 