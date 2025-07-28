<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test successful user registration
     */
    public function test_user_can_register_successfully()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
            'company' => 'Test Company',
            'phone' => '+233244123456',
            'country' => 'Ghana'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'company',
                            'phone',
                            'country',
                            'subscription_plan',
                            'is_active',
                            'created_at'
                        ],
                        'token',
                        'token_type'
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'message' => 'User registered successfully',
                    'data' => [
                        'user' => [
                            'name' => 'John Doe',
                            'email' => 'john@example.com',
                            'company' => 'Test Company',
                            'phone' => '+233244123456',
                            'country' => 'Ghana',
                            'subscription_plan' => 'starter',
                            'is_active' => true
                        ],
                        'token_type' => 'Bearer'
                    ]
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe'
        ]);
    }

    /**
     * Test registration with missing required fields
     */
    public function test_registration_fails_with_missing_fields()
    {
        $response = $this->postJson('/api/auth/register', []);

        $response->assertStatus(422)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'errors' => [
                        'name',
                        'email',
                        'password',
                        'password_confirmation'
                    ]
                ]);
    }

    /**
     * Test registration with invalid email
     */
    public function test_registration_fails_with_invalid_email()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'Password123',
            'password_confirmation' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test registration with duplicate email
     */
    public function test_registration_fails_with_duplicate_email()
    {
        // Create existing user
        User::factory()->create(['email' => 'john@example.com']);

        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test registration with weak password
     */
    public function test_registration_fails_with_weak_password()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => '123',
            'password_confirmation' => '123'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test registration with mismatched password confirmation
     */
    public function test_registration_fails_with_mismatched_password()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'DifferentPassword123'
        ];

        $response = $this->postJson('/api/auth/register', $userData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
    }
}
