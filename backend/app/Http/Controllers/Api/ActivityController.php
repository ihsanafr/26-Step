<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\HabitLog;
use App\Models\Journal;
use App\Models\FinancialTransaction;
use App\Models\Schedule;
use App\Models\TimeTracking;
use App\Models\File;
use App\Models\Note;
use App\Models\Link;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ActivityController extends Controller
{
    /**
     * Get all activities for a specific date
     */
    public function getByDate(Request $request, string $date)
    {
        $user = $request->user();
        $dateObj = Carbon::parse($date)->startOfDay();
        $dateEnd = $dateObj->copy()->endOfDay();

        // Get tasks for the date (due_date or task_date)
        $tasks = Task::where('user_id', $user->id)
            ->where(function ($query) use ($dateObj) {
                $query->whereDate('due_date', $dateObj->toDateString())
                    ->orWhereDate('task_date', $dateObj->toDateString());
            })
            ->with('target')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get habit logs for the date
        $habitLogs = HabitLog::whereHas('habit', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereDate('date', $dateObj->toDateString())
            ->with('habit')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get journals for the date
        $journals = Journal::where('user_id', $user->id)
            ->whereDate('date', $dateObj->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get financial transactions for the date
        $transactions = FinancialTransaction::where('user_id', $user->id)
            ->whereDate('date', $dateObj->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get schedules for the date (check if start_time is on this date)
        $schedules = Schedule::where('user_id', $user->id)
            ->whereDate('start_time', $dateObj->toDateString())
            ->orderBy('start_time', 'asc')
            ->get();

        // Get time tracking for the date
        $timeTrackings = TimeTracking::where('user_id', $user->id)
            ->whereDate('date', $dateObj->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get storage activities for the date (using created_at)
        $files = File::where('user_id', $user->id)
            ->whereDate('created_at', $dateObj->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();

        $notes = Note::where('user_id', $user->id)
            ->whereDate('created_at', $dateObj->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();

        $links = Link::where('user_id', $user->id)
            ->whereDate('created_at', $dateObj->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'date' => $dateObj->toDateString(),
            'tasks' => $tasks,
            'habit_logs' => $habitLogs,
            'journals' => $journals,
            'transactions' => $transactions,
            'schedules' => $schedules,
            'time_trackings' => $timeTrackings,
            'files' => $files,
            'notes' => $notes,
            'links' => $links,
        ]);
    }

    /**
     * Get activities for a date range (for calendar view)
     */
    public function getByDateRange(Request $request)
    {
        $user = $request->user();
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $start = Carbon::parse($startDate)->startOfDay();
        $end = Carbon::parse($endDate)->endOfDay();

        // Get all tasks in date range
        $tasks = Task::where('user_id', $user->id)
            ->where(function ($query) use ($start, $end) {
                $query->where(function ($q) use ($start, $end) {
                    $q->whereNotNull('due_date')
                      ->whereBetween('due_date', [$start, $end]);
                })
                ->orWhere(function ($q) use ($start, $end) {
                    $q->whereNotNull('task_date')
                      ->whereBetween('task_date', [$start, $end]);
                });
            })
            ->get(['id', 'title', 'due_date', 'task_date', 'status']);

        // Get all habit logs in date range
        $habitLogs = HabitLog::whereHas('habit', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->whereBetween('date', [$start, $end])
            ->get(['id', 'habit_id', 'date', 'completed']);

        // Get all journals in date range
        $journals = Journal::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->get(['id', 'title', 'date', 'mood']);

        // Get all financial transactions in date range
        $transactions = FinancialTransaction::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->get(['id', 'type', 'amount', 'category', 'date']);

        // Get all schedules in date range
        $schedules = Schedule::where('user_id', $user->id)
            ->whereBetween('start_time', [$start, $end])
            ->get(['id', 'title', 'start_time', 'end_time']);

        // Get all time trackings in date range
        $timeTrackings = TimeTracking::where('user_id', $user->id)
            ->whereBetween('date', [$start, $end])
            ->get(['id', 'activity', 'date', 'duration_minutes']);

        // Get all storage activities in date range (using created_at)
        $files = File::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->get(['id', 'name', 'created_at']);

        $notes = Note::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->get(['id', 'title', 'created_at']);

        $links = Link::where('user_id', $user->id)
            ->whereBetween('created_at', [$start, $end])
            ->get(['id', 'title', 'created_at']);

        // Group by date
        $activitiesByDate = [];

        // Process tasks
        foreach ($tasks as $task) {
            $date = $task->task_date ?? $task->due_date;
            if ($date) {
                $dateStr = Carbon::parse($date)->toDateString();
                if (!isset($activitiesByDate[$dateStr])) {
                    $activitiesByDate[$dateStr] = [];
                }
                $activitiesByDate[$dateStr]['tasks'] = ($activitiesByDate[$dateStr]['tasks'] ?? 0) + 1;
            }
        }

        // Process habit logs
        foreach ($habitLogs as $log) {
            $dateStr = Carbon::parse($log->date)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['habits'] = ($activitiesByDate[$dateStr]['habits'] ?? 0) + 1;
        }

        // Process journals
        foreach ($journals as $journal) {
            $dateStr = Carbon::parse($journal->date)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['journals'] = ($activitiesByDate[$dateStr]['journals'] ?? 0) + 1;
        }

        // Process transactions
        foreach ($transactions as $transaction) {
            $dateStr = Carbon::parse($transaction->date)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['transactions'] = ($activitiesByDate[$dateStr]['transactions'] ?? 0) + 1;
        }

        // Process schedules
        foreach ($schedules as $schedule) {
            $dateStr = Carbon::parse($schedule->start_time)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['schedules'] = ($activitiesByDate[$dateStr]['schedules'] ?? 0) + 1;
        }

        // Process time trackings
        foreach ($timeTrackings as $tracking) {
            $dateStr = Carbon::parse($tracking->date)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['time_trackings'] = ($activitiesByDate[$dateStr]['time_trackings'] ?? 0) + 1;
        }

        // Process files
        foreach ($files as $file) {
            $dateStr = Carbon::parse($file->created_at)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['files'] = ($activitiesByDate[$dateStr]['files'] ?? 0) + 1;
        }

        // Process notes
        foreach ($notes as $note) {
            $dateStr = Carbon::parse($note->created_at)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['notes'] = ($activitiesByDate[$dateStr]['notes'] ?? 0) + 1;
        }

        // Process links
        foreach ($links as $link) {
            $dateStr = Carbon::parse($link->created_at)->toDateString();
            if (!isset($activitiesByDate[$dateStr])) {
                $activitiesByDate[$dateStr] = [];
            }
            $activitiesByDate[$dateStr]['links'] = ($activitiesByDate[$dateStr]['links'] ?? 0) + 1;
        }

        return response()->json($activitiesByDate);
    }
}
