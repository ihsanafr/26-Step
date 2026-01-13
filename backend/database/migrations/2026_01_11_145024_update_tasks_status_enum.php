<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing data to new status values
        DB::table('tasks')->where('status', 'pending')->update(['status' => 'todo']);
        DB::table('tasks')->where('status', 'in_progress')->update(['status' => 'on_progress']);
        DB::table('tasks')->where('status', 'completed')->update(['status' => 'finish']);

        // Modify enum to include new status values
        // MySQL requires raw SQL to modify ENUM
        DB::statement("ALTER TABLE `tasks` MODIFY COLUMN `status` ENUM('todo', 'on_progress', 'on_hold', 'finish', 'pending', 'in_progress', 'completed') DEFAULT 'todo'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert data back to old status values
        DB::table('tasks')->where('status', 'todo')->update(['status' => 'pending']);
        DB::table('tasks')->where('status', 'on_progress')->update(['status' => 'in_progress']);
        DB::table('tasks')->where('status', 'finish')->update(['status' => 'completed']);
        DB::table('tasks')->where('status', 'on_hold')->update(['status' => 'pending']); // on_hold doesn't have old equivalent, map to pending

        // Revert enum to old values
        DB::statement("ALTER TABLE `tasks` MODIFY COLUMN `status` ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending'");
    }
};
