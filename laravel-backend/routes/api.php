<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\API\AiProviderController;
use App\Http\Controllers\API\AiModelConfigController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserRoleController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // AI Providers routes
    Route::apiResource('ai-providers', AiProviderController::class);

    // AI Model Configurations routes
    Route::apiResource('ai-model-configs', AiModelConfigController::class);
    Route::post('ai-model-configs/{id}/toggle-active', [AiModelConfigController::class, 'toggleActive']);
    Route::post('ai-model-configs/{id}/test', [AiModelConfigController::class, 'testModel']);

    // User management
    Route::apiResource('users', UserController::class);
    Route::patch('users/{id}/status', [UserController::class, 'updateStatus']);

    // Roles and Permissions routes
    // Roles management
    Route::apiResource('roles', RoleController::class);

    // User-Role management
    Route::get('users/{userId}/roles', [UserRoleController::class, 'getUserRoles']);
    Route::post('users/{userId}/roles', [UserRoleController::class, 'assignRole']);
    Route::delete('users/{userId}/roles/{roleId}', [UserRoleController::class, 'removeRole']);
    Route::put('users/{userId}/roles', [UserRoleController::class, 'syncRoles']);

    // Special admin route for debugging
    Route::get('/admin-check', function (Request $request) {
        $user = $request->user();
        $isAdmin = $user->email === 'admin@example.com';

        return response()->json([
            'status' => 'success',
            'isAdmin' => $isAdmin,
            'user' => [
                'id' => (string) $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'isAdmin' => $isAdmin,
            ]
        ]);
    });
});

// Public AI routes (if needed)
Route::get('ai-providers/public', [AiProviderController::class, 'index']);
