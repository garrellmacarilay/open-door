<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Log;
class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $email = $googleUser->getEmail();

            // 1. Determine Role based on .env
            $adminEmail = env('ADMIN_EMAIL');
            // Explode converts the comma-separated string into an array, trim removes spaces
            $staffEmails = array_map('trim', explode(',', env('STAFF_EMAILS', '')));

            $role = 'student'; // Default role

            if ($email === $adminEmail) {
                $role = 'admin';
            } elseif (in_array($email, $staffEmails)) {
                $role = 'staff';
            }

            // 2. Find or Create User
            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'full_name' => $googleUser->getName(),
                    'email'     => $email,
                    'google_id' => $googleUser->getId(),
                    'password'  => Hash::make(Str::random(16)),
                    'role'      => $role, // Save the role we determined above
                ]);

                // Handle Avatar (Only do this once on creation)
                if ($googleUser->getAvatar()) {
                    $avatarUrl = $googleUser->getAvatar();
                    // Use try-catch for external HTTP requests to prevent crash if Google fails
                    try {
                        $avatarContents = Http::get($avatarUrl)->body();
                        $avatarFilename = 'avatars/profile_pictures/' . uniqid('google_') . '.jpg';
                        Storage::disk('public')->put($avatarFilename, $avatarContents);
                        Storage::disk('public')->setVisibility($avatarFilename, 'public');

                        $user->profile_picture = $avatarFilename;
                        $user->save();
                    } catch (\Exception $e) {
                        // Log error but allow login to proceed without avatar
                        Log::error("Failed to download avatar: " . $e->getMessage());
                    }
                }

                // 3. Conditional Student Record Creation
                // ONLY create a student record if the role is 'student'
                if ($role === 'student') {
                    $student = Student::create([
                        'user_id'        => $user->id,
                        'student_number' => 'S' . Str::upper(Str::random(7)),
                    ]);

                    $user->update(['student_id' => $student->id]);
                }
            } else {
                // Optional: If user exists, force update their role based on .env
                // This ensures if you add a student to the staff list later, they get promoted on next login
                if ($user->role !== $role) {
                    $user->update(['role' => $role]);
                }
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

            // Pass the role to the frontend so you can redirect them to /admin or /dashboard
            return redirect("{$frontendUrl}/?token={$token}&role={$user->role}");

        } catch (\Exception $e) {
            return response()->json(['error' => 'Login Failed: ' . $e->getMessage()], 500);
        }
    }
}
