<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    public function index()
    {
        // $user = Auth::user();

        // if ($user == null) {
        //     return response()->json([
        //         'success' => false,
        //         'message' => 'Unauthorized'
        //     ], 401);
        // }

        // if ($user->role === 'admin') {
        //     $bookings = Booking::with(['student', 'office', 'staff'])
        //     ->get();
        // } elseif ($user->role === 'staff') {
        //     $bookings = Booking::with(['student','staff'])
        //     ->where('staff_id', $user->staff->id)
        //     ->get();
        // } else {
        //     $bookings = Booking::with('staff')
        //     ->where('student_id', $user->student->id)
        //     ->get();
        // }

        $bookings = Booking::all();

        $events = $bookings->map(function ($bookings) {
            return [
                'id' => $bookings->id,
                'title' => $bookings->service_type . ' - ' . $bookings->status,
                'start' => $bookings->consultation_date,
                'end' => $bookings->consultation_date,
                'color' => $this->getStatusColor($bookings->status),
                'details' => [
                    // 'student' => $bookings->student->first_name . ' ' . $bookings->student->last_name,
                    // 'office' => $bookings->office->name,
                    // 'staff' => $bookings->staff ? $bookings->staff->first_name . ' ' . $bookings->staff->last_name : 'Unassigned',
                    'student' => 'Test Student',
                    'office' => 'Test Office',
                    'staff' => 'Test Staff',
                    'concern_description' => $bookings->concern_description,
                    'status' => $bookings->status,
                    'reference_code' => $bookings->reference_code,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $events
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
