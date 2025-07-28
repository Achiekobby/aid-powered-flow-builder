<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test successful user login
     */
    public function test_user_can_login_successfully()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('Password123')
        ]);

        $loginData = [
            'email' => 'john@example.com',
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(200)
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
                    'message' => 'Login successful',
                    'data' => [
                        'user' => [
                            'email' => 'john@example.com',
                            'is_active' => true
                        ],
                        'token_type' => 'Bearer'
                    ]
                ]);

        // Verify token was created
        $this->assertNotEmpty($response->json('data.token'));
    }

    /**
     * Test login with invalid email
     */
    public function test_login_fails_with_invalid_email()
    {
        $loginData = [
            'email' => 'nonexistent@example.com',
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ]);
    }

    /**
     * Test login with wrong password
     */
    public function test_login_fails_with_wrong_password()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('Password123')
        ]);

        $loginData = [
            'email' => 'john@example.com',
            'password' => 'WrongPassword123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ]);
    }

    /**
     * Test login with inactive account
     */
    public function test_login_fails_with_inactive_account()
    {
        // Create an inactive user
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('Password123'),
            'is_active' => false
        ]);

        $loginData = [
            'email' => 'john@example.com',
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Account is deactivated. Please contact support.'
                ]);
    }

    /**
     * Test login with missing email
     */
    public function test_login_fails_with_missing_email()
    {
        $loginData = [
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test login with missing password
     */
    public function test_login_fails_with_missing_password()
    {
        $loginData = [
            'email' => 'john@example.com'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test login with invalid email format
     */
    public function test_login_fails_with_invalid_email_format()
    {
        $loginData = [
            'email' => 'invalid-email',
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test login with case insensitive email
     */
    public function test_login_works_with_case_insensitive_email()
    {
        // Create a user with lowercase email
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('Password123')
        ]);

        // Try to login with uppercase email
        $loginData = [
            'email' => 'JOHN@EXAMPLE.COM',
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Login successful'
                ]);
    }

    /**
     * Test login with whitespace in email
     */
    public function test_login_works_with_whitespace_in_email()
    {
        // Create a user
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => bcrypt('Password123')
        ]);

        // Try to login with whitespace in email
        $loginData = [
            'email' => '  john@example.com  ',
            'password' => 'Password123'
        ];

        $response = $this->postJson('/api/auth/login', $loginData);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Login successful'
                ]);
    }
}
