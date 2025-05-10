<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $resources = [
            'dashboard',
            'widget',
            'models',
            'prompts',
            'analytics',
            'settings',
            'users'
        ];
        
        $actions = [
            'view',
            'create',
            'edit',
            'delete',
            'export',
            'configure'
        ];
        
        $permissions = [];
        
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $permission = Permission::firstOrCreate([
                    'resource' => $resource,
                    'action' => $action,
                    'description' => ucfirst($action) . ' ' . ucfirst($resource)
                ]);
                
                $permissions[$resource][$action] = $permission->id;
            }
        }
        
        // Create roles
        $adminRole = Role::firstOrCreate([
            'name' => 'Administrator',
            'description' => 'Full access to all system features and settings',
            'is_system' => true,
        ]);
        
        $managerRole = Role::firstOrCreate([
            'name' => 'Manager',
            'description' => 'Can manage content and view analytics, but cannot modify system settings',
            'is_system' => true,
        ]);
        
        $editorRole = Role::firstOrCreate([
            'name' => 'Editor',
            'description' => 'Can edit content but cannot access system settings or user management',
            'is_system' => true,
        ]);
        
        $viewerRole = Role::firstOrCreate([
            'name' => 'Viewer',
            'description' => 'Read-only access to content and analytics',
            'is_system' => true,
        ]);
        
        // Assign permissions to roles
        
        // Administrator - all permissions
        $adminPermissions = [];
        foreach ($permissions as $resource => $actions) {
            foreach ($actions as $permissionId) {
                $adminPermissions[] = $permissionId;
            }
        }
        $adminRole->permissions()->sync($adminPermissions);
        
        // Manager - can't modify system settings
        $managerPermissions = [];
        foreach ($permissions as $resource => $actions) {
            if ($resource !== 'settings') {
                foreach ($actions as $action => $permissionId) {
                    $managerPermissions[] = $permissionId;
                }
            } else {
                // Only view settings
                $managerPermissions[] = $permissions['settings']['view'];
            }
        }
        $managerRole->permissions()->sync($managerPermissions);
        
        // Editor - can view and edit content, but not users or settings
        $editorPermissions = [];
        foreach (['dashboard', 'widget', 'models', 'prompts', 'analytics'] as $resource) {
            foreach (['view', 'edit'] as $action) {
                if (isset($permissions[$resource][$action])) {
                    $editorPermissions[] = $permissions[$resource][$action];
                }
            }
            
            // Add create for prompts
            if ($resource === 'prompts' && isset($permissions[$resource]['create'])) {
                $editorPermissions[] = $permissions[$resource]['create'];
            }
        }
        $editorRole->permissions()->sync($editorPermissions);
        
        // Viewer - view only
        $viewerPermissions = [];
        foreach ($resources as $resource) {
            if (isset($permissions[$resource]['view'])) {
                $viewerPermissions[] = $permissions[$resource]['view'];
            }
        }
        $viewerRole->permissions()->sync($viewerPermissions);
        
        // Assign admin role to the test user
        $user = User::where('email', 'test@example.com')->first();
        if ($user) {
            $user->syncRoles([$adminRole->id]);
        }
    }
}
