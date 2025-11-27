<?php

use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GoogleController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\Office\OfficeController;
use App\Http\Controllers\Api\Admin\AnalyticsController;
use App\Http\Controllers\Api\Admin\AdminEventController;
use App\Http\Controllers\Api\Admin\AdminBookingController;
use App\Http\Controllers\Api\Admin\AdminOfficeController;
use App\Http\Controllers\Api\FeedbackController;



// Route::middleware(['auth:sanctum'])->group(function () {
//     Route::get('/calendar/events', [CalendarController::class, 'index']);
// });



Route::get('/test-cloudinary', function () {
    return response()->json(config('cloudinary'));
});


Route::middleware('guest')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/auth/google', [GoogleController::class, 'redirect']);
    Route::get('/auth/google/callback', [GoogleController::class, 'callback']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user()->load('student');

    $user->profile_picture_url = $user->profile_picture
        ? asset('storage/' . $user->profile_picture)
        : null;

    return response()->json([
        'success' => true,
        'user' => $user // includes student relation if any
    ]);
});

Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('/show/user', [ProfileController::class, 'show']);

    Route::get('/calendar/appointments', [CalendarController::class, 'index']);
    Route::get('/offices', function() {
        return response()->json(Office::all());
    });
    Route::get('/calendar/events', [AdminEventController::class, 'events']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/read/{id}', [NotificationController::class, 'markAsRead']);

    Route::post('/user/profile', [ProfileController::class, 'updateProfile']);

    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'student'])->group(function() {
    Route::get('/my-bookings', [BookingController::class, 'show']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/history', [BookingController::class, 'history']);
    Route::get('/bookings/recent', [BookingController::class, 'recent']);

    Route::post('/feedback/store', [FeedbackController::class, 'feedBack']);

    Route::patch('/reschedule/booking/{id}', [BookingController::class, 'reschedule']);
    Route::patch('/cancel/booking/{id}', [BookingController::class, 'cancel']);
});

Route::middleware(['auth:sanctum', 'staff'])->group(function () {
    Route::get('/office/dashboard', [OfficeController::class, 'dashboard']);
    Route::get('/office/bookings/{id}', [OfficeController::class, 'showBooking']);
    Route::get('/office/bookings', [OfficeController::class, 'consultationSummary']);

});

Route::middleware(['auth:sanctum', 'staffadmin'])->group(function () {
    Route::get('/calendar/appointments', [CalendarController::class, 'index']);
    Route::post('/admin/events', [AdminEventController::class, 'storeEvents']);
    Route::put('/admin/events/{id}', [AdminEventController::class, 'updateEvent']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminBookingController::class, 'dashboard']);

    Route::get('/admin/bookings', [AdminBookingController::class, 'index']);
    Route::get('/admin/bookings/{id}', [AdminBookingController::class, 'show']);
    Route::patch('/bookings/status/{id}', [AdminBookingController::class, 'updateStatus']);


    Route::get('/admin/offices', [AdminOfficeController::class, 'show']);
    Route::post('/admin/office/create', [AdminOfficeController::class, 'store']);
    Route::patch('/admin/office/update/{id}', [AdminOfficeController::class, 'update']);
    Route::delete('/admin/office/delete/{id}', [AdminOfficeController::class, 'delete']);

    Route::get('/admin/analytics/stats', [AnalyticsController::class, 'consultationStats']);
    Route::get('/admin/analytics/trends', [AnalyticsController::class, 'consultationTrends']);
    Route::get('/admin/analytics/distribution', [AnalyticsController::class, 'serviceDistribution']);
    Route::get('/admin/analytics/generate-report', [AnalyticsController::class, 'generateReport']);
});




