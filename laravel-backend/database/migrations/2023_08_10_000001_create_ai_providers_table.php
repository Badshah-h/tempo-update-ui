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
        Schema::create('ai_provider_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->string('version')->default('1.0');
            $table->json('auth_config')->nullable();
            $table->json('endpoints')->nullable();
            $table->json('request_templates')->nullable();
            $table->json('response_mappings')->nullable();
            $table->json('parameter_schema')->nullable();
            $table->json('stream_config')->nullable();
            $table->json('token_calculation')->nullable();
            $table->json('cost_calculation')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Ensure only one active config per provider
            $table->unique(['provider_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_providers');
    }
};