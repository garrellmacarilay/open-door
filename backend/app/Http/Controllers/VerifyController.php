<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;

class VerifyController extends Controller
{
    public function verifyEmail(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'verification_code' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
                ->where('verification_code', $request->verification_code)
                ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code or email.'
            ], 404);
        }

        if ($user->verification_code != $request->verification_code) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification code'
            ], 401);
        }

        $expiration = Carbon::now()->addDays(7);

        $token = $user->createToken('auth_token', ['*'],$expiration)->plainTextToken;


        $user->update([
            'email_verified_at' => now(),
            'verification_code' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully',
            'user' => $user,
            'token' => $token,
            'expires_at' => $expiration,
        ]);
    }
}
