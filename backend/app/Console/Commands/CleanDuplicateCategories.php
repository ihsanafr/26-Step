<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CleanDuplicateCategories extends Command
{
    protected $signature = 'categories:clean-duplicates';
    protected $description = 'Remove duplicate categories for each user';

    public function handle()
    {
        $this->info('Cleaning duplicate categories...');

        // Get all users with categories
        $users = Category::select('user_id')->distinct()->get();

        $totalDeleted = 0;

        foreach ($users as $user) {
            $userId = $user->user_id;
            
            // Get all categories for this user
            $categories = Category::where('user_id', $userId)
                ->orderBy('id', 'asc')
                ->get();

            // Group by name
            $grouped = $categories->groupBy('name');

            foreach ($grouped as $name => $group) {
                if ($group->count() > 1) {
                    // Keep the first one, delete the rest
                    $keep = $group->first();
                    $duplicates = $group->slice(1);

                    foreach ($duplicates as $duplicate) {
                        $this->line("Deleting duplicate: {$duplicate->name} (ID: {$duplicate->id}) for user {$userId}");
                        $duplicate->delete();
                        $totalDeleted++;
                    }
                }
            }
        }

        $this->info("Cleaned {$totalDeleted} duplicate categories.");
        return 0;
    }
}
