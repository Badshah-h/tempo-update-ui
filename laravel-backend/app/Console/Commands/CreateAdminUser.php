<?php

namespace App\Console\Commands;

use App\Models\Role;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:create {--name= : The name of the admin user} {--email= : The email of the admin user} {--password= : The password for the admin user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user with Administrator role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->option('name');
        $email = $this->option('email');
        $password = $this->option('password');

        // If options are not provided, prompt for them
        if (!$name) {
            $name = $this->ask('Enter admin name');
        }

        if (!$email) {
            $email = $this->ask('Enter admin email');
        }

        if (!$password) {
            $password = $this->secret('Enter admin password (min 8 characters)');
            $passwordConfirmation = $this->secret('Confirm password');

            if ($password !== $passwordConfirmation) {
                $this->error('Passwords do not match!');
                return 1;
            }
        }

        // Validate input
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }
            return 1;
        }

        // Find the Administrator role
        $adminRole = Role::where('name', 'Administrator')->first();

        if (!$adminRole) {
            $this->error('Administrator role not found. Make sure to run migrations and seeders first.');
            return 1;
        }

        // Create the admin user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'email_verified_at' => now(),
        ]);

        // Assign the Administrator role
        $user->assignRole($adminRole->id);

        $this->info("Admin user '{$name}' created successfully with email: {$email}");
        return 0;
    }
}
