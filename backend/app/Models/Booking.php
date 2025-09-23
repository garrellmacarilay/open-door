<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Admin;
use App\Models\Student;
use App\Models\Office;
use App\Models\Staff;
use App\Models\Feedback;
use App\Models\EmailNotification;

class Booking extends Model
{
    protected $fillable = [
        'student_id',
        'office_id',
        'staff_id',
        'service_type',
        'consultation_date',
        'concern_description',
        'status',
        'uploaded_file_url',
        'reference_code',
    ];

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

    public function feedback()
    {
        return $this->hasOne(Feedback::class);
    }

    public function emailNotifications()
    {
        return $this->hasMany(EmailNotification::class);
    }
}
