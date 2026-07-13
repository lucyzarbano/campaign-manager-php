import type { Creative } from "../types/Creative";
import type { CreativeCreate } from "../types/CreativeCreate";
import type CreativeResponse from "../types/CreativeResponse";
import { get_auth_headers } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function getErrorMessage(
    response: Response,
    fallbackMessage: string
): Promise<string> {
    const errorResponse = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

    return errorResponse?.message ?? fallbackMessage;
}

export async function fetch_creatives_by_campaign_id(
    id: number
): Promise<Creative[]> {
    const response = await fetch(
        `${API_BASE_URL}/api/campaigns/${id}/creatives`
    );

    if (!response.ok) {
        throw new Error("Unable to load campaign creatives");
    }

    const result = await response.json();
    return result.data;
}

export async function create_creative(
    campaign_id: number,
    creative_to_create: CreativeCreate
): Promise<Creative> {
    const response = await fetch(
        `${API_BASE_URL}/api/campaigns/${campaign_id}/creatives`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...get_auth_headers()
            },
            body: JSON.stringify(creative_to_create)
        }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Unable to create creative")
        );
    }

    const result: CreativeResponse = await response.json();
    return result.data;
}

export async function delete_creative(
    campaign_id: number,
    creative_id: string
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/campaigns/${campaign_id}/creatives/${creative_id}`,
        {
            method: "DELETE",
            headers: get_auth_headers()
        }
    );

    if (!response.ok) {
        throw new Error(
            await getErrorMessage(response, "Unable to delete creative")
        );
    }
}