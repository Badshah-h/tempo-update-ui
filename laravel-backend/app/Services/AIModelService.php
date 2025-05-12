<?php

namespace App\Services;

use App\Models\AIModel;
use App\Models\AIProvider;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class AIModelService
{
    /**
     * Get all AI models.
     *
     * @param bool $activeOnly
     * @return Collection
     */
    public function getAllModels(bool $activeOnly = false): Collection
    {
        $query = AIModel::with('provider');

        if ($activeOnly) {
            $query->where('is_active', true);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get models by provider ID.
     *
     * @param int $providerId
     * @param bool $activeOnly
     * @return Collection
     */
    public function getModelsByProvider(int $providerId, bool $activeOnly = false): Collection
    {
        $query = AIModel::where('provider_id', $providerId);

        if ($activeOnly) {
            $query->where('is_active', true);
        }

        return $query->orderBy('name')->get();
    }

    /**
     * Get a model by ID.
     *
     * @param int $id
     * @return AIModel|null
     */
    public function getModelById(int $id): ?AIModel
    {
        return AIModel::with('provider')->find($id);
    }

    /**
     * Get a model by slug.
     *
     * @param string $slug
     * @return AIModel|null
     */
    public function getModelBySlug(string $slug): ?AIModel
    {
        return AIModel::with('provider')->where('slug', $slug)->first();
    }

    /**
     * Get the default AI model.
     *
     * @return AIModel|null
     */
    public function getDefaultModel(): ?AIModel
    {
        return AIModel::where('is_default', true)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Create a new AI model.
     *
     * @param array $data
     * @return AIModel
     */
    public function createModel(array $data): AIModel
    {
        // Generate slug if not provided
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // If this is set as default, unset any existing defaults
        if (isset($data['is_default']) && $data['is_default']) {
            $this->clearDefaultModels();
        }

        return AIModel::create($data);
    }

    /**
     * Update an AI model.
     *
     * @param int $id
     * @param array $data
     * @return AIModel|null
     */
    public function updateModel(int $id, array $data): ?AIModel
    {
        $model = $this->getModelById($id);

        if (!$model) {
            return null;
        }

        // Update slug if name changed and slug not provided
        if (isset($data['name']) && !isset($data['slug']) && $data['name'] !== $model->name) {
            $data['slug'] = Str::slug($data['name']);
        }

        // If this is set as default, unset any existing defaults
        if (isset($data['is_default']) && $data['is_default'] && !$model->is_default) {
            $this->clearDefaultModels();
        }

        $model->update($data);
        return $model;
    }

    /**
     * Delete an AI model.
     *
     * @param int $id
     * @return bool
     */
    public function deleteModel(int $id): bool
    {
        $model = $this->getModelById($id);

        if (!$model) {
            return false;
        }

        // If this was the default model, find another to make default
        if ($model->is_default) {
            $newDefault = AIModel::where('id', '!=', $id)
                ->where('is_active', true)
                ->first();

            if ($newDefault) {
                $newDefault->is_default = true;
                $newDefault->save();
            }
        }

        return $model->delete();
    }

    /**
     * Toggle the active status of a model.
     *
     * @param int $id
     * @return AIModel|null
     */
    public function toggleModelStatus(int $id): ?AIModel
    {
        $model = $this->getModelById($id);

        if (!$model) {
            return null;
        }

        $model->is_active = !$model->is_active;

        // If deactivating the default model, find another to make default
        if ($model->is_default && !$model->is_active) {
            $newDefault = AIModel::where('id', '!=', $id)
                ->where('is_active', true)
                ->first();

            if ($newDefault) {
                $model->is_default = false;
                $newDefault->is_default = true;
                $newDefault->save();
            }
        }

        $model->save();
        return $model;
    }

    /**
     * Set a model as the default.
     *
     * @param int $id
     * @return AIModel|null
     */
    public function setAsDefault(int $id): ?AIModel
    {
        $model = $this->getModelById($id);

        if (!$model || !$model->is_active) {
            return null;
        }

        $this->clearDefaultModels();

        $model->is_default = true;
        $model->save();

        return $model;
    }

    /**
     * Clear all default models.
     *
     * @return void
     */
    private function clearDefaultModels(): void
    {
        AIModel::where('is_default', true)->update(['is_default' => false]);
    }

    /**
     * Test a model with a sample query.
     *
     * @param int $id
     * @param string $query
     * @param array $options
     * @return array
     */
    public function testModel(int $id, string $query, array $options = []): array
    {
        $model = $this->getModelById($id);

        if (!$model) {
            return [
                'success' => false,
                'message' => 'Model not found',
            ];
        }

        // Get the appropriate AI adapter for this model
        $adapter = $this->getAdapterForModel($model);

        if (!$adapter) {
            return [
                'success' => false,
                'message' => 'No adapter available for this model',
            ];
        }

        try {
            $startTime = microtime(true);
            $response = $adapter->generateResponse($query, $options);
            $endTime = microtime(true);

            $responseTime = round($endTime - $startTime, 2);

            return [
                'success' => true,
                'response' => $response['content'],
                'metrics' => [
                    'time' => $responseTime . 's',
                    'tokens' => $response['usage']['total_tokens'] ?? 0,
                    'cost' => $response['usage']['cost'] ?? 0,
                ],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get the appropriate AI adapter for a model.
     *
     * @param AIModel $model
     * @return mixed|null
     */
    private function getAdapterForModel(AIModel $model)
    {
        $provider = $model->provider;

        if (!$provider || !$provider->is_active) {
            return null;
        }

        $apiKey = $provider->activeApiKey;

        if (!$apiKey) {
            return null;
        }

        // Use the adapter factory to get the right adapter
        return \App\Services\AIAdapters\AIAdapterFactory::createAdapter($model, $apiKey->key_value);
    }
}