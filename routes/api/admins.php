<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;

Route::prefix('/admins')->group(function () {
    Route::get('/', [UserController::class, 'index'])->defaults('role', 'admin'); // Get all admins
    Route::get('/{id}', [UserController::class, 'show'])->defaults('role', 'admin'); // Get a specific admin
    Route::post('/', [UserController::class, 'store'])->defaults('role', 'admin'); // Create a new admin
    Route::put('/{id}', [UserController::class, 'update'])->defaults('role', 'admin'); // Update an admin
    Route::delete('/{id}', [UserController::class, 'destroy'])->defaults('role', 'admin'); // Delete an admin
});