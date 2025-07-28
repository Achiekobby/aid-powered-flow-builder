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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->nullable()->constrained()->onDelete('set null');
            $table->string('payment_id')->unique();
            $table->string('reference')->unique();
            $table->enum('type', ['subscription', 'ussd_code', 'addon', 'credit'])->default('subscription');
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'])->default('pending');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('GHS');
            $table->enum('payment_method', ['flutterwave', 'paystack', 'momo', 'card', 'bank_transfer'])->nullable();
            $table->string('gateway_response')->nullable();
            $table->json('metadata')->nullable();
            $table->string('description')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['subscription_id', 'status']);
            $table->index(['payment_id']);
            $table->index(['reference']);
            $table->index(['type', 'status']);
            $table->index(['payment_method', 'status']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
