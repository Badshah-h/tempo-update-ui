<?php

namespace App\Http\Controllers;

use App\Models\APIKey;
use App\Services\APIKeyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class APIKeyController extends Controller
{
    protected $keyService;
    
    public function __construct(APIKeyService $keyService)
    {
        $this->keyService = $keyService;
    }
    
    /**
     * Get all API keys.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $activeOnly = $request->query('active_only', false);
        $keys = $this->keyService->getAllKeys($activeOnly);
        
        // Mask key values for security
        $keys->each(function ($key) {
            $key->key_value = $this->maskApiKey($key->key_value);
        });
        
        return response()->json([
            'status' => 'success',
            'data' => $keys,
        ]);
    }
    
    /**
     * Get keys by provider.
     *
     * @param Request $request
     * @param int $providerId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByProvider(Request $request, $providerId)
    {
        $activeOnly = $request->query('active_only', false);
        $keys = $this->keyService->getKeysByProvider($providerId, $activeOnly);
        
        // Mask key values for security
        $keys->each(function ($key) {
            $key->key_value = $this->maskApiKey($key->key_value);
        });
        
        return response()->json([
            'status' => 'success',
            'data' => $keys,
        ]);
    }
    
    /**
     * Get a specific API key.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $key = $this->keyService->getKeyById($id);
        
        if (!$key) {
            return response()->json([
                'status' => 'error',
                'message' => 'API key not found',
            ], 404);
        }
        
        // Mask key value for security
        $key->key_value = $this->maskApiKey($key->key_value);
        
        return response()->json([
            'status' => 'success',
            'data' => $key,
        ]);
    }
    
    /**
     * Create a new API key.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'provider_id' => 'required|exists:ai_providers,id',
            'key_name' => 'required|string|max:255',
            'key_value' => 'required|string',
            'is_active' => 'nullable|boolean',
            'expires_at' => 'nullable|date',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $key = $this->keyService->createKey($request->all());
        
        // Mask key value for security in response
        $key->key_value = $this->maskApiKey($key->key_value);
        
        return response()->json([
            'status' => 'success',
            'message' => 'API key created successfully',
            'data' => $key,
        ], 201);
    }
    
    /**
     * Update an API key.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'provider_id' => 'nullable|exists:ai_providers,id',
            'key_name' => 'nullable|string|max:255',
            'key_value' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'expires_at' => 'nullable|date',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        $key = $this->keyService->updateKey($id, $request->all());
        
        if (!$key) {
            return response()->json([
                'status' => 'error',
                'message' => 'API key not found',
            ], 404);
        }
        
        // Mask key value for security
        $key->key_value = $this->maskApiKey($key->key_value);
        
        return response()->json([
            'status' => 'success',
            'message' => 'API key updated successfully',
            'data' => $key,
        ]);
    }
    
    /**
     * Delete an API key.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $result = $this->keyService->deleteKey($id);
        
        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'API key not found',
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'API key deleted successfully',
        ]);
    }
    
    /**
     * Toggle the active status of an API key.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggleStatus($id)
    {
        $key = $this->keyService->toggleKeyStatus($id);
        
        if (!$key) {
            return response()->json([
                'status' => 'error',
                'message' => 'API key not found',
            ], 404);
        }
        
        // Mask key value for security
        $key->key_value = $this->maskApiKey($key->key_value);
        
        return response()->json([
            'status' => 'success',
            'message' => 'API key status updated successfully',
            'data' => $key,
        ]);
    }
    
    /**
     * Validate an API key with the provider's API.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function validate($id)
    {
        $result = $this->keyService->validateKey($id);
        
        return response()->json([
            'status' => $result['valid'] ? 'success' : 'error',
            'message' => $result['message'],
            'valid' => $result['valid'],
        ]);
    }
    
    /**
     * Mask an API key for security.
     *
     * @param string $key
     * @return string
     */
    private function maskApiKey($key)
    {
        if (empty($key)) {
            return null;
        }
        
        $length = strlen($key);
        
        if ($length <= 8) {
            return '********';
        }
        
        $visibleChars = 4;
        $prefix = substr($key, 0, $visibleChars);
        $suffix = substr($key, -$visibleChars);
        
        return $prefix . str_repeat('*', $length - ($visibleChars * 2)) . $suffix;
    }
}