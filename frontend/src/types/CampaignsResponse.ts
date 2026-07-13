import type { Campaign } from "./Campaign";

export default interface CampaignsResponse {
  data: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
