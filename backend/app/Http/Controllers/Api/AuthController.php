<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Services\GmailService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request) {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $code = rand(100000, 999999);

        $user = User::create([
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'verification_code' => $code,
        ]);

        $gmail = new GmailService();

        $html =  "
            <h2>Email Verification</h2>
            <p>Your verification code:</p>
            <h1>$code</h1>
        ";

        $gmail->sendEmail(
            $user->email,
            'Verify Your Email',
            $html
        );

        return response()->json([
            'success' => true,
            'message' => 'Registration successful. Check your email for the verification code.',
            'user' => $user
        ]);
    }

    public function login(Request $request) {

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            $expiration = $request->boolean('remember_me')
                ? now()->addDays(30)
                : now()->addMinutes(30);

            $token = $user->createToken('auth_token', ['*'], $expiration)->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ]);
        }
        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password'
        ], 401);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout successful'
        ]);
    }
}
