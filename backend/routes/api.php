<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GoogleController;
use App\Http\Controllers\Api\CalendarController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/calendar/events', [CalendarController::class, 'index']);
// });
Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/google/', [GoogleController::class, 'redirect']); 
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
});



Route::get('/calendar/events', [CalendarController::class, 'index']);