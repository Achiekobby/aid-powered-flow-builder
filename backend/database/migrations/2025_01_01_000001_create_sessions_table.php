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
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('flow_id')->constrained()->onDelete('cascade');
            $table->string('session_id')->unique();
            $table->string('phone_number');
            $table->string('ussd_code');
            $table->enum('status', ['active', 'completed', 'expired', 'terminated'])->default('active');
            $table->json('session_data')->nullable();
            $table->json('user_inputs')->nullable();
            $table->string('current_node')->nullable();
            $table->integer('step_count')->default(0);
            $table->timestamp('started_at');
            $table->timestamp('last_activity_at');
            $table->timestamp('expires_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['session_id']);
            $table->index(['phone_number']);
            $table->index(['ussd_code']);
            $table->index(['status']);
            $table->index(['flow_id', 'status']);
            $table->index(['last_activity_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
