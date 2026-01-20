<?php

namespace App\Console\Commands;

use App\Models\Task;
use Illuminate\Console\Command;
use Carbon\Carbon;

class GenerateRecurringTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:generate-recurring';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate recurring tasks for today based on parent recurring tasks';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        $this->info("Generating recurring tasks for {$today->toDateString()}...");

        // Get all active recurring parent tasks
        $parentTasks = Task::where('is_recurring', true)
            ->whereNull('parent_task_id') // Only parent tasks
            ->where(function ($query) use ($today) {
                $query->whereNull('recurring_end_date')
                    ->orWhere('recurring_end_date', '>=', $today);
            })
            ->get();

        $generatedCount = 0;

        foreach ($parentTasks as $parentTask) {

            // Check if we should generate based on recurring type
            $shouldGenerate = false;
            $startDate = Carbon::parse($parentTask->due_date ?? $parentTask->task_date ?? $parentTask->created_at);
            
            // Don't generate if start date is in the future
            if ($startDate->isFuture()) {
                continue;
            }

            // Check if task for today already exists
            if ($existingTask) {
                continue; // Already handled above
            }

            // For daily tasks, generate every day from start date
            if ($parentTask->recurring_type === 'daily') {
                // Generate if start date is today or in the past
                if ($startDate->isSameDay($today) || $startDate->isBefore($today)) {
                    $shouldGenerate = true;
                }
            } else {
                // For weekly/monthly, check last instance
                $lastInstance = Task::where('parent_task_id', $parentTask->id)
                    ->orderBy('task_date', 'desc')
                    ->first();

                if (!$lastInstance) {
                    // First instance - generate if start date matches today
                    if ($startDate->isSameDay($today)) {
                        $shouldGenerate = true;
                    }
                } else {
                    $lastDate = Carbon::parse($lastInstance->task_date);
                    
                    if ($parentTask->recurring_type === 'weekly') {
                        // Generate if last instance was 7+ days ago
                        if ($lastDate->diffInDays($today) >= 7) {
                            $shouldGenerate = true;
                        }
                    } elseif ($parentTask->recurring_type === 'monthly') {
                        // Generate if last instance was 30+ days ago
                        if ($lastDate->diffInDays($today) >= 30) {
                            $shouldGenerate = true;
                        }
                    }
                }
            }

            if ($shouldGenerate) {
                // Check if task for today already exists (double check)
                $existingTask = Task::where('parent_task_id', $parentTask->id)
                    ->where('task_date', $today->toDateString())
                    ->first();

                if ($existingTask) {
                    $this->line("Task '{$parentTask->title}' already exists for today. Skipping...");
                    continue;
                }

                // Create new task instance
                $newTask = Task::create([
                    'user_id' => $parentTask->user_id,
                    'target_id' => $parentTask->target_id,
                    'title' => $parentTask->title,
                    'description' => $parentTask->description,
                    'category' => $parentTask->category,
                    'priority' => $parentTask->priority,
                    'status' => 'todo', // New instances start as todo
                    'due_date' => $today->toDateString(),
                    'progress' => 0,
                    'is_recurring' => false, // Instance is not recurring itself
                    'parent_task_id' => $parentTask->id,
                    'task_date' => $today->toDateString(),
                ]);

                $generatedCount++;
                $this->info("Generated task: '{$newTask->title}' for {$today->toDateString()}");

                // Recalculate target values if task has a target
                if ($newTask->target_id) {
                    $target = \App\Models\Target::find($newTask->target_id);
                    if ($target) {
                        $target->recalculateValues();
                    }
                }
            }
        }

        $this->info("Generated {$generatedCount} recurring task(s) for {$today->toDateString()}");

        return Command::SUCCESS;
    }
}
