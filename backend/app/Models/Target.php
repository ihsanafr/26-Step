<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Target extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'target_value',
        'current_value',
        'period',
        'start_date',
        'end_date',
        'status',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'target_value' => 'integer',
            'current_value' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Recalculate target_value and current_value from tasks
     */
    public function recalculateValues(): void
    {
        $this->loadCount([
            'tasks as total_tasks',
            'tasks as completed_tasks' => function ($query) {
                $query->where('status', 'finish');
            }
        ]);

        $this->target_value = $this->total_tasks ?? 0;
        $this->current_value = $this->completed_tasks ?? 0;

        // Auto-update status based on progress
        if ($this->target_value > 0 && $this->current_value >= $this->target_value) {
            $this->status = 'completed';
        } elseif ($this->status === 'completed' && $this->current_value < $this->target_value) {
            $this->status = 'active';
        }

        $this->save();
    }
}
