<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Staff;
use App\Models\Office;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        $offices = Office::all();

        foreach ($offices as $office) {

            $office = Office::where('office_name', $office->office_name)->first();

            if (!$office) {
                echo "Office not found: $office->office_name \n";
                continue;
            }

            // Email
            $emailSlug = strtolower(str_replace(' ', '', $office->office_name));
            $email = "{$emailSlug}.staff@laverdad.edu.ph";

            // ✅ Prevent duplicate users
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'full_name' => $office->office_name . " Staff",
                    'password' => Hash::make('password123'),
                    'role' => 'staff'
                ]
            );

            // ✅ Prevent duplicate staff entries
            Staff::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'office_id' => $office->id
                ],
                [
                    'position' => 'Staff'
                ]
            );
        }
    }
}

