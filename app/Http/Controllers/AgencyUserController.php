<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\User;
use App\Models\AgencyUser;

class AgencyUserController extends Controller
{
    /**
     * Get all users under the authenticated agency.
     */
    public function index(): JsonResponse
    {
        $agencyId = Auth::id(); // Get the authenticated agency's ID

        $users = User::whereHas('agencies', function ($query) use ($agencyId) {
            $query->where('agency_id', $agencyId);
        })->get();

        return response()->json($users);
    }

    /**
     * Get a specific user under the authenticated agency.
     */
    public function show($id): JsonResponse
    {
        $agencyId = Auth::id();
        $user = User::whereHas('agencies', function ($query) use ($agencyId, $id) {
            $query->where('agency_id', $agencyId)->where('user_id', $id);
        })->first();

        if (!$user) {
            return response()->json(['message' => 'User not found or does not belong to this agency'], 404);
        }

        return response()->json($user);
    }

    /**
     * Create a new user under the authenticated agency.
     */
    public function store(Request $request): JsonResponse
    {
        $agencyId = Auth::id(); // Get the authenticated agency's ID

        // Ensure only agencies can create users
        $agency = User::find($agencyId);
        if (!$agency || $agency->role !== 'agency') {
            return response()->json(['error' => 'Unauthorized. Only agencies can create users.'], 403);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user', // Assign role 'user'
        ]);

        // Link the user to the agency in the pivot table
        AgencyUser::create([
            'agency_id' => $agencyId,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'User created successfully under the agency',
            'user' => $user,
        ], 201);
    }

    /**
     * Update a user under the authenticated agency.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $agencyId = Auth::id();
        $user = User::whereHas('agencies', function ($query) use ($agencyId, $id) {
            $query->where('agency_id', $agencyId)->where('user_id', $id);
        })->first();

        if (!$user) {
            return response()->json(['message' => 'User not found or does not belong to this agency'], 404);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $id],
            'password' => ['sometimes', 'confirmed', Rules\Password::defaults()],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user], 200);
    }

    /**
     * Delete a user under the authenticated agency.
     */
    public function destroy($id): JsonResponse
    {
        $agencyId = Auth::id();
        $user = User::whereHas('agencies', function ($query) use ($agencyId, $id) {
            $query->where('agency_id', $agencyId)->where('user_id', $id);
        })->first();

        if (!$user) {
            return response()->json(['message' => 'User not found or does not belong to this agency'], 404);
        }

        // Remove user from the agency-user relation table
        AgencyUser::where('agency_id', $agencyId)->where('user_id', $id)->delete();

        // Delete the user
        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
