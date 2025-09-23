<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Booking;
use App\Models\User;


class ModalNotification extends Model
{
    protected $fillable = [
        'booking_id',
        'sender_id',
        'receiver_id',
        'type',
        'message',
        'status',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
