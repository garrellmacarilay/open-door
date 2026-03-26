<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Booking;

class NotificationController extends Controller
{
    // 📥 Get all notifications
    public function index()
    {
        $user = Auth::user();

        $notifications = DB::table('modal_notifications')
            ->where('receiver_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notif) {
                return [
                    'id' => $notif->id,
                    'type' => $notif->type,
                    'message' => $notif->message,
                    'booking_id' => $notif->booking_id,
                    'booking_reference' => $notif->booking_reference,
                    'read_at' => $notif->status === 'read' ? now()->toISOString() : null,
                    'created_at' => Carbon::parse($notif->created_at)->diffForHumans(),
                ];
            });

        return response()->json([
            'success' => true,
            'notifications' => $notifications
        ]);
    }

    // ✅ Mark a notification as read
    public function markAsRead($id)
    {
        $user = Auth::user();

        $notif = DB::table('modal_notifications')
            ->where('id', $id)
            ->where('receiver_id', $user->id)
            ->first();

        if (!$notif) {
            return response()->json([
                'success' => false,
                'message' => 'Notification not found'
            ], 404);
        }


        if ($notif->status !== 'read') {
            DB::table('modal_notifications')
                ->where('id', $id)
                ->update([
                    'status' => 'read',
                    'updated_at' => now()
                ]);
        }

        return response()->json(['success' => true]);
    }

    public function unreadCount()
    {
        $count = DB::table('modal_notifications')
            ->where('receiver_id', Auth::id())
            ->where('status', 'unread')
            ->count();

        return response()->json(['success' => true, 'count' => $count]);
    }
}
