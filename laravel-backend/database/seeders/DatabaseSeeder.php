<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run permission and role seeders first
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            AdminPermissionSeeder::class, // Ensure admin has all permissions
        ]);

        // Create admin user
        $adminRole = Role::where('name', 'Administrator')->first();

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role_id' => $adminRole->id,
        ]);

        // Create manager user
        $managerRole = Role::where('name', 'Manager')->first();

        User::factory()->create([
            'name' => 'John Manager',
            'email' => 'manager@example.com',
            'role_id' => $managerRole->id,
        ]);

        // Create editor user
        $editorRole = Role::where('name', 'Editor')->first();

        User::factory()->create([
            'name' => 'Emily Editor',
            'email' => 'editor@example.com',
            'role_id' => $editorRole->id,
        ]);

        // Create viewer user
        $viewerRole = Role::where('name', 'Viewer')->first();

        User::factory()->create([
            'name' => 'Sarah Viewer',
            'email' => 'viewer@example.com',
            'role_id' => $viewerRole->id,
        ]);
    }
}
