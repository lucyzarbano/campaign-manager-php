<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Creative;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CreativeController extends Controller
{
    public function index(Campaign $campaign): JsonResponse
    {
        return response()->json([
            'data' => $campaign->creatives()->latest('id')->get()->map->toFrontendArray()->values(),
        ]);
    }

    public function store(Request $request, Campaign $campaign): JsonResponse
    {
        $validated = $request->validate([
            'assetUrl' => ['required', 'string'],
        ]);

        if ($campaign->status === 0) {
            throw ValidationException::withMessages([
                'campaign' => ['Paused campaigns cannot accept new creatives.'],
            ]);
        }

        if ($campaign->creatives()->count() >= 3) {
            throw ValidationException::withMessages([
                'assetUrl' => ['A campaign can have at most 3 creatives.'],
            ]);
        }

        $this->validateCreativeImage($validated['assetUrl']);

        $creative = $campaign->creatives()->create([
            'asset_url' => $validated['assetUrl'],
        ]);

        return response()->json([
            'data' => $creative->toFrontendArray(),
        ], 201);
    }

    public function destroy(Campaign $campaign, Creative $creative): JsonResponse
    {
        if ($creative->campaign_id !== $campaign->id) {
            abort(404);
        }

        $creative->delete();

        return response()->json(null, 204);
    }

    private function validateCreativeImage(string $assetUrl): void
    {
        if (! str_starts_with($assetUrl, 'data:image/')) {
            return;
        }

        [$meta, $payload] = array_pad(explode(',', $assetUrl, 2), 2, '');
        $binary = base64_decode($payload, true);

        if ($binary === false) {
            throw ValidationException::withMessages([
                'assetUrl' => ['Invalid image payload.'],
            ]);
        }

        $image = @getimagesizefromstring($binary);

        if ($image === false || $image[0] !== 320 || $image[1] !== 480) {
            throw ValidationException::withMessages([
                'assetUrl' => ['Images must be exactly 320 x 480 pixels.'],
            ]);
        }
    }
}
