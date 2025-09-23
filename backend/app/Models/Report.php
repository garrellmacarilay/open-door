<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Admin;

class Report extends Model
{
    protected $fillable = [
        'month_year',
        'total_consultations',
        'approved_count',
        'cancelled_count',
        'rescheduled_count',
        'top_office',
        'generated_by',
        'file_url',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'generated_by');
    }
}
