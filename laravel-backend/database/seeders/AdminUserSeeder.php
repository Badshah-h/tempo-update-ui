<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'), // You should change this in production
                'email_verified_at' => now(),
            ]
        );

        // Find the Administrator role
        $adminRole = Role::where('name', 'Administrator')->first();

        // If the role exists, assign it to the admin user
        if ($adminRole) {
            $admin->syncRoles([$adminRole->id]);
            $this->command->info('Admin user created and assigned Administrator role.');
        } else {
            $this->command->warn('Administrator role not found. Make sure to run RolesAndPermissionsSeeder first.');
        }
    }
}
