<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'target_id',
        'title',
        'description',
        'category',
        'priority',
        'status',
        'due_date',
        'completed_at',
        'progress',
        'is_recurring',
        'recurring_type',
        'recurring_end_date',
        'parent_task_id',
        'task_date',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'completed_at' => 'datetime',
            'progress' => 'integer',
            'is_recurring' => 'boolean',
            'recurring_end_date' => 'date',
            'task_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function target(): BelongsTo
    {
        return $this->belongsTo(Target::class);
    }

    public function parentTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function recurringInstances(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_task_id');
    }
}
