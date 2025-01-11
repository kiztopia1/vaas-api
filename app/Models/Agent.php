<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'owner_id',
    ];

    /**
     * Get the user who owns this agent.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the clients that have access to this agent.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function clients()
    {
        return $this->belongsToMany(User::class, 'client_agent', 'agent_id', 'client_id');
    }
}
