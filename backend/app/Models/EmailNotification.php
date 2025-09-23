<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Booking;

class EmailNotification extends Model
{
    protected $fillable = [
        'user_id',
        'booking_id',
        'subject',
        'message',
        'recipient_email',
        'type',
        'status',
        'sent_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
