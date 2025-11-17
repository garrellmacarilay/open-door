<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Event;
use App\Models\Office;
use App\Models\Booking;
use App\Models\Student;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ModalNotification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ModalNotificationCreated;

class BookingController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        $bookings = Booking::with(['student.user', 'office', 'staff'])
            ->whereIn('status', ['approved', 'pending'])
            ->whereHas('student', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();

        $appointments = $bookings->map(function ($booking) {
            return [
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $booking->consultation_date,
                'end' => $booking->consultation_date,
                'color' => $booking->getStatusColor($booking->status),
                'details' => [
                    'student' => $booking->student->user->full_name ?? 'Unknown',
                    'office' => $booking->office->office_name ?? 'N/A',
                    'staff' => $booking->staff ? $booking->staff->user->full_name : 'Unassigned',
                    'concern_description' => $booking->concern_description,
                    'status' => $booking->status,
                    'reference_code' => $booking->reference_code,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

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

        $consultationDay = Carbon::parse($val['consultation_date'])->toDateString();

        $eventExists = Event::where('event_date', $consultationDay)->exists();

        if ($eventExists) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not allowed. There is an event scheduled for this date'
            ], 422);
        }

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

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            $type = 'booking_request';
            $message = "A student booked an appointment ({$booking->reference_code}).";

            $notification = new ModalNotificationCreated($booking, $student->user, $type, $message);
            $notification->handleCustomInsert($admin);
        }

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
            ->whereIn('status', ['declined', 'completed', 'cancelled'])
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
            ->whereIn('status', ['approved', 'pending'])
            ->take(11)
            ->get()
            ->map(function ($booking) {
                return [
                    'student_name' => $booking->student->user->full_name ?? "Unknown",
                    'office' => $booking->office->office_name,
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
