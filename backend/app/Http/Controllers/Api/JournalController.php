<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Journal;
use Illuminate\Http\Request;

class JournalController extends Controller
{
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
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_private'] = $validated['is_private'] ?? false;
        $validated['date'] = $validated['date'] ?? now()->toDateString();

        $journal = Journal::create($validated);

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
        ]);

        $journal->update($validated);

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

