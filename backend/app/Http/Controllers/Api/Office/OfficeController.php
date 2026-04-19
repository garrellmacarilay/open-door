<?php

namespace App\Http\Controllers\Api\Office;

use App\Models\Office;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class OfficeController extends Controller
{
    public function dashboard(Request $request) {

        $user = Auth::user();

        if (!$user->staff || !$user->staff->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'Staff is not assigned to an office'
            ], 400);
        }

        $officeId = $user->staff->office_id;

        $now = now();

       $query = Booking::with(['student.user', 'office', 'staff.user'])
            ->where('office_id', $officeId);

        if ($request->filled('month') && $request->filled('year')) {
            $query->whereMonth('consultation_date', $request->month)
                    ->whereYear('consultation_date', $request->year);
        } else {
            $query->where('consultation_date', '>=', $now->toDateString()); //only render today's appointment onwards
        }

        if ($request->filled('status')) {
            $status = strtolower(trim($request->status));

            if ($status === 'all') {
                $query->whereIn('status', ['pending', 'approved', 'declined']);
            } else {
                $query->where('status', $status);
            }
        }

        $bookings = $query->orderBy('consultation_date', 'asc')->paginate(15);

        $appointments = collect($bookings->items())->map(function($booking) {
            return[
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $booking->consultation_date,
                'dateString' => $booking->consultation_date,
                'end' => $booking->consultation_date,
                'color' => $this->getStatusColor($booking->status),
                'details' => [
                    'student' => $booking->student->user->full_name ?? 'Unknown',
                    'office' => $booking->office->office_name ?? 'N/A',
                    'staff' => $booking->staff ? $booking->staff->user->full_name : 'Unassigned',
                    'attachment' => $booking->uploaded_file_url,
                    'attachment_name' => $booking->uploaded_file_name,
                    'group_members' => $booking->group_members,
                    'concern_description' => $booking->concern_description,
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

    public function mobileConsultationSummary(Request $request) {
        $user = Auth::user();

        if (!$user->staff || !$user->staff->office_id) {
            return response()->json([
                'success' => false,
                'message' => 'Staff is not assigned to any office.'
            ], 400);
        }

        $officeId = $user->staff->office_id;

        $query = Booking::with(['student.user', 'office', 'staff.user'])
            ->where('office_id', $officeId); // ✅ Only this office


        if ($request->filled('status')) {
            $status = strtolower(trim($request->status));

            if ($status === 'all') {
                $query->whereIn('status', ['pending', 'approved', 'declined', 'completed']);
            } else {
                $query->where('status', $status);
            }
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate(100);

        $appointments = collect($bookings->items())->map(function($booking) {
            return[
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $booking->consultation_date,
                'dateString' => $booking->consultation_date,
                'end' => $booking->consultation_date,
                'color' => $this->getStatusColor($booking->status),
                'details' => [
                    'student' => $booking->student->user->full_name ?? 'Unknown',
                    'office' => $booking->office->office_name ?? 'N/A',
                    'staff' => $booking->staff ? $booking->staff->user->full_name : 'Unassigned',
                    'attachment' => $booking->uploaded_file_url,
                    'attachment_name' => $booking->uploaded_file_name,
                    'group_members' => $booking->group_members,
                    'concern_description' => $booking->concern_description,
                    'status' => strtolower($booking->status),
                    'reference_code' => $booking->reference_code,
                    'feedback' => [
                        'ratings' => $booking->feedback->rating ?? '',
                        'comment' => $booking->feedback->comment ?? ''
                    ]
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

    public function getSpecificAppointment($id) {
        // 1. Fetch the single record with relationships
        $booking = Booking::with(['student.user', 'office', 'staff.user', 'feedback'])
            ->find($id);

        if (!$booking) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        // 2. Return the exact same structure as your list uses
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $booking->id,
                'title' => $booking->student->user->full_name ?? 'Unknown',
                'start' => $booking->consultation_date,
                'dateString' => $booking->consultation_date,
                'end' => $booking->consultation_date,
                'color' => $this->getStatusColor($booking->status),
                'details' => [
                    'student' => $booking->student->user->full_name ?? 'Unknown',
                    'office' => $booking->office->office_name ?? 'N/A',
                    'staff' => $booking->staff ? $booking->staff->user->full_name : 'Unassigned',
                    'attachment' => $booking->uploaded_file_url,
                    'attachment_name' => $booking->uploaded_file_name,
                    'group_members' => $booking->group_members,
                    'concern_description' => $booking->concern_description,
                    'status' => strtolower($booking->status),
                    'reference_code' => $booking->reference_code,
                    'feedback' => [
                        'ratings' => $booking->feedback->rating ?? '',
                        'comment' => $booking->feedback->comment ?? ''
                    ]
                ]
            ]
        ]);
    }

    public function updateStatus(Request $request, $id) {
        $user = Auth::user();

        $request->validate([
            'status' => 'required|in:active,inactive'
        ]);

        if (!$user->staff || $user->staff->office_id != $id) {
            return response()->json([
                'success' => false,
                'message' => 'Staff is not assigned to any office.'
            ], 403);
        }
        $office = Office::findOrFail($id);

        $office->update([
            'status' => $request->status
        ]);
        return response()->json([
            'success' => true,
            'message' => "Office status updated to {$request->status}",
            'data' => $office
        ]);

    }

    public function showOffice($id) {
        $office = Office::find($id);

        if (!$office) {
            return response()->json(['success' => false, 'message' => 'Office not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $office // This will include 'status' (active/inactive)
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
