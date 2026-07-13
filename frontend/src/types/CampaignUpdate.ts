export interface CampaignUpdate {
    id: number;
    name?: string;
    status?: 0 | 1;
    landingUrl?: string;
    coverImageUrl?: string;
}