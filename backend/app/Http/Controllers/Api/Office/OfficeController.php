<?php

namespace App\Http\Controllers\Api\Office;

use App\Models\Office;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class OfficeController extends Controller
{
    public function dashboard() {

        $user = Auth::user();

        if (!$user->staff || !$user->staff->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'Staff is not assigned to an office'
            ], 400);
        }

        $officeId = $user->staff->office_id;

        $bookings = Booking::with(['student.user', 'office', 'staff.user'])
            ->where('office_id', $officeId)
            ->orderBy('consultation_date', 'asc')
            ->get();

        $appointments = $bookings->map(function($booking) {
            return[
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $booking->consultation_date,
                'end' => $booking->consultation_date,
                'color' => $this->getStatusColor($booking->status),
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
            'data' => $appointments
        ]);
    }

    public function showBooking($id)
    {
        $user = Auth::user();

        if (!$user->staff) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $officeId = $user->staff->office_id;

        $booking = Booking::with(['student.user', 'office', 'staff'])
            ->where('office_id', $officeId)
            ->find($id);

        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Booking not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $booking->id,
                'student_name' => $booking->student->user->full_name,
                'office' => $booking->office->office_name,
                'service_type' => $booking->service_type,
                'consultation_date' => $booking->consultation_date,
                'attached_files' => $booking->uploaded_file_url,
                'status' => $booking->status,
            ]
        ]);
    }

    public function consultationSummary(Request $request)
    {
        $user = Auth::user();

        if (!$user->staff || !$user->staff->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'Staff is not assigned to any office.'
            ], 400);
        }

        $officeId = $user->staff->office_id;
        $search = $request->input('search');

        $bookings = Booking::with(['student.user', 'office'])
            ->where('office_id', $officeId) // ✅ Only this office
            // ✅ Case-Insensitive Search Fix
            ->when($search, function ($query) use ($search) {
                $searchTerm = strtolower($search); // Convert input to lowercase

                $query->where(function ($q) use ($searchTerm) {
                    // 1. Search Student Name (via Relationship)
                    $q->whereHas('student.user', function ($subQ) use ($searchTerm) {
                        $subQ->whereRaw('LOWER(full_name) LIKE ?', ["%{$searchTerm}%"]);
                    })
                    // 2. Search Direct Columns (Reference, Service, Status)
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
                    'status' => ucfirst($booking->status),
                    // Added feedback safely in case you need it here too
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
