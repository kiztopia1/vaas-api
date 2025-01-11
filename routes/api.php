<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


require __DIR__ . '/api/users.php';
require __DIR__ . '/api/admins.php';
require __DIR__ . '/api/clients.php';

// // Define API routes for the Users table
// Route::prefix('/users')->group(function () {

//     // Get all users
//     Route::get('/', function () {
//         return response()->json(User::all(), 200);
//     });

//     // Get a specific user by ID
//     Route::get('/{id}', function ($id) {
//         $user = User::find($id);
//         if ($user) {
//             return response()->json($user, 200);
//         }
//         return response()->json(['message' => 'User not found'], 404);
//     });

//     // Create a new user
//     Route::post('/', function (Request $request) {
//         $validatedData = $request->validate([
//             'name' => 'required|string|max:255',
//             'email' => 'required|string|email|unique:users,email',
//             'password' => 'required|string|min:8',
//             'role' => 'required|string|in:admin,agency_owner,client',
//         ]);

//         $user = User::create([
//             'name' => $validatedData['name'],
//             'email' => $validatedData['email'],
//             'password' => Hash::make($validatedData['password']),
//             'role' => $validatedData['role'],
//         ]);

//         return response()->json($user, 201);
//     });

//     // Update an existing user
//     Route::put('/{id}', function (Request $request, $id) {
//         $user = User::find($id);
//         if (!$user) {
//             return response()->json(['message' => 'User not found'], 404);
//         }

//         $validatedData = $request->validate([
//             'name' => 'sometimes|string|max:255',
//             'email' => 'sometimes|string|email|unique:users,email,' . $id,
//             'password' => 'sometimes|string|min:8',
//             'role' => 'sometimes|string|in:admin,agency_owner,client',
//         ]);

//         if (isset($validatedData['password'])) {
//             $validatedData['password'] = Hash::make($validatedData['password']);
//         }

//         $user->update($validatedData);

//         return response()->json($user, 200);
//     });

//     // Delete a user
//     Route::delete('/{id}', function ($id) {
//         $user = User::find($id);
//         if ($user) {
//             $user->delete();
//             return response()->json(['message' => 'User deleted successfully'], 200);
//         }
//         return response()->json(['message' => 'User not found'], 404);
//     });
// });
