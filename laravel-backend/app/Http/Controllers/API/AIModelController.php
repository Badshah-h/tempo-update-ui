<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AIModel;
use App\Services\AIModelService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AIModelController extends Controller
{
    protected $modelService;
    
    /**
     * Create a new controller instance.
     *
     * @param AIModelService $modelService
     */
    public function __construct(AIModelService $modelService)
    {
        $this->modelService = $modelService;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $activeOnly = $request->boolean('active_only', false);
        $models = $this->modelService->getAllModels($activeOnly);
        
        return response()->json([
            'success' => true,
            'data' => $models
        ]);
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'provider_id' => 'required|exists:ai_providers,id',
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:ai_models,slug',
            'type' => 'required|string|max:255',
            'capabilities' => 'nullable|array',
            'max_tokens' => 'nullable|integer|min:1',
            'api_endpoint' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $model = $this->modelService->createModel($request->all());
        
        return response()->json([
            'success' => true,
            'message' => 'AI Model created successfully',
            'data' => $model
        ], 201);
    }
    
    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $model = $this->modelService->getModelById((int) $id);
        
        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'AI Model not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $model
        ]);
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'provider_id' => 'nullable|exists:ai_providers,id',
            'name' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255|unique:ai_models,slug,' . $id,
            'type' => 'nullable|string|max:255',
            'capabilities' => 'nullable|array',
            'max_tokens' => 'nullable|integer|min:1',
            'api_endpoint' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
            'is_default' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $model = $this->modelService->updateModel((int) $id, $request->all());
        
        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'AI Model not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'AI Model updated successfully',
            'data' => $model
        ]);
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $result = $this->modelService->deleteModel((int) $id);
        
        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'AI Model not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'AI Model deleted successfully'
        ]);
    }
    
    /**
     * Get models by provider.
     *
     * @param Request $request
     * @param string $providerId
     * @return JsonResponse
     */
    public function getByProvider(Request $request, string $providerId): JsonResponse
    {
        $activeOnly = $request->boolean('active_only', false);
        $models = $this->modelService->getModelsByProvider((int) $providerId, $activeOnly);
        
        return response()->json([
            'success' => true,
            'data' => $models
        ]);
    }
    
    /**
     * Toggle the active status of a model.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function toggleActive(string $id): JsonResponse
    {
        $model = $this->modelService->toggleModelStatus((int) $id);
        
        if (!$model) {
            return response()->json([
                'success' => false,
                'message' => 'AI Model not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'AI Model status toggled successfully',
            'data' => $model
        ]);
    }
}
