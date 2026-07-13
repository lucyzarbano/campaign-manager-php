import type { Campaign } from "../types/Campaign";
import type CampaignFilters from "../types/CampaignFilters";
import type CampaignResponse from "../types/CampaignResponse";
import type CampaignsResponse from "../types/CampaignsResponse";
import type { CampaignUpdate } from "../types/CampaignUpdate";
import { get_auth_headers } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export async function fetch_campaigns(
    filters: CampaignFilters = {}
): Promise<CampaignsResponse> {

    const params = new URLSearchParams();

    if (filters.status !== undefined) { params.set("status", String(filters.status)) }
    if (filters.page) { params.set("page", String(filters.page)) }
    if (filters.limit) { params.set("limit", String(filters.limit)) }
    if (filters.id !== undefined) { params.set("id", String(filters.id)) }
    if (filters.q) { params.set("q", String(filters.q)) }

    const response = await fetch(`${API_BASE_URL}/api/campaigns?${params.toString()}`);

    if (!response.ok) {
        throw new Error("Error to get campaign list");
    }

    return response.json();
}


export async function fetch_campaign_by_id(id: number): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${id}`);

    if (!response.ok) {
        throw new Error("Error to get campaign");
    }

    const result = await response.json();
    return result.data;
}


export async function update_campaign(
    campaign_id: number,
    campaign_to_update: CampaignUpdate
): Promise<Campaign> {
    const response = await fetch(`${API_BASE_URL}/api/campaigns/${campaign_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...get_auth_headers(),
        },
        body: JSON.stringify(campaign_to_update),
    });

    if (!response.ok) {
        throw new Error("Error to update campaign");
    }

    const result: CampaignResponse = await response.json();
    return result.data;
}
