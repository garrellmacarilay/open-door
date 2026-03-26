<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Force HTTPS for generated URLs in production behind load balancers
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }

        //rate limit for resending otp
        RateLimiter::for('resend-otp', function (Request $request) {
            $key = $request->input('email') ?: $request->ip();

            return Limit::perMinute(3)->by($key);
        });
    }
}
