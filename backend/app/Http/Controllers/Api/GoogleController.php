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

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'full_name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => Hash::make(Str::random(16)),                
            ]);

            if ($googleUser->getAvatar()) {
                $avatarUrl = $googleUser->getAvatar();
                $avatarContents = Http::get($avatarUrl)->body();

                // Generate unique filename
                $avatarFilename = 'profile_pictures/' . uniqid('google_') . '.jpg';

                Storage::disk('public')->put($avatarFilename, $avatarContents);

                $user->profile_picture = $avatarFilename;
                $user->save();
            }

            $student = Student::create([
                'user_id' => $user->id,
                'student_number' => 'S' . Str::upper(Str::random(7)),
            ]);

            $user->update(attributes: ['student_id' => $student->id]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        // Redirect to frontend React app with token
        return redirect("{$frontendUrl}/auth/callback?token={$token}");
    }
}
