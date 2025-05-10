<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'is_system',
    ];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    /**
     * The permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    /**
     * The users that belong to the role.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_role');
    }

    /**
     * Check if the role has a specific permission.
     *
     * @param string $resource
     * @param string $action
     * @return bool
     */
    public function hasPermission(string $resource, string $action): bool
    {
        return $this->permissions()
            ->where('resource', $resource)
            ->where('action', $action)
            ->exists();
    }

    /**
     * Sync permissions with the role.
     *
     * @param array $permissions
     * @return void
     */
    public function syncPermissions(array $permissions): void
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
        
        $this->permissions()->sync($permissionIds);
    }

    /**
     * Get permissions grouped by resource.
     *
     * @return array
     */
    public function getGroupedPermissions(): array
    {
        $permissions = $this->permissions()->get(['resource', 'action'])->toArray();
        $grouped = [];
        
        foreach ($permissions as $permission) {
            $resource = $permission['resource'];
            $action = $permission['action'];
            
            if (!isset($grouped[$resource])) {
                $grouped[$resource] = ['resource' => $resource, 'actions' => []];
            }
            
            $grouped[$resource]['actions'][] = $action;
        }
        
        return array_values($grouped);
    }
}
