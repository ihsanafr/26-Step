<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->boolean('is_recurring')->default(false)->after('progress');
            $table->enum('recurring_type', ['daily', 'weekly', 'monthly'])->nullable()->after('is_recurring');
            $table->date('recurring_end_date')->nullable()->after('recurring_type');
            $table->foreignId('parent_task_id')->nullable()->after('recurring_end_date')->constrained('tasks')->onDelete('cascade');
            $table->date('task_date')->nullable()->after('parent_task_id'); // Tanggal spesifik untuk recurring task instance
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropForeign(['parent_task_id']);
            $table->dropColumn(['is_recurring', 'recurring_type', 'recurring_end_date', 'parent_task_id', 'task_date']);
        });
    }
};
