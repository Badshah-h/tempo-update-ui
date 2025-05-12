<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\AiProviderConfigService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AiProviderConfigController extends Controller
{
    protected $configService;
    
    /**
     * Create a new controller instance.
     *
     * @param AiProviderConfigService $configService
     */
    public function __construct(AiProviderConfigService $configService)
    {
        $this->configService = $configService;
    }
    
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $providerId = $request->input('provider_id');
        
        if ($providerId) {
            $configs = $this->configService->getConfigsForProvider((int) $providerId);
        } else {
            $configs = $this->configService->getAllConfigs();
        }
        
        return response()->json([
            'success' => true,
            'data' => $configs
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
        try {
            $config = $this->configService->createConfig($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Provider configuration created successfully',
                'data' => $config
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
                'message' => 'Failed to create provider configuration',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $config = $this->configService->getConfigById((int) $id);
        
        if (!$config) {
            return response()->json([
                'success' => false,
                'message' => 'Provider configuration not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $config
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
        try {
            $config = $this->configService->updateConfig((int) $id, $request->all());
            
            if (!$config) {
                return response()->json([
                    'success' => false,
                    'message' => 'Provider configuration not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Provider configuration updated successfully',
                'data' => $config
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
                'message' => 'Failed to update provider configuration',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $result = $this->configService->deleteConfig((int) $id);
        
        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Provider configuration not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Provider configuration deleted successfully'
        ]);
    }
    
    /**
     * Set a configuration as active.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function setActive(string $id): JsonResponse
    {
        $config = $this->configService->setConfigAsActive((int) $id);
        
        if (!$config) {
            return response()->json([
                'success' => false,
                'message' => 'Provider configuration not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'message' => 'Provider configuration set as active successfully',
            'data' => $config
        ]);
    }
    
    /**
     * Test a provider configuration.
     *
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function testConfig(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string',
            'api_key' => 'nullable|string',
            'options' => 'nullable|array',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $result = $this->configService->testConfig(
            (int) $id,
            $request->input('query'),
            array_merge(
                ['api_key' => $request->input('api_key')],
                $request->input('options', [])
            )
        );
        
        return response()->json($result);
    }
    
    /**
     * Create a new provider with configuration.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createProviderWithConfig(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'provider' => 'required|array',
                'provider.name' => 'required|string|max:255',
                'provider.slug' => 'nullable|string|max:255|unique:ai_providers,slug',
                'provider.description' => 'nullable|string',
                'provider.logo_url' => 'nullable|string|max:255',
                'provider.is_active' => 'nullable|boolean',
                'config' => 'required|array',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            $result = $this->configService->createProviderWithConfig($request->all());
            
            return response()->json([
                'success' => true,
                'message' => 'Provider with configuration created successfully',
                'data' => $result
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
                'message' => 'Failed to create provider with configuration',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get default templates for common providers.
     *
     * @return JsonResponse
     */
    public function getDefaultTemplates(): JsonResponse
    {
        $templates = $this->configService->getDefaultTemplates();
        
        return response()->json([
            'success' => true,
            'data' => $templates
        ]);
    }
}
