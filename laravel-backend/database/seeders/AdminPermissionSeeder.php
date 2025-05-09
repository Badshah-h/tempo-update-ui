<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds to give all permissions to the Administrator role.
     * This seeder can be run separately to fix permission issues.
     */
    public function run(): void
    {
        $this->command->info('Starting Admin Permission Seeder...');
        
        // First, ensure all permissions exist
        $this->ensureAllPermissionsExist();
        
        // Find or create the Administrator role
        $adminRole = $this->findOrCreateAdminRole();
        
        // Assign all permissions to the admin role
        $this->assignAllPermissionsToAdmin($adminRole);
        
        // Ensure admin users have the admin role
        $this->ensureAdminUsersHaveAdminRole($adminRole);
        
        $this->command->info('Admin Permission Seeder completed successfully!');
    }
    
    /**
     * Ensure all permissions exist in the database
     */
    private function ensureAllPermissionsExist(): void
    {
        $this->command->info('Ensuring all permissions exist...');
        
        $resources = [
            'dashboard',
            'widget',
            'models',
            'prompts',
            'analytics',
            'settings',
            'users',
        ];

        $actions = [
            'view',
            'create',
            'edit',
            'delete',
            'export',
            'configure',
        ];

        $permissionCount = 0;
        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                $permission = Permission::firstOrCreate([
                    'resource' => $resource,
                    'action' => $action,
                ]);
                
                if ($permission->wasRecentlyCreated) {
                    $permissionCount++;
                }
            }
        }
        
        $this->command->info("Created {$permissionCount} new permissions.");
    }
    
    /**
     * Find or create the Administrator role
     */
    private function findOrCreateAdminRole(): Role
    {
        $this->command->info('Finding or creating Administrator role...');
        
        $adminRole = Role::firstOrCreate(
            ['name' => 'Administrator'],
            [
                'description' => 'Full access to all system features and settings',
                'is_system' => true,
            ]
        );
        
        if ($adminRole->wasRecentlyCreated) {
            $this->command->info('Administrator role created.');
        } else {
            $this->command->info('Administrator role already exists.');
        }
        
        return $adminRole;
    }
    
    /**
     * Assign all permissions to the admin role
     */
    private function assignAllPermissionsToAdmin(Role $adminRole): void
    {
        $this->command->info('Assigning all permissions to Administrator role...');
        
        // Get all permissions
        $allPermissions = Permission::all();
        
        // Sync all permissions to admin role
        $adminRole->permissions()->sync($allPermissions->pluck('id')->toArray());
        
        $this->command->info("Assigned {$allPermissions->count()} permissions to Administrator role.");
    }
    
    /**
     * Ensure admin users have the admin role
     */
    private function ensureAdminUsersHaveAdminRole(Role $adminRole): void
    {
        $this->command->info('Ensuring admin users have Administrator role...');
        
        // Find users with admin in their email or name
        $adminUsers = User::where('email', 'like', '%admin%')
            ->orWhere('name', 'like', '%admin%')
            ->get();
        
        $updatedCount = 0;
        foreach ($adminUsers as $user) {
            if ($user->role_id !== $adminRole->id) {
                $user->role_id = $adminRole->id;
                $user->save();
                $updatedCount++;
            }
        }
        
        $this->command->info("Updated role for {$updatedCount} admin users.");
    }
}
