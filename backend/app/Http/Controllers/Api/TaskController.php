<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::where('user_id', $request->user()->id)->with('target');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tasks = $query->orderBy('created_at', 'desc')->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:pending,in_progress,completed,todo,on_progress,on_hold,finish',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'target_id' => 'nullable|exists:targets,id',
            'is_recurring' => 'nullable|boolean',
            'recurring_type' => 'nullable|in:daily,weekly,monthly',
            'recurring_end_date' => 'nullable|date|after_or_equal:today',
            'task_date' => 'nullable|date',
        ]);

        // Verify target belongs to user
        if (isset($validated['target_id'])) {
            $target = \App\Models\Target::where('id', $validated['target_id'])
                ->where('user_id', $request->user()->id)
                ->first();
            
            if (!$target) {
                return response()->json(['message' => 'Target not found or does not belong to user'], 404);
            }
        }

        $validated['user_id'] = $request->user()->id;
        
        // Set default values for recurring fields
        $validated['is_recurring'] = $validated['is_recurring'] ?? false;
        
        // If recurring task, validate and set required fields
        if ($validated['is_recurring']) {
            // Require recurring_type if is_recurring is true
            if (empty($validated['recurring_type'])) {
                return response()->json(['message' => 'recurring_type is required when is_recurring is true'], 422);
            }
            
            // Set task_date to today or due_date
            $validated['task_date'] = $validated['task_date'] ?? $validated['due_date'] ?? now()->toDateString();
            if (!$validated['due_date']) {
                $validated['due_date'] = $validated['task_date'];
            }
        } else {
            // Clear recurring fields if not recurring
            $validated['recurring_type'] = null;
            $validated['recurring_end_date'] = null;
        }

        $task = Task::create($validated);

        // Recalculate target values if task has a target
        if ($task->target_id) {
            $target = \App\Models\Target::find($task->target_id);
            if ($target) {
                $target->recalculateValues();
            }
        }

        return response()->json($task, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->with('target')
            ->findOrFail($id);

        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'priority' => 'nullable|in:low,medium,high',
            'status' => 'nullable|in:pending,in_progress,completed,todo,on_progress,on_hold,finish',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
            'target_id' => 'nullable|exists:targets,id',
            'is_recurring' => 'nullable|boolean',
            'recurring_type' => 'nullable|in:daily,weekly,monthly',
            'recurring_end_date' => 'nullable|date',
            'task_date' => 'nullable|date',
        ]);

        // Verify target belongs to user
        if (isset($validated['target_id'])) {
            $target = \App\Models\Target::where('id', $validated['target_id'])
                ->where('user_id', $request->user()->id)
                ->first();
            
            if (!$target) {
                return response()->json(['message' => 'Target not found or does not belong to user'], 404);
            }
        }

        // Store old target_id before update
        $oldTargetId = $task->target_id;

        if (isset($validated['status']) && ($validated['status'] === 'completed' || $validated['status'] === 'finish')) {
            $validated['completed_at'] = now();
        }

        $task->update($validated);
        $task->load('target');

        // Recalculate target values for both old and new target (if changed)
        if ($oldTargetId) {
            $oldTarget = \App\Models\Target::find($oldTargetId);
            if ($oldTarget) {
                $oldTarget->recalculateValues();
            }
        }

        if ($task->target_id && $task->target_id !== $oldTargetId) {
            $newTarget = \App\Models\Target::find($task->target_id);
            if ($newTarget) {
                $newTarget->recalculateValues();
            }
        }

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        // Store target_id before deletion
        $targetId = $task->target_id;

        $task->delete();

        // Recalculate target values after task deletion
        if ($targetId) {
            $target = \App\Models\Target::find($targetId);
            if ($target) {
                $target->recalculateValues();
            }
        }

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
