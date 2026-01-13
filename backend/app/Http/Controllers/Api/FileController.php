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
            'files.*' => 'file|max:10240', // 10MB max per file
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $uploadedFiles = [];

        foreach ($request->file('files') as $uploadedFile) {
            $path = $uploadedFile->store('files/' . $request->user()->id, 'public');
            
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

            $uploadedFiles[] = $file;
        }

        return response()->json($uploadedFiles, 201);
    }

    public function show(Request $request, string $id)
    {
        $file = File::where('user_id', $request->user()->id)
            ->findOrFail($id);

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
}
