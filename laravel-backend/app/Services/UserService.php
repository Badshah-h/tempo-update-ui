<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserService
{
    /**
     * Get all users with their roles.
     *
     * @return Collection
     */
    public function getAllUsers(): Collection
    {
        return User::with('roles.permissions')->get();
    }

    /**
     * Get a user by ID.
     *
     * @param int $id
     * @return User|null
     */
    public function getUserById(int $id): ?User
    {
        return User::with('roles.permissions')->find($id);
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return User
     */
    public function createUser(array $data): User
    {
        try {
            DB::beginTransaction();

            // Prepare user data
            $userData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
            ];

            // Add status if the column exists
            if (Schema::hasColumn('users', 'status')) {
                $userData['status'] = $data['status'] ?? 'active';
            }

            // Add last_active_at if the column exists
            if (Schema::hasColumn('users', 'last_active_at')) {
                $userData['last_active_at'] = now();
            }

            $user = User::create($userData);

            // Assign role if provided
            if (isset($data['role_id'])) {
                $user->assignRole($data['role_id']);
            } else {
                // Assign default viewer role
                $viewerRole = Role::where('name', 'Viewer')->first();
                if ($viewerRole) {
                    $user->assignRole($viewerRole->id);
                }
            }

            DB::commit();

            return $user->load('roles.permissions');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update a user.
     *
     * @param int $id
     * @param array $data
     * @return User|null
     */
    public function updateUser(int $id, array $data): ?User
    {
        $user = User::find($id);

        if (!$user) {
            return null;
        }

        try {
            DB::beginTransaction();

            if (isset($data['name'])) {
                $user->name = $data['name'];
            }

            if (isset($data['email'])) {
                $user->email = $data['email'];
            }

            if (isset($data['password'])) {
                $user->password = Hash::make($data['password']);
            }

            // Update status if the column exists and status is provided
            if (isset($data['status']) && Schema::hasColumn('users', 'status')) {
                $user->status = $data['status'];
            }

            $user->save();

            // Update role if provided
            if (isset($data['role_id'])) {
                $user->syncRoles([$data['role_id']]);
            }

            DB::commit();

            return $user->load('roles.permissions');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a user.
     *
     * @param int $id
     * @return bool
     */
    public function deleteUser(int $id): bool
    {
        $user = User::find($id);

        if (!$user) {
            return false;
        }

        return $user->delete();
    }

    /**
     * Format user data for API response.
     *
     * @param User $user
     * @return array
     */
    public function formatUserData(User $user): array
    {
        // Check if the status column exists
        $status = 'active'; // Default status
        if (Schema::hasColumn('users', 'status') && isset($user->status)) {
            $status = $user->status;
        }

        // Check if the last_active_at column exists
        $lastActive = $user->updated_at; // Default to updated_at
        if (Schema::hasColumn('users', 'last_active_at') && isset($user->last_active_at)) {
            $lastActive = $user->last_active_at ?? $user->updated_at;
        }

        $userData = [
            'id' => (string) $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $status,
            'avatarUrl' => "https://api.dicebear.com/7.x/avataaars/svg?seed=" . urlencode($user->email),
            'createdAt' => $user->created_at,
            'updatedAt' => $user->updated_at,
            'lastActive' => $lastActive,
        ];

        // Add role information if the user has roles
        if ($user->roles->isNotEmpty()) {
            $role = $user->roles->first();
            $userData['role'] = [
                'id' => (string) $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->getGroupedPermissions(),
            ];
        } else {
            // Default empty role structure
            $userData['role'] = [
                'id' => '',
                'name' => 'No Role',
                'description' => 'No permissions assigned',
                'permissions' => [],
            ];
        }

        return $userData;
    }

    /**
     * Update the user's last active timestamp.
     *
     * @param User $user
     * @return User
     */
    public function updateLastActive(User $user): User
    {
        try {
            // Check if the last_active_at column exists
            if (Schema::hasColumn('users', 'last_active_at')) {
                $user->last_active_at = now();
                $user->save();
            } else {
                // If the column doesn't exist, just update the updated_at timestamp
                $user->touch();
            }
        } catch (\Exception $e) {
            // If there's an error, just update the updated_at timestamp
            $user->touch();
        }

        return $user;
    }
}
