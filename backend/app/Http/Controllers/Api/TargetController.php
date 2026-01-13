<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Target;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class TargetController extends Controller
{
    public function index(Request $request)
    {
        $query = Target::where('user_id', $request->user()->id)->withCount([
            'tasks as total_tasks',
            'tasks as completed_tasks' => function ($query) {
                $query->where('status', 'finish');
            }
        ]);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Simple ordering - use created_at first, then try order if column exists
        $targets = $query->orderBy('created_at', 'desc')->get();
        
        // If order column exists, sort by it
        try {
            if (Schema::hasColumn('targets', 'order')) {
                $targets = $targets->sortBy(function($target) {
                    return $target->order ?? 999999;
                })->values();
            }
        } catch (\Exception $e) {
            // Ignore if order column doesn't exist
        }

        // Calculate values from tasks
        $targets->transform(function ($target) {
            $target->target_value = $target->total_tasks ?? 0;
            $target->current_value = $target->completed_tasks ?? 0;
            return $target;
        });

        return response()->json($targets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'period' => 'required|in:daily,weekly,monthly,yearly',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:active,completed,paused',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = $validated['status'] ?? 'active';
        // Set default values (will be calculated from tasks)
        $validated['target_value'] = 0;
        $validated['current_value'] = 0;
        
        // Set order for new target (max order + 1)
        try {
            $maxOrder = Target::where('user_id', $request->user()->id)->max('order') ?? 0;
            $validated['order'] = $maxOrder + 1;
        } catch (\Exception $e) {
            // If order column doesn't exist, ignore
        }

        $target = Target::create($validated);
        
        // Load task counts and calculate values
        $target->loadCount([
            'tasks as total_tasks',
            'tasks as completed_tasks' => function ($query) {
                $query->where('status', 'finish');
            }
        ]);
        
        $target->target_value = $target->total_tasks ?? 0;
        $target->current_value = $target->completed_tasks ?? 0;

        return response()->json($target, 201);
    }

    public function show(Request $request, string $id)
    {
        $target = Target::where('user_id', $request->user()->id)
            ->withCount([
                'tasks as total_tasks',
                'tasks as completed_tasks' => function ($query) {
                    $query->where('status', 'finish');
                }
            ])
            ->findOrFail($id);

        // Calculate values from tasks
        $target->target_value = $target->total_tasks ?? 0;
        $target->current_value = $target->completed_tasks ?? 0;

        return response()->json($target);
    }

    public function update(Request $request, string $id)
    {
        $target = Target::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'period' => 'sometimes|required|in:daily,weekly,monthly,yearly',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:active,completed,paused',
            'order' => 'nullable|integer',
        ]);

        $target->update($validated);

        // Recalculate values from tasks after update
        $target->loadCount([
            'tasks as total_tasks',
            'tasks as completed_tasks' => function ($query) {
                $query->where('status', 'finish');
            }
        ]);

        $target->target_value = $target->total_tasks ?? 0;
        $target->current_value = $target->completed_tasks ?? 0;

        // Auto-update status based on progress
        if ($target->target_value > 0 && $target->current_value >= $target->target_value) {
            $target->status = 'completed';
            $target->save();
        } elseif ($target->status === 'completed' && $target->current_value < $target->target_value) {
            $target->status = 'active';
            $target->save();
        }

        return response()->json($target);
    }

    public function destroy(Request $request, string $id)
    {
        $target = Target::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $target->delete();

        return response()->json(['message' => 'Target deleted successfully']);
    }
}
