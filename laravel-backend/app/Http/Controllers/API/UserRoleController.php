<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\UserRoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserRoleController extends Controller
{
    protected $userRoleService;

    public function __construct(UserRoleService $userRoleService)
    {
        $this->userRoleService = $userRoleService;
    }

    /**
     * Display the roles for a user.
     */
    public function getUserRoles(string $userId): JsonResponse
    {
        $roles = $this->userRoleService->getUserRoles((int) $userId);

        if ($roles === null) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'roles' => $roles
        ]);
    }

    /**
     * Assign a role to a user.
     */
    public function assignRole(Request $request, string $userId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->userRoleService->assignRole((int) $userId, (int) $request->role_id);

        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'User or role not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Role assigned successfully'
        ]);
    }

    /**
     * Remove a role from a user.
     */
    public function removeRole(string $userId, string $roleId): JsonResponse
    {
        $result = $this->userRoleService->removeRole((int) $userId, (int) $roleId);

        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'User or role not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Role removed successfully'
        ]);
    }

    /**
     * Sync roles for a user.
     */
    public function syncRoles(Request $request, string $userId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'role_ids' => 'required|array',
            'role_ids.*' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $result = $this->userRoleService->syncRoles((int) $userId, $request->role_ids);

        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Roles synced successfully'
        ]);
    }
}
