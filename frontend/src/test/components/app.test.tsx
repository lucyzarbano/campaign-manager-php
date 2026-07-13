import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import App from "../../App";
import { fetch_campaigns } from "../../api/campaigns";
import type { Campaign } from "../../types/Campaign";

vi.mock("../../api/campaigns", () => ({
    fetch_campaigns: vi.fn(),
    update_campaign: vi.fn(),
}));

const mockedFetchCampaigns = vi.mocked(fetch_campaigns)

describe("App", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    })

    it("displays campaigns after loading", async () => {
         const campaign: Campaign = {
              id: 42,
              name: "Summer Campaign",
              status: 1,
              landingUrl: "https://example.com/landing",
              coverImageUrl: "https://example.com/cover.jpg",
              createdAt: "2026-06-20T10:00:00.000Z"
            };
        const mock_campaign_response = {
          "data": [campaign],
          "pagination": {
            "page": 1,
            "limit": 1,
            "total": 700,
            "total_pages": 35
          }
        };
        mockedFetchCampaigns.mockResolvedValueOnce(mock_campaign_response);
        render(<App />);
        expect(screen.getByText(/loading campaigns/i)).toBeInTheDocument();
        expect(await screen.findByText("Summer Campaign")).toBeInTheDocument();
    });

    it("displays error campaigns after loading", async () => {
        mockedFetchCampaigns.mockRejectedValueOnce(new Error("Network error"));

        render(<App />);
        expect(screen.getByText(/loading campaigns/i)).toBeInTheDocument();
        expect(
            await screen.findByText("Unable to load campaigns")
        ).toBeInTheDocument();
        expect(
            screen.queryByText(/loading campaigns/i)
        ).not.toBeInTheDocument();
    });

});
