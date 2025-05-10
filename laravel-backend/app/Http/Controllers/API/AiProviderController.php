<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AiProvider;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AiProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $providers = AiProvider::all();
        return response()->json([
            'success' => true,
            'data' => $providers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:ai_providers,slug',
                'description' => 'nullable|string',
                'logo_url' => 'nullable|string|url',
                'is_active' => 'boolean',
                'auth_requirements' => 'nullable|array',
                'available_models' => 'nullable|array',
                'default_parameters' => 'nullable|array',
            ]);

            // Generate slug if not provided
            if (!isset($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }

            $provider = AiProvider::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'AI Provider created successfully',
                'data' => $provider
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
                'message' => 'Failed to create AI Provider',
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
            $provider = AiProvider::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $provider
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'AI Provider not found',
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
            $provider = AiProvider::findOrFail($id);

            $validated = $request->validate([
                'name' => 'string|max:255',
                'slug' => 'string|max:255|unique:ai_providers,slug,' . $id,
                'description' => 'nullable|string',
                'logo_url' => 'nullable|string|url',
                'is_active' => 'boolean',
                'auth_requirements' => 'nullable|array',
                'available_models' => 'nullable|array',
                'default_parameters' => 'nullable|array',
            ]);

            $provider->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'AI Provider updated successfully',
                'data' => $provider
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
                'message' => 'Failed to update AI Provider',
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
            $provider = AiProvider::findOrFail($id);
            $provider->delete();

            return response()->json([
                'success' => true,
                'message' => 'AI Provider deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete AI Provider',
                'error' => $e->getMessage()
            ], $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException ? 404 : 500);
        }
    }
}
