<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JournalNoteCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JournalNoteCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get default categories (user_id = null) and user's custom categories
        $categories = JournalNoteCategory::where(function ($query) use ($user) {
            $query->whereNull('user_id')
                  ->orWhere('user_id', $user->id);
        })
        ->orderBy('is_default', 'desc')
        ->orderBy('name', 'asc')
        ->get();

        return response()->json($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = JournalNoteCategory::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'color' => $request->color,
            'icon' => $request->icon,
            'is_default' => false,
        ]);

        return response()->json($category, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = JournalNoteCategory::findOrFail($id);
        
        // Check if user can access this category (default or own)
        if ($category->user_id !== null && $category->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = JournalNoteCategory::findOrFail($id);
        
        // Only allow updating user's own categories, not default ones
        if ($category->user_id !== auth()->id()) {
            return response()->json(['message' => 'Cannot update default categories'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->update($request->only(['name', 'color', 'icon']));

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $category = JournalNoteCategory::findOrFail($id);
        
        // Only allow deleting user's own categories, not default ones
        if ($category->user_id !== auth()->id()) {
            return response()->json(['message' => 'Cannot delete default categories'], 403);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted successfully']);
    }
}
