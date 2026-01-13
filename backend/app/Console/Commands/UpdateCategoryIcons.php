<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Category;

class UpdateCategoryIcons extends Command
{
    protected $signature = 'categories:update-icons';
    protected $description = 'Update category icons based on their names';

    private $iconMap = [
        'Work' => '💼',
        'Personal' => '🏠',
        'Health' => '💪',
        'Learning' => '📚',
        'Shopping' => '🛒',
        'Family' => '👨‍👩‍👧‍👦',
    ];

    public function handle()
    {
        $this->info('Updating category icons...');

        $categories = Category::all();
        $updated = 0;

        foreach ($categories as $category) {
            $icon = $this->iconMap[$category->name] ?? null;
            
            if ($icon && $category->icon !== $icon) {
                $category->icon = $icon;
                $category->save();
                $this->line("Updated icon for: {$category->name} to {$icon}");
                $updated++;
            }
        }

        $this->info("Updated {$updated} categories.");
        return 0;
    }
}

