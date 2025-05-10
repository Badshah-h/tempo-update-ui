<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AiModelConfig;
use App\Models\AiProvider;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class AiModelConfigController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AiModelConfig::with('provider');

        // Filter by provider if requested
        if ($request->has('provider_id')) {
            $query->where('ai_provider_id', $request->provider_id);
        }

        // Filter by active status if requested
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $models = $query->get();

        return response()->json([
            'success' => true,
            'data' => $models
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ai_provider_id' => 'required|exists:ai_providers,id',
                'name' => 'required|string|max:255',
                'model_id' => 'required|string|max:255',
                'type' => 'nullable|string|max:255',
                'is_active' => 'boolean',
                'credentials' => 'nullable|array',
                'parameters' => 'nullable|array',
                'system_prompt' => 'nullable|string',
                'cost_per_query' => 'nullable|numeric|min:0',
                'performance_score' => 'nullable|integer|min:0|max:100',
            ]);

            $modelConfig = AiModelConfig::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'AI Model Configuration created successfully',
                'data' => $modelConfig
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create AI Model Configuration',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $modelConfig = AiModelConfig::with('provider')->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $modelConfig
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'AI Model Configuration not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $modelConfig = AiModelConfig::findOrFail($id);

            $validated = $request->validate([
                'ai_provider_id' => 'exists:ai_providers,id',
                'name' => 'string|max:255',
                'model_id' => 'string|max:255',
                'type' => 'nullable|string|max:255',
                'is_active' => 'boolean',
                'credentials' => 'nullable|array',
                'parameters' => 'nullable|array',
                'system_prompt' => 'nullable|string',
                'cost_per_query' => 'nullable|numeric|min:0',
                'performance_score' => 'nullable|integer|min:0|max:100',
            ]);

            $modelConfig->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'AI Model Configuration updated successfully',
                'data' => $modelConfig
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update AI Model Configuration',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $modelConfig = AiModelConfig::findOrFail($id);
            $modelConfig->delete();

            return response()->json([
                'success' => true,
                'message' => 'AI Model Configuration deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete AI Model Configuration',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Toggle the active status of a model configuration.
     */
    public function toggleActive(string $id): JsonResponse
    {
        try {
            $modelConfig = AiModelConfig::findOrFail($id);
            $modelConfig->is_active = !$modelConfig->is_active;
            $modelConfig->save();

            return response()->json([
                'success' => true,
                'message' => 'AI Model Configuration status toggled successfully',
                'data' => [
                    'id' => $modelConfig->id,
                    'is_active' => $modelConfig->is_active
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle AI Model Configuration status',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }

    /**
     * Test the model configuration with a sample query.
     */
    public function testModel(Request $request, string $id): JsonResponse
    {
        try {
            $modelConfig = AiModelConfig::with('provider')->findOrFail($id);

            $validated = $request->validate([
                'query' => 'required|string',
                'test_parameters' => 'nullable|array',
            ]);

            // In a real implementation, this would call the appropriate AI service
            // For now, we'll simulate a response

            $responseTime = rand(8, 20) / 10; // Random response time between 0.8 and 2.0 seconds
            $tokens = rand(100, 350); // Random token count
            $cost = $tokens * 0.000002; // Simulated cost calculation

            $simulatedResponse = [
                'content' => "This is a simulated response from the {$modelConfig->name} model. In a real implementation, this would be the actual response from the AI provider's API.",
                'metadata' => [
                    'response_time' => $responseTime,
                    'tokens_used' => $tokens,
                    'estimated_cost' => $cost,
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $simulatedResponse
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to test AI Model',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }
}
