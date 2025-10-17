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
        $val = $request->validate([
            'service_type' => 'required|string',
            'consultation_date' => 'required|date',
            'concern_description' => 'required|string',
            'uploaded_file_url' => 'nullable|url',
        ]);

        // $student = Student::where('user_id', $request->user()->id)->first();

        $booking = Booking::create(array_merge($val, [
            'student_id' => 1, //temporary for testing
            'office_id' => 1, //temporary for testing
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
