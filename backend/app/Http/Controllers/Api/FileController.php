<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    public function index(Request $request)
    {
        $query = File::where('user_id', $request->user()->id);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $files = $query->orderBy('created_at', 'desc')->get();

        // Add URL to each file
        $appUrl = config('app.url');
        $files->transform(function ($file) use ($appUrl) {
            $file->url = rtrim($appUrl, '/') . '/storage/' . $file->path;
            return $file;
        });

        return response()->json($files);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'original_name' => 'required|string|max:255',
            'path' => 'required|string',
            'mime_type' => 'required|string|max:255',
            'size' => 'required|integer|min:0',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        $file = File::create($validated);

        return response()->json($file, 201);
    }

    public function upload(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'file|max:102400', // 100MB max per file
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $user = $request->user();
        $currentUsage = File::where('user_id', $user->id)->sum('size');
        $uploadSize = 0;
        foreach ($request->file('files') as $file) {
            $uploadSize += $file->getSize();
        }

        if ($currentUsage + $uploadSize > $user->storage_limit) {
            return response()->json(['message' => 'Storage limit exceeded. Maximum allowable storage is ' . formatBytes($user->storage_limit)], 400);
        }

        $uploadedFiles = [];
        $appUrl = config('app.url');

        foreach ($request->file('files') as $uploadedFile) {
            $path = $uploadedFile->store('files/' . $request->user()->id, 'public');

            // Generate absolute URL
            $absoluteUrl = rtrim($appUrl, '/') . '/storage/' . $path;

            $file = File::create([
                'user_id' => $request->user()->id,
                'name' => pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME),
                'original_name' => $uploadedFile->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $uploadedFile->getMimeType(),
                'size' => $uploadedFile->getSize(),
                'category' => $request->category,
                'description' => $request->description,
            ]);

            // Add URL to response
            $file->url = $absoluteUrl;
            $uploadedFiles[] = $file;
        }

        return response()->json($uploadedFiles, 201);
    }

    public function show(Request $request, string $id)
    {
        $file = File::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Add URL
        $appUrl = config('app.url');
        $file->url = rtrim($appUrl, '/') . '/storage/' . $file->path;

        return response()->json($file);
    }

    public function update(Request $request, string $id)
    {
        $file = File::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $file->update($validated);

        return response()->json($file);
    }

    public function destroy(Request $request, string $id)
    {
        $file = File::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Delete physical file
        if (Storage::disk('public')->exists($file->path)) {
            Storage::disk('public')->delete($file->path);
        }

        $file->delete();

        return response()->json(['message' => 'File deleted successfully']);
    }

    public function download(Request $request, string $id)
    {
        $file = File::where('user_id', $request->user()->id)
            ->findOrFail($id);

        if (!Storage::disk('public')->exists($file->path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $absolutePath = Storage::disk('public')->path($file->path);
        $downloadName = $file->original_name ?: ($file->name ?: basename($file->path));

        return response()->download($absolutePath, $downloadName);
    }
}

function formatBytes($bytes, $precision = 2)
{
    if ($bytes > pow(1024, 3))
        return round($bytes / pow(1024, 3), $precision) . "GB";
    else if ($bytes > pow(1024, 2))
        return round($bytes / pow(1024, 2), $precision) . "MB";
    else if ($bytes > 1024)
        return round($bytes / 1024, $precision) . "KB";
    else
        return ($bytes) . "B";
}
