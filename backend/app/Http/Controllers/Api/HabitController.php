<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index(Request $request)
    {
        $query = Habit::where('user_id', $request->user()->id);

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $habits = $query->orderBy('created_at', 'desc')->get();

        return response()->json($habits);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_days' => 'nullable|integer|min:1',
            'start_date' => 'required|date',
            'is_active' => 'nullable|boolean',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:10',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['current_streak'] = 0;
        $validated['longest_streak'] = 0;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['color'] = $validated['color'] ?? 'blue';
        $validated['icon'] = $validated['icon'] ?? '🔥';

        $habit = Habit::create($validated);

        return response()->json($habit, 201);
    }

    public function show(Request $request, string $id)
    {
        $habit = Habit::where('user_id', $request->user()->id)
            ->with('logs')
            ->findOrFail($id);

        return response()->json($habit);
    }

    public function update(Request $request, string $id)
    {
        $habit = Habit::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'target_days' => 'nullable|integer|min:1',
            'start_date' => 'sometimes|required|date',
            'is_active' => 'nullable|boolean',
            'color' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:10',
            'current_streak' => 'nullable|integer|min:0',
            'longest_streak' => 'nullable|integer|min:0',
        ]);

        $habit->update($validated);

        return response()->json($habit);
    }

    public function destroy(Request $request, string $id)
    {
        $habit = Habit::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $habit->delete();

        return response()->json(['message' => 'Habit deleted successfully']);
    }
}
