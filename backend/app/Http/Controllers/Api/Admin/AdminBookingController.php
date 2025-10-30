<?php

namespace App\Http\Controllers\Api\Admin;

use Carbon\Carbon;
use App\Models\Booking;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ModalNotificationCreated;

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
    public function index()
    {
        $bookings = Booking::with('student.user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'reference_code' => $booking->reference_code,
                    'student_name' => $booking->student->user->full_name ?? 'Unknown',
                    'service_type' => $booking->service_type,
                    'consultation_date' => $booking->consultation_date,
                    'status' => ucfirst($booking->status),
                ];
            });

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ]);
    }



    // 🟨 Update booking status (approve, decline, etc.)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:approved,declined,rescheduled,cancelled'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->status = $request->status;
        $booking->save();

        $sender = Auth::user(); // admin
        $receiver = $booking->student->user;
        $student = $booking->student;

        switch ($booking->status) {
            case 'approved':
                $message = "Your booking ({$booking->reference_code}) has been approved.";
                $type = 'approval';
                break;

            case 'declined':
                $message = "Your booking ({$booking->reference_code}) has been declined.";
                $type = 'decline';
                break;

            case 'rescheduled':
                $message = "Your booking ({$booking->reference_code}) has been rescheduled.";
                $type = 'reschedule';
                break;

            case 'cancelled':
                $message = "Your booking ({$booking->reference_code}) has been cancelled.";
                $type = 'cancellation';
                break;

            default:
                $message = "There’s an update on your booking ({$booking->reference_code}).";
                $type = 'update';
                break;
        }

        // Send notification to student
        $receiver->notify(new ModalNotificationCreated($booking, $sender, $type, $message));

        // 🟥 Handle habitual cancellations
        if ($booking->status === 'cancelled') {
            $cancelledCount = $student->bookings()->where('status', 'cancelled')->count();

            if ($cancelledCount >= 3) {
                $existingWarning = $receiver->notifications()
                    ->where('data->type', 'warning')
                    ->exists();

                if (!$existingWarning) {
                    $receiver->notify(new ModalNotificationCreated(
                        booking: $booking,
                        sender: $sender,
                        type: 'warning',
                        message: '⚠️ You have missed multiple consultations. Habitual cancellations may lead to disciplinary action.'
                    ));
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Booking status updated successfully.'
        ]);
    }
}
