<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Services\GmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request) {

        // Incoming request data
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => [
                'required',
                'string',
                'min:8',
                'max:16',
                'confirmed',
                'regex:/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/'
                ]
        ], [
            'password.regex' => 'The password must contain at least one uppercase letter and one special character.',
            'password.min' => 'The password must be at least 8 characters.',
            'password.max' => 'The password may not be greater than 16 characters.',
        ]);

        $existingUser = User::where('email', $data['email'])->first();

        if ($existingUser) {
            if ($existingUser->email_verified_at !== null) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => [
                        'email' => ['Email is already verified. Please login.']
                        ]
                ], 422);
            }
        }

        //check if email ends with @student.laverdad.edu.ph
        if (!str_ends_with($data['email'], config('services.school_domain', env('SCHOOL_DOMAIN')))) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => [
                    'email' => ['Email must be a provided by the school.']
                ]
            ], 422);
        }

        $code = rand(100000, 999999);

        try {
            $user = DB::transaction(function() use($data, $code) {
                $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'full_name' => $data['full_name'],
                    'password' => Hash::make($data['password']),
                    'verification_code' => $code,
                    'role' => 'student',
                ]);

                Student::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'student_number' => 'S' . Str::upper(Str::random(7)),
                ]);

                return $user;
            });

            $gmail = new GmailService();
            $html = "<h2>Email Verification</h2><p>Your code is: <h1>$code</h1>";

            $gmail->sendEmail($user->email, 'Verify Your Email', $html);

            return response()->json([
                'success' => true,
                'message' => 'Registration successful. Check your email for the verification code.',
                'user' => $user
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request) {
        //initialize validator
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        //Check for email existance
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'email' => ['This email address is not registered']
                ]
            ], 404);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
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
            'errors' => [
                'password' => ['The password you entered is incorrect.']
            ]
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
