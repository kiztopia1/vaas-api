<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgencyUser extends Model
{
    use HasFactory;

    protected $table = 'agency_user';

    protected $fillable = [
        'agency_id',
        'user_id',
    ];

    public function agency(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agency_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
