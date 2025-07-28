<?php
namespace App\Services;

use App\Models\Flow;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;

class FlowService
{
    /**
     * Get all flows for a user
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserFlows(int $userId)
    {
        return Flow::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Create a new flow
     *
     * @param int $userId
     * @param array $data
     * @return array
     */
    public function createFlow(int $userId, array $data): array
    {
        try {
            DB::beginTransaction();

            $user = User::find($userId);
            if (! $user) {
                return [
                    'success' => false,
                    'message' => 'User not found',
                ];
            }

            $flow = Flow::create([
                'user_id'     => $userId,
                'name'        => $data['name'],
                'description' => $data['description'] ?? null,
                'flow_data'   => $data['flow_data'] ?? $this->getDefaultFlowData(),
                'variables'   => $data['variables'] ?? [],
                'is_active'   => $data['is_active'] ?? false,
                'is_template' => $data['is_template'] ?? false,
                'category'    => $data['category'] ?? null,
                'tags'        => $data['tags'] ?? null,
                'version'     => 1,
            ]);

            DB::commit();

            return [
                'success' => true,
                'flow'    => $flow,
                'message' => 'Flow created successfully',
            ];

        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to create flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get a specific flow for a user
     *
     * @param int $userId
     * @param int $flowId
     * @return array
     */
    public function getFlow(int $userId, int $flowId): array
    {
        try {
            $flow = Flow::where('user_id', $userId)
                ->where('id', $flowId)
                ->first();

            if (! $flow) {
                return [
                    'success' => false,
                    'message' => 'Flow not found',
                ];
            }

            return [
                'success' => true,
                'flow'    => $flow,
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to fetch flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Update a flow
     *
     * @param int $userId
     * @param int $flowId
     * @param array $data
     * @return array
     */
    public function updateFlow(int $userId, int $flowId, array $data): array
    {
        try {
            DB::beginTransaction();

            $flow = Flow::where('user_id', $userId)
                ->where('id', $flowId)
                ->first();

            if (! $flow) {
                return [
                    'success' => false,
                    'message' => 'Flow not found',
                ];
            }

            if (isset($data['flow_data']) && $data['flow_data'] !== $flow->flow_data) {
                $data['version'] = $flow->version + 1;
            }

            $flow->update($data);

            DB::commit();

            return [
                'success' => true,
                'flow'    => $flow->fresh(),
                'message' => 'Flow updated successfully',
            ];

        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to update flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Delete a flow
     *
     * @param int $userId
     * @param int $flowId
     * @return array
     */
    public function deleteFlow(int $userId, int $flowId): array
    {
        try {
            DB::beginTransaction();

            $flow = Flow::where('user_id', $userId)
                ->where('id', $flowId)
                ->first();

            if (! $flow) {
                return [
                    'success' => false,
                    'message' => 'Flow not found',
                ];
            }

            if ($flow->is_active && $flow->usage_count > 0) {
                return [
                    'success' => false,
                    'message' => 'Cannot delete active flow with usage history',
                ];
            }

            $flow->delete();

            DB::commit();

            return [
                'success' => true,
                'message' => 'Flow deleted successfully',
            ];

        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to delete flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Duplicate a flow
     *
     * @param int $userId
     * @param int $flowId
     * @return array
     */
    public function duplicateFlow(int $userId, int $flowId): array
    {
        try {
            DB::beginTransaction();

            $originalFlow = Flow::where('user_id', $userId)
                ->where('id', $flowId)
                ->first();

            if (! $originalFlow) {
                return [
                    'success' => false,
                    'message' => 'Flow not found',
                ];
            }

            $duplicateFlow = Flow::create([
                'user_id'     => $userId,
                'name'        => $originalFlow->name . ' (Copy)',
                'description' => $originalFlow->description,
                'flow_data'   => $originalFlow->flow_data,
                'variables'   => $originalFlow->variables,
                'is_active'   => false,
                'is_template' => false,
                'category'    => $originalFlow->category,
                'tags'        => $originalFlow->tags,
                'version'     => 1,
                'usage_count' => 0,
            ]);

            DB::commit();

            return [
                'success' => true,
                'flow'    => $duplicateFlow,
                'message' => 'Flow duplicated successfully',
            ];

        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Failed to duplicate flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get flow templates
     *
     * @param string|null $category
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getTemplates(?string $category = null)
    {
        $query = Flow::where('is_template', true);

        if ($category) {
            $query->where('category', $category);
        }

        return $query->orderBy('usage_count', 'desc')->get();
    }

    /**
     * Get flows by category
     *
     * @param int $userId
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getFlowsByCategory(int $userId, string $category)
    {
        return Flow::where('user_id', $userId)
            ->where('category', $category)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Activate a flow
     *
     * @param int $userId
     * @param int $flowId
     * @return array
     */
    public function activateFlow(int $userId, int $flowId): array
    {
        try {
            $flow = Flow::where('user_id', $userId)
                ->where('id', $flowId)
                ->first();

            if (! $flow) {
                return [
                    'success' => false,
                    'message' => 'Flow not found',
                ];
            }

            $flow->activate();

            return [
                'success' => true,
                'flow'    => $flow->fresh(),
                'message' => 'Flow activated successfully',
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to activate flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Deactivate a flow
     *
     * @param int $userId
     * @param int $flowId
     * @return array
     */
    public function deactivateFlow(int $userId, int $flowId): array
    {
        try {
            $flow = Flow::where('user_id', $userId)
                ->where('id', $flowId)
                ->first();

            if (! $flow) {
                return [
                    'success' => false,
                    'message' => 'Flow not found',
                ];
            }

            $flow->deactivate();

            return [
                'success' => true,
                'flow'    => $flow->fresh(),
                'message' => 'Flow deactivated successfully',
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to deactivate flow: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get default flow data structure
     *
     * @return array
     */
    private function getDefaultFlowData(): array
    {
        return [
            'nodes'    => [
                [
                    'id'       => 'start',
                    'type'     => 'start',
                    'position' => ['x' => 100, 'y' => 100],
                    'data'     => [
                        'label'   => 'Start',
                        'message' => 'Welcome to USSD Service',
                    ],
                ],
            ],
            'edges'    => [],
            'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1],
        ];
    }

    /**
     * Validate flow data structure
     *
     * @param array $flowData
     * @return array
     */
    public function validateFlowData(array $flowData): array
    {
        $errors = [];

        if (! isset($flowData['nodes']) || ! is_array($flowData['nodes'])) {
            $errors['flow_data'] = 'Flow data must contain nodes array';
        }

        if (! isset($flowData['edges']) || ! is_array($flowData['edges'])) {
            $errors['flow_data'] = 'Flow data must contain edges array';
        }

        $hasStartNode = false;
        foreach ($flowData['nodes'] ?? [] as $node) {
            if (isset($node['type']) && $node['type'] === 'start') {
                $hasStartNode = true;
                break;
            }
        }

        if (! $hasStartNode) {
            $errors['flow_data'] = 'Flow must have at least one start node';
        }

        return $errors;
    }

    /**
     * Check if user can create more flows
     *
     * @param int $userId
     * @return array
     */
    public function canCreateFlow(int $userId): array
    {
        try {
            $user = User::find($userId);
            if (! $user) {
                return [
                    'can_create' => false,
                    'message'    => 'User not found',
                ];
            }

            $flowCount = Flow::where('user_id', $userId)->count();

            $maxFlows = $this->getMaxFlowsByPlan($user->subscription_plan);

            if ($flowCount >= $maxFlows) {
                return [
                    'can_create' => false,
                    'message'    => "You have reached the maximum number of flows for your {$user->subscription_plan} plan",
                ];
            }

            return [
                'can_create'    => true,
                'current_count' => $flowCount,
                'max_allowed'   => $maxFlows,
            ];

        } catch (Exception $e) {
            return [
                'can_create' => false,
                'message'    => 'Failed to check flow creation limits',
            ];
        }
    }

    /**
     * Get maximum flows allowed by subscription plan
     *
     * @param string $plan
     * @return int
     */
    private function getMaxFlowsByPlan(string $plan): int
    {
        return match ($plan) {
            'starter' => 5,
            'professional' => 20,
            'enterprise' => 100,
            default => 5,
        };
    }
}
