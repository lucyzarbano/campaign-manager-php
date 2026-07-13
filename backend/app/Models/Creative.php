<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Creative extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'asset_url',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function toFrontendArray(): array
    {
        return [
            'id' => $this->id,
            'campaignId' => $this->campaign_id,
            'assetUrl' => $this->asset_url,
            'createdAt' => $this->created_at?->toISOString(),
        ];
    }
}
