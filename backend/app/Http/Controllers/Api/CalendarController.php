<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CalendarController extends Controller
{
    public function index(Request $request) // Added Request here
    {
        $now = now();

        $query = Booking::with(['student.user', 'office', 'staff']);

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('consultation_date', $request->month)
                    ->whereYear('consultation_date', $request->year);
        } else {
            $query->where('consultation_date', '>=', $now->toDateString()); //only render today's appointment onwards
        }


        // Fixed Office Filter
        if ($request->filled('office') && $request->office !== 'All Offices') {
            $query->whereHas('office', function($q) use ($request)  {
                $q->where('office_name', $request->office);
            });
        }

        // Fixed Status Filter
        if ($request->filled('status') && $request->status !== 'all') {
            $status = strtolower(trim($request->status));
            $query->where('status', $status);
        }

        // Paginate results per 15 request
        $bookings = $query->orderBy('consultation_date', 'asc')->paginate(100);

        // 5. Map the results
        $appointments = collect($bookings->items())->map(function ($booking) {
            return [
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $booking->consultation_date,
                'dateString' => $booking->consultation_date,
                'color' => $booking->getStatusColor($booking->status),
                'details' => [
                    'student' => $booking->student->user->full_name ?? 'Unknown',
                    'office' => $booking->office->office_name ?? 'N/A',
                    'staff' => $booking->staff ? $booking->staff->user->full_name : 'Unassigned',
                    'concern_description' => $booking->concern_description,
                    'attachment' => $booking->uploaded_file_url,
                    'attachment_name' => $booking->uploaded_file_name,
                    'service_type' => $booking->service_type,
                    'status' => strtolower($booking->status),
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
                'total' => $bookings->total(),
                'has_more' => $bookings->hasMorePages()
            ]
        ]);
    }
}
