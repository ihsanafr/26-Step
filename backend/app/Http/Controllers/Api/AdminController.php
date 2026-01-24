<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Task;
use App\Models\Target;
use App\Models\Habit;
use App\Models\FinancialTransaction;
use App\Models\Budget;
use App\Models\Journal;
use App\Models\Note;
use App\Models\File;
use App\Models\Link;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function dashboard()
    {
        $stats = [
            'users' => [
                'total' => User::where('is_admin', false)->count(),
                'new_today' => User::where('is_admin', false)
                    ->whereDate('created_at', today())
                    ->count(),
                'new_this_week' => User::where('is_admin', false)
                    ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                    ->count(),
                'new_this_month' => User::where('is_admin', false)
                    ->whereMonth('created_at', Carbon::now()->month)
                    ->whereYear('created_at', Carbon::now()->year)
                    ->count(),
            ],
            'tasks' => [
                'total' => Task::count(),
                'completed' => Task::whereIn('status', ['completed', 'finish'])->count(),
                'in_progress' => Task::whereIn('status', ['in_progress', 'on_progress'])->count(),
                'pending' => Task::whereIn('status', ['pending', 'todo'])->count(),
            ],
            'targets' => [
                'total' => Target::count(),
                'active' => Target::where('status', 'active')->count(),
                'completed' => Target::where('status', 'completed')->count(),
            ],
            'habits' => [
                'total' => Habit::count(),
                'active' => Habit::where('is_active', true)->count(),
            ],
            'transactions' => [
                'total' => FinancialTransaction::count(),
                'income' => FinancialTransaction::where('type', 'income')->sum('amount'),
                'expense' => FinancialTransaction::where('type', 'expense')->sum('amount'),
            ],
            'budgets' => Budget::count(),
            'journals' => Journal::count(),
            'notes' => Note::count(),
            'files' => File::count(),
            'links' => Link::count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get all users with statistics
     */
    public function users(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $search = $request->get('search', '');

        // Show all users (including admins) for admin dashboard
        $query = User::withCount([
            'tasks as tasks_count',
            'tasks as completed_tasks_count' => function ($q) {
                $q->whereIn('status', ['completed', 'finish']);
            },
            'habits as habits_count',
            'journals as journals_count',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json($users);
    }

    /**
     * Get user details with all activities
     */
    public function userDetails($id)
    {
        $user = User::where('is_admin', false)->with([
            'tasks' => function ($q) {
                $q->latest()->limit(10);
            },
            'habits' => function ($q) {
                $q->latest()->limit(10);
            },
            'journals' => function ($q) {
                $q->latest()->limit(10);
            },
        ])->findOrFail($id);

        $stats = [
            'tasks_total' => Task::where('user_id', $id)->count(),
            'tasks_completed' => Task::where('user_id', $id)->whereIn('status', ['completed', 'finish'])->count(),
            'targets_total' => Target::where('user_id', $id)->count(),
            'habits_total' => Habit::where('user_id', $id)->count(),
            'habits_active' => Habit::where('user_id', $id)->where('is_active', true)->count(),
            'transactions_total' => FinancialTransaction::where('user_id', $id)->count(),
            'journals_total' => Journal::where('user_id', $id)->count(),
            'notes_total' => Note::where('user_id', $id)->count(),
            'files_total' => File::where('user_id', $id)->count(),
            'links_total' => Link::where('user_id', $id)->count(),
        ];

        return response()->json([
            'user' => $user,
            'stats' => $stats,
        ]);
    }

    /**
     * Get analytics data
     */
    public function analytics()
    {
        // User registration over time (last 30 days)
        $userRegistrations = User::where('is_admin', false)
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Tasks created over time (last 30 days)
        $tasksCreated = Task::where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Module usage statistics
        $moduleUsage = [
            'tasks' => Task::distinct('user_id')->count('user_id'),
            'targets' => Target::distinct('user_id')->count('user_id'),
            'habits' => Habit::distinct('user_id')->count('user_id'),
            'journals' => Journal::distinct('user_id')->count('user_id'),
            'finance' => FinancialTransaction::distinct('user_id')->count('user_id'),
            'files' => File::distinct('user_id')->count('user_id'),
        ];

        // Top active users (by task completion)
        $topUsers = User::where('is_admin', false)
            ->withCount([
                'tasks as completed_tasks' => function ($q) {
                    $q->whereIn('status', ['completed', 'finish']);
                },
            ])
            ->orderBy('completed_tasks', 'desc')
            ->limit(10)
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json([
            'user_registrations' => $userRegistrations,
            'tasks_created' => $tasksCreated,
            'module_usage' => $moduleUsage,
            'top_users' => $topUsers,
        ]);
    }

    /**
     * Update user (admin only)
     */
    public function updateUser(Request $request, $id)
    {
        // Allow updating all users (including admins) but prevent updating yourself
        $user = User::findOrFail($id);

        // Prevent updating yourself
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot update your own account'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|nullable|string|min:8',
            'is_admin' => 'sometimes|boolean',
            'storage_limit' => 'sometimes|integer|min:0',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }

        if (isset($validated['email'])) {
            $user->email = $validated['email'];
        }

        if (isset($validated['password']) && $validated['password']) {
            $user->password = Hash::make($validated['password']);
        }

        // Only allow admins to change is_admin status
        if (isset($validated['is_admin'])) {
            if (!$request->user()->is_admin) {
                return response()->json(['message' => 'Unauthorized to change admin status'], 403);
            }
            $user->is_admin = $validated['is_admin'];
        }

        if ($request->has('storage_limit')) {
            $user->storage_limit = $request->input('storage_limit');
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    /**
     * Get active users (users with active sessions)
     */
    public function activeUsers()
    {
        $activeSessions = UserSession::with('user')
            ->where('last_activity', '>=', Carbon::now()->subHours(1))
            ->orderBy('last_activity', 'desc')
            ->get()
            ->groupBy('user_id')
            ->map(function ($sessions) {
                $session = $sessions->first();
                return [
                    'user' => $session->user,
                    'sessions' => $sessions->map(function ($s) {
                        return [
                            'ip_address' => $s->ip_address,
                            'location' => $s->location,
                            'latitude' => $s->latitude,
                            'longitude' => $s->longitude,
                            'user_agent' => $s->user_agent,
                            'last_activity' => $s->last_activity,
                        ];
                    }),
                    'total_sessions' => $sessions->count(),
                    'last_activity' => $session->last_activity,
                ];
            })
            ->values();

        return response()->json([
            'active_users' => $activeSessions,
            'total' => $activeSessions->count(),
        ]);
    }

    /**
     * Delete user
     */
    public function deleteUser($id)
    {
        $user = User::where('is_admin', false)->findOrFail($id);

        // Delete sessions
        UserSession::where('user_id', $id)->delete();

        // Delete related data (cascade should handle this, but being explicit)
        Task::where('user_id', $id)->delete();
        Target::where('user_id', $id)->delete();
        Habit::where('user_id', $id)->delete();
        FinancialTransaction::where('user_id', $id)->delete();
        Budget::where('user_id', $id)->delete();
        Journal::where('user_id', $id)->delete();
        Note::where('user_id', $id)->delete();
        File::where('user_id', $id)->delete();
        Link::where('user_id', $id)->delete();

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
}
