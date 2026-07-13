export default interface CampaignFilters {
    page?: number;
    limit?: number;
    id?: number;
    q?: string;
    status?: 0 | 1;
}