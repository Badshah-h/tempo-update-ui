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
        Schema::create('model_usage_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('model_id')->constrained('ai_models')->onDelete('cascade');
            $table->date('date');
            $table->integer('request_count')->default(0);
            $table->integer('token_count')->default(0);
            $table->float('average_response_time')->default(0);
            $table->float('cost')->default(0);
            $table->integer('success_count')->default(0);
            $table->integer('error_count')->default(0);
            $table->timestamps();
            
            $table->unique(['model_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_usage_stats');
    }
};