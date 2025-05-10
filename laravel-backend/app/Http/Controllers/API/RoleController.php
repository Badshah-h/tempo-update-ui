<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    protected $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * Display a listing of the roles.
     */
    public function index(): JsonResponse
    {
        $roles = $this->roleService->getAllRoles();

        return response()->json([
            'status' => 'success',
            'roles' => $roles
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string',
            'permissions' => 'required|array',
            'permissions.*.resource' => 'required|string',
            'permissions.*.actions' => 'required|array',
            'permissions.*.actions.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $role = $this->roleService->createRole($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Role created successfully',
                'role' => $role
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified role.
     */
    public function show(string $id): JsonResponse
    {
        $role = $this->roleService->getRoleById((int) $id);

        if (!$role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Role not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'role' => $role
        ]);
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->ignore($id),
            ],
            'description' => 'nullable|string',
            'permissions' => 'required|array',
            'permissions.*.resource' => 'required|string',
            'permissions.*.actions' => 'required|array',
            'permissions.*.actions.*' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $role = $this->roleService->updateRole((int) $id, $request->all());

            if (!$role) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Role updated successfully',
                'role' => $role
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $e->getMessage() === 'System roles cannot be modified' ? 403 : 500);
        }
    }

    /**
     * Remove the specified role.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $result = $this->roleService->deleteRole((int) $id);

            if (!$result) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Role not found'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Role deleted successfully'
            ]);
        } catch (\Exception $e) {
            $statusCode = 500;

            if ($e->getMessage() === 'System roles cannot be deleted') {
                $statusCode = 403;
            } else if (strpos($e->getMessage(), 'Cannot delete role as it is assigned to') === 0) {
                $statusCode = 409;
            }

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], $statusCode);
        }
    }
}
