<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Feedback;
use App\Models\Office;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = ['approved', 'pending', 'cancelled', 'rescheduled', 'completed', 'declined'];

        $comments = [
            'The staff are very helpful and professional.',
            'Smooth process, thank you!',
            'Very accommodating office.',
            'Consultation was very informative.',
            'Highly recommended service.',
            'Great experience overall.'
        ];

        $offices = Office::all();

        if ($offices->isEmpty()) {
            $this->command->error("No offices found. Please seed offices first.");
            return;
        }

        $counter = (Booking::max('id') ?? 0) + 1;

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

                $startDate = Carbon::now(); // Feb 17 current year
                $endDate = Carbon::create(now()->year, 12, 1);

                $consultDate = Carbon::createFromTimeStamp(rand($startDate->timestamp, $endDate->timestamp))
                    ->setTime(rand(8, 16), rand(0, 59));

                $status = $statuses[array_rand($statuses)];

                $booking =Booking::create([
                    'student_id' => $student->id,
                    'office_id'  => $offices->random()->id,
                    'staff_id'   => null, // optional
                    'service_type' => 'Consultation',
                    'consultation_date' => $consultDate,
                    'concern_description' => "Dummy consultation concern #{$i}-{$b}",
                    'status' => $statuses[array_rand($statuses)],
                    'group_members' => null,
                    'uploaded_file_url' => null,
                    'reference_code' => 'APPT-' . str_pad($counter++, 3, '0', STR_PAD_LEFT),
                ]);

                if ($status === 'completed') {
                    Feedback::create([
                        'booking_id' => $booking->id,
                        'student_id' => $booking->student_id,
                        'office_id' => $booking->office_id,
                        'staff_id' => $booking->staff_id,
                        'rating' => rand(4, 5),
                        'comment' => $comments[array_rand($comments)],
                    ]);
                }
            }
        }
    }
}
