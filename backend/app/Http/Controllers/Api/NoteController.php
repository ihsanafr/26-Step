<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Note::where('user_id', $request->user()->id);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('is_pinned')) {
            $query->where('is_pinned', $request->boolean('is_pinned'));
        }

        $notes = $query->with('category')
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:journal_note_categories,id',
            'color' => 'nullable|string|max:7',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_pinned' => 'nullable|boolean',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_pinned'] = $validated['is_pinned'] ?? false;

        $note = Note::create($validated);
        $note->load('category');

        return response()->json($note, 201);
    }

    public function show(Request $request, string $id)
    {
        $note = Note::where('user_id', $request->user()->id)
            ->with('category')
            ->findOrFail($id);

        return response()->json($note);
    }

    public function update(Request $request, string $id)
    {
        $note = Note::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'category' => 'nullable|string|max:255',
            'category_id' => 'nullable|exists:journal_note_categories,id',
            'color' => 'nullable|string|max:7',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_pinned' => 'nullable|boolean',
        ]);

        $note->update($validated);
        $note->load('category');

        return response()->json($note);
    }

    public function destroy(Request $request, string $id)
    {
        $note = Note::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }
}
