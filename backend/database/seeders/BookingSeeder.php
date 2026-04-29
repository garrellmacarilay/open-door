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
use Faker\Factory as Faker;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

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

        for ($i = 1; $i <= 200; $i++) {

            $firstName = $faker->firstName;
            $lastName  = $faker->lastName;
            $fullName  = $firstName . ' ' . $lastName;
            $emailSlug = Str::slug($firstName . $lastName, '');

            $user = User::create([
                'full_name'         => $fullName,
                'email'             => "{$emailSlug}{$i}@student.laverdad.edu.ph",
                'password'          => bcrypt('password'),
                'role'              => 'student',
                'contact_number'    => '09' . $faker->numerify('#########'),
                'email_verified_at' => now()
            ]);

            $student = Student::create([
                'user_id'        => $user->id,
                'student_number' => 'LVCC-' . $faker->unique()->numberBetween(10000, 99999),
                'program'        => $faker->randomElement(['BSIT', 'BSIS', 'BSA', 'BSEMC']),
                'year_level'     => rand(1, 4),
            ]);

            // 4–6 bookings per student → ~1000 total across 200 students
            $bookingCount = rand(4, 6);

            for ($b = 1; $b <= $bookingCount; $b++) {

                // Distribute across January to June
                $startDate = Carbon::create(now()->year, 1, 1);
                $endDate   = Carbon::create(now()->year, 6, 30);

                $consultDate = Carbon::createFromTimestamp(
                    rand($startDate->timestamp, $endDate->timestamp)
                )->setTime(rand(8, 16), rand(0, 59));

                $status = $statuses[array_rand($statuses)];

                $booking = Booking::create([
                    'student_id'          => $student->id,
                    'office_id'           => $offices->random()->id,
                    'staff_id'            => null,
                    'service_type'        => 'Consultation',
                    'consultation_date'   => $consultDate,
                    'concern_description' => $faker->sentence(),
                    'status'              => $status,
                    'group_members'       => null,
                    'uploaded_file_url'   => null,
                    'uploaded_file_name'  => null,
                    'reference_code'      => 'APPT-' . str_pad($counter++, 5, '0', STR_PAD_LEFT),
                ]);

                if ($status === 'completed') {
                    Feedback::create([
                        'booking_id' => $booking->id,
                        'student_id' => $booking->student_id,
                        'office_id'  => $booking->office_id,
                        'staff_id'   => $booking->staff_id,
                        'rating'     => rand(4, 5),
                        'comment'    => $comments[array_rand($comments)],
                        'created_at' => $consultDate, // align feedback date with booking
                    ]);
                }
            }
        }
    }
}
