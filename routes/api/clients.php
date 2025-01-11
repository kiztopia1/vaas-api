<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\UserController;
Route::prefix('/clients')->group(function () {
    Route::get('/', [UserController::class, 'index'])->defaults('role', 'client'); // Get all clients
    Route::get('/{id}', [UserController::class, 'show'])->defaults('role', 'client'); // Get a specific client
    Route::post('/', [UserController::class, 'store'])->defaults('role', 'client'); // Create a new client
    Route::put('/{id}', [UserController::class, 'update'])->defaults('role', 'client'); // Update a client
    Route::delete('/{id}', [UserController::class, 'destroy'])->defaults('role', 'client'); // Delete a client
});

