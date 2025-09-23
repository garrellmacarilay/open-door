<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Report;
use App\Models\Restriction;

class Admin extends Model
{
    protected $fillable = [
        'user_id',
        'role_description',
        'managed_offices',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'generated_by');
    }

    public function restrictions()
    {
        return $this->hasMany(Restriction::class, 'created_by');
    }
}
