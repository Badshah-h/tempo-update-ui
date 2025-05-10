<?php

namespace App\Http\Controllers;

use App\Models\AIModel;
use App\Services\AIModelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AIModelController extends Controller
{
    protected $modelService;
    
    public function __construct(AIModelService $modelService)
    {
        $this->modelService = $modelService;
    }
    
    /**
     * Get all AI models.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $activeOnly = $request->query('active_only', false);
        $models = $this->modelService->getAllModels($activeOnly);
        
        return response()->json([
            'status' => 'success',
            'data' => $models,
        ]);
    }
    
    /**
     * Get models by provider.
     *
     * @param Request $request
     * @param int $providerId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByProvider(Request $request, $providerId)
    {
        $activeOnly = $request->query('active_only', false);
        $models = $this->modelService->getModelsByProvider($providerId, $activeOnly);
        
        return response()->json([
            'status' => 'success',
            'data' => $models,
        ]);
    }
    
    /**
     * Get a specific AI model.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $model = $this->modelService->getModelById($id);
        
        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $model,
        ]);
    }
    
    /**
     * Get the default AI model.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDefault()
    {
        $model = $this->modelService->getDefaultModel();
        
        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'No default model found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $model,
        ]);
    }
    
    /**
     * Create a new AI model.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider_id' => 'required|exists:ai_providers,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:ai_models,slug',
            'type' => 'required|string|max:255',
            'capabilities' => 'nullable|array',
            'context_types' => 'nullable|array',
            'max_tokens' => 'nullable|integer|min:1',
            'api_endpoint' => 'nullable|string|max:255',
            'default_parameters' => 'nullable|array',
            'system_prompt' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $model = $this->modelService->createModel($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Model created successfully',
            'data' => $model,
        ], 201);
    }
    
    /**
     * Update an AI model.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'provider_id' => 'nullable|exists:ai_providers,id',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:ai_models,slug,' . $id,
            'type' => 'nullable|string|max:255',
            'capabilities' => 'nullable|array',
            'context_types' => 'nullable|array',
            'max_tokens' => 'nullable|integer|min:1',
            'api_endpoint' => 'nullable|string|max:255',
            'default_parameters' => 'nullable|array',
            'system_prompt' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $model = $this->modelService->updateModel($id, $request->all());
        
        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Model updated successfully',
            'data' => $model,
        ]);
    }
    
    /**
     * Delete an AI model.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $result = $this->modelService->deleteModel($id);
        
        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Model deleted successfully',
        ]);
    }
    
    /**
     * Toggle the active status of a model.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus($id)
    {
        $model = $this->modelService->toggleModelStatus($id);
        
        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Model status updated successfully',
            'data' => $model,
        ]);
    }
    
    /**
     * Set a model as the default.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function setAsDefault($id)
    {
        $model = $this->modelService->setAsDefault($id);
        
        if (!$model) {
            return response()->json([
                'status' => 'error',
                'message' => 'Model not found or inactive',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Model set as default successfully',
            'data' => $model,
        ]);
    }
    
    /**
     * Test a model with a sample query.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function testModel(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string',
            'options' => 'nullable|array',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $result = $this->modelService->testModel(
            $id,
            $request->query,
            $request->options ?? []
        );
        
        if (!$result['success']) {
            return response()->json([
                'status' => 'error',
                'message' => $result['message'],
            ], 400);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $result,
        ]);
    }
}