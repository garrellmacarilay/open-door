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
        $offices = [
            'Communications',
            'Guidance and Counseling',
            'Medical and Dental Services',
            'Sports Development and Management',
            'Student Assistance and Experiential Education',
            'Student Discipline',
            'Student Internship',
            'Student IT Support and Services',
            'Student Organization',
            'Student Publication',
        ];

        foreach ($offices as $officeName) {

            $office = Office::where('office_name', $officeName)->first();

            if (!$office) {
                echo "Office not found: $officeName \n";
                continue;
            }

            // Email
            $emailSlug = strtolower(str_replace(' ', '', $officeName));
            $email = "{$emailSlug}.staff@laverdad.edu.ph";

            // ✅ Prevent duplicate users
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'full_name' => $officeName . " Staff",
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

