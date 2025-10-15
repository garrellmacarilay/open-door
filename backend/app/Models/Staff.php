<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Office;
use App\Models\Booking;

class Staff extends Model
{
    protected $table = 'staffs';
    protected $fillable = [
        'user_id',
        'office_id',
        'position',
        'availability_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
