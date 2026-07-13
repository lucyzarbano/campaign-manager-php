<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CampaignApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $this->postJson('/api/auth/register', [
            'username' => 'lucia',
            'password' => 'secret123',
        ])->assertCreated()
            ->assertJsonPath('data.user.username', 'lucia');

        $this->postJson('/api/auth/login', [
            'username' => 'lucia',
            'password' => 'secret123',
        ])->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'username'],
                    'token',
                ],
            ]);
    }

    public function test_campaigns_can_be_filtered_and_paginated(): void
    {
        Campaign::create([
            'name' => 'Summer Launch',
            'status' => 1,
            'landing_url' => 'https://example.com/summer',
            'cover_image_url' => 'https://example.com/summer.jpg',
        ]);

        Campaign::create([
            'name' => 'Paused Campaign',
            'status' => 0,
            'landing_url' => 'https://example.com/paused',
            'cover_image_url' => 'https://example.com/paused.jpg',
        ]);

        $this->getJson('/api/campaigns?status=1&q=Summer&limit=10')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Summer Launch')
            ->assertJsonPath('pagination.total_pages', 1);
    }

    public function test_campaign_detail_is_available(): void
    {
        $campaign = Campaign::create([
            'name' => 'Detail Campaign',
            'status' => 1,
            'landing_url' => 'https://example.com/detail',
            'cover_image_url' => 'https://example.com/detail.jpg',
        ]);

        $this->getJson('/api/campaigns/'.$campaign->id)
            ->assertOk()
            ->assertJsonPath('data.id', $campaign->id)
            ->assertJsonPath('data.name', 'Detail Campaign');
    }

    public function test_campaign_can_be_updated_when_body_id_matches_route(): void
    {
        $campaign = Campaign::create([
            'name' => 'Old Name',
            'status' => 1,
            'landing_url' => 'https://example.com/old',
            'cover_image_url' => 'https://example.com/old.jpg',
        ]);

        $this->putJson('/api/campaigns/'.$campaign->id, [
            'id' => $campaign->id,
            'name' => 'New Name',
            'status' => 0,
            'landingUrl' => 'https://example.com/new',
            'coverImageUrl' => 'https://example.com/new.jpg',
        ])->assertOk()
            ->assertJsonPath('data.name', 'New Name')
            ->assertJsonPath('data.status', 0)
            ->assertJsonPath('data.landingUrl', 'https://example.com/new');
    }

    public function test_campaign_update_rejects_mismatched_body_id(): void
    {
        $campaign = Campaign::create([
            'name' => 'Old Name',
            'status' => 1,
            'landing_url' => 'https://example.com/old',
            'cover_image_url' => 'https://example.com/old.jpg',
        ]);

        $this->putJson('/api/campaigns/'.$campaign->id, [
            'id' => $campaign->id + 1,
            'name' => 'New Name',
        ])->assertUnprocessable();
    }

    public function test_campaign_can_have_at_most_three_creatives(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $campaign = Campaign::create([
            'name' => 'Creative Test',
            'status' => 1,
            'landing_url' => 'https://example.com/landing',
            'cover_image_url' => 'https://example.com/cover.jpg',
        ]);

        $campaign->creatives()->createMany([
            ['asset_url' => 'https://example.com/1.jpg'],
            ['asset_url' => 'https://example.com/2.jpg'],
            ['asset_url' => 'https://example.com/3.jpg'],
        ]);

        $this->postJson('/api/campaigns/'.$campaign->id.'/creatives', [
            'assetUrl' => 'https://example.com/4.jpg',
        ])->assertUnprocessable();
    }

    public function test_paused_campaign_cannot_accept_creatives(): void
    {
        $campaign = Campaign::create([
            'name' => 'Paused Creative Test',
            'status' => 0,
            'landing_url' => 'https://example.com/landing',
            'cover_image_url' => 'https://example.com/cover.jpg',
        ]);

        $this->postJson('/api/campaigns/'.$campaign->id.'/creatives', [
            'assetUrl' => 'https://example.com/creative.jpg',
        ])->assertUnprocessable();
    }
}
