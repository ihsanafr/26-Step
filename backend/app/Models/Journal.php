<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Journal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'date',
        'mood',
        'tags',
        'is_private',
        'weather',
        'location',
        'color',
        'cover_image',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'tags' => 'array',
            'is_private' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

