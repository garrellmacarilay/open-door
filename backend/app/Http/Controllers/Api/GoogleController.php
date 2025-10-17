<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Student;
use Laravel\Socialite\Facades\Socialite;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callback()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();

        // $user = User::firstOrCreate(
        //     ['email' => $googleUser->getEmail()],
        //     [
        //         'student_id' => Student::create()->id,
        //         'name' => $googleUser->getName(),
        //         'google_id' => $googleUser->getId(),
        //         'password' => Hash::make(Str::random(16)),
        //     ]
        // );

        $user = User::where('email', $googleUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'full_name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => Hash::make(Str::random(16)),
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'student_number' => 'S' . Str::upper(Str::random(7)),
            ]);

            $user->update(['student_id' => $student->id]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Redirect to frontend React app with token
        return redirect("http://localhost:5173/auth/callback?token={$token}");
    }
}
