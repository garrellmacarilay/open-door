<?php

namespace App\Notifications;


use App\Models\User;
use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class ModalNotificationCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;
    protected $sender;
    protected $type;
    protected $message;

    public function __construct(Booking $booking, User $sender, string $type, string $message)
    {
        $this->booking  = $booking;
        $this->sender   = $sender;
        $this->type     = $type;
        $this->message  = $message;
    }

    public function via($notifiable)
    {
        // ✅ Do NOT store in Laravel notifications table
        return [];
    }

    public function toArray($notifiable)
    {
        // ✅ THIS WILL BE USED BY QUEUE ONLY (not stored)
        return [];
    }

    /**
     * ✅ MANUAL custom insert into modal_notifications table
     */
    public function handleCustomInsert($receiver)
    {
        DB::table('modal_notifications')->insert([
            'booking_id'  => $this->booking->id,
            'sender_id'   => $this->sender->id,
            'receiver_id' => $receiver->id,
            'type'        => $this->type,
            'message'     => $this->message,
            'status'      => 'sent',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }
}
