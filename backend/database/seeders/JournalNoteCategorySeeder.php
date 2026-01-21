<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JournalNoteCategory;

class JournalNoteCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultCategories = [
            ['name' => 'Work', 'color' => '#3B82F6', 'icon' => '💼', 'is_default' => true],
            ['name' => 'Personal', 'color' => '#8B5CF6', 'icon' => '🏠', 'is_default' => true],
            ['name' => 'Ideas', 'color' => '#EC4899', 'icon' => '💡', 'is_default' => true],
            ['name' => 'Health', 'color' => '#10B981', 'icon' => '💪', 'is_default' => true],
            ['name' => 'Travel', 'color' => '#F59E0B', 'icon' => '✈️', 'is_default' => true],
            ['name' => 'Education', 'color' => '#6366F1', 'icon' => '🎓', 'is_default' => true],
            ['name' => 'Finance', 'color' => '#F97316', 'icon' => '💰', 'is_default' => true],
            ['name' => 'Family', 'color' => '#EF4444', 'icon' => '👨‍👩‍👧‍👦', 'is_default' => true],
        ];

        foreach ($defaultCategories as $category) {
            JournalNoteCategory::updateOrCreate(
                ['name' => $category['name'], 'user_id' => null],
                $category
            );
        }
    }
}
