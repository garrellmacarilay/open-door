<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function feedBack(Request $request)
    {
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'student_id' => 'required|exists:students,id',
            'office_id' => 'required|exists:offices,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:255'
        ]);

        $booking = Booking::where('id', $request->booking_id)
            ->where('student_id', $request->student_id)
            ->first();

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        if ($booking->status !== 'completed') {
            return response()->json([
                'success' => false,
                'message' => 'You can only submit a feedback after the appointment is completed'
            ]);
        }

        $existing = Feedback::where('booking_id', $request->booking_id)->first();
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Feedback already submitted for this booking'
            ], 409);
        }

        $feedback = Feedback::create([
            'booking_id' => $request->booking_id,
            'student_id' => $request->student_id,
            'office_id' => $request->office_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Feedback submitted successfully!',
            'feedback' => $feedback
        ]);
    }

}
