<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
            'full_name' => 'Super Admin',
            'password' => Hash::make('password123'), // Make sure to hash the password
            'role' => 'admin',
            'status' => 'active',
            ]
        );

        // Create the admin details record linked to this user
        Admin::firstOrCreate(
            ['user_id' => $user->id],
            [
            'role_description' => 'Has full system access and management privileges.',
            'managed_offices' => json_encode(['Head Office', 'IT Department']),
            ]
        );
    }
}
