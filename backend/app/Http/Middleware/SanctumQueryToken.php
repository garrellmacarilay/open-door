<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Sanctum;

class SanctumQueryToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Check for token in query string
        $token = $request->query('token');
        Log::info('Token found in URL: ' . ($token ? 'Yes' : 'No'));

        if ($token) {
            // 2. Set the header so auth:sanctum can find it
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
