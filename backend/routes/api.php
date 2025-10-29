<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GoogleController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Models\Office;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/calendar/events', [CalendarController::class, 'index']);
// });

Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/google', [GoogleController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'user' => $request->user()->load('student') // includes student relation if any
    ]);
});

Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/calendar/events', [CalendarController::class, 'index']);
    Route::get('/offices', function() {
        return response()->json(Office::all());
    });

    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/history', [BookingController::class, 'history']);
    Route::get('/bookings/recent', [BookingController::class, 'recent']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    // Protected routes for staff users
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminBookingController::class, 'dashboard']);
    Route::get('/bookings', [AdminBookingController::class, 'index']);
    Route::patch('/bookings/{id}/status', [AdminBookingController::class, 'updateStatus']);
});




