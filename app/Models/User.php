<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasFactory;

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
