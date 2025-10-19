<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Student;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    public function store(Request $request)
    {

        $student = Student::where('user_id', $request->user()->id)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $val = $request->validate([
            'service_type' => 'required|string',
            'consultation_date' => 'required|date_format:Y-m-d\TH:i',
            'concern_description' => 'required|string',
            'uploaded_file_url' => 'nullable|url',
        ]);

        // $student = Student::where('user_id', $request->user()->id)->first();

        $booking = Booking::create(array_merge($val, [
            'student_id' => $student->id,
            'staff_id' => null, // Assign staff later
            'office_id' => null, //temporary for testing
            'reference_code' => Str::upper(Str::random(10)),
            'status' => 'pending',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking' => $booking
        ], 201);

    }
}
