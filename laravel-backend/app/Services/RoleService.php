<?php

namespace App\Services;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class RoleService
{
    /**
     * Get all roles with their permissions.
     *
     * @return array
     */
    public function getAllRoles(): array
    {
        $roles = Role::all();
        
        return $roles->map(function ($role) {
            return $this->formatRoleData($role);
        })->toArray();
    }
    
    /**
     * Get a role by ID.
     *
     * @param int $id
     * @return array|null
     */
    public function getRoleById(int $id): ?array
    {
        $role = Role::find($id);
        
        if (!$role) {
            return null;
        }
        
        return $this->formatRoleData($role);
    }
    
    /**
     * Create a new role with permissions.
     *
     * @param array $data
     * @return array
     */
    public function createRole(array $data): array
    {
        try {
            DB::beginTransaction();
            
            $role = Role::create([
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'is_system' => false,
            ]);
            
            $this->syncRolePermissions($role, $data['permissions']);
            
            DB::commit();
            
            return $this->formatRoleData($role);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Update a role and its permissions.
     *
     * @param int $id
     * @param array $data
     * @return array|null
     */
    public function updateRole(int $id, array $data): ?array
    {
        $role = Role::find($id);
        
        if (!$role) {
            return null;
        }
        
        // Prevent updating system roles
        if ($role->is_system) {
            throw new \Exception('System roles cannot be modified');
        }
        
        try {
            DB::beginTransaction();
            
            $role->update([
                'name' => $data['name'],
                'description' => $data['description'] ?? $role->description,
            ]);
            
            if (isset($data['permissions'])) {
                $this->syncRolePermissions($role, $data['permissions']);
            }
            
            DB::commit();
            
            return $this->formatRoleData($role);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    
    /**
     * Delete a role.
     *
     * @param int $id
     * @return bool
     */
    public function deleteRole(int $id): bool
    {
        $role = Role::find($id);
        
        if (!$role) {
            return false;
        }
        
        // Prevent deleting system roles
        if ($role->is_system) {
            throw new \Exception('System roles cannot be deleted');
        }
        
        // Check if any users have this role
        $usersWithRole = $role->users()->count();
        if ($usersWithRole > 0) {
            throw new \Exception("Cannot delete role as it is assigned to {$usersWithRole} users");
        }
        
        return $role->delete();
    }
    
    /**
     * Sync permissions for a role.
     *
     * @param Role $role
     * @param array $permissions
     * @return void
     */
    public function syncRolePermissions(Role $role, array $permissions): void
    {
        $permissionIds = [];
        
        foreach ($permissions as $permission) {
            $resource = $permission['resource'];
            $actions = $permission['actions'];
            
            foreach ($actions as $action) {
                $perm = Permission::firstOrCreate([
                    'resource' => $resource,
                    'action' => $action,
                ]);
                
                $permissionIds[] = $perm->id;
            }
        }
        
        $role->permissions()->sync($permissionIds);
    }
    
    /**
     * Format role data for API response.
     *
     * @param Role $role
     * @return array
     */
    public function formatRoleData(Role $role): array
    {
        $userCount = $role->users()->count();
        
        return [
            'id' => (string) $role->id,
            'name' => $role->name,
            'description' => $role->description,
            'permissions' => $role->getGroupedPermissions(),
            'isSystem' => $role->is_system,
            'userCount' => $userCount,
        ];
    }
}
