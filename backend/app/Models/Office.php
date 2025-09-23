<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Staff;
use App\Models\Booking;
use App\Models\Feedback;

class Office extends Model
{
    protected $fillable = [
        'office_name',
        'contact_email',
        'contact_number',
        'status',
    ];

    public function staff()
    {
        return $this->hasMany(Staff::class);
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
