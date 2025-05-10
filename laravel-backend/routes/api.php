<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AIProviderController;
use App\Http\Controllers\AIModelController;
use App\Http\Controllers\APIKeyController;
use App\Http\Controllers\RoutingRuleController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Add a fallback user route outside the auth middleware for debugging
Route::get('/user-debug', [AuthController::class, 'user']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Permissions routes
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::get('/permissions/grouped', [PermissionController::class, 'grouped']);

    // Roles routes
    Route::apiResource('/roles', RoleController::class);

    // Users routes
    Route::apiResource('/users', UserController::class);
    
    // AI Providers routes
    Route::apiResource('/ai-providers', AIProviderController::class);
    Route::put('/ai-providers/{id}/toggle-status', [AIProviderController::class, 'toggleStatus']);
    
    // AI Models routes
    Route::apiResource('/ai-models', AIModelController::class);
    Route::get('/ai-models/provider/{providerId}', [AIModelController::class, 'getByProvider']);
    Route::get('/ai-models/default', [AIModelController::class, 'getDefault']);
    Route::put('/ai-models/{id}/toggle-status', [AIModelController::class, 'toggleStatus']);
    Route::put('/ai-models/{id}/set-default', [AIModelController::class, 'setAsDefault']);
    Route::post('/ai-models/{id}/test', [AIModelController::class, 'testModel']);
    
    // API Keys routes
    Route::apiResource('/api-keys', APIKeyController::class);
    Route::get('/api-keys/provider/{providerId}', [APIKeyController::class, 'getByProvider']);
    Route::put('/api-keys/{id}/toggle-status', [APIKeyController::class, 'toggleStatus']);
    Route::post('/api-keys/{id}/validate', [APIKeyController::class, 'validate']);
    
    // Routing Rules routes
    Route::apiResource('/routing-rules', RoutingRuleController::class);
    Route::put('/routing-rules/{id}/toggle-status', [RoutingRuleController::class, 'toggleStatus']);
    Route::post('/routing-rules/priorities', [RoutingRuleController::class, 'updatePriorities']);
    Route::post('/routing-rules/{id}/test', [RoutingRuleController::class, 'testRule']);
    Route::post('/routing-rules/route', [RoutingRuleController::class, 'routeMessage']);
});
