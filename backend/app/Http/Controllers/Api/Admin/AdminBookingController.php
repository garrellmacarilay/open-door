<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Booking;
use App\Mail\BookingEmail;
use Illuminate\Http\Request;
use App\Models\EmailNotification;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\BookingResource;
use App\Notifications\ModalNotificationCreated;
use Illuminate\Support\Facades\Log;

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

        $booking = Booking::with(['student.user'])->find($id);

        if (!$booking)  {
            return response()->json([
                'success' => false,
                'message' => "Booking not found"
            ], 404);
        }

        $sender = Auth::user();
        $student = $booking->student;
        $receiver = $student?->user;

        if (!$receiver) {
            return response()->json([
                'success' => false,
                'message' => 'Student user not found.'
            ], 500);
        }

        $booking->status = $request->status;
        $booking->save();

        $statusNotif = [
            'approved' => ['approval', "Your booking at the({$booking->office->office_name}) has been approved. "],
            'declined' => ['decline', "Your booking at the ({$booking->office->office_name}) has been declined. "],
            'rescheduled' => ['reschedule', "Your booking at the ({$booking->office->office_name}) has been rescheduled. "],
            'cancelled' => ['cancellation', "Your booking at the ({$booking->office->office_name}) has been cancelled. "],
            'completed' => ['completed', "Your booking at the ({$booking->office->office_name}) has been completed. "],
        ];

        [$type, $message] = $statusNotif[$booking->status] ?? ['update', "There’s an update on your booking ({$booking->reference_code})."];

        $notification = new ModalNotificationCreated($booking, $sender, $type, $message);
        $notification->handleCustomInsert($receiver);

        if (in_array($request->status, ['approved', 'declined', 'cancelled', 'rescheduled'])) {

            try {
                $emailSubject = "Update on Booking #" . $booking->reference_code;

                // Custom messages based on status
                $messages = [
                    'approved' => "Great news! Your booking at {$booking->office->office_name} has been APPROVED.",
                    'declined' => "We are sorry, but your booking at {$booking->office->office_name} has been DECLINED.",
                    'cancelled' => "Your booking at {$booking->office->office_name} has been CANCELLED.",
                    'rescheduled' => "Your booking at {$booking->office->office_name} has been RESCHEDULED."
                ];

                $emailMessage = "Hi " . $receiver->name . ",\n\n" . ($messages[$request->status] ?? "Your booking status has changed to " . $request->status);

                // 1. Log to Database
                $emailLog = EmailNotification::create([
                    'user_id' => $receiver->id,
                    'booking_id' => $booking->id,
                    'recipient_email' => $receiver->email,
                    'subject' => $emailSubject,
                    'message' => $emailMessage,
                    'type' => 'booking_' . $request->status, // e.g., booking_approved
                    'status' => 'pending',
                ]);

                // 2. Send Email
                Mail::to($receiver->email)->send(new BookingEmail($emailSubject, $emailMessage));

                // 3. Update Log Success
                $emailLog->update(['status' => 'sent', 'sent_at' => Carbon::now()]);

            } catch (\Exception $e) {
                // 4. Log Failure
                if (isset($emailLog)) {
                    $emailLog->update(['status' => 'failed']);
                }
                \Log::error("Status Update Email Failed: " . $e->getMessage());
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


