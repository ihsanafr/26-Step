<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\TargetController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\FinancialTransactionController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\SavingController;
use App\Http\Controllers\Api\TimeTrackingController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\HabitController;
use App\Http\Controllers\Api\HabitLogController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\LinkController;
use App\Http\Controllers\Api\JournalController;
use App\Http\Controllers\Api\FeedbackController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\JournalNoteCategoryController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/feedback', [FeedbackController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::post('/user/avatar', [AuthController::class, 'updateAvatar']);

    // Tasks
    Route::apiResource('tasks', TaskController::class);

    // Targets
    Route::apiResource('targets', TargetController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);

    // Financial Transactions
    Route::apiResource('financial-transactions', FinancialTransactionController::class);

    // Budgets
    Route::apiResource('budgets', BudgetController::class);

    // Savings
    Route::apiResource('savings', SavingController::class);

    // Time Trackings
    Route::apiResource('time-trackings', TimeTrackingController::class);

    // Schedules
    Route::apiResource('schedules', ScheduleController::class);

    // Habits
    Route::apiResource('habits', HabitController::class);

    // Habit Logs
    Route::prefix('habits/{habit}')->group(function () {
        Route::get('logs', [HabitLogController::class, 'index']);
        Route::post('logs', [HabitLogController::class, 'store']);
        Route::get('logs/{log}', [HabitLogController::class, 'show']);
        Route::put('logs/{log}', [HabitLogController::class, 'update']);
        Route::delete('logs/{log}', [HabitLogController::class, 'destroy']);
    });

    // Notes
    Route::apiResource('notes', NoteController::class);

    // Journal & Note Categories
    Route::apiResource('journal-note-categories', JournalNoteCategoryController::class);

    // Files
    Route::apiResource('files', FileController::class);
    Route::get('files/{file}/download', [FileController::class, 'download']);
    Route::post('files/upload', [FileController::class, 'upload']);

    // Links
    Route::apiResource('links', LinkController::class);

    // Journals
    Route::post('journals/cover', [JournalController::class, 'uploadCover']);
    Route::post('journals/content-image', [JournalController::class, 'uploadContentImage']);
    Route::apiResource('journals', JournalController::class);

    // Activities (for calendar)
    Route::get('activities/date/{date}', [ActivityController::class, 'getByDate']);
    Route::get('activities/range', [ActivityController::class, 'getByDateRange']);
});

// Admin routes
Route::middleware(['auth:sanctum', \App\Http\Middleware\EnsureUserIsAdmin::class])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}', [AdminController::class, 'userDetails']);
    Route::put('/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/active-users', [AdminController::class, 'activeUsers']);
    Route::get('/analytics', [AdminController::class, 'analytics']);
});
