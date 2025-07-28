<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('company')->nullable();
            $table->string('phone')->nullable();
            $table->string('country')->default('Ghana');
            $table->enum('subscription_plan', ['starter', 'professional', 'enterprise'])->default('starter');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_admin')->default(false);
            $table->json('settings')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->index(['email']);
            $table->index(['subscription_plan', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
