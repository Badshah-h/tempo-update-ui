<?php

namespace Database\Seeders;

use App\Models\AiProvider;
use Illuminate\Database\Seeder;

class AiProviderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $providers = [
            [
                'name' => 'Google',
                'slug' => 'google',
                'description' => 'Google AI models including Gemini',
                'logo_url' => null,
                'is_active' => true,
                'auth_requirements' => json_encode([
                    'api_key' => [
                        'type' => 'string',
                        'required' => true,
                        'description' => 'Google API Key'
                    ]
                ]),
                'available_models' => json_encode([
                    'gemini-pro',
                    'gemini-pro-vision',
                    'gemini-ultra'
                ]),
                'default_parameters' => json_encode([
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                    'top_p' => 0.9,
                    'presence_penalty' => 0
                ])
            ],
            [
                'name' => 'OpenAI',
                'slug' => 'openai',
                'description' => 'OpenAI models including GPT-4 and GPT-3.5',
                'logo_url' => null,
                'is_active' => true,
                'auth_requirements' => json_encode([
                    'api_key' => [
                        'type' => 'string',
                        'required' => true,
                        'description' => 'OpenAI API Key'
                    ],
                    'organization_id' => [
                        'type' => 'string',
                        'required' => false,
                        'description' => 'OpenAI Organization ID'
                    ]
                ]),
                'available_models' => json_encode([
                    'gpt-4',
                    'gpt-4-turbo',
                    'gpt-3.5-turbo'
                ]),
                'default_parameters' => json_encode([
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                    'top_p' => 0.9,
                    'presence_penalty' => 0
                ])
            ],
            [
                'name' => 'Hugging Face',
                'slug' => 'huggingface',
                'description' => 'Hugging Face models and endpoints',
                'logo_url' => null,
                'is_active' => true,
                'auth_requirements' => json_encode([
                    'api_key' => [
                        'type' => 'string',
                        'required' => true,
                        'description' => 'Hugging Face API Key'
                    ]
                ]),
                'available_models' => json_encode([
                    'mistral-7b',
                    'llama-2-70b',
                    'falcon-40b'
                ]),
                'default_parameters' => json_encode([
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                    'top_p' => 0.9
                ])
            ]
        ];

        foreach ($providers as $provider) {
            AiProvider::create($provider);
        }
    }
}
