<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        // Check for Bearer token in Authorization header first
        $bearerToken = $request->bearerToken();

        // If no Bearer token, check for token in query parameter
        if (!$bearerToken) {
            $bearerToken = $request->query('token');
        }

        // If we have a token, inject it into the Authorization header for Sanctum
        if ($bearerToken) {
            $request->headers->set('Authorization', 'Bearer ' . $bearerToken);
        }

        return $next($request);
    }
}
