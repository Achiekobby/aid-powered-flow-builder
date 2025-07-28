<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $canRegister = $this->authService->canRegister($request->validated());

            if (!$canRegister['can_register']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Registration validation failed',
                    'errors' => $canRegister['errors']
                ], 422);
            }
            $result = $this->authService->register($request->validated());

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 500);
            }

            Log::info('User registered successfully', [
                'user_id' => $result['user']->id,
                'email' => $result['user']->email
            ]);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Login user
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 401);
            }

            Log::info('User logged in successfully', [
                'user_id' => $result['user']->id,
                'email' => $result['user']->email
            ]);

            return response()->json([
                'success' => true,
                'message' => $result['message'],
                'data' => [
                    'user' => new UserResource($result['user']),
                    'token' => $result['token'],
                    'token_type' => 'Bearer'
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Login failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.'
            ], 500);
        }
    }

    /**
     * Get authenticated user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function user(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => new UserResource($user)
            ]);

        } catch (\Exception $e) {
            Log::error('Get user failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user data'
            ], 500);
        }
    }

    /**
     * Logout user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user) {
                $user->tokens()->delete();

                Log::info('User logged out', [
                    'user_id' => $user->id,
                    'email' => $user->email
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Logout failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 500);
        }
    }

    /**
     * Check if email exists
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function checkEmail(Request $request): JsonResponse
    {
        try {
            $email = $request->input('email');

            if (!$email) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email is required'
                ], 400);
            }

            $exists = \App\Models\User::where('email', strtolower(trim($email)))->exists();

            return response()->json([
                'success' => true,
                'data' => [
                    'email' => $email,
                    'exists' => $exists
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Email check failed', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check email'
            ], 500);
        }
    }
}
