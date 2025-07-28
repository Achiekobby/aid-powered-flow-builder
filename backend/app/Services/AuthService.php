<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class AuthService
{
    /**
     * Register a new user
     *
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function register(array $data): array
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'company' => $data['company'] ?? null,
                'phone' => $data['phone'] ?? null,
                'country' => $data['country'] ?? 'Ghana',
                'password' => Hash::make($data['password']),
                'settings' => $this->getDefaultSettings(),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            $user->updateLastLogin();

            DB::commit();

            return [
                'success' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'User registered successfully'
            ];

        } catch (Exception $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get default user settings
     *
     * @return array
     */
    private function getDefaultSettings(): array
    {
        return [
            'theme' => 'light',
            'language' => 'en',
            'notifications' => [
                'email' => true,
                'sms' => false,
                'push' => false
            ],
            'timezone' => 'Africa/Accra',
            'currency' => 'GHS'
        ];
    }

    /**
     * Validate registration data
     *
     * @param array $data
     * @return array
     */
    public function validateRegistrationData(array $data): array
    {
        $errors = [];

        if (User::where('email', $data['email'])->exists()) {
            $errors['email'] = 'Email already exists';
        }

        if (!empty($data['phone']) && User::where('phone', $data['phone'])->exists()) {
            $errors['phone'] = 'Phone number already exists';
        }

        if (strlen($data['password']) < 8) {
            $errors['password'] = 'Password must be at least 8 characters';
        }

        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/', $data['password'])) {
            $errors['password'] = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        return $errors;
    }

    /**
     * Check if user can register (business rules)
     *
     * @param array $data
     * @return array
     */
    public function canRegister(array $data): array
    {
        $errors = $this->validateRegistrationData($data);

        if (!empty($errors)) {
            return [
                'can_register' => false,
                'errors' => $errors
            ];
        }

        return [
            'can_register' => true,
            'errors' => []
        ];
    }

    /**
     * Login user
     *
     * @param array $data
     * @return array
     */
    public function login(array $data): array
    {
        try {
            // Find user by email
            $user = User::where('email', strtolower(trim($data['email'])))->first();

            if (!$user) {
                return [
                    'success' => false,
                    'message' => 'Invalid credentials'
                ];
            }

            // Check if user account is active
            if (!$user->isActive()) {
                return [
                    'success' => false,
                    'message' => 'Account is deactivated. Please contact support.'
                ];
            }

            // Verify password
            if (!Hash::check($data['password'], $user->password)) {
                return [
                    'success' => false,
                    'message' => 'Invalid credentials'
                ];
            }

            // Create access token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Update last login
            $user->updateLastLogin();

            return [
                'success' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'Login successful'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Validate login data
     *
     * @param array $data
     * @return array
     */
    public function validateLoginData(array $data): array
    {
        $errors = [];

        // Check if email exists
        if (!User::where('email', strtolower(trim($data['email'])))->exists()) {
            $errors['email'] = 'Email not found';
        }

        return $errors;
    }

    /**
     * Check if user can login (business rules)
     *
     * @param array $data
     * @return array
     */
    public function canLogin(array $data): array
    {
        $errors = $this->validateLoginData($data);

        if (!empty($errors)) {
            return [
                'can_login' => false,
                'errors' => $errors
            ];
        }

        return [
            'can_login' => true,
            'errors' => []
        ];
    }
}
