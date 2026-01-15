<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JournalController extends Controller
{
    public function uploadCover(Request $request)
    {
        try {
            \Log::info('🔵 [JournalController] Cover upload request', [
                'has_file' => $request->hasFile('cover'),
                'all_files' => array_keys($request->allFiles()),
                'content_type' => $request->header('Content-Type'),
            ]);

            // More flexible validation - accept any image type
        $request->validate([
                'cover' => 'required|image|max:5120', // 5MB, accept any image type
            ], [
                'cover.required' => 'Please select an image file',
                'cover.image' => 'The file must be an image',
                'cover.max' => 'Image size must be less than 5MB',
        ]);

        $file = $request->file('cover');
            if (!$file || !$file->isValid()) {
                \Log::error('❌ [JournalController] Invalid cover file', [
                    'file' => $file ? 'exists' : 'null',
                    'isValid' => $file ? $file->isValid() : false,
                ]);
                return response()->json([
                    'message' => 'Invalid file uploaded. Please ensure the file is a valid image.',
                    'errors' => ['cover' => ['The uploaded file is not valid']]
                ], 422);
            }

            \Log::info('🟢 [JournalController] Cover file validated', [
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);

        $path = $file->store('journals/' . $request->user()->id . '/covers', 'public');

            // Generate URL - construct from APP_URL + /storage + path
            $appUrl = config('app.url');
            // Always use /storage as the base path
            $absoluteUrl = rtrim($appUrl, '/') . '/storage/' . $path;

        \Log::info('🟢 [JournalController] Cover uploaded', [
            'path' => $path,
            'absoluteUrl' => $absoluteUrl,
                'appUrl' => $appUrl,
        ]);

        return response()->json([
            'path' => $path,
            'url' => $absoluteUrl,
        ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ [JournalController] Cover validation failed', [
                'errors' => $e->errors(),
                'request_data' => [
                    'has_file' => $request->hasFile('cover'),
                    'file_keys' => array_keys($request->allFiles()),
                ],
            ]);
            return response()->json([
                'message' => 'Validation failed: ' . implode(', ', array_map(function($errors) {
                    return implode(', ', $errors);
                }, $e->errors())),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('❌ [JournalController] Cover upload error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Failed to upload cover image: ' . $e->getMessage()
            ], 500);
        }
    }

    public function uploadContentImage(Request $request)
    {
        try {
            \Log::info('🔵 [JournalController] Content image upload request', [
                'has_file' => $request->hasFile('image'),
                'all_files' => array_keys($request->allFiles()),
                'content_type' => $request->header('Content-Type'),
            ]);

            // More flexible validation - accept any image type
        $request->validate([
                'image' => 'required|image|max:5120', // 5MB, accept any image type
            ], [
                'image.required' => 'Please select an image file',
                'image.image' => 'The file must be an image',
                'image.max' => 'Image size must be less than 5MB',
        ]);

        $file = $request->file('image');
            if (!$file || !$file->isValid()) {
                \Log::error('❌ [JournalController] Invalid file', [
                    'file' => $file ? 'exists' : 'null',
                    'isValid' => $file ? $file->isValid() : false,
                ]);
                return response()->json([
                    'message' => 'Invalid file uploaded. Please ensure the file is a valid image.',
                    'errors' => ['image' => ['The uploaded file is not valid']]
                ], 422);
            }

            \Log::info('🟢 [JournalController] File validated', [
                'name' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ]);

        $path = $file->store('journals/' . $request->user()->id . '/content', 'public');

            // Generate URL - construct from APP_URL + /storage + path
            $appUrl = config('app.url');
            // Always use /storage as the base path
            $absoluteUrl = rtrim($appUrl, '/') . '/storage/' . $path;

        \Log::info('🟢 [JournalController] Content image uploaded', [
            'path' => $path,
            'absoluteUrl' => $absoluteUrl,
                'appUrl' => $appUrl,
        ]);

        return response()->json([
            'path' => $path,
            'url' => $absoluteUrl,
        ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('❌ [JournalController] Content image validation failed', [
                'errors' => $e->errors(),
                'request_data' => [
                    'has_file' => $request->hasFile('image'),
                    'file_keys' => array_keys($request->allFiles()),
                ],
            ]);
            return response()->json([
                'message' => 'Validation failed: ' . implode(', ', array_map(function($errors) {
                    return implode(', ', $errors);
                }, $e->errors())),
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('❌ [JournalController] Content image upload error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'message' => 'Failed to upload image: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = Journal::where('user_id', $request->user()->id);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('mood')) {
            $query->where('mood', $request->mood);
        }

        if ($request->has('is_private')) {
            $query->where('is_private', $request->boolean('is_private'));
        }

        if ($request->has('month')) {
            $query->whereMonth('date', $request->month);
        }

        if ($request->has('year')) {
            $query->whereYear('date', $request->year);
        }

        $journals = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($journals);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'date' => 'required|date',
            'mood' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_private' => 'nullable|boolean',
            'weather' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'cover_image' => 'nullable|string|max:500', // Allow full URL
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_private'] = $validated['is_private'] ?? false;
        $validated['date'] = $validated['date'] ?? now()->toDateString();

        \Log::info('🔵 [JournalController] Creating journal', [
            'cover_image' => $validated['cover_image'] ?? null,
            'cover_image_length' => isset($validated['cover_image']) ? strlen($validated['cover_image']) : 0,
        ]);

        $journal = Journal::create($validated);

        \Log::info('🟢 [JournalController] Journal created', [
            'id' => $journal->id,
            'cover_image' => $journal->cover_image,
        ]);

        return response()->json($journal, 201);
    }

    public function show(Request $request, string $id)
    {
        $journal = Journal::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($journal);
    }

    public function update(Request $request, string $id)
    {
        $journal = Journal::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'mood' => 'nullable|string|max:50',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_private' => 'nullable|boolean',
            'weather' => 'nullable|string|max:100',
            'location' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:7',
            'cover_image' => 'nullable|string|max:500', // Allow full URL
        ]);

        \Log::info('🔵 [JournalController] Updating journal', [
            'id' => $id,
            'cover_image' => $validated['cover_image'] ?? null,
            'cover_image_length' => isset($validated['cover_image']) ? strlen($validated['cover_image']) : 0,
        ]);

        $journal->update($validated);

        \Log::info('🟢 [JournalController] Journal updated', [
            'id' => $journal->id,
            'cover_image' => $journal->cover_image,
        ]);

        return response()->json($journal);
    }

    public function destroy(Request $request, string $id)
    {
        $journal = Journal::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $journal->delete();

        return response()->json(['message' => 'Journal entry deleted successfully']);
    }
}

