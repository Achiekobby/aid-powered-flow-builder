<?php

namespace App\Services;

use App\Models\Analytics;
use App\Models\Flow;
use App\Models\User;
use App\Models\UssdCode;
use App\Models\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AnalyticsService
{
    /**
     * Log an analytics event.
     */
    public function logEvent(array $data): Analytics
    {
        $analytics = Analytics::create([
            'user_id' => $data['user_id'],
            'flow_id' => $data['flow_id'] ?? null,
            'ussd_code_id' => $data['ussd_code_id'] ?? null,
            'session_id' => $data['session_id'] ?? null,
            'phone_number' => $data['phone_number'] ?? null,
            'event_type' => $data['event_type'],
            'event_data' => $data['event_data'] ?? [],
            'node_id' => $data['node_id'] ?? null,
            'user_input' => $data['user_input'] ?? null,
            'duration' => $data['duration'] ?? null,
            'telco' => $data['telco'] ?? null,
            'location' => $data['location'] ?? null,
            'device_info' => $data['device_info'] ?? null,
            'error_message' => $data['error_message'] ?? null,
        ]);

        Log::info('Analytics event logged', [
            'event_type' => $data['event_type'],
            'user_id' => $data['user_id'],
            'flow_id' => $data['flow_id'] ?? null,
        ]);

        return $analytics;
    }

    /**
     * Get user analytics summary.
     */
    public function getUserAnalytics(int $userId, array $filters = []): array
    {
        $query = Analytics::where('user_id', $userId);

        // Apply date filters
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
            'unique_sessions' => $analytics->unique('session_id')->count(),
            'average_duration' => $analytics->where('event_type', 'session_completed')->avg('duration'),
            'completion_rate' => $this->calculateCompletionRate($analytics),
            'error_rate' => $this->calculateErrorRate($analytics),
        ];
    }

    /**
     * Get flow analytics.
     */
    public function getFlowAnalytics(int $flowId, array $filters = []): array
    {
        $query = Analytics::where('flow_id', $flowId);

        // Apply date filters
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
            'unique_phones' => $analytics->unique('phone_number')->count(),
            'unique_sessions' => $analytics->unique('session_id')->count(),
            'average_duration' => $analytics->where('event_type', 'session_completed')->avg('duration'),
            'completion_rate' => $this->calculateCompletionRate($analytics),
            'error_rate' => $this->calculateErrorRate($analytics),
            'node_analytics' => $this->getNodeAnalytics($analytics),
            'telco_breakdown' => $this->getTelcoBreakdown($analytics),
        ];
    }

    /**
     * Get USSD code analytics.
     */
    public function getUssdCodeAnalytics(int $ussdCodeId, array $filters = []): array
    {
        $query = Analytics::where('ussd_code_id', $ussdCodeId);

        // Apply date filters
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
            'unique_phones' => $analytics->unique('phone_number')->count(),
            'unique_sessions' => $analytics->unique('session_id')->count(),
            'average_duration' => $analytics->where('event_type', 'session_completed')->avg('duration'),
            'completion_rate' => $this->calculateCompletionRate($analytics),
            'error_rate' => $this->calculateErrorRate($analytics),
            'telco_breakdown' => $this->getTelcoBreakdown($analytics),
        ];
    }

    /**
     * Get session analytics.
     */
    public function getSessionAnalytics(string $sessionId): array
    {
        $analytics = Analytics::where('session_id', $sessionId)->get();

        return [
            'total_events' => $analytics->count(),
            'session_events' => $analytics->whereIn('event_type', ['session_started', 'session_completed'])->count(),
            'node_events' => $analytics->where('event_type', 'node_visited')->count(),
            'input_events' => $analytics->where('event_type', 'input_received')->count(),
            'error_events' => $analytics->where('event_type', 'error_occurred')->count(),
            'payment_events' => $analytics->whereIn('event_type', ['payment_initiated', 'payment_completed'])->count(),
            'event_timeline' => $this->getEventTimeline($analytics),
            'node_journey' => $this->getNodeJourney($analytics),
        ];
    }

    /**
     * Get real-time analytics dashboard data.
     */
    public function getDashboardData(int $userId): array
    {
        $now = now();
        $today = $now->startOfDay();
        $thisWeek = $now->startOfWeek();
        $thisMonth = $now->startOfMonth();

        return [
            'today' => $this->getUserAnalytics($userId, ['start_date' => $today]),
            'this_week' => $this->getUserAnalytics($userId, ['start_date' => $thisWeek]),
            'this_month' => $this->getUserAnalytics($userId, ['start_date' => $thisMonth]),
            'top_flows' => $this->getTopFlows($userId, $thisMonth),
            'top_ussd_codes' => $this->getTopUssdCodes($userId, $thisMonth),
            'recent_activity' => $this->getRecentActivity($userId),
            'error_summary' => $this->getErrorSummary($userId, $thisMonth),
        ];
    }

    /**
     * Get analytics by date range with grouping.
     */
    public function getAnalyticsByDateRange(int $userId, string $startDate, string $endDate, string $groupBy = 'day'): array
    {
        $query = Analytics::where('user_id', $userId)
            ->whereBetween('created_at', [$startDate, $endDate]);

        switch ($groupBy) {
            case 'hour':
                $query->selectRaw('DATE_FORMAT(created_at, "%Y-%m-%d %H:00:00") as period, COUNT(*) as count, event_type')
                    ->groupBy('period', 'event_type');
                break;
            case 'day':
                $query->selectRaw('DATE(created_at) as period, COUNT(*) as count, event_type')
                    ->groupBy('period', 'event_type');
                break;
            case 'week':
                $query->selectRaw('YEARWEEK(created_at) as period, COUNT(*) as count, event_type')
                    ->groupBy('period', 'event_type');
                break;
            case 'month':
                $query->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as period, COUNT(*) as count, event_type')
                    ->groupBy('period', 'event_type');
                break;
        }

        return $query->get()->toArray();
    }

    /**
     * Get top performing flows.
     */
    public function getTopFlows(int $userId, Carbon $since = null, int $limit = 10): array
    {
        $query = Analytics::where('user_id', $userId)
            ->whereNotNull('flow_id')
            ->whereIn('event_type', ['session_started', 'session_completed']);

        if ($since) {
            $query->where('created_at', '>=', $since);
        }

        return $query->selectRaw('flow_id, COUNT(*) as event_count, event_type')
            ->with('flow:id,name')
            ->groupBy('flow_id', 'event_type')
            ->orderBy('event_count', 'desc')
            ->limit($limit)
            ->get()
            ->groupBy('flow_id')
            ->map(function ($flowAnalytics) {
                $flow = $flowAnalytics->first()->flow;
                $started = $flowAnalytics->where('event_type', 'session_started')->first()->event_count ?? 0;
                $completed = $flowAnalytics->where('event_type', 'session_completed')->first()->event_count ?? 0;

                return [
                    'flow_id' => $flow->id,
                    'flow_name' => $flow->name,
                    'sessions_started' => $started,
                    'sessions_completed' => $completed,
                    'completion_rate' => $started > 0 ? round(($completed / $started) * 100, 2) : 0,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get top performing USSD codes.
     */
    public function getTopUssdCodes(int $userId, Carbon $since = null, int $limit = 10): array
    {
        $query = Analytics::where('user_id', $userId)
            ->whereNotNull('ussd_code_id')
            ->whereIn('event_type', ['session_started', 'session_completed']);

        if ($since) {
            $query->where('created_at', '>=', $since);
        }

        return $query->selectRaw('ussd_code_id, COUNT(*) as event_count, event_type')
            ->with('ussdCode:id,code,name')
            ->groupBy('ussd_code_id', 'event_type')
            ->orderBy('event_count', 'desc')
            ->limit($limit)
            ->get()
            ->groupBy('ussd_code_id')
            ->map(function ($codeAnalytics) {
                $ussdCode = $codeAnalytics->first()->ussdCode;
                $started = $codeAnalytics->where('event_type', 'session_started')->first()->event_count ?? 0;
                $completed = $codeAnalytics->where('event_type', 'session_completed')->first()->event_count ?? 0;

                return [
                    'ussd_code_id' => $ussdCode->id,
                    'code' => $ussdCode->code,
                    'name' => $ussdCode->name,
                    'sessions_started' => $started,
                    'sessions_completed' => $completed,
                    'completion_rate' => $started > 0 ? round(($completed / $started) * 100, 2) : 0,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get recent activity.
     */
    public function getRecentActivity(int $userId, int $limit = 20): array
    {
        return Analytics::where('user_id', $userId)
            ->with(['flow:id,name', 'ussdCode:id,code,name'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($analytics) {
                return [
                    'id' => $analytics->id,
                    'event_type' => $analytics->event_type,
                    'event_type_label' => $analytics->event_type_label,
                    'flow_name' => $analytics->flow->name ?? null,
                    'ussd_code' => $analytics->ussdCode->code ?? null,
                    'phone_number' => $analytics->phone_number,
                    'created_at' => $analytics->created_at->toISOString(),
                ];
            })
            ->toArray();
    }

    /**
     * Get error summary.
     */
    public function getErrorSummary(int $userId, Carbon $since = null): array
    {
        $query = Analytics::where('user_id', $userId)
            ->where('event_type', 'error_occurred');

        if ($since) {
            $query->where('created_at', '>=', $since);
        }

        $errors = $query->get();

        return [
            'total_errors' => $errors->count(),
            'error_types' => $errors->groupBy('error_message')
                ->map(function ($group) {
                    return [
                        'error_message' => $group->first()->error_message,
                        'count' => $group->count(),
                        'percentage' => 0, // Will be calculated
                    ];
                })
                ->values()
                ->toArray(),
        ];
    }

    /**
     * Calculate completion rate.
     */
    private function calculateCompletionRate($analytics): float
    {
        $started = $analytics->where('event_type', 'session_started')->count();
        $completed = $analytics->where('event_type', 'session_completed')->count();

        return $started > 0 ? round(($completed / $started) * 100, 2) : 0;
    }

    /**
     * Calculate error rate.
     */
    private function calculateErrorRate($analytics): float
    {
        $totalEvents = $analytics->count();
        $errorEvents = $analytics->where('event_type', 'error_occurred')->count();

        return $totalEvents > 0 ? round(($errorEvents / $totalEvents) * 100, 2) : 0;
    }

    /**
     * Get node analytics.
     */
    private function getNodeAnalytics($analytics): array
    {
        return $analytics->where('event_type', 'node_visited')
            ->groupBy('node_id')
            ->map(function ($group) {
                return [
                    'node_id' => $group->first()->node_id,
                    'visit_count' => $group->count(),
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get telco breakdown.
     */
    private function getTelcoBreakdown($analytics): array
    {
        return $analytics->whereNotNull('telco')
            ->groupBy('telco')
            ->map(function ($group) {
                return [
                    'telco' => $group->first()->telco,
                    'count' => $group->count(),
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get event timeline.
     */
    private function getEventTimeline($analytics): array
    {
        return $analytics->sortBy('created_at')
            ->map(function ($event) {
                return [
                    'event_type' => $event->event_type,
                    'event_type_label' => $event->event_type_label,
                    'timestamp' => $event->created_at->toISOString(),
                    'data' => $event->event_data,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Get node journey.
     */
    private function getNodeJourney($analytics): array
    {
        return $analytics->where('event_type', 'node_visited')
            ->sortBy('created_at')
            ->map(function ($event) {
                return [
                    'node_id' => $event->node_id,
                    'timestamp' => $event->created_at->toISOString(),
                    'data' => $event->event_data,
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Export analytics data.
     */
    public function exportAnalytics(int $userId, array $filters = []): array
    {
        $query = Analytics::where('user_id', $userId)
            ->with(['flow:id,name', 'ussdCode:id,code,name']);

        // Apply filters
        if (isset($filters['start_date'])) {
            $query->where('created_at', '>=', $filters['start_date']);
        }
        if (isset($filters['end_date'])) {
            $query->where('created_at', '<=', $filters['end_date']);
        }
        if (isset($filters['event_type'])) {
            $query->where('event_type', $filters['event_type']);
        }
        if (isset($filters['flow_id'])) {
            $query->where('flow_id', $filters['flow_id']);
        }

        return $query->get()
            ->map(function ($analytics) {
                return [
                    'id' => $analytics->id,
                    'event_type' => $analytics->event_type,
                    'event_type_label' => $analytics->event_type_label,
                    'flow_name' => $analytics->flow->name ?? null,
                    'ussd_code' => $analytics->ussdCode->code ?? null,
                    'phone_number' => $analytics->phone_number,
                    'telco' => $analytics->telco,
                    'duration' => $analytics->duration,
                    'created_at' => $analytics->created_at->toISOString(),
                    'event_data' => $analytics->event_data,
                ];
            })
            ->toArray();
    }
}
