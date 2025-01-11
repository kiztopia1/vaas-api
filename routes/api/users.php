<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\UserController;

Route::prefix('/users')->group(function () {
    Route::get('/', [UserController::class, 'index'])->defaults('role', 'user'); // Get all users
    Route::get('/{id}', [UserController::class, 'show'])->defaults('role', 'user'); // Get a specific user
    Route::post('/', [UserController::class, 'store'])->defaults('role', 'user'); // Create a new user
    Route::put('/{id}', [UserController::class, 'update'])->defaults('role', 'user'); // Update a user
    Route::delete('/{id}', [UserController::class, 'destroy'])->defaults('role', 'user'); // Delete a user
});

