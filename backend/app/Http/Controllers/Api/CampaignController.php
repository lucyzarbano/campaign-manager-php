<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CampaignController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['nullable', 'integer', 'min:1'],
            'q' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'integer', 'in:0,1'],
            'page' => ['nullable', 'integer', 'min:1'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $query = Campaign::query()->latest('id');

        if (isset($validated['id'])) {
            $query->whereKey($validated['id']);
        }

        if (! empty($validated['q'])) {
            $query->where('name', 'like', '%'.$validated['q'].'%');
        }

        if (array_key_exists('status', $validated)) {
            $query->where('status', $validated['status']);
        }

        $limit = $validated['limit'] ?? 20;
        $campaigns = $query->paginate($limit);

        return response()->json([
            'data' => $campaigns->getCollection()->map->toFrontendArray()->values(),
            'pagination' => [
                'page' => $campaigns->currentPage(),
                'limit' => $campaigns->perPage(),
                'total' => $campaigns->total(),
                'total_pages' => $campaigns->lastPage(),
            ],
        ]);
    }

    public function show(Campaign $campaign): JsonResponse
    {
        return response()->json([
            'data' => $campaign->toFrontendArray(),
        ]);
    }

    public function update(Request $request, Campaign $campaign): JsonResponse
    {
        $validated = $request->validate([
            'id' => ['required', 'integer', Rule::in([$campaign->id])],
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'required', 'integer', 'in:0,1'],
            'landingUrl' => ['sometimes', 'required', 'url', 'max:2048'],
            'coverImageUrl' => ['sometimes', 'required_without:imageUrl', 'url', 'max:2048'],
            'imageUrl' => ['sometimes', 'required_without:coverImageUrl', 'url', 'max:2048'],
        ]);

        if (! array_intersect(array_keys($validated), ['name', 'status', 'landingUrl', 'coverImageUrl', 'imageUrl'])) {
            throw ValidationException::withMessages([
                'campaign' => ['At least one editable field is required.'],
            ]);
        }

        $updates = [];

        if (array_key_exists('name', $validated)) {
            $updates['name'] = $validated['name'];
        }

        if (array_key_exists('status', $validated)) {
            $updates['status'] = $validated['status'];
        }

        if (array_key_exists('landingUrl', $validated)) {
            $updates['landing_url'] = $validated['landingUrl'];
        }

        if (array_key_exists('coverImageUrl', $validated) || array_key_exists('imageUrl', $validated)) {
            $updates['cover_image_url'] = $validated['coverImageUrl'] ?? $validated['imageUrl'];
        }

        $campaign->update($updates);

        return response()->json([
            'data' => $campaign->fresh()->toFrontendArray(),
        ]);
    }
}
