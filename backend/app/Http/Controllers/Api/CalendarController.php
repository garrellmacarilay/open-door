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
        $bookings = Booking::with(['student.user', 'office', 'staff'])->get();

        $appointments = $bookings->map(function ($bookings) {
            return [
                'id' => $bookings->id,
                'title' => $bookings->student->user->full_name ?? 'Unknown',
                'start' => $bookings->consultation_date,
                'end' => $bookings->consultation_date,
                'color' => $bookings->getStatusColor($bookings->status),
                'details' => [
                    'student' => $bookings->student->user->full_name ?? 'Unknown',
                    'office' => $bookings->office->office_name ?? 'N/A',
                    'staff' => $bookings->staff ? $bookings->staff->user->full_name : 'Unassigned',
                    'concern_description' => $bookings->concern_description,
                    'status' => $bookings->status,
                    'reference_code' => $bookings->reference_code,
                ]
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }
}
