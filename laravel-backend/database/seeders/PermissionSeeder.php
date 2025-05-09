<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

        foreach ($resources as $resource) {
            foreach ($actions as $action) {
                Permission::firstOrCreate([
                    'resource' => $resource,
                    'action' => $action,
                ]);
            }
        }
    }
}
