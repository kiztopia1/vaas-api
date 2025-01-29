<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;


// User Registration
Route::post('/register', [RegisteredUserController::class, 'store']);

// User Login
Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest:api')
    ->name('api.login');

// Forgot Password (Request Reset Link)
Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest:api')
    ->name('api.password.email');

// Reset Password
Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest:api')
    ->name('api.password.reset');

// Verify Email
Route::get('/verify-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
    ->middleware(['auth:api', 'signed', 'throttle:6,1'])
    ->name('api.verification.verify');

// Resend Email Verification Notification
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth:api', 'throttle:6,1'])
    ->name('api.verification.resend');

// User Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:api')
    ->name('api.logout');
