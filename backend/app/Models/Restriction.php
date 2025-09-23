<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Admin;

class Restriction extends Model
{
    protected $fillable = [
        'target_type',
        'target_id',
        'reason',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
