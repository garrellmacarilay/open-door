<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

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

        $user->update([
            'email_verified_at' => now(),
            'verification_code' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully',
            'user' => $user
        ]);
    }
}