<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserSession;
use App\Mail\VerifyEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:2|max:255|regex:/^[a-zA-Z\s\'-]+$/',
            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:users',
                'regex:/^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/',
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/', // At least one lowercase, one uppercase, one number
            ],
        ], [
            'name.regex' => 'Name can only contain letters, spaces, hyphens, and apostrophes.',
            'email.email' => 'Please enter a valid email address.',
            'email.regex' => 'Please enter a valid email address format.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        ]);

        // Generate verification code (6 digits)
        $verificationCode = str_pad((string)rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $verificationToken = Str::random(64);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'verification_code' => $verificationCode,
            'verification_token' => $verificationToken,
            'verification_code_expires_at' => now()->addHours(24),
        ]);

        // Generate verification link
        $verificationLink = url('/api/verify-email?token=' . $verificationToken . '&email=' . urlencode($user->email));

        // Send verification email
        try {
            Mail::to($user->email)->send(new VerifyEmail($user, $verificationCode, $verificationLink));
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
            // Continue even if email fails - user can request resend
        }

        $user->avatar_url = $user->avatar ? url($user->avatar) : null;

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => $user,
            'email_verified' => false,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => [
                'required',
                'email:rfc,dns',
                'regex:/^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/',
            ],
            'password' => 'required',
        ], [
            'email.email' => 'Please enter a valid email address.',
            'email.regex' => 'Please enter a valid email address format.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Please verify your email address before logging in.',
                'email_verified' => false,
                'user_id' => $user->id,
            ], 403);
        }

        $token = $user->createToken('auth_token');
        $tokenId = $token->accessToken->id;
        $plainTextToken = $token->plainTextToken;

        // Store session without location data
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();

        UserSession::updateOrCreate(
            ['token_id' => (string)$tokenId, 'user_id' => $user->id],
            [
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'location' => null,
                'latitude' => null,
                'longitude' => null,
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

    /**
     * Verify email using token or code
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'token' => 'nullable|string',
            'code' => 'nullable|string|size:6',
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.',
                'email_verified' => true,
            ], 200);
        }

        // Verify using token
        if ($request->token) {
            if ($user->verification_token !== $request->token) {
                return response()->json([
                    'message' => 'Invalid verification token.',
                ], 400);
            }

            $user->email_verified_at = now();
            $user->verification_token = null;
            $user->verification_code = null;
            $user->verification_code_expires_at = null;
            $user->save();

            return response()->json([
                'message' => 'Email verified successfully.',
                'email_verified' => true,
            ], 200);
        }

        // Verify using code
        if ($request->code) {
            if ($user->verification_code !== $request->code) {
                return response()->json([
                    'message' => 'Invalid verification code.',
                ], 400);
            }

            if ($user->verification_code_expires_at && $user->verification_code_expires_at->isPast()) {
                return response()->json([
                    'message' => 'Verification code has expired. Please request a new one.',
                ], 400);
            }

            $user->email_verified_at = now();
            $user->verification_token = null;
            $user->verification_code = null;
            $user->verification_code_expires_at = null;
            $user->save();

            return response()->json([
                'message' => 'Email verified successfully.',
                'email_verified' => true,
            ], 200);
        }

        return response()->json([
            'message' => 'Please provide either a verification token or code.',
        ], 400);
    }

    /**
     * Resend verification email
     */
    public function resendVerificationEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found.',
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified.',
                'email_verified' => true,
            ], 200);
        }

        // Generate new verification code and token
        $verificationCode = str_pad((string)rand(0, 999999), 6, '0', STR_PAD_LEFT);
        $verificationToken = Str::random(64);

        $user->verification_code = $verificationCode;
        $user->verification_token = $verificationToken;
        $user->verification_code_expires_at = now()->addHours(24);
        $user->save();

        // Generate verification link
        $verificationLink = url('/api/verify-email?token=' . $verificationToken . '&email=' . urlencode($user->email));

        // Send verification email
        try {
            Mail::to($user->email)->send(new VerifyEmail($user, $verificationCode, $verificationLink));
            
            return response()->json([
                'message' => 'Verification email sent successfully. Please check your inbox.',
            ], 200);
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to send verification email. Please try again later.',
            ], 500);
        }
    }
}
