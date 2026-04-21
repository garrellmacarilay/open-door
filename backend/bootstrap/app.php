<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\OfficeMiddleware;
use App\Http\Middleware\StaffAdminMiddleware;
use App\Http\Middleware\StudentMiddleware;
use App\Http\Middleware\SanctumQueryToken;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;



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
            SanctumQueryToken::class,
        ]);

         $middleware->redirectGuestsTo(fn() => response()->json(['error' => 'Unauthenticated.'], 401));

        $middleware->alias([
            'sanctum.query' => SanctumQueryToken::class,
            'admin' => AdminMiddleware::class,
            'student' => StudentMiddleware::class,
            'staff' => OfficeMiddleware::class,
            'staffadmin' => StaffAdminMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['error' => 'Unauthenticated.'], 401);
            }
            return response()->json(['error' => 'Unauthenticated.'], 401);
        });
        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Too many attempts. Please wait a moment before trying again.'
                ], 429);
            }
        });
    })->create();
