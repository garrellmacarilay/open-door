<?php

use Illuminate\Foundation\Application;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\OfficeMiddleware;
use App\Http\Middleware\StudentMiddleware;
use Illuminate\Http\Middleware\HandleCors;
use App\Http\Middleware\StaffAdminMiddleware;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;



return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->api(prepend: [
            HandleCors::class,
        ]);

        $middleware->api(append: [
        ]);

        $middleware->alias([
            'admin' => AdminMiddleware::class,
            'student' => StudentMiddleware::class,
            'staff' => OfficeMiddleware::class,
            'staffadmin' => StaffAdminMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
