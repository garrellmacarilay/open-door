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
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use App\Notifications\ModalNotificationCreated;

class BookingController extends Controller
{
    public function show()
    {
        $user = Auth::user();

        $bookings = Booking::with(['student.user', 'office', 'staff'])
            ->whereIn('status', ['approved', 'pending', 'rescheduled'])
            ->whereHas('student.user', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'asc')
            ->paginate(5);


        $appointments = $bookings->map(function ($booking) {
            $date = Carbon::parse($booking->consultation_date);
            return [
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $date->format('Y-m-d\TH:i:s'),
                'end' => $date->format('Y-m-d\TH:i:s'),
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
            'data' => $appointments,
            'meta' => [
                'current_page' => $bookings->currentPage(),
                'last_page' => $bookings->lastPage(),
            ]
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

                    $hour = $consultationDate->hour;

                    if ($hour < 8 || $hour >= 17) {
                        $fail('Booking time must be between 8:00 AM and 5:00 PM.');
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
                'errors' => [
                    'consultation_date' => ['Booking not allowed. There is an event scheduled for this date']
                ]
            ], 422);
        }

        if ($request->hasFile('uploaded_file_url')) {
            try {
                $file = $request->file('uploaded_file_url');
                $path = $file->getRealPath();

                $uploaded = Cloudinary::uploadApi()->upload($path, [
                    'folder' => 'attachments',
                    'resource_type' => 'auto',
                    'access_mode' => 'public'
                ]);

                $val['uploaded_file_url'] = $uploaded['secure_url'];
                $val['uploaded_file_name'] = $file->getClientOriginalName();
                $val['uploaded_file_mime'] = $file->getMimeType();
                $val['uploaded_file_size'] = $file->getSize();

            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'File upload failed: ' . $e->getMessage()
                ], 500);
            }
        } else {
            $val['uploaded_file_url'] = null;
            $val['uploaded_file_name'] = null;
            $val['uploaded_file_mime'] = null;
            $val['uploaded_file_size'] = null;
        }

        $office = Office::findOrFail($val['office_id']);

        $booking = Booking::create(array_merge($val, [
            'student_id' => $student->id,
            'staff_id' => null, // Assign staff later
            'office_id' => $office->id,
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
            ->whereIn('status', ['completed'])
            ->with('student.user', 'feedback', 'office')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking){
                return [
                    'id' => $booking->id,
                    'student_id' => $booking->student_id,
                    'office_id' => $booking->office_id,
                    'reference_code' => $booking->reference_code,
                    'student_name' => $booking->student->user->full_name ?? 'Unknown',
                    'office_name' => $booking->office->office_name ?? 'Unknown',
                    'service_type' => $booking->service_type,
                    'concern_description' => $booking->concern_description,
                    'consultation_date' => $booking->consultation_date,
                    'feedback' => $booking->feedback ? [
                            'rating' => $booking->feedback->rating,
                            'comment' => $booking->feedback->comment,
                        ]: null,
                    // Convenience top-level fields for frontend compatibility
                    'hasFeedback' => $booking->feedback ? true : false,
                    'rating' => $booking->feedback ? $booking->feedback->rating : null,
                    'comment' => $booking->feedback ? $booking->feedback->comment : null,
                    'status' => $booking->status,
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
            ->whereIn('status', ['approved', 'pending', 'rescheduled', 'cancelled'])
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'student_name' => $booking->student->user->full_name ?? "Unknown",
                    'office' => $booking->office->office_name,
                    'reference_code' => $booking->reference_code,
                    'service_type' => $booking->service_type,
                    'concern_description' => $booking->concern_description,
                    'group_members' => $booking->group_members,
                    'attachments' => $booking->uploaded_file_url,
                    'consultation_date' => $booking->consultation_date,
                    'status' => $booking->status
                ];
            });

            return response()->json([
                'success' => true,
                'bookings' => $recentBookings
            ]);
    }

    public function reschedule(Request $request, $id)
    {
        $request->validate([
            'consultation_date' => [
                'required',
                'date_format:Y-m-d\TH:i',
                function ($_, $value, $fail) {
                    $consultationDate = Carbon::parse($value);
                    $minDate = Carbon::now()->addDays(2)->startOfDay();

                    if ($consultationDate->lessThan($minDate)) {
                        $fail('You can only reschedule a consultation at least 2 days ahead.');
                    }
                }
            ],
            'uploaded_file_url' => 'nullable|file|mimes:pdf,jpg,png|max:5120'
        ]);

        $booking = Booking::findOrFail($id);

        $consultationDay = Carbon::parse($request->consultation_date)->toDateString();

        $eventExists = Event::where('event_date', $consultationDay)->exists();

        if ($eventExists) {
            return response()->json([
                'success' => false,
                'message' => 'Rescheduling not allowed. There is an event scheduled for this date.'
            ], 422);
        }

        $updated = [
            'consultation_date' => $request->consultation_date,
            'status' => 'rescheduled',
        ];

        if ($request->hasFile('uploaded_file_url')) {
            $path = $request->file('uploaded_file_url')->store('attachments', 'public');
            $updated['uploaded_file_url'] = '/storage/' . $path;
        } else {
            // If no new file uploaded, keep the existing one
            $updated['uploaded_file_url'] = $booking->uploaded_file_url;
        }

        $booking->update($updated);

        return response()->json([
            'success' => 'Booking successfully rescheduled',
            'booking' => $booking
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'This booked appointment has already been cancelled'
            ], 422);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'booking successfully cancelled',
            'booking' => $booking
        ]);
    }
}
