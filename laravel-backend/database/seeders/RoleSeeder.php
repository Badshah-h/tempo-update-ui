<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Administrator role
        $adminRole = Role::firstOrCreate(
            ['name' => 'Administrator'],
            [
                'description' => 'Full access to all system features and settings',
                'is_system' => true,
            ]
        );

        // Assign all permissions to admin
        $adminRole->permissions()->sync(Permission::all());

        // Create Manager role
        $managerRole = Role::firstOrCreate(
            ['name' => 'Manager'],
            [
                'description' => 'Can manage content and view analytics, but cannot modify system settings',
                'is_system' => true,
            ]
        );

        // Assign specific permissions to manager
        $managerPermissions = Permission::where(function ($query) {
            $query->where('resource', 'dashboard')
                ->where('action', 'view');
        })->orWhere(function ($query) {
            $query->where('resource', 'widget')
                ->whereIn('action', ['view', 'edit', 'configure']);
        })->orWhere(function ($query) {
            $query->where('resource', 'models')
                ->whereIn('action', ['view', 'edit']);
        })->orWhere(function ($query) {
            $query->where('resource', 'prompts')
                ->whereIn('action', ['view', 'create', 'edit', 'export']);
        })->orWhere(function ($query) {
            $query->where('resource', 'analytics')
                ->whereIn('action', ['view', 'export']);
        })->orWhere(function ($query) {
            $query->where('resource', 'settings')
                ->where('action', 'view');
        })->orWhere(function ($query) {
            $query->where('resource', 'users')
                ->where('action', 'view');
        })->get();

        $managerRole->permissions()->sync($managerPermissions);

        // Create Editor role
        $editorRole = Role::firstOrCreate(
            ['name' => 'Editor'],
            [
                'description' => 'Can edit content but cannot access system settings or user management',
                'is_system' => true,
            ]
        );

        // Assign specific permissions to editor
        $editorPermissions = Permission::where(function ($query) {
            $query->where('resource', 'dashboard')
                ->where('action', 'view');
        })->orWhere(function ($query) {
            $query->where('resource', 'widget')
                ->whereIn('action', ['view', 'edit']);
        })->orWhere(function ($query) {
            $query->where('resource', 'models')
                ->where('action', 'view');
        })->orWhere(function ($query) {
            $query->where('resource', 'prompts')
                ->whereIn('action', ['view', 'create', 'edit']);
        })->orWhere(function ($query) {
            $query->where('resource', 'analytics')
                ->where('action', 'view');
        })->get();

        $editorRole->permissions()->sync($editorPermissions);

        // Create Viewer role
        $viewerRole = Role::firstOrCreate(
            ['name' => 'Viewer'],
            [
                'description' => 'Read-only access to content and analytics',
                'is_system' => true,
            ]
        );

        // Assign view permissions to viewer
        $viewerPermissions = Permission::whereIn('resource', ['dashboard', 'widget', 'models', 'prompts', 'analytics'])
            ->where('action', 'view')
            ->get();

        $viewerRole->permissions()->sync($viewerPermissions);
    }
}
