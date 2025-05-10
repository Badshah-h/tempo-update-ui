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
        Schema::create('ai_model_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_provider_id')->constrained('ai_providers')->onDelete('cascade');
            $table->string('name');
            $table->string('model_id');
            $table->string('type')->nullable();
            $table->boolean('is_active')->default(true);
            $table->json('credentials')->nullable();
            $table->json('parameters')->nullable();
            $table->text('system_prompt')->nullable();
            $table->decimal('cost_per_query', 10, 6)->default(0);
            $table->integer('performance_score')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_model_configs');
    }
};
