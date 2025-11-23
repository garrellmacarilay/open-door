<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{

    public function show()
    {
        $user = Auth::user();

        // Only return a storage URL if the file actually exists on the public disk.
        // If the file is missing on the server (common in ephemeral deployments),
        // return null so the frontend will fall back to a generated avatar.
        if ($user->profile_picture && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->profile_picture)) {
            $user->profile_picture_url = asset('storage/' . $user->profile_picture);
        } else {
            $user->profile_picture_url = null;
        }

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request) {
        $user = Auth::user();

        $request->validate([
            'full_name' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->filled('full_name')) {
            $user->full_name = $request->input('full_name');
        }


        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
                Storage::disk('public')->delete($user->profile_picture);
            }
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->profile_picture = $path;
        }

        $user->save();

        $user->profile_picture_url = $user->profile_picture
            ? asset('storage/' . $user->profile_picture)
            : null;

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user->toArray()
        ]);
    }
}
