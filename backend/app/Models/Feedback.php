<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Office;
use App\Models\Staff;

class Feedback extends Model
{
    protected $fillable = [
        'booking_id',
        'student_id',
        'office_id',
        'staff_id',
        'rating',
        'comment',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }
}
