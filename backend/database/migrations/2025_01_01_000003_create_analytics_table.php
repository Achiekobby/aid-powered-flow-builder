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
        Schema::create('analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('flow_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('ussd_code_id')->nullable()->constrained()->onDelete('set null');
            $table->string('session_id')->nullable();
            $table->string('phone_number')->nullable();
            $table->enum('event_type', [
                'session_started',
                'session_completed',
                'session_terminated',
                'node_visited',
                'input_received',
                'error_occurred',
                'payment_initiated',
                'payment_completed'
            ]);
            $table->json('event_data')->nullable();
            $table->string('node_id')->nullable();
            $table->string('user_input')->nullable();
            $table->decimal('duration', 8, 2)->nullable();
            $table->string('telco')->nullable();
            $table->string('location')->nullable();
            $table->string('device_info')->nullable();
            $table->string('error_message')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['flow_id', 'created_at']);
            $table->index(['ussd_code_id', 'created_at']);
            $table->index(['event_type', 'created_at']);
            $table->index(['phone_number', 'created_at']);
            $table->index(['session_id']);
            $table->index(['created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics');
    }
};
