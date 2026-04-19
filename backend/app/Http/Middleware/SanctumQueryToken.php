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
        $token = $request->query('token') ?: $request->bearerToken();

        if ($token) {
            $cleanToken = str_replace('Bearer ', '', $token);
            $request->headers->set('Authorization', 'Bearer ' . $cleanToken);
        }

        return $next($request);
    }
}
