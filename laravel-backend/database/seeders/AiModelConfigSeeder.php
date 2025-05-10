<?php

namespace Database\Seeders;

use App\Models\AiModelConfig;
use App\Models\AiProvider;
use Illuminate\Database\Seeder;

class AiModelConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get provider IDs
        $googleProvider = AiProvider::where('slug', 'google')->first();
        $openaiProvider = AiProvider::where('slug', 'openai')->first();
        $huggingfaceProvider = AiProvider::where('slug', 'huggingface')->first();

        if (!$googleProvider || !$openaiProvider || !$huggingfaceProvider) {
            $this->command->error('Required providers not found. Please run AiProviderSeeder first.');
            return;
        }

        $models = [
            [
                'ai_provider_id' => $googleProvider->id,
                'name' => 'Gemini Pro',
                'model_id' => 'gemini-pro',
                'type' => 'Large Language Model',
                'is_active' => true,
                'credentials' => json_encode([
                    'api_key' => 'AIza...'
                ]),
                'parameters' => json_encode([
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                    'top_p' => 0.9,
                    'presence_penalty' => 0
                ]),
                'system_prompt' => 'You are a helpful AI assistant for our company. Answer questions accurately and concisely based on the provided context. If you don\'t know the answer, say so rather than making up information.',
                'cost_per_query' => 0.0010,
                'performance_score' => 94
            ],
            [
                'ai_provider_id' => $huggingfaceProvider->id,
                'name' => 'T5 Large',
                'model_id' => 'mistral-7b',
                'type' => 'Text-to-Text',
                'is_active' => true,
                'credentials' => json_encode([
                    'api_key' => 'hf_...'
                ]),
                'parameters' => json_encode([
                    'temperature' => 0.8,
                    'max_tokens' => 512,
                    'top_p' => 0.95
                ]),
                'system_prompt' => 'You are a helpful AI assistant. Provide accurate and concise answers to user questions.',
                'cost_per_query' => 0.0005,
                'performance_score' => 89
            ],
            [
                'ai_provider_id' => $openaiProvider->id,
                'name' => 'Custom Fine-tuned',
                'model_id' => 'gpt-3.5-turbo',
                'type' => 'Fine-tuned GPT',
                'is_active' => false,
                'credentials' => json_encode([
                    'api_key' => 'sk_...'
                ]),
                'parameters' => json_encode([
                    'temperature' => 0.5,
                    'max_tokens' => 2048,
                    'top_p' => 0.9,
                    'presence_penalty' => 0.1
                ]),
                'system_prompt' => 'You are a specialized AI assistant for our company, trained on our documentation and knowledge base. Provide accurate and helpful responses to user queries.',
                'cost_per_query' => 0.0020,
                'performance_score' => 96
            ]
        ];

        foreach ($models as $model) {
            AiModelConfig::create($model);
        }
    }
}
