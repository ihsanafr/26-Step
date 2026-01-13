<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::where('user_id', $request->user()->id);

        if ($request->has('is_completed')) {
            $query->where('is_completed', $request->boolean('is_completed'));
        }

        if ($request->has('date_from')) {
            $query->where('start_time', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('start_time', '<=', $request->date_to);
        }

        $schedules = $query->orderBy('start_time', 'asc')->get();

        return response()->json($schedules);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'is_completed' => 'nullable|boolean',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_completed'] = $validated['is_completed'] ?? false;

        $schedule = Schedule::create($validated);

        return response()->json($schedule, 201);
    }

    public function show(Request $request, string $id)
    {
        $schedule = Schedule::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($schedule);
    }

    public function update(Request $request, string $id)
    {
        $schedule = Schedule::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'is_completed' => 'nullable|boolean',
        ]);

        $schedule->update($validated);

        return response()->json($schedule);
    }

    public function destroy(Request $request, string $id)
    {
        $schedule = Schedule::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully']);
    }
}
