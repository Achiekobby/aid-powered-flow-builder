<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = \App\Models\User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'company' => fake()->optional()->company(),
            'phone' => fake()->optional()->phoneNumber(),
            'country' => 'Ghana',
            'subscription_plan' => fake()->randomElement(['starter', 'professional', 'enterprise']),
            'is_active' => true,
            'is_admin' => false,
            'settings' => [
                'theme' => 'light',
                'language' => 'en',
                'notifications' => [
                    'email' => true,
                    'sms' => false,
                    'push' => false
                ],
                'timezone' => 'Africa/Accra',
                'currency' => 'GHS'
            ],
            'email_verified_at' => now(),
            'last_login_at' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
                'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Indicate that the user is an admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_admin' => true,
        ]);
    }

    /**
     * Indicate that the user is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the user has a specific subscription plan.
     */
    public function subscriptionPlan(string $plan): static
    {
        return $this->state(fn (array $attributes) => [
            'subscription_plan' => $plan,
        ]);
    }
}
