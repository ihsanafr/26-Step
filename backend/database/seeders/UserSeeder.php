<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin',
            'email' => 'admin@habitify.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@habitify.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        // Create demo user
        User::create([
            'name' => 'Demo User',
            'email' => 'demo@habitify.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $this->command->info('Users seeded successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('  - admin@habitify.com / password');
        $this->command->info('  - test@habitify.com / password');
        $this->command->info('  - demo@habitify.com / password');
    }
}
