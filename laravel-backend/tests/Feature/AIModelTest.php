<?php

namespace Tests\Feature;

use App\Models\AIModel;
use App\Models\AiProvider;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AIModelTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $user;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a user
        $this->user = User::factory()->create();

        // Create a provider
        $this->provider = AiProvider::create([
            'name' => 'Test Provider',
            'slug' => 'test-provider',
            'description' => 'Test provider description',
            'is_active' => true,
            'auth_requirements' => json_encode(['api_key' => ['type' => 'string', 'required' => true]]),
            'available_models' => json_encode(['test-model']),
            'default_parameters' => json_encode(['temperature' => 0.7]),
        ]);
    }

    public function test_can_get_all_models(): void
    {
        // Create some models
        AIModel::create([
            'provider_id' => $this->provider->id,
            'name' => 'Test Model 1',
            'slug' => 'test-model-1',
            'type' => 'text',
            'max_tokens' => 1024,
            'is_active' => true,
            'is_default' => false,
        ]);

        AIModel::create([
            'provider_id' => $this->provider->id,
            'name' => 'Test Model 2',
            'slug' => 'test-model-2',
            'type' => 'chat',
            'max_tokens' => 2048,
            'is_active' => true,
            'is_default' => true,
        ]);

        // Make authenticated request
        $response = $this->actingAs($this->user)
            ->getJson('/api/ai-models');

        // Assert response
        $response->assertStatus(200)
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.name', 'Test Model 1')
            ->assertJsonPath('data.1.name', 'Test Model 2');
    }

    public function test_can_create_model(): void
    {
        $modelData = [
            'provider_id' => $this->provider->id,
            'name' => 'New Test Model',
            'slug' => 'new-test-model',
            'type' => 'chat',
            'max_tokens' => 1024,
            'api_endpoint' => 'https://api.example.com/v1/chat',
            'credentials' => json_encode(['api_key' => 'test-key']),
            'is_active' => true,
            'is_default' => false,
        ];

        // Make authenticated request
        $response = $this->actingAs($this->user)
            ->postJson('/api/ai-models', $modelData);

        // Assert response
        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'New Test Model')
            ->assertJsonPath('data.slug', 'new-test-model');

        // Assert model was created in database
        $this->assertDatabaseHas('ai_models', [
            'name' => 'New Test Model',
            'slug' => 'new-test-model',
        ]);
    }

    public function test_can_update_model(): void
    {
        // Create a model
        $model = AIModel::create([
            'provider_id' => $this->provider->id,
            'name' => 'Test Model',
            'slug' => 'test-model',
            'type' => 'text',
            'max_tokens' => 1024,
            'is_active' => true,
            'is_default' => false,
        ]);

        $updateData = [
            'name' => 'Updated Model Name',
            'max_tokens' => 2048,
            'is_active' => false,
        ];

        // Make authenticated request
        $response = $this->actingAs($this->user)
            ->putJson("/api/ai-models/{$model->id}", $updateData);

        // Assert response
        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Updated Model Name')
            ->assertJsonPath('data.max_tokens', 2048)
            ->assertJsonPath('data.is_active', false);

        // Assert model was updated in database
        $this->assertDatabaseHas('ai_models', [
            'id' => $model->id,
            'name' => 'Updated Model Name',
            'max_tokens' => 2048,
            'is_active' => 0,
        ]);
    }

    public function test_can_delete_model(): void
    {
        // Create a model
        $model = AIModel::create([
            'provider_id' => $this->provider->id,
            'name' => 'Test Model',
            'slug' => 'test-model',
            'type' => 'text',
            'max_tokens' => 1024,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Make authenticated request
        $response = $this->actingAs($this->user)
            ->deleteJson("/api/ai-models/{$model->id}");

        // Assert response
        $response->assertStatus(200);

        // Assert model was deleted from database
        $this->assertDatabaseMissing('ai_models', [
            'id' => $model->id,
        ]);
    }

    public function test_can_toggle_model_active_status(): void
    {
        // Create a model
        $model = AIModel::create([
            'provider_id' => $this->provider->id,
            'name' => 'Test Model',
            'slug' => 'test-model',
            'type' => 'text',
            'max_tokens' => 1024,
            'is_active' => true,
            'is_default' => false,
        ]);

        // Make authenticated request to toggle status
        $response = $this->actingAs($this->user)
            ->postJson("/api/ai-models/{$model->id}/toggle-active");

        // Assert response
        $response->assertStatus(200)
            ->assertJsonPath('data.is_active', false);

        // Assert model status was updated in database
        $this->assertDatabaseHas('ai_models', [
            'id' => $model->id,
            'is_active' => 0,
        ]);

        // Toggle back to active
        $response = $this->actingAs($this->user)
            ->postJson("/api/ai-models/{$model->id}/toggle-active");

        // Assert response
        $response->assertStatus(200)
            ->assertJsonPath('data.is_active', true);

        // Assert model status was updated in database
        $this->assertDatabaseHas('ai_models', [
            'id' => $model->id,
            'is_active' => 1,
        ]);
    }
}
