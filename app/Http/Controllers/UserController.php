<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Agent;
use App\Models\AgencyUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
{
    /**
     * Get all users by role.
     */
    public function index($role)
    {
        $users = User::where('role', $role)->get();
        return response()->json(['success' => true, 'data' => $users], 200);
    }

    /**
     * Get a specific user by ID and role.
     */
    public function show($id)
    {
        $user = User::where('id', $id)->first();
        if ($user) {
            return response()->json(['success' => true, 'data' => $user], 200);
        }
        return response()->json(['error' => ucfirst($id) . ' not found'], 404);
    }

    /**
     * Create a new client user (Only agency users can create).
     */
    public function store(Request $request)
    {
        $authUser = Auth::user(); // Get authenticated user

        // Ensure only agencies can create clients
        if (!$authUser || $authUser->role !== 'agency') {
            return response()->json(['error' => 'Unauthorized. Only agencies can create client users.'], 403);
        }

        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => ['required', 'string', 'min:6', 'confirmed', Rules\Password::defaults()],
            'agent_id' => 'required|exists:agents,id', // Ensure the agent exists
        ]);

        // Create the client user
        $client = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'client', // Assign the "client" role
        ]);

        // Track agency-client relationship in `agency_user` table
        AgencyUser::create([
            'agency_id' => $authUser->id, // Agency user ID
            'user_id' => $client->id, // New client ID
        ]);

        // Find the agent and assign the new user's ID as `client_id`
        $agent = Agent::find($validated['agent_id']);
        if ($agent) {
            $agent->client_id = $client->id;
            $agent->save();
        }

        return response()->json(['success' => true, 'data' => $client], 201);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, $id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response()->json(['error' => ucfirst($id) . ' not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8',
        ]);

        $user->update($validated);
        return response()->json(['success' => true, 'data' => $user], 200);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::where('id', $id)->first();
        if ($user) {
            $user->delete();
            return response()->json(['message' => ' deleted successfully'], 200);
        }
        return response()->json(['error' =>  ' not found'], 404);
    }

    /**
     * Get all client users under the authenticated agency.
     */

    public function getAgencyClients()
    {
        Log::info('Authenticated User Role:', [Auth::user()->role]);
        $authUser = Auth::user();

        // Ensure only agency users can access this
        if (!$authUser || $authUser->role !== 'agency') {
            return response()->json(['error' => 'Unauthorized. Only agencies can retrieve clients.'], 403);
        }

        // Debugging: Log current agency ID
        Log::info('Agency ID:', [$authUser->id]);

        // Retrieve all client user IDs from agency_user table
        $clientIds = AgencyUser::where('agency_id', $authUser->id)->pluck('user_id');

        // Debugging: Log retrieved client IDs
        Log::info('Retrieved Client IDs:', $clientIds->toArray());

        // Fetch clients along with their assigned agent's name
        $clients = User::whereIn('id', $clientIds)
            ->with('agent:id,name,client_id') // Fetch only the necessary agent fields
            ->get()
            ->map(function ($client) {
                return [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                    'email_verified_at' => $client->email_verified_at,
                    'role' => $client->role,
                    'created_at' => $client->created_at,
                    'updated_at' => $client->updated_at,
                    'agent' => $client->agent ? $client->agent->name : null, // Attach agent name
                ];
            });

        // Debugging: Log retrieved client data
        Log::info('Retrieved Clients with Agents:', $clients->toArray());

        return response()->json(['success' => true, 'data' => $clients]);
    }
}
