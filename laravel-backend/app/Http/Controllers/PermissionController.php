<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Display a listing of the permissions.
     */
    public function index(): JsonResponse
    {
        $permissions = Permission::all();

        return response()->json([
            'status' => 'success',
            'data' => $permissions
        ]);
    }

    /**
     * Get permissions grouped by resource.
     */
    public function grouped(): JsonResponse
    {
        $permissions = Permission::all();
        
        $grouped = $permissions->groupBy('resource')->map(function ($items) {
            return [
                'resource' => $items->first()->resource,
                'actions' => $items->pluck('action')->toArray()
            ];
        })->values();

        return response()->json([
            'status' => 'success',
            'data' => $grouped
        ]);
    }
}
