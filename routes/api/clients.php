<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AgencyUserController;

Route::middleware('auth:sanctum')->prefix('/clients')->group(function () {
    Route::get('/', [AgencyUserController::class, 'index']); // Get all users assigned to an agency
    Route::get('/{id}', [AgencyUserController::class, 'show']); // Get a specific user assigned to an agency
    Route::post('/', [AgencyUserController::class, 'store']); // Create a new user under an agency
    Route::put('/{id}', [AgencyUserController::class, 'update']); // Update a user's details
    Route::delete('/{id}', [AgencyUserController::class, 'destroy']); // Delete a user assigned to an agency
});
