<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class UpdateTasksStatusEnum extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:update-status-enum';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update tasks status enum to support new status values (todo, on_progress, on_hold, finish)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating tasks status enum...');

        try {
            // First, modify the enum to include new values
            $this->info('Modifying enum column...');
            DB::statement("ALTER TABLE `tasks` MODIFY COLUMN `status` ENUM('todo', 'on_progress', 'on_hold', 'finish', 'pending', 'in_progress', 'completed') DEFAULT 'todo'");
            $this->info('✓ Enum column updated successfully');

            // Then update existing data to new status values
            $this->info('Updating existing task statuses...');
            $updated = DB::table('tasks')->where('status', 'pending')->update(['status' => 'todo']);
            $this->info("✓ Updated {$updated} tasks from 'pending' to 'todo'");

            $updated = DB::table('tasks')->where('status', 'in_progress')->update(['status' => 'on_progress']);
            $this->info("✓ Updated {$updated} tasks from 'in_progress' to 'on_progress'");

            $updated = DB::table('tasks')->where('status', 'completed')->update(['status' => 'finish']);
            $this->info("✓ Updated {$updated} tasks from 'completed' to 'finish'");

            $this->info('');
            $this->info('✅ Tasks status enum updated successfully!');
            $this->info('New status values: todo, on_progress, on_hold, finish');
            $this->info('Old status values (backward compatibility): pending, in_progress, completed');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('❌ Error updating tasks status enum: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
