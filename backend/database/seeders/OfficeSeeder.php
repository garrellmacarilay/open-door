<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Office;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $offices = [
            ['office_name' => 'Communications', 'contact_email' => 'communications@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Guidance and Counseling', 'contact_email' => 'prefect.guidance@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Medical and Dental Services', 'contact_email' => 'prefect.clinic@lavedad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Sports Development and Management', 'contact_email' => 'prefect.sports@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Student Assistance and Experiential Education', 'contact_email' => 'prefect.assistance@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Student Discipline', 'contact_email' => json_encode(['prefect.discipline.basiced@laverdad.edu.ph', 'prefect.discipline.highered@laverdad.edu.ph']), 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Student Internship', 'contact_email' => 'studentinternship@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Student IT Support and Services', 'contact_email' => 'prefect.its@lavedad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Student Organization', 'contact_email' => 'prefect.sord@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
            ['office_name' => 'Student Publication', 'contact_email' => 'prefect.publications@laverdad.edu.ph', 'contact_number' => null, 'status' => 'active'],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }
    }
}
