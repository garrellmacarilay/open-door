<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Booking;
use App\Models\Office;
use App\Models\Student;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ModalNotification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ModalNotificationCreated;

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
            'office_id' => 'required|integer|exists:offices,id',
            'service_type' => 'required|string',
            'consultation_date' => [
                'required',
                'date_format:Y-m-d\TH:i',
                function ($_, $value, $fail) {
                    $consultationDate = Carbon::parse($value);
                    $minDate = Carbon::now()->addDays(2)->startOfDay();

                    if ($consultationDate->lessThan($minDate)) {
                        $fail('You can only book a consultation at least 2 days in advance.');
                    }
                }
            ],
            'concern_description' => 'required|string',
            'group_members' => 'nullable|string',
            'uploaded_file_url' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
        ]);

        if ($request->hasFile('uploaded_file_url')) {
            $path = $request->file('uploaded_file_url')->store('attachments', 'public');
            $val['uploaded_file_url'] = '/storage/' . $path;
        } else {
            $val['uploaded_file_url'] = null;
        }

        $office = Office::findOrFail($val['office_id']);

        $booking = Booking::create(array_merge($val, [
            'student_id' => $student->id,
            'staff_id' => null, // Assign staff later
            'office_id' => $office->id, //temporary for testing
            'reference_code' => Str::upper(Str::random(10)),
            'status' => 'pending',
        ]));



        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully',
            'booking' => $booking
        ], 201);

    }

    public function history(Request $request)
    {
        $student = Student::where('user_id', $request->user()->id)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ], 404);
        }

        $bookings = Booking::where('student_id', $student->id)
            ->with('student.user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking){
                return [
                    'reference_code' => $booking->reference_code,
                    'student_name' => $booking->student->user->full_name ?? 'Unknown',
                    'service_type' => $booking->service_type,
                    'concern_description' => $booking->concern_description,
                    'consultation_date' => $booking->consultation_date,
                    'status' => ucfirst($booking->status),
                    'created_at' => $booking->created_at->toDayDateTimeString(),
                ];
            });

            return response()->json([
                'success' => true,
                'bookings' => $bookings
            ], 200);
    }

    public function recent(Request $request)
    {
        $student = Student::where('user_id', $request->user()->id)->first();

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not found'
            ]);
        }

        $recentBookings = Booking::where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->take(1)
            ->get()
            ->map(function ($booking) {
                return [
                    'reference_code' => $booking->reference_code,
                    'service_type' => $booking->service_type,
                    'consultation_date' => $booking->consultation_date,
                ];
            });

            return response()->json([
                'success' => true,
                'bookings' => $recentBookings
            ]);
    }
}
