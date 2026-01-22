<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->avatar_url = $user->avatar ? url($user->avatar) : null;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token');
        $tokenId = $token->accessToken->id;
        $plainTextToken = $token->plainTextToken;

        // Store session with location
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        
        // Get location (simplified - can use IP geolocation service)
        $locationData = $this->getLocationFromIp($ipAddress);

        UserSession::updateOrCreate(
            ['token_id' => (string)$tokenId, 'user_id' => $user->id],
            [
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'location' => $locationData['location'],
                'latitude' => $locationData['latitude'],
                'longitude' => $locationData['longitude'],
                'last_activity' => now(),
            ]
        );

        $user->avatar_url = $user->avatar ? url($user->avatar) : null;

        return response()->json([
            'user' => $user,
            'token' => $plainTextToken,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $tokenId = $request->user()->currentAccessToken()->id;
        $request->user()->currentAccessToken()->delete();
        
        // Delete session record
        UserSession::where('token_id', $tokenId)->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get location from IP address (simplified)
     */
    private function getLocationFromIp($ipAddress)
    {
        // For local/private IPs
        if ($ipAddress === '127.0.0.1' || $ipAddress === '::1' || str_starts_with($ipAddress, '192.168.') || str_starts_with($ipAddress, '10.')) {
            return [
                'location' => 'Local',
                'latitude' => null,
                'longitude' => null,
            ];
        }

        try {
            // Using ip-api.com free service (no API key needed)
            $response = @file_get_contents("http://ip-api.com/json/{$ipAddress}?fields=status,country,city,lat,lon");
            if ($response) {
                $data = json_decode($response, true);
                if ($data && $data['status'] === 'success') {
                    $city = $data['city'] ?? '';
                    $country = $data['country'] ?? '';
                    $location = $city ? "{$city}, {$country}" : $country;
                    return [
                        'location' => $location,
                        'latitude' => $data['lat'] ?? null,
                        'longitude' => $data['lon'] ?? null,
                    ];
                }
            }
        } catch (\Exception $e) {
            // Fallback
        }

        return [
            'location' => 'Unknown',
            'latitude' => null,
            'longitude' => null,
        ];
    }

    public function user(Request $request)
    {
        $user = $request->user();
        $user->avatar_url = $user->avatar ? url($user->avatar) : null;

        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        // Update name if provided
        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        // Update password if provided
        if (isset($validated['password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'message' => 'Current password is incorrect'
                ], 422);
            }
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    public function updateAvatar(Request $request)
    {
        try {
            $user = $request->user();
            
            // Debug: Log request data
            \Log::info('🔵 [AuthController] Avatar upload request', [
                'has_file' => $request->hasFile('avatar'),
                'all_files' => array_keys($request->allFiles()),
                'content_type' => $request->header('Content-Type'),
                'request_method' => $request->method(),
            ]);

            // Allow any file field (fallback to first file if "avatar" is missing)
            $fileKey = 'avatar';
            $file = $request->file($fileKey);
            if (!$file) {
                $allFiles = $request->allFiles();
                $firstKey = array_key_first($allFiles);
                if ($firstKey) {
                    $fileKey = $firstKey;
                    $file = $request->file($fileKey);
                }
            }

            if (!$file) {
                return response()->json([
                    'message' => 'No file uploaded',
                    'error' => 'The avatar field is required.'
                ], 422);
            }

            // More flexible validation - accept any image type (like JournalController)
            $validator = Validator::make([$fileKey => $file], [
                $fileKey => 'required|image|max:5120', // 5MB, accept any image type
            ], [
                $fileKey . '.required' => 'Please select an image file to upload.',
                $fileKey . '.image' => 'The file must be an image.',
                $fileKey . '.max' => 'The image may not be greater than 5MB.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }
            
            if (!$file->isValid()) {
                \Log::error('❌ [AuthController] Invalid avatar file', [
                    'file' => $file ? 'exists' : 'null',
                    'isValid' => $file ? $file->isValid() : false,
                ]);
                return response()->json([
                    'message' => 'Invalid file uploaded. Please ensure the file is a valid image.',
                    'error' => 'The uploaded file is not valid.',
                    'errors' => ['avatar' => ['The uploaded file is not valid']]
                ], 422);
            }

            \Log::info('🟢 [AuthController] Avatar file validated', [
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);
            
            // Generate unique filename
            $filename = time() . '_' . $user->id . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Store file
            $path = $file->storeAs('avatars', $filename, 'public');
            
            if (!$path) {
                return response()->json([
                    'message' => 'Failed to store file',
                    'error' => 'Could not save the uploaded file.'
                ], 500);
            }
            
            // Delete old avatar if exists
            if ($user->avatar) {
                $oldPath = str_replace('/storage/', '', $user->avatar);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
            
            // Store relative path (will be served via storage link)
            $user->avatar = '/storage/' . $path;
            $user->save();
            
            // Return full URL for the avatar
            $avatarUrl = url('/storage/' . $path);

            \Log::info('🟢 [AuthController] Avatar uploaded successfully', [
                'path' => $path,
                'avatar_url' => $avatarUrl,
            ]);

            return response()->json([
                'message' => 'Avatar updated successfully',
                'user' => $user,
                'avatar_url' => $avatarUrl
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ [AuthController] Avatar validation failed', [
                'errors' => $e->errors(),
                'request_data' => [
                    'has_file' => $request->hasFile('avatar'),
                    'file_keys' => array_keys($request->allFiles()),
                ],
            ]);
            return response()->json([
                'message' => 'Validation failed: ' . implode(', ', array_map(function($errors) {
                    return implode(', ', $errors);
                }, $e->errors())),
                'error' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('❌ [AuthController] Avatar upload error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Failed to upload avatar: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
