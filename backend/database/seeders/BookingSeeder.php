<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Office;
use App\Models\Booking;
use Illuminate\Support\Str;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['approved', 'pending', 'cancelled', 'rescheduled', 'completed', 'declined'];
        $offices = Office::all();

        if ($offices->isEmpty()) {
            $this->command->error("No offices found. Please seed offices first.");
            return;
        }

        // --- Create 50 students with bookings ---
        for ($i = 1; $i <= 50; $i++) {

            // Create a student user
            $user = User::create([
                'full_name'  => "Student {$i}",
                'email'      => "student{$i}@student.laverdad.edu.ph",
                'password'   => bcrypt('password'),
                'role'       => 'student',
                'contact_number' => '09' . rand(100000000, 999999999),
            ]);

            // Create student info
            $student = Student::create([
                'user_id' => $user->id,
                'student_number' => 'LVCC-' . rand(10000, 99999),
                'program' => 'BSIT',
                'year_level' => rand(1, 4),
            ]);

            // Generate 1–3 bookings per student
            $bookingCount = rand(1, 3);

            for ($b = 1; $b <= $bookingCount; $b++) {

                $consultDate = Carbon::now()
                    ->subDays(rand(1, 60))
                    ->setTime(rand(8, 16), rand(0, 59));

                Booking::create([
                    'student_id' => $student->id,
                    'office_id'  => $offices->random()->id,
                    'staff_id'   => null, // optional
                    'service_type' => 'Consultation',
                    'consultation_date' => $consultDate,
                    'concern_description' => "Dummy consultation concern #{$i}-{$b}",
                    'status' => $statuses[array_rand($statuses)],
                    'group_members' => null,
                    'uploaded_file_url' => null,
                    'reference_code' => strtoupper(Str::random(10)),
                ]);
            }
        }
    }
}
