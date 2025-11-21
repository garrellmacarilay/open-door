<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'event_title',
        'description',
        'event_date',
        'event_time'
    ];
}
