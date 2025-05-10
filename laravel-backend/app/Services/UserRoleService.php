<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class UserRoleService
{
    /**
     * Get roles for a user.
     *
     * @param int $userId
     * @return array|null
     */
    public function getUserRoles(int $userId): ?array
    {
        $user = User::find($userId);
        
        if (!$user) {
            return null;
        }
        
        return $user->roles()->get()->map(function ($role) {
            return [
                'id' => (string) $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->getGroupedPermissions(),
                'isSystem' => $role->is_system,
            ];
        })->toArray();
    }
    
    /**
     * Assign a role to a user.
     *
     * @param int $userId
     * @param int $roleId
     * @return bool
     */
    public function assignRole(int $userId, int $roleId): bool
    {
        $user = User::find($userId);
        $role = Role::find($roleId);
        
        if (!$user || !$role) {
            return false;
        }
        
        $user->assignRole($roleId);
        return true;
    }
    
    /**
     * Remove a role from a user.
     *
     * @param int $userId
     * @param int $roleId
     * @return bool
     */
    public function removeRole(int $userId, int $roleId): bool
    {
        $user = User::find($userId);
        $role = Role::find($roleId);
        
        if (!$user || !$role) {
            return false;
        }
        
        $user->removeRole($roleId);
        return true;
    }
    
    /**
     * Sync roles for a user.
     *
     * @param int $userId
     * @param array $roleIds
     * @return bool
     */
    public function syncRoles(int $userId, array $roleIds): bool
    {
        $user = User::find($userId);
        
        if (!$user) {
            return false;
        }
        
        $user->syncRoles($roleIds);
        return true;
    }
    
    /**
     * Check if a user has a specific permission.
     *
     * @param int $userId
     * @param string $resource
     * @param string $action
     * @return bool
     */
    public function hasPermission(int $userId, string $resource, string $action): bool
    {
        $user = User::find($userId);
        
        if (!$user) {
            return false;
        }
        
        return $user->hasPermission($resource, $action);
    }
}
