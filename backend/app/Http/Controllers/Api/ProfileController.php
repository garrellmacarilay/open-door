<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{

    public function show()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $user->profile_picture_url = $user->profile_picture ?? null;

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request) {
    // Log for debugging (fixed syntax)
        Log::info('Profile Update Attempt:', ['user_id' => Auth::id(), 'data' => $request->except('password')]);

        $user = Auth::user();

        $validated = $request->validate([
            'full_name' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // 1. Update Basic Info (Fillable)
        if ($request->filled('full_name')) {
            $user->full_name = $validated['full_name'];
        }

        // 2. Update Password
        if ($request->filled('password')) {
            $isGoogleOnlyAccount = $user->google_id && !$user->has_set_password;

            if (!$isGoogleOnlyAccount) {
                if (!$request->filled('currPassword')) {
                    return response()->json([
                        'success' => false,
                        'errors' => ['currPassword' => ['Current password is required.']]
                    ], 422);
                }
                if (!Hash::check($request->currPassword, $user->password)) {
                   return response()->json([
                        'success' => false,
                        'errors'  => ['currPassword' => ['Current password is incorrect.']]
                    ], 422);
                }
            }
            $user->password = Hash::make($validated['password']);
            $user->has_set_password = true;
        }

        // 3. Handle Cloudinary Upload
        if ($request->hasFile('profile_picture')) {
            try {
                // Validate Cloudinary Config before trying
                if (empty(config('cloudinary.cloud_url'))) {
                    throw new \Exception('Cloudinary is not configured in .env');
                }

                $options = [
                    'folder' => 'profile_picture',
                    'upload_preset' => config('cloudinary.upload_preset'),
                ];

                // Use the file object directly; Cloudinary SDK handles getRealPath()
                $uploaded = Cloudinary::uploadApi()->upload($request->file('profile_picture')->getRealPath(), array_filter($options));

                $user->profile_picture = $uploaded['secure_url'] ?? $uploaded['url'];

            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image upload failed: ' . $e->getMessage()
                ], 500);
            }
        }

        // 4. Final Save
        $user->save();

        // Attach virtual attribute for frontend consistency
        $user->profile_picture_url = $user->profile_picture;

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
