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
            // Clean the token
            $cleanToken = str_replace('Bearer ', '', $token);
            
            // 1. Set the header for current request
            $request->headers->set('Authorization', 'Bearer ' . $cleanToken);

            // 2. Manual Auth Check (If Sanctum is being stubborn)
            // This ensures the user is actually 'resolved' before reaching 'auth:sanctum'
            if ($tokenInstance = \Laravel\Sanctum\PersonalAccessToken::findToken($cleanToken)) {
                $user = $tokenInstance->tokenable;
                if ($user) {
                    Auth::login($user); 
                }
            }
        }

        return $next($request);
    }
}
