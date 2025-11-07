<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ModalNotificationCreated;
use App\Http\Resources\BookingResource;

class AdminBookingController extends Controller
{

    public function dashboard(Request $request)
    {
        $officeId = $request->query('office_id');

        $bookingQuery = Booking::query();

        if ($officeId) {
            $bookingQuery->where('office_id', $officeId);
        }

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

        $recentBookings = (clone $bookingQuery)
            ->with('student.user')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($booking) {
                return [
                    'reference_code' => $booking->reference_code,
                    'student_name' =>  optional($booking->student?->user)->full_name ?? 'Unknown',
                    'service_type' => $booking->service_type,
                    'status' => ucfirst($booking->status),
                    'consultation_date' => $booking->consultation_date
                        ? Carbon::parse($booking->consultation_date)->toIso8601String()
                        : null,
                    'created_at' => $booking->created_at->toIso8601String(),

                ];
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
        ]);
    }
        // 🟩 Fetch all bookings
    public function index(Request $request)
    {
        $search = $request->input('search');

        $bookings = Booking::with(['student.user', 'office'])
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
                    'status' => ucfirst($booking->status),
                ];
            });

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }

    public function show($id) {

        $bookings = Booking::with(['student.user', 'office'])
            ->find($id);

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
            'status' => 'required|string|in:approved,declined,rescheduled,cancelled'
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
            'approved' => ['approval', "Your booking ({$booking->reference_code}) has been approved. "],
            'declined' => ['decline', "Your booking ({$booking->reference_code}) has been declined. "],
            'rescheduled' => ['reschedule', "Your booking ({$booking->reference_code}) has been rescheduled. "],
            'cancelled' => ['cancellation', "Your booking ({$booking->reference_code}) has been cancelled. "],
        ];

        [$type, $message] = $statusNotif[$booking->status] ?? ['update', "There’s an update on your booking ({$booking->reference_code})."];

        $notification = new ModalNotificationCreated($booking, $sender, $type, $message);
        $notification->handleCustomInsert($receiver);

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
}
