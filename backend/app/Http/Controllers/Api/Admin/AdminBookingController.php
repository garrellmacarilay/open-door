<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Booking;
use App\Mail\BookingEmail;
use Illuminate\Http\Request;
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
            ->when($status && $status !== 'All', function($q) use ($status){
                $q->where('status', $status);
            })
            ->when($search, function ($query) use ($search) {

                $query->whereHas('student.user', function ($q) use ($search) {
                    $q->where('full_name', 'LIKE', "%{$search}%");
                })
                ->orWhereHas('office', function($q) use ($search) {
                    $q->where('office_name', 'LIKE', "%{$search}%");
                })
                ->orWhere('reference_code', 'LIKE', "%{$search}%")
                ->orWhere('service_type', 'LIKE', "%{$search}%")
                ->orWhere('status', 'LIKE', "%{$search}%");
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

        DB::transaction(function () use ($booking, $request, $sender, $receiver) {

            // ✅ Update status
            $booking->update([
                'status' => $request->status
            ]);

            // ✅ Notification mapping
            $statusMap = [
                'approved'     => ['approval', "Your booking at ({$booking->office->office_name}) has been approved."],
                'declined'     => ['decline', "Your booking at ({$booking->office->office_name}) has been declined."],
                'rescheduled'  => ['reschedule', "Your booking at ({$booking->office->office_name}) has been rescheduled."],
                'cancelled'    => ['cancellation', "Your booking at ({$booking->office->office_name}) has been cancelled."],
                'completed'    => ['completed', "Your booking at ({$booking->office->office_name}) has been completed."],
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

            // ✅ Only send email for certain statuses
            if (!in_array($request->status, [
                'approved', 'declined', 'cancelled', 'rescheduled', 'completed'
            ])) {
                return;
            }

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

            // ✅ Log email
            $emailLog = EmailNotification::create([
                'user_id' => $receiver->id,
                'booking_id' => $booking->id,
                'recipient_email' => $receiver->email,
                'subject' => $subject,
                'message' => $body,
                'type' => 'booking_' . $request->status,
                'status' => 'pending',
            ]);

            // ✅ Queue email (NON-blocking)
            Mail::to($receiver->email)
                ->queue(new BookingEmail($subject, $body));

            // ✅ Mark as queued/sent (depends on your preference)
            $emailLog->update([
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        });

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


