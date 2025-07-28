<?php

namespace App\Http\Controllers\Analytics;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Get user analytics summary.
     */
    public function userAnalytics(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['start_date', 'end_date']);
            $analytics = $this->analyticsService->getUserAnalytics($request->user()->id, $filters);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get user analytics', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get user analytics'
            ], 500);
        }
    }

    /**
     * Get flow analytics.
     */
    public function flowAnalytics(Request $request, int $flowId): JsonResponse
    {
        try {
            // Check if user owns the flow
            $flow = \App\Models\Flow::where('id', $flowId)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$flow) {
                return response()->json([
                    'success' => false,
                    'message' => 'Flow not found or unauthorized access'
                ], 404);
            }

            $filters = $request->only(['start_date', 'end_date']);
            $analytics = $this->analyticsService->getFlowAnalytics($flowId, $filters);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get flow analytics', [
                'flow_id' => $flowId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get flow analytics'
            ], 500);
        }
    }

    /**
     * Get USSD code analytics.
     */
    public function ussdCodeAnalytics(Request $request, int $ussdCodeId): JsonResponse
    {
        try {
            // Check if user owns the USSD code
            $ussdCode = \App\Models\UssdCode::where('id', $ussdCodeId)
                ->where('user_id', $request->user()->id)
                ->first();

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found or unauthorized access'
                ], 404);
            }

            $filters = $request->only(['start_date', 'end_date']);
            $analytics = $this->analyticsService->getUssdCodeAnalytics($ussdCodeId, $filters);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get USSD code analytics', [
                'ussd_code_id' => $ussdCodeId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get USSD code analytics'
            ], 500);
        }
    }

    /**
     * Get session analytics.
     */
    public function sessionAnalytics(Request $request, string $sessionId): JsonResponse
    {
        try {
            // Check if user owns the session
            $session = \App\Models\Session::where('session_id', $sessionId)
                ->whereHas('flow', function ($query) use ($request) {
                    $query->where('user_id', $request->user()->id);
                })
                ->first();

            if (!$session) {
                return response()->json([
                    'success' => false,
                    'message' => 'Session not found or unauthorized access'
                ], 404);
            }

            $analytics = $this->analyticsService->getSessionAnalytics($sessionId);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get session analytics', [
                'session_id' => $sessionId,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get session analytics'
            ], 500);
        }
    }

    /**
     * Get dashboard data.
     */
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $dashboardData = $this->analyticsService->getDashboardData($request->user()->id);

            return response()->json([
                'success' => true,
                'data' => $dashboardData
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get dashboard data', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get dashboard data'
            ], 500);
        }
    }

    /**
     * Get analytics by date range.
     */
    public function dateRange(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'group_by' => 'sometimes|in:hour,day,week,month'
            ]);

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');
            $groupBy = $request->input('group_by', 'day');

            $analytics = $this->analyticsService->getAnalyticsByDateRange(
                $request->user()->id,
                $startDate,
                $endDate,
                $groupBy
            );

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get date range analytics', [
                'user_id' => $request->user()->id,
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get date range analytics'
            ], 500);
        }
    }

    /**
     * Get top performing flows.
     */
    public function topFlows(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $since = $request->input('since') ? \Carbon\Carbon::parse($request->input('since')) : null;

            $topFlows = $this->analyticsService->getTopFlows($request->user()->id, $since, $limit);

            return response()->json([
                'success' => true,
                'data' => $topFlows
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get top flows', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get top flows'
            ], 500);
        }
    }

    /**
     * Get top performing USSD codes.
     */
    public function topUssdCodes(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $since = $request->input('since') ? \Carbon\Carbon::parse($request->input('since')) : null;

            $topCodes = $this->analyticsService->getTopUssdCodes($request->user()->id, $since, $limit);

            return response()->json([
                'success' => true,
                'data' => $topCodes
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get top USSD codes', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get top USSD codes'
            ], 500);
        }
    }

    /**
     * Get recent activity.
     */
    public function recentActivity(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 20);
            $recentActivity = $this->analyticsService->getRecentActivity($request->user()->id, $limit);

            return response()->json([
                'success' => true,
                'data' => $recentActivity
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get recent activity', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get recent activity'
            ], 500);
        }
    }

    /**
     * Get error summary.
     */
    public function errorSummary(Request $request): JsonResponse
    {
        try {
            $since = $request->input('since') ? \Carbon\Carbon::parse($request->input('since')) : null;
            $errorSummary = $this->analyticsService->getErrorSummary($request->user()->id, $since);

            return response()->json([
                'success' => true,
                'data' => $errorSummary
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get error summary', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get error summary'
            ], 500);
        }
    }

    /**
     * Export analytics data.
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['start_date', 'end_date', 'event_type', 'flow_id']);
            $exportData = $this->analyticsService->exportAnalytics($request->user()->id, $filters);

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'message' => 'Analytics data exported successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to export analytics', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to export analytics'
            ], 500);
        }
    }

    /**
     * Log analytics event.
     */
    public function logEvent(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'event_type' => 'required|string',
                'flow_id' => 'sometimes|integer|exists:flows,id',
                'ussd_code_id' => 'sometimes|integer|exists:ussd_codes,id',
                'session_id' => 'sometimes|string',
                'phone_number' => 'sometimes|string',
                'event_data' => 'sometimes|array',
                'node_id' => 'sometimes|string',
                'user_input' => 'sometimes|string',
                'duration' => 'sometimes|numeric',
                'telco' => 'sometimes|string',
                'location' => 'sometimes|string',
                'device_info' => 'sometimes|string',
                'error_message' => 'sometimes|string',
            ]);

            $data = $request->all();
            $data['user_id'] = $request->user()->id;

            $analytics = $this->analyticsService->logEvent($data);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $analytics->id,
                    'event_type' => $analytics->event_type,
                    'created_at' => $analytics->created_at->toISOString(),
                ],
                'message' => 'Event logged successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to log analytics event', [
                'user_id' => $request->user()->id,
                'event_type' => $request->input('event_type'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to log event: ' . $e->getMessage()
            ], 500);
        }
    }
}
