<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'status',
        'landing_url',
        'cover_image_url',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function creatives(): HasMany
    {
        return $this->hasMany(Creative::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'landingUrl' => $this->landing_url,
            'coverImageUrl' => $this->cover_image_url,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
