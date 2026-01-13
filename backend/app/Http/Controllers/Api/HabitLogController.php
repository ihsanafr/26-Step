<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HabitLogController extends Controller
{
    public function index(Request $request, string $habit)
    {
        $habitModel = Habit::where('user_id', $request->user()->id)
            ->findOrFail($habit);

        $query = HabitLog::where('habit_id', $habitModel->id);

        if ($request->has('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        $logs = $query->orderBy('date', 'desc')->get();

        return response()->json($logs);
    }

    public function store(Request $request, string $habit)
    {
        $habitModel = Habit::where('user_id', $request->user()->id)
            ->findOrFail($habit);

        $validated = $request->validate([
            'date' => 'required|date',
            'completed' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $validated['habit_id'] = $habitModel->id;
        $validated['completed'] = $validated['completed'] ?? true;

        // Check if log already exists for this date
        $existingLog = HabitLog::where('habit_id', $habitModel->id)
            ->where('date', $validated['date'])
            ->first();

        if ($existingLog) {
            $existingLog->update($validated);
            $log = $existingLog;
        } else {
            $log = HabitLog::create($validated);
        }

        // Update streak
        $this->updateStreak($habitModel);

        return response()->json($log, 201);
    }

    public function show(Request $request, string $habit, string $log)
    {
        $habitModel = Habit::where('user_id', $request->user()->id)
            ->findOrFail($habit);

        $log = HabitLog::where('habit_id', $habitModel->id)
            ->findOrFail($log);

        return response()->json($log);
    }

    public function update(Request $request, string $habit, string $log)
    {
        $habitModel = Habit::where('user_id', $request->user()->id)
            ->findOrFail($habit);

        $log = HabitLog::where('habit_id', $habitModel->id)
            ->findOrFail($log);

        $validated = $request->validate([
            'date' => 'sometimes|required|date',
            'completed' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $log->update($validated);

        // Update streak
        $this->updateStreak($habitModel);

        return response()->json($log);
    }

    public function destroy(Request $request, string $habit, string $log)
    {
        $habitModel = Habit::where('user_id', $request->user()->id)
            ->findOrFail($habit);

        $log = HabitLog::where('habit_id', $habitModel->id)
            ->findOrFail($log);

        $log->delete();

        // Update streak
        $this->updateStreak($habitModel);

        return response()->json(['message' => 'Habit log deleted successfully']);
    }

    private function updateStreak(Habit $habit)
    {
        $logs = HabitLog::where('habit_id', $habit->id)
            ->where('completed', true)
            ->orderBy('date', 'desc')
            ->get();

        if ($logs->isEmpty()) {
            $habit->update([
                'current_streak' => 0,
                'longest_streak' => max($habit->longest_streak, 0)
            ]);
            return;
        }

        // Calculate current streak (consecutive days from today backwards)
        $currentStreak = 0;
        $today = Carbon::today();
        $checkDate = $today->copy();

        foreach ($logs as $log) {
            $logDate = Carbon::parse($log->date);
            if ($logDate->isSameDay($checkDate)) {
                $currentStreak++;
                $checkDate->subDay();
            } elseif ($logDate->isBefore($checkDate)) {
                break;
            }
        }

        // Calculate longest streak
        $longestStreak = 0;
        $tempStreak = 0;
        $prevDate = null;

        foreach ($logs as $log) {
            $logDate = Carbon::parse($log->date);
            if ($prevDate === null) {
                $tempStreak = 1;
            } elseif ($logDate->diffInDays($prevDate) === 1) {
                $tempStreak++;
            } else {
                $longestStreak = max($longestStreak, $tempStreak);
                $tempStreak = 1;
            }
            $prevDate = $logDate;
        }
        $longestStreak = max($longestStreak, $tempStreak);

        $habit->update([
            'current_streak' => $currentStreak,
            'longest_streak' => max($habit->longest_streak, $longestStreak)
        ]);
    }
}
