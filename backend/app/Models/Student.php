<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Booking;
use App\Models\Feedback;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'student_number',
        'program',
        'year_level',
        'missed_count'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }
}
