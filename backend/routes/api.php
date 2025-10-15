<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CalendarController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/calendar/events', [CalendarController::class, 'index']);
// });

Route::get('/calendar/events', [CalendarController::class, 'index']);