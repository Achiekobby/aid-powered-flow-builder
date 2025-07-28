<?php

namespace App\Http\Controllers\UssdCode;

use App\Http\Controllers\Controller;
use App\Http\Requests\UssdCode\StoreUssdCodeRequest;
use App\Http\Requests\UssdCode\UpdateUssdCodeRequest;
use App\Http\Resources\UssdCodeResource;
use App\Services\UssdCodeService;
use App\Models\UssdCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UssdCodeController extends Controller
{
    public function __construct(
        private UssdCodeService $ussdCodeService
    ) {}

    /**
     * Get user's USSD codes.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'telco', 'flow_id']);
            $ussdCodes = $this->ussdCodeService->getUserUssdCodes($request->user()->id, $filters);

            return response()->json([
                'success' => true,
                'data' => UssdCodeResource::collection($ussdCodes)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve USSD codes', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve USSD codes'
            ], 500);
        }
    }

    /**
     * Create a new USSD code.
     */
    public function store(StoreUssdCodeRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;

            $ussdCode = $this->ussdCodeService->createUssdCode($data);

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($ussdCode),
                'message' => 'USSD code created successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create USSD code', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create USSD code: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get USSD code by ID.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($ussdCode)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve USSD code'
            ], 500);
        }
    }

    /**
     * Update USSD code.
     */
    public function update(UpdateUssdCodeRequest $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $updatedUssdCode = $this->ussdCodeService->updateUssdCode($ussdCode, $request->validated());

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($updatedUssdCode),
                'message' => 'USSD code updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update USSD code: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete USSD code.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $this->ussdCodeService->deleteUssdCode($ussdCode);

            return response()->json([
                'success' => true,
                'message' => 'USSD code deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to delete USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete USSD code: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate USSD code.
     */
    public function activate(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $activatedUssdCode = $this->ussdCodeService->activateUssdCode($ussdCode);

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($activatedUssdCode),
                'message' => 'USSD code activated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to activate USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to activate USSD code: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Deactivate USSD code.
     */
    public function deactivate(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $deactivatedUssdCode = $this->ussdCodeService->deactivateUssdCode($ussdCode);

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($deactivatedUssdCode),
                'message' => 'USSD code deactivated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to deactivate USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate USSD code: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Suspend USSD code.
     */
    public function suspend(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $reason = $request->input('reason');
            $suspendedUssdCode = $this->ussdCodeService->suspendUssdCode($ussdCode, $reason);

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($suspendedUssdCode),
                'message' => 'USSD code suspended successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to suspend USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to suspend USSD code: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign flow to USSD code.
     */
    public function assignFlow(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'flow_id' => 'required|integer|exists:flows,id'
            ]);

            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $assignedUssdCode = $this->ussdCodeService->assignFlow($ussdCode, $request->input('flow_id'));

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($assignedUssdCode),
                'message' => 'Flow assigned to USSD code successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to assign flow to USSD code', [
                'ussd_code_id' => $id,
                'flow_id' => $request->input('flow_id'),
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to assign flow: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unassign flow from USSD code.
     */
    public function unassignFlow(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $unassignedUssdCode = $this->ussdCodeService->unassignFlow($ussdCode);

            return response()->json([
                'success' => true,
                'data' => new UssdCodeResource($unassignedUssdCode),
                'message' => 'Flow unassigned from USSD code successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to unassign flow from USSD code', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to unassign flow: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available USSD codes for assignment.
     */
    public function available(Request $request): JsonResponse
    {
        try {
            $availableCodes = $this->ussdCodeService->getAvailableCodes($request->user()->id);

            return response()->json([
                'success' => true,
                'data' => UssdCodeResource::collection($availableCodes)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get available USSD codes', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get available USSD codes'
            ], 500);
        }
    }

    /**
     * Generate suggested USSD codes.
     */
    public function suggestions(Request $request): JsonResponse
    {
        try {
            $count = $request->input('count', 5);
            $suggestions = $this->ussdCodeService->generateSuggestedCodes($count);

            return response()->json([
                'success' => true,
                'data' => $suggestions
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to generate USSD code suggestions', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to generate suggestions'
            ], 500);
        }
    }

    /**
     * Get USSD code statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->ussdCodeService->getUserCodeStats($request->user()->id);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get USSD code statistics', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get statistics'
            ], 500);
        }
    }

    /**
     * Get USSD code usage analytics.
     */
    public function analytics(Request $request, int $id): JsonResponse
    {
        try {
            $ussdCode = $this->ussdCodeService->getUssdCode($id);

            if (!$ussdCode) {
                return response()->json([
                    'success' => false,
                    'message' => 'USSD code not found'
                ], 404);
            }

            // Check if user owns the USSD code
            if ($ussdCode->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to USSD code'
                ], 403);
            }

            $filters = $request->only(['start_date', 'end_date']);
            $analytics = $this->ussdCodeService->getCodeUsageAnalytics($id, $filters);

            return response()->json([
                'success' => true,
                'data' => $analytics
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get USSD code analytics', [
                'ussd_code_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get analytics'
            ], 500);
        }
    }

    /**
     * Search USSD codes.
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'search' => 'required|string|min:1'
            ]);

            $search = $request->input('search');
            $ussdCodes = $this->ussdCodeService->searchCodes($search, $request->user()->id);

            return response()->json([
                'success' => true,
                'data' => UssdCodeResource::collection($ussdCodes)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to search USSD codes', [
                'user_id' => $request->user()->id,
                'search' => $request->input('search'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to search USSD codes'
            ], 500);
        }
    }
}
