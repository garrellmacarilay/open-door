<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\Booking;
use App\Models\User;

class ModalNotificationCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $booking;
    protected $message;
    protected $type;
    protected $sender;
    /**
     * Create a new notification instance.
     */
    public function __construct(Booking $booking, User $sender, string $type, string $message)
    {
        $this->booking = $booking;
        $this->message = $message;
        $this->sender = $sender;
        $this->type = $type;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toDatabase($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'sender_id' => $this->sender->id,
            'receiver_id' => $notifiable->id,
            'type' => $this->type,
            'message' => $this->message,
            'status' => 'sent',
            'booking_reference' => $this->booking->reference_code ?? null
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
