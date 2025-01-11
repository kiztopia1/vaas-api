<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    // Get all users by role
    public function index($role)
    {
        $users = User::getByRole($role);
        return response()->json($users, 200);
    }

    // Get a specific user by ID and role
    public function show($role, $id)
    {
        $user = User::getByRoleAndId($role, $id);
        if ($user) {
            return response()->json($user, 200);
        }
        return response()->json(['message' => ucfirst($role) . ' not found'], 404);
    }

    // Create a new user
    public function store(Request $request, $role)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $user = User::createUser($validatedData, $role);
        return response()->json($user, 201);
    }

    // Update an existing user
    public function update(Request $request, $role, $id)
    {
        $user = User::getByRoleAndId($role, $id);
        if (!$user) {
            return response()->json(['message' => ucfirst($role) . ' not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $updatedUser = $user->updateUser($validatedData);
        return response()->json($updatedUser, 200);
    }

    // Delete a user
    public function destroy($role, $id)
    {
        $user = User::getByRoleAndId($role, $id);
        if ($user) {
            $user->deleteUser();
            return response()->json(['message' => ucfirst($role) . ' deleted successfully'], 200);
        }
        return response()->json(['message' => ucfirst($role) . ' not found'], 404);
    }
}
