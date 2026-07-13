<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use RuntimeException;
use SplFileObject;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['username' => 'demo'],
            [
                'name' => 'demo',
                'email' => 'demo@campaign-manager.local',
                'password' => 'password',
            ]
        );

        $csvPath = base_path('../technical_documentation/campaigns_data_2026.csv');

        if (! file_exists($csvPath)) {
            throw new RuntimeException('Campaign CSV not found at '.$csvPath);
        }

        $csv = new SplFileObject($csvPath);
        $csv->setFlags(SplFileObject::READ_CSV | SplFileObject::SKIP_EMPTY);
        $csv->setCsvControl(';');

        $headers = [];

        foreach ($csv as $row) {
            if ($row === [null] || $row === false) {
                continue;
            }

            if ($headers === []) {
                $headers = $row;
                continue;
            }

            $campaignData = array_combine($headers, $row);

            if (! $campaignData || empty($campaignData['id'])) {
                continue;
            }

            $campaign = Campaign::find($campaignData['id']) ?? new Campaign();
            $campaign->id = (int) $campaignData['id'];
            $campaign->name = $campaignData['name'];
            $campaign->status = (int) $campaignData['status'];
            $campaign->landing_url = $campaignData['landingUrl'];
            $campaign->cover_image_url = $campaignData['coverImageUrl'];
            $campaign->created_at = Carbon::parse($campaignData['createdAt']);
            $campaign->updated_at = Carbon::parse($campaignData['createdAt']);
            $campaign->save();
        }
    }
}
