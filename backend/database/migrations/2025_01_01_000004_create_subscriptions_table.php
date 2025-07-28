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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('subscription_id')->unique();
            $table->enum('plan', ['starter', 'professional', 'enterprise']);
            $table->enum('status', ['active', 'inactive', 'cancelled', 'expired', 'pending'])->default('pending');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('GHS');
            $table->enum('billing_cycle', ['monthly', 'quarterly', 'yearly'])->default('monthly');
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->timestamp('next_billing_date')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->json('features')->nullable();
            $table->json('usage_limits')->nullable();
            $table->json('current_usage')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['subscription_id']);
            $table->index(['plan', 'status']);
            $table->index(['end_date']);
            $table->index(['next_billing_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
