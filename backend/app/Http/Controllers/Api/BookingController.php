<?php

namespace App\Http\Controllers\Api;


use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Event;
use App\Models\Office;
use App\Models\Booking;
use App\Models\Student;
use App\Mail\BookingEmail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\GmailService;
use App\Models\EmailNotification;
use App\Models\ModalNotification;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Notifications\ModalNotificationCreated;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

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
        $student = Student::where('user_id', $request->user()->id)->firstOrFail();

        $data = $request->validate([
            'office_id' => 'required|exists:offices,id',
            'service_type' => 'required|string',
            'consultation_date' => [
                'required',
                'date_format:Y-m-d\TH:i',
                function ($_, $value, $fail) {
                    $date = Carbon::parse($value);

                    if ($date->lt(now()->addDays(2)->startOfDay())) {
                        $fail('You can only book a consultation at least 2 days in advance.');
                    }

                    if ($date->hour < 8 || $date->hour >= 17) {
                        $fail('Booking time must be between 8:00 AM and 5:00 PM.');
                    }
                }
            ],
            'concern_description' => 'required|string',
            'group_members' => 'nullable|string',
            'uploaded_file_url' => 'nullable|file|mimes:pdf,jpg,png|max:5120',
        ]);

        // ✅ Block booking if there is an event that day
        if (Event::whereDate(
            'event_date',
            Carbon::parse($data['consultation_date'])->toDateString()
        )->exists()) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'consultation_date' => ['Booking not allowed. There is an event on this date.']
                ]
            ], 422);
        }

        // ✅ Upload file
        if ($request->hasFile('uploaded_file_url')) {
            try {
                $file = $request->file('uploaded_file_url');

                $upload = Cloudinary::uploadApi()->upload(
                    $file->getRealPath(),
                    ['folder' => 'attachments', 'resource_type' => 'auto']
                );

                $data['uploaded_file_url']  = $upload['secure_url'];
                $data['uploaded_file_name'] = $file->getClientOriginalName();
                $data['uploaded_file_mime'] = $file->getMimeType();
                $data['uploaded_file_size'] = $file->getSize();

            } catch (\Throwable $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'File upload failed.'
                ], 500);
            }
        }

        // ✅ Create booking inside transaction
        $booking = DB::transaction(function () use ($data, $student) {
            return Booking::create([
                ...$data,
                'student_id'     => $student->id,
                'staff_id'       => null,
                'reference_code' => Str::upper(Str::random(10)),
                'status'         => 'pending',
            ]);
        });

        // ✅ Notify admins + office staff (Modal Notifications)
        $recipients = User::query()
            ->where('role', 'admin')
            ->orWhereHas('staff', fn ($q) =>
                $q->where('office_id', $booking->office_id)
            )->get();

        foreach ($recipients as $recipient) {
            (new ModalNotificationCreated(
                $booking,
                $request->user(),
                'booking_request',
                "A new booking request ({$booking->reference_code}) was created."
            ))->handleCustomInsert($recipient);
        }

        // ✅ SEND EMAIL VIA GMAIL API SERVICE
        try {
            $subject = "Booking Request Received #{$booking->reference_code}";

            // 1. Prepare Text for DB Log (Readable text)
            $plainMessage = "Hi {$request->user()->name},\n\n" .
                            "We received your booking request for {$booking->office->office_name}.\n\n" .
                            "Status: Pending review.";

            // 2. Prepare HTML for Gmail API (Render Blade to String)
            $htmlMessage = view('emails.booking_notification', [
                'emailSubject' => $subject,
                'bodyContent'  => $plainMessage // The blade file will handle nl2br()
            ])->render();

            // 3. Create DB Log (Pending)
            $emailLog = EmailNotification::create([
                'user_id'         => $request->user()->id,
                'booking_id'      => $booking->id,
                'recipient_email' => $request->user()->email,
                'subject'         => $subject,
                'message'         => $plainMessage, // Store plain text in DB
                'type'            => 'booking_request',
                'status'          => 'pending',
            ]);

            // 4. Send using Gmail Service
            $gmail = new GmailService();
            $sent = $gmail->sendEmail($request->user()->email, $subject, $htmlMessage);

            // 5. Update Log based on result
            if ($sent) {
                $emailLog->update([
                    'status'  => 'sent',
                    'sent_at' => now(),
                ]);
            } else {
                $emailLog->update(['status' => 'failed']);
            }

        } catch (\Exception $e) {
            // Log the error internally so you can debug later
            Log::error("Booking Email Failed: " . $e->getMessage());

            // Mark as failed in DB if the log was created
            if (isset($emailLog)) {
                $emailLog->update(['status' => 'failed']);
            }
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

        $booking = Booking::with(['office.users', 'student.user'])->findOrFail($id);
        $currentUser = Auth::user(); // The person performing the action

        // ---------------------------------------------------------
        // DETERMINE RECEIVER AND CONTEXT
        // ---------------------------------------------------------
        $studentUser = $booking->student->user;

        // Default: Assume the logged-in user is the Staff, so notify the Student
        $receiver = $studentUser;
        $notificationContext = "Staff initiated";

        // Logic: If the current logged-in user IS the student, notify the Staff/Admin
        if ($currentUser->id === $studentUser->id) {
            // Get the staff/admin associated with this office
            // Note: If an office has multiple staff, this grabs the first one.
            // Ideally, you might loop through all of them.
            $receiver = $booking->office->staff()->first();

            if (!$receiver) {
                // Fallback protection if no staff is assigned to office
                return response()->json(['success' => false, 'message' => 'No office staff found to notify.'], 500);
            }
            $notificationContext = "Student initiated";
        }

        // Check for Event Conflicts
        $consultationDay = Carbon::parse($request->consultation_date)->toDateString();
        $eventExists = Event::where('event_date', $consultationDay)->exists();

        if ($eventExists) {
            return response()->json([
                'success' => false,
                'message' => 'Rescheduling not allowed. There is an event scheduled for this date.'
            ], 422);
        }

        // 1. DATABASE TRANSACTION
        $emailLog = DB::transaction(function () use ($booking, $request, $currentUser, $receiver, $notificationContext) {
            // Update Booking Data
            $updatedData = [
                'consultation_date' => $request->consultation_date,
                'status' => 'rescheduled',
            ];

            if ($request->hasFile('uploaded_file_url')) {
                $path = $request->file('uploaded_file_url')->store('attachments', 'public');
                $updatedData['uploaded_file_url'] = '/storage/' . $path;
            }

            $booking->update($updatedData);

            $formattedDate = Carbon::parse($request->consultation_date)->format('M d, h:i A');

            // ✅ Dynamic Message Construction
            if ($notificationContext === "Student initiated") {
                // Message for STAFF
                $modalMsg = "Student ({$currentUser->name}) has RESCHEDULED Booking #{$booking->reference_code} to {$formattedDate}.";
                $emailSubject = "Reschedule Alert: Booking #{$booking->reference_code}";
                $emailBody = "Hi {$receiver->name},\n\n" .
                             "The student ({$currentUser->name}) has RESCHEDULED their appointment at {$booking->office->office_name}.\n" .
                             "New Date: " . $formattedDate;
            } else {
                // Message for STUDENT
                $modalMsg = "Your booking #{$booking->reference_code} has been RESCHEDULED by the office to {$formattedDate}.";
                $emailSubject = "Appointment Rescheduled: Booking #{$booking->reference_code}";
                $emailBody = "Hi {$receiver->name},\n\n" .
                             "The office staff has RESCHEDULED your appointment at {$booking->office->office_name}.\n" .
                             "New Date: " . $formattedDate;
            }

            // ✅ Insert modal notification
            (new ModalNotificationCreated(
                $booking,
                $currentUser, // Sender
                'reschedule',
                $modalMsg
            ))->handleCustomInsert($receiver);

            // ✅ Create Email Log
            return EmailNotification::create([
                'user_id'         => $receiver->id,
                'booking_id'      => $booking->id,
                'recipient_email' => $receiver->email,
                'subject'         => $emailSubject,
                'message'         => $emailBody,
                'type'            => 'booking_rescheduled',
                'status'          => 'pending',
            ]);
        });

        // 2. SEND EMAIL (Outside Transaction)
        if ($emailLog) {
            try {
                $htmlMessage = view('emails.booking_notification', [
                    'emailSubject' => $emailLog->subject,
                    'bodyContent'  => $emailLog->message
                ])->render();

                $gmail = new GmailService();
                $sent = $gmail->sendEmail($emailLog->recipient_email, $emailLog->subject, $htmlMessage);

                $emailLog->update(['status' => $sent ? 'sent' : 'failed', 'sent_at' => $sent ? now() : null]);

            } catch (\Exception $e) {
                Log::error("Reschedule Email Failed: " . $e->getMessage());
                $emailLog->update(['status' => 'failed']);
            }
        }

        return response()->json([
            'success' => 'Booking successfully rescheduled',
            'booking' => $booking
        ]);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::with(['office.staff.user', 'student.user'])->findOrFail($id);
        $currentUser = Auth::user();

        if ($booking->status === 'cancelled') {
            return response()->json([
                'success' => false,
                'message' => 'This booked appointment has already been cancelled'
            ], 422);
        }

        // ---------------------------------------------------------
        // DETERMINE RECEIVER AND CONTEXT
        // ---------------------------------------------------------
        $studentUser = $booking->student->user;

        // Default: Assume Staff is acting, notify Student
        $receiver = $studentUser;
        $notificationContext = "Staff initiated";

        // If Student is acting, notify Staff/Admin
        if ($currentUser->id === $studentUser->id) {

            // Get the Staff model first
            $staffMember = $booking->office->staff()->first();

            // Check if staff exists AND if that staff has a linked user
            if (!$staffMember || !$staffMember->user) {
                return response()->json(['success' => false, 'message' => 'No office staff user found to notify.'], 500);
            }

            // Set receiver to the USER associated with the staff
            $receiver = $staffMember->user;

            $notificationContext = "Student initiated";
        }

        // 1. DATABASE TRANSACTION
        $emailLog = DB::transaction(function () use ($booking, $currentUser, $receiver, $notificationContext) {
            // Update Status
            $booking->update(['status' => 'cancelled']);

            // ✅ Dynamic Message Construction
            if ($notificationContext === "Student initiated") {
                 // Message for STAFF
                $modalMsg = "Student ({$currentUser->name}) has CANCELLED Booking #{$booking->reference_code}.";
                $emailSubject = "Cancellation Alert: Booking #{$booking->reference_code}";
                $emailBody = "Hi {$receiver->name},\n\n" .
                             "The student ({$currentUser->name}) has CANCELLED their appointment at {$booking->office->office_name}.";
            } else {
                // Message for STUDENT
                $modalMsg = "Your booking at ({$booking->office->office_name}) has been CANCELLED by the office.";
                $emailSubject = "Appointment Cancelled: Booking #{$booking->reference_code}";
                $emailBody = "Hi {$receiver->name},\n\n" .
                             "Your booking at {$booking->office->office_name} has been CANCELLED by the staff.";
            }

            // ✅ Insert modal notification
            (new ModalNotificationCreated(
                $booking,
                $currentUser,
                'cancellation',
                $modalMsg
            ))->handleCustomInsert($receiver);

            // ✅ Create Email Log
            return EmailNotification::create([
                'user_id'         => $receiver->id,
                'booking_id'      => $booking->id,
                'recipient_email' => $receiver->email,
                'subject'         => $emailSubject,
                'message'         => $emailBody,
                'type'            => 'booking_cancelled',
                'status'          => 'pending',
            ]);
        });

        // 2. SEND EMAIL (Outside Transaction)
        if ($emailLog) {
            try {
                $htmlMessage = view('emails.booking_notification', [
                    'emailSubject' => $emailLog->subject,
                    'bodyContent'  => $emailLog->message
                ])->render();

                $gmail = new GmailService();
                $sent = $gmail->sendEmail($emailLog->recipient_email, $emailLog->subject, $htmlMessage);

                $emailLog->update(['status' => $sent ? 'sent' : 'failed', 'sent_at' => $sent ? now() : null]);

            } catch (\Exception $e) {
                Log::error("Cancel Email Failed: " . $e->getMessage());
                $emailLog->update(['status' => 'failed']);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'booking successfully cancelled',
            'booking' => $booking
        ]);
    }
}
