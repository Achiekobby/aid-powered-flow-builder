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
        Schema::create('ussd_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('flow_id')->nullable()->constrained()->onDelete('set null');
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('status', ['active', 'inactive', 'pending', 'suspended'])->default('pending');
            $table->enum('telco', ['mtn', 'telecel', 'AirtelTigo', 'all'])->default('all');
            $table->json('settings')->nullable();
            $table->integer('usage_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();

            $table->index(['code']);
            $table->index(['status']);
            $table->index(['telco']);
            $table->index(['user_id', 'status']);
            $table->index(['flow_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ussd_codes');
    }
};
