<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'status',
        'last_active_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_active_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    /**
     * Check if the user has a specific role.
     *
     * @param string $roleName
     * @return bool
     */
    public function hasRole(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if the user has a specific permission.
     *
     * @param string $resource
     * @param string $action
     * @return bool
     */
    public function hasPermission(string $resource, string $action): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($resource, $action) {
                $query->where('resource', $resource)
                      ->where('action', $action);
            })
            ->exists();
    }

    /**
     * Assign a role to the user.
     *
     * @param int|string $roleId
     * @return void
     */
    public function assignRole($roleId): void
    {
        if (is_string($roleId) && !is_numeric($roleId)) {
            $role = Role::where('name', $roleId)->first();
            $roleId = $role ? $role->id : null;
        }

        if ($roleId) {
            $this->roles()->syncWithoutDetaching([$roleId]);
        }
    }

    /**
     * Remove a role from the user.
     *
     * @param int|string $roleId
     * @return void
     */
    public function removeRole($roleId): void
    {
        if (is_string($roleId) && !is_numeric($roleId)) {
            $role = Role::where('name', $roleId)->first();
            $roleId = $role ? $role->id : null;
        }

        if ($roleId) {
            $this->roles()->detach($roleId);
        }
    }

    /**
     * Sync roles for the user.
     *
     * @param array $roleIds
     * @return void
     */
    public function syncRoles(array $roleIds): void
    {
        $this->roles()->sync($roleIds);
    }
}
