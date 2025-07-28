<?php

namespace App\Http\Controllers\Flow;

use App\Http\Controllers\Controller;
use App\Http\Requests\Flow\StoreFlowRequest;
use App\Http\Requests\Flow\UpdateFlowRequest;
use App\Http\Resources\FlowResource;
use App\Services\FlowService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FlowController extends Controller
{
    protected FlowService $flowService;

    public function __construct(FlowService $flowService)
    {
        $this->flowService = $flowService;
    }

    /**
     * Get all flows for the authenticated user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $flows = $this->flowService->getUserFlows($user->id);

            return response()->json([
                'success' => true,
                'data' => FlowResource::collection($flows)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch flows', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch flows'
            ], 500);
        }
    }

    /**
     * Store a new flow
     *
     * @param StoreFlowRequest $request
     * @return JsonResponse
     */
    public function store(StoreFlowRequest $request): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->createFlow($user->id, $request->validated());

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 400);
            }

            Log::info('Flow created successfully', [
                'user_id' => $user->id,
                'flow_id' => $result['flow']->id,
                'flow_name' => $result['flow']->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Flow created successfully',
                'data' => new FlowResource($result['flow'])
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create flow', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create flow'
            ], 500);
        }
    }

    /**
     * Get a specific flow
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->getFlow($user->id, $id);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new FlowResource($result['flow'])
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch flow', [
                'user_id' => $request->user()->id,
                'flow_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch flow'
            ], 500);
        }
    }

    /**
     * Update a flow
     *
     * @param UpdateFlowRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateFlowRequest $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->updateFlow($user->id, $id, $request->validated());

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 404);
            }

            Log::info('Flow updated successfully', [
                'user_id' => $user->id,
                'flow_id' => $id,
                'flow_name' => $result['flow']->name
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Flow updated successfully',
                'data' => new FlowResource($result['flow'])
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update flow', [
                'user_id' => $request->user()->id,
                'flow_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update flow'
            ], 500);
        }
    }

    /**
     * Delete a flow
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->deleteFlow($user->id, $id);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 404);
            }

            Log::info('Flow deleted successfully', [
                'user_id' => $user->id,
                'flow_id' => $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Flow deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete flow', [
                'user_id' => $request->user()->id,
                'flow_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete flow'
            ], 500);
        }
    }

    /**
     * Duplicate a flow
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function duplicate(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->duplicateFlow($user->id, $id);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 404);
            }

            Log::info('Flow duplicated successfully', [
                'user_id' => $user->id,
                'original_flow_id' => $id,
                'new_flow_id' => $result['flow']->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Flow duplicated successfully',
                'data' => new FlowResource($result['flow'])
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to duplicate flow', [
                'user_id' => $request->user()->id,
                'flow_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate flow'
            ], 500);
        }
    }

    /**
     * Get flow templates
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function templates(Request $request): JsonResponse
    {
        try {
            $category = $request->query('category');
            $templates = $this->flowService->getTemplates($category);

            return response()->json([
                'success' => true,
                'data' => FlowResource::collection($templates)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to fetch flow templates', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch flow templates'
            ], 500);
        }
    }

    /**
     * Activate a flow
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function activate(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->activateFlow($user->id, $id);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 404);
            }

            Log::info('Flow activated successfully', [
                'user_id' => $user->id,
                'flow_id' => $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Flow activated successfully',
                'data' => new FlowResource($result['flow'])
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to activate flow', [
                'user_id' => $request->user()->id,
                'flow_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to activate flow'
            ], 500);
        }
    }

    /**
     * Deactivate a flow
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function deactivate(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();
            $result = $this->flowService->deactivateFlow($user->id, $id);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 404);
            }

            Log::info('Flow deactivated successfully', [
                'user_id' => $user->id,
                'flow_id' => $id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Flow deactivated successfully',
                'data' => new FlowResource($result['flow'])
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to deactivate flow', [
                'user_id' => $request->user()->id,
                'flow_id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate flow'
            ], 500);
        }
    }
}
