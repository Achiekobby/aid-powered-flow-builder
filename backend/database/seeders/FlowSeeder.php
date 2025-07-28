<?php

namespace Database\Seeders;

use App\Models\Flow;
use App\Models\User;
use Illuminate\Database\Seeder;

class FlowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::factory(5)->create();

        foreach ($users as $user) {
            Flow::factory()
                ->count(fake()->numberBetween(2, 5))
                ->for($user)
                ->create();

            // Create 1-2 active flows per user
            Flow::factory()
                ->count(fake()->numberBetween(1, 2))
                ->active()
                ->for($user)
                ->create();

            // Create 1 used flow per user
            Flow::factory()
                ->used()
                ->for($user)
                ->create();
        }

        // Create template flows (not associated with specific users)
        Flow::factory()
            ->count(10)
            ->template()
            ->create();

        // Create category-specific template flows
        Flow::factory()
            ->count(3)
            ->template()
            ->banking()
            ->create();

        Flow::factory()
            ->count(3)
            ->template()
            ->ecommerce()
            ->create();

        Flow::factory()
            ->count(2)
            ->template()
            ->healthcare()
            ->create();

        Flow::factory()
            ->count(2)
            ->template()
            ->education()
            ->create();

        // Create some popular flows with high usage
        Flow::factory()
            ->count(5)
            ->active()
            ->usageCount(fake()->numberBetween(100, 1000))
            ->create();

        // Create flows with different versions
        $user = User::first();
        if ($user) {
            Flow::factory()
                ->count(3)
                ->for($user)
                ->version(2)
                ->create();

            Flow::factory()
                ->count(2)
                ->for($user)
                ->version(3)
                ->create();
        }

        $this->command->info('Flow seeder completed successfully!');
        $this->command->info('Created:');
        $this->command->info('- ' . Flow::count() . ' total flows');
        $this->command->info('- ' . Flow::where('is_template', true)->count() . ' template flows');
        $this->command->info('- ' . Flow::where('is_active', true)->count() . ' active flows');
        $this->command->info('- ' . Flow::where('usage_count', '>', 0)->count() . ' used flows');
    }
}
