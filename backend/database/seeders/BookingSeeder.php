<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        // 🔒 Temporarily disable foreign key checks (for SQLite or MySQL)
        DB::statement('PRAGMA foreign_keys = OFF;'); // For SQLite
        // DB::statement('SET FOREIGN_KEY_CHECKS=0;'); // For MySQL

        $statuses = ['pending', 'approved', 'cancelled', 'rescheduled', 'completed'];
        $serviceTypes = ['Consultation', 'Therapy', 'Assessment', 'Follow-up', 'Advisory'];

        for ($i = 1; $i <= 10; $i++) {
            Booking::create([
                'service_type' => $serviceTypes[array_rand($serviceTypes)],
                'consultation_date' => Carbon::now()
                    ->addDays(rand(0, 10))
                    ->setTime(rand(8, 16), [0, 30][rand(0, 1)]),
                'concern_description' => 'This is a test booking concern for event #' . $i,
                'status' => $statuses[array_rand($statuses)],
                'uploaded_file_url' => null,
                'reference_code' => strtoupper(Str::random(8)),
                'student_id' => 1, // temporary test IDs
                'staff_id' => 1,
                'office_id' => 1,
            ]);
        }

        // ✅ Re-enable foreign key checks
        DB::statement('PRAGMA foreign_keys = ON;'); // For SQLite
        // DB::statement('SET FOREIGN_KEY_CHECKS=1;'); // For MySQL
    }
}
