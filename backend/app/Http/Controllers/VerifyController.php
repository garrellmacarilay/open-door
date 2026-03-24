<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\GmailService;
use Carbon\Carbon;
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

    public function resend(Request $request) {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->email_verified_at) {
            return response()->json([
                'success' => false,
                'message' => 'This account is already verified.'
            ], 400);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $user->update([
            'verification_code' => $code,
        ]);

        try {
            $gmail = new GmailService();
            $subject = "Your New Verification Code";
            $html = "
                <div style='font-family: sans-serif; padding: 20px; color: #333;'>
                    <h2 style='color: #1A73E8;'>Email Verification</h2>
                    <p>You requested a new verification code. Use the code below to continue:</p>
                    <div style='background: #f1f3f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;'>
                        <h1 style='font-size: 32px; letter-spacing: 5px; margin: 0;'>$code</h1>
                    </div>
                    <p style='font-size: 12px; color: #777;'>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                </div>
            ";
            $gmail->sendEmail($user->email, $subject, $html);

            return response()->json([
                'success' => true,
                'message' => 'A new code has been sent to your inbox.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not send email. Please try again later.'
            ], 500);
        }
    }
}
