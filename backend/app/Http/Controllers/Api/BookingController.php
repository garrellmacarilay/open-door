<?php

namespace App\Http\Controllers\Api;

use App\Notifications\ModalNotificationCreated;
use App\Models\Booking;
use App\Models\Student;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ModalNotification;
use Illuminate\Support\Facades\Auth;

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

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->status = $request->input('status');
        $booking->save();

        $sender = Auth::user();
        $receiver = $booking->student->user;

        switch ($booking->status) {
            case 'approved':
                $message = "Your booking ({$booking->reference_code}) has been approved";
                $type = "approval";
                break;

            case 'declined':
                $message = "Your booking ({$booking->reference_code}) has been declined";
                $type = "decline";
                break;


            case 'rescheduled':
                $message = "Your booking ({$booking->reference_code}) has been rescheduled";
                $type = "reschedule";
                break;

            case 'cancelled':
                $message = "Your booking ({$booking->reference_code}) has been cancelled";
                $type = "cancellation";
                break;

            default:
                $message = "There's an update on your booking ({$booking->reference_code}) .";
                $type = 'update';
                break;
        }

        $receiver->notify(new ModalNotificationCreated($booking, $sender, $type, $message));

        return response()->json([
            'success' => true,
            'message' => 'Booking status has been updated'
        ]);
    }
}
