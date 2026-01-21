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
            ->get()
            ->unique('date')
            ->values();

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

        // Calculate longest streak from all logs (need to iterate from oldest to newest)
        // Get logs sorted by date ascending for streak calculation
        $logsAscending = HabitLog::where('habit_id', $habit->id)
            ->where('completed', true)
            ->orderBy('date', 'asc')
            ->get()
            ->unique('date')
            ->values();

        $longestStreak = 0;
        $tempStreak = 0;
        $prevDate = null;

        foreach ($logsAscending as $log) {
            $logDate = Carbon::parse($log->date);
            if ($prevDate !== null && $logDate->isSameDay($prevDate)) {
                continue;
            }
            if ($prevDate === null) {
                $tempStreak = 1;
            } elseif ($logDate->diffInDays($prevDate) === 1) {
                // Consecutive day, continue streak
                $tempStreak++;
            } else {
                // Gap found, save current streak and start new one
                $longestStreak = max($longestStreak, $tempStreak);
                $tempStreak = 1;
            }
            $prevDate = $logDate;
        }
        // Don't forget the last streak
        $longestStreak = max($longestStreak, $tempStreak);

        // Longest streak should be at least equal to current streak
        // (since current streak is part of the longest streak history)
        $longestStreak = max($longestStreak, $currentStreak);
        
        // CRITICAL: Preserve the all-time longest streak if it's higher than calculated
        // This ensures if user had 5 days streak before and broke it, it stays as 5
        // Only update if the newly calculated streak is longer than the stored one
        $finalLongestStreak = max($habit->longest_streak, $longestStreak);

        $habit->update([
            'current_streak' => $currentStreak,
            'longest_streak' => $finalLongestStreak
        ]);
    }
}
