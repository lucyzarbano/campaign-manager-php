import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CampaignTable } from "../../components/CampaignTable";
import type { Campaign } from "../../types/Campaign";
import userEvent from "@testing-library/user-event";

const campaign: Campaign = {
  id: 42,
  name: "Summer Campaign",
  status: 1,
  landingUrl: "https://example.com/landing",
  coverImageUrl: "https://example.com/cover.jpg",
  createdAt: "2026-06-20T10:00:00.000Z"
};

describe("CampaignTable", () => {
  it("renders campaign information and actions", () => {
    render(
      <CampaignTable
        campaigns={[campaign]}
        page={1}
        totalPages={1}
        favoriteCampaignIds={[]}
        onPageChange={vi.fn()}
        onEditCampaign={vi.fn()}
        onToggleFavorite={vi.fn()}
        onViewCreatives={vi.fn()}
      />
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Summer Campaign")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /creatives/i })
    ).toBeInTheDocument();
  });

  it("calls onToggleFavorite when the favorite button is clicked", async () => {
    const user = userEvent.setup();
    const onToggleFavorite = vi.fn();

    render(
      <CampaignTable
        campaigns={[campaign]}
        page={1}
        totalPages={1}
        favoriteCampaignIds={[]}
        onPageChange={vi.fn()}
        onEditCampaign={vi.fn()}
        onToggleFavorite={onToggleFavorite}
        onViewCreatives={vi.fn()}
      />
    );

    const favoriteButton = screen.getByRole("button", {
      name: /favorite/i
    });
    await user.click(favoriteButton);
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    expect(onToggleFavorite).toHaveBeenCalledWith(campaign);
  });

  it("calls onEditCampaign with campaign payload when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEditCampaign = vi.fn();

    render(
      <CampaignTable
        campaigns={[campaign]}
        page={1}
        totalPages={1}
        favoriteCampaignIds={[]}
        onPageChange={vi.fn()}
        onEditCampaign={onEditCampaign}
        onToggleFavorite={vi.fn()}
        onViewCreatives={vi.fn()}
      />
    );

    const editButton = screen.getByRole("button", {
      name: /edit/i,
    });

    await user.click(editButton);
    expect(onEditCampaign).toHaveBeenCalledTimes(1);
    expect(onEditCampaign).toHaveBeenCalledWith(campaign);
  });

  it("calls onViewCreatives with campaign payload when creatives button is clicked", async () => {
    const user = userEvent.setup();
    const onViewCreatives = vi.fn();

    render(<CampaignTable
        campaigns={[campaign]}
        page={1}
        totalPages={1}
        favoriteCampaignIds={[]}
        onPageChange={vi.fn()}
        onEditCampaign={vi.fn()}
        onToggleFavorite={vi.fn()}
        onViewCreatives={onViewCreatives}
      />)

      const creativeButton = screen.getByRole("button", {
        name: /creatives/i,
      });

      await user.click(creativeButton)
      expect(onViewCreatives).toHaveBeenCalledTimes(1);
      expect(onViewCreatives).toHaveBeenCalledWith(campaign);
  })

  it("renders the landing link", () => {
    render(
      <CampaignTable
        campaigns={[campaign]}
        page={1}
        totalPages={1}
        favoriteCampaignIds={[]}
        onPageChange={vi.fn()}
        onEditCampaign={vi.fn()}
        onToggleFavorite={vi.fn()}
        onViewCreatives={vi.fn()}
      />
    );

    const landingLink = screen.getByRole("link", {
      name: /open landing/i
    });
    expect(landingLink).toBeInTheDocument();
    expect(landingLink).toHaveAttribute("href", campaign.landingUrl);
    expect(landingLink).toHaveAttribute("target", "_blank");
  });

  it("renders the cover image link", () => {
    render(
      <CampaignTable
        campaigns={[campaign]}
        page={1}
        totalPages={1}
        favoriteCampaignIds={[]}
        onPageChange={vi.fn()}
        onEditCampaign={vi.fn()}
        onToggleFavorite={vi.fn()}
        onViewCreatives={vi.fn()}
      />
    );

    const coverLink = screen.getByRole("link", {
      name: /view cover/i
    });
    expect(coverLink).toBeInTheDocument();
    expect(coverLink).toHaveAttribute("href", campaign.coverImageUrl);
    expect(coverLink).toHaveAttribute("target", "_blank");
  });
});
