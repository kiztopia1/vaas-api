<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::prefix('/users')->middleware('auth:sanctum')->group(function () {
        // Route::get('/', [UserController::class, 'index']); 
        Route::get('/{id}', [UserController::class, 'show']); // Get a specific user by role & ID
        Route::post('/', [UserController::class, 'store']); // Create a new user (Only agencies can create clients)
        Route::put('/{role}/{id}', [UserController::class, 'update']); // Update a user
        Route::delete('/{id}', [UserController::class, 'destroy']); // Delete a user

    });
});
