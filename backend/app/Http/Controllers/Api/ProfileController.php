<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{

    public function show()
    {
        $user = Auth::user();

        $user->profile_picture_url = $user->profile_picture ?? null;

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'full_name' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        // Update full name if provided
        if ($request->filled('full_name')) {
            $user->full_name = $request->input('full_name');
        }

        // Upload profile picture to Cloudinary if provided
        if ($request->hasFile('profile_picture')) {
                // Ensure Cloudinary config is present
                if (empty(config('cloudinary.cloud_url'))) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cloudinary is not configured. Please set CLOUDINARY_URL or CLOUDINARY_KEY/CLOUDINARY_SECRET/CLOUDINARY_CLOUD_NAME in your environment.'
                    ], 500);
                }
            try {
                // Use the Cloudinary PHP SDK's Upload API
                // The SDK returns an array with upload information (including 'secure_url')
                $path = $request->file('profile_picture')->getRealPath();
                $options = [
                    'folder' => 'profile_picture',
                ];

                if ($preset = config('cloudinary.upload_preset')) {
                    $options['upload_preset'] = $preset;
                }

                $uploaded = Cloudinary::uploadApi()->upload($path, $options);

                // The Upload API returns an array; prefer the secure_url when available
                $user->profile_picture = $uploaded['secure_url'] ?? $uploaded['url'] ?? null;
            } catch (\Exception $e) {
                $msg = $e->getMessage();

                // Provide a clearer message for common upload_preset issues
                if (stripos($msg, 'upload preset not found') !== false) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cloudinary upload failed: Upload preset not found. Either create an unsigned upload preset named "'.config('cloudinary.upload_preset').'" in your Cloudinary dashboard, or remove/clear the CLOUDINARY_UPLOAD_PRESET environment variable to use server-side signed uploads.'
                    ], 500);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Cloudinary upload failed: ' . $msg
                ], 500);
            }
        }

        $user->save();

        // Return profile_picture_url as the URL itself
        $user->profile_picture_url = $user->profile_picture ?? null;

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }
}
