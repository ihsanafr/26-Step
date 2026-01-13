<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Link;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    public function index(Request $request)
    {
        $query = Link::where('user_id', $request->user()->id);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('is_favorite')) {
            $query->where('is_favorite', $request->boolean('is_favorite'));
        }

        $links = $query->orderBy('is_favorite', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($links);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url|max:2048',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_favorite' => 'nullable|boolean',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_favorite'] = $validated['is_favorite'] ?? false;

        $link = Link::create($validated);

        return response()->json($link, 201);
    }

    public function show(Request $request, string $id)
    {
        $link = Link::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($link);
    }

    public function update(Request $request, string $id)
    {
        $link = Link::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'url' => 'sometimes|required|url|max:2048',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:255',
            'is_favorite' => 'nullable|boolean',
        ]);

        $link->update($validated);

        return response()->json($link);
    }

    public function destroy(Request $request, string $id)
    {
        $link = Link::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $link->delete();

        return response()->json(['message' => 'Link deleted successfully']);
    }
}
