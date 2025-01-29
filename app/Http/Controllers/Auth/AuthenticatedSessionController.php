<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request (Login).
     */
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Find the user by email
        $user = \App\Models\User::where('email', $request->email)->first();

        // Check if the user exists and the password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Generate a Sanctum token
        $token = $user->createToken('API Token')->plainTextToken;

        // Return response with token and user data
        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Destroy an authenticated session (Logout).
     */
    public function destroy(Request $request)
    {
        // Revoke all tokens for the authenticated user
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        return response()->json([
            'message' => 'Logout successful',
        ], 200);
    }
}
