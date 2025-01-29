<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationship: An agency has many clients (via the agency_user table)
    public function agencyClients(): HasManyThrough
    {
        return $this->hasManyThrough(
            User::class,       // The related model (Client)
            AgencyUser::class, // The intermediate model (agency_user table)
            'agency_id',       // Foreign key on agency_user linking to agencies
            'id',              // Local key on users table (the client ID)
            'id',              // Local key on users table (agency ID)
            'user_id'          // Foreign key on agency_user linking to clients
        );
    }
    // Relationship: A user belongs to multiple agencies
    public function agencies(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'agency_user', 'user_id', 'agency_id');
    }

    // Relationship: An agency manages many users
    public function managedUsers(): HasMany
    {
        return $this->hasMany(AgencyUser::class, 'agency_id');
    }

    public function agent(): HasOne
    {
        return $this->hasOne(Agent::class, 'client_id', 'id');
    }

    // Get all users by role
    public static function getByRole($role)
    {
        return self::where('role', $role)->get();
    }

    // Get a specific user by role and ID
    public static function getByRoleAndId($role, $id)
    {
        return self::where('role', $role)->find($id);
    }

    // Create a new user
    public static function createUser($data, $role)
    {
        $data['role'] = $role;
        $data['password'] = Hash::make($data['password']);
        return self::create($data);
    }

    // Update a user
    public function updateUser($data)
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $this->update($data);
        return $this;
    }

    // Delete a user
    public function deleteUser()
    {
        return $this->delete();
    }
}
