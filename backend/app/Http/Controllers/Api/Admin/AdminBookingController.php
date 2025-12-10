<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Booking;
use App\Mail\BookingEmail;
use Illuminate\Http\Request;
use App\Services\GmailService;
use App\Models\EmailNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\BookingResource;
use App\Notifications\ModalNotificationCreated;

class AdminBookingController extends Controller
{

    public function dashboard(Request $request)
    {
        $officeId = $request->query('office_id');

        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);

        $bookingQuery = Booking::query();

        if ($officeId) {
            $bookingQuery->where('office_id', $officeId);
        }
        //STATS
        $totalBookings = $bookingQuery->count();
        $pending = (clone $bookingQuery)->where('status', 'pending')->count();
        $approved = (clone $bookingQuery)->where('status', 'approved')->count();
        $cancelled = (clone $bookingQuery)->where('status', 'cancelled')->count();

        // ✅ Add these new ones safely
        $todayConsultations = (clone $bookingQuery)->whereDate('consultation_date', now())->count();
        $thisMonthConsultations = (clone $bookingQuery)
            ->whereMonth('consultation_date', now()->month)
            ->whereYear('consultation_date', now()->year)
            ->count();


        //SIDEBAR
        $recentBookings = (clone $bookingQuery)
            ->with('student.user', 'office')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return $this->formatBookingData($booking);
            });

        //CALENDAR BOOKING
        $calendarBookings = (clone $bookingQuery)
            ->with('student.user', 'office')
            ->whereMonth('consultation_date', $month)
            ->where('status', ['approved', 'pending'])
            ->whereYear('consultation_date', $year)
            ->get()
            ->map(function ($booking) {
                return $this->formatBookingData($booking);
            });


        return response()->json([
            'success' => true,
            'stats' => [
                'total' => $totalBookings,
                'pending' => $pending,
                'approved' => $approved,
                'cancelled' => $cancelled,
                'today' => $todayConsultations,
                'month' => $thisMonthConsultations,
            ],
            'recent_bookings' => $recentBookings,
            'calendar_bookings' => $calendarBookings,
        ]);
    }
        // 🟩 Fetch all bookings
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $bookings = Booking::with(['student.user', 'office', 'feedback'])
            // 1. Filter by Status
            ->when($status && $status !== 'All', function($q) use ($status){
                $q->where('status', $status);
            })
            // 2. Filter by Search (Case-Insensitive Fix)
            ->when($search, function ($query) use ($search) {
                $searchTerm = strtolower($search); // Convert input to lowercase once

                $query->where(function($q) use ($searchTerm) {
                    // A. Search Student Name (via Relationship)
                    $q->whereHas('student.user', function ($subQ) use ($searchTerm) {
                        $subQ->whereRaw('LOWER(full_name) LIKE ?', ["%{$searchTerm}%"]);
                    })
                    // B. Search Office Name (via Relationship)
                    ->orWhereHas('office', function($subQ) use ($searchTerm) {
                        $subQ->whereRaw('LOWER(office_name) LIKE ?', ["%{$searchTerm}%"]);
                    })
                    // C. Search Direct Columns
                    ->orWhereRaw('LOWER(reference_code) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(service_type) LIKE ?', ["%{$searchTerm}%"])
                    ->orWhereRaw('LOWER(status) LIKE ?', ["%{$searchTerm}%"]);
                });
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference_code' => $booking->reference_code,
                    'student_name' => $booking->student->user->full_name ?? 'Unknown',
                    'service_type' => $booking->service_type,
                    'office' => $booking->office->office_name,
                    'color' => $this->getStatusColor($booking->status),
                    'consultation_date' => $booking->consultation_date,
                    'notes' => $booking->concern_description,
                    'status' => ucfirst($booking->status),
                    'feedback' => [
                        'rating' => $booking->feedback->rating ?? '',
                        'comment' => $booking->feedback->comment ?? ''
                    ]
                ];
            });

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    public function show($id) {

        $bookings = Booking::with(['student.user', 'office'])->find($id);

        if (!$bookings) {
            return response()->json([
                'message' => 'No requests'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => new BookingResource($bookings)
        ]);

    }




    // 🟨 Update booking status (approve, decline, etc.)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:approved,declined,rescheduled,cancelled,pending,completed'
        ]);

        $booking = Booking::with(['student.user', 'office'])->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        $receiver = $booking->student?->user;
        $sender   = Auth::user();

        if (!$receiver) {
            return response()->json([
                'success' => false,
                'message' => 'Student user not found'
            ], 500);
        }

        // 1. DATABASE TRANSACTION
        // Handles all DB updates (Status, Modal Notification, and creating the initial "Pending" Email Log)
        $emailLog = DB::transaction(function () use ($booking, $request, $sender, $receiver) {

            // ✅ Update status
            $booking->update([
                'status' => $request->status
            ]);

            // ✅ Notification mapping (Modal)
            $statusMap = [
                'approved'    => ['approval', "Your booking at ({$booking->office->office_name}) has been approved."],
                'declined'    => ['decline', "Your booking at ({$booking->office->office_name}) has been declined."],
                'rescheduled' => ['reschedule', "Your booking at ({$booking->office->office_name}) has been rescheduled."],
                'cancelled'   => ['cancellation', "Your booking at ({$booking->office->office_name}) has been cancelled."],
                'completed'   => ['completed', "Your booking at ({$booking->office->office_name}) has been completed."],
            ];

            [$type, $message] = $statusMap[$request->status]
                ?? ['update', "There’s an update on your booking ({$booking->reference_code})."];

            // ✅ Insert modal notification
            (new ModalNotificationCreated(
                $booking,
                $sender,
                $type,
                $message
            ))->handleCustomInsert($receiver);

            // ✅ Check if email is needed for this status
            if (!in_array($request->status, [
                'approved', 'declined', 'cancelled', 'rescheduled', 'completed'
            ])) {
                return null; // Return null if no email is needed
            }

            // ✅ Prepare Email Content
            $subject = "Update on Booking #{$booking->reference_code}";
            $emailMap = [
                'approved'    => "Great news! Your booking at {$booking->office->office_name} has been APPROVED.",
                'declined'    => "We are sorry, but your booking at {$booking->office->office_name} has been DECLINED.",
                'cancelled'   => "Your booking at {$booking->office->office_name} has been CANCELLED.",
                'rescheduled' => "Your booking at {$booking->office->office_name} has been RESCHEDULED.",
                'completed'   => "Great news! Your booking at {$booking->office->office_name} has been COMPLETED.",
            ];

            $body = "Hi {$receiver->name},\n\n" .
                    ($emailMap[$request->status]
                        ?? "Your booking status has changed to {$request->status}");

            // ✅ Create Email Log (Status: Pending)
            // We return this object so we can use it outside the transaction
            return EmailNotification::create([
                'user_id'         => $receiver->id,
                'booking_id'      => $booking->id,
                'recipient_email' => $receiver->email,
                'subject'         => $subject,
                'message'         => $body,
                'type'            => 'booking_' . $request->status,
                'status'          => 'pending',
            ]);
        });

        // 2. SEND EMAIL VIA GMAIL API (Outside Transaction)
        // We do this here so if Google is slow, it doesn't lock our Database tables.
        if ($emailLog) {
            try {
                // Render Blade to HTML String
                $htmlMessage = view('emails.booking_notification', [
                    'emailSubject' => $emailLog->subject,
                    'bodyContent'  => $emailLog->message
                ])->render();

                // Send
                $gmail = new GmailService();
                $sent = $gmail->sendEmail($emailLog->recipient_email, $emailLog->subject, $htmlMessage);

                // Update Log Status
                if ($sent) {
                    $emailLog->update(['status' => 'sent', 'sent_at' => now()]);
                } else {
                    $emailLog->update(['status' => 'failed']);
                }

            } catch (\Exception $e) {
                Log::error("Booking Update Email Failed: " . $e->getMessage());
                $emailLog->update(['status' => 'failed']);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking status successfully updated'
        ]);
    }


    private function getStatusColor($status)
    {
        switch ($status) {
            case 'pending':
                return 'orange';
            case 'approved':
                return 'blue';
            case 'cancelled':
                return 'red';
            case 'rescheduled':
                return 'purple';
            case 'completed':
                return 'green';
            default:
                return 'gray';
        }
    }

    private function formatBookingData($booking) {
        return [
            'reference_code' => $booking->reference_code,
            'student_name' => optional($booking->student?->user)->full_name ?? 'Unknown',
            'service_type' => $booking->service_type,
            'office' => $booking->office?->office_name ?? 'Unknown',
            'status' => ucfirst($booking->status),
            'consultation_date' => $booking->consultation_date
                ? Carbon::parse($booking->consultation_date)->toIso8601String()
                : null,
            'created_at' => $booking->created_at->toIso8601String(),
        ];
    }
}


