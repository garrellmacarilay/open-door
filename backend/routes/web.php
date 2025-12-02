<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';

// If you build and place the frontend inside `public/` (e.g. `public/index.html`),
// serve it for any non-API route so single-page-app routes don't 404 on refresh.
Route::get('/{any}', function () {
	$index = public_path('index.html');
	if (file_exists($index)) {
		return file_get_contents($index);
	}
	abort(404);
})->where('any', '^(?!api).*$');



