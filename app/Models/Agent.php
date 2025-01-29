<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'private_key',
        'public_key',
        'agent_id',
        'name',
        'admin_id',
        'client_id',
        'fee_type',
        'custom_fee',
        'fee',
    ];

    /**
     * Get the user who owns this agent.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * Get the clients that have access to this agent.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function client()
    {
        return $this->hasOne(User::class, 'id', 'client_id');
    }
}
