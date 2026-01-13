<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TimeTracking;
use Illuminate\Http\Request;

class TimeTrackingController extends Controller
{
    public function index(Request $request)
    {
        $query = TimeTracking::where('user_id', $request->user()->id);

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $trackings = $query->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($trackings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'activity' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'duration_minutes' => 'required|integer|min:1',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $validated['user_id'] = $request->user()->id;

        $tracking = TimeTracking::create($validated);

        return response()->json($tracking, 201);
    }

    public function show(Request $request, string $id)
    {
        $tracking = TimeTracking::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($tracking);
    }

    public function update(Request $request, string $id)
    {
        $tracking = TimeTracking::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'activity' => 'sometimes|required|string|max:255',
            'category' => 'nullable|string|max:255',
            'duration_minutes' => 'sometimes|required|integer|min:1',
            'date' => 'sometimes|required|date',
            'description' => 'nullable|string',
        ]);

        $tracking->update($validated);

        return response()->json($tracking);
    }

    public function destroy(Request $request, string $id)
    {
        $tracking = TimeTracking::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $tracking->delete();

        return response()->json(['message' => 'Time tracking deleted successfully']);
    }
}
