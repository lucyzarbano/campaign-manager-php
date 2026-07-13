import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EditCampaignModal } from "../../components/EditCampaignModal";
import type { Campaign } from "../../types/Campaign";

const campaign: Campaign = {
  id: 42,
  name: "Summer Campaign",
  status: 1,
  landingUrl: "https://example.com/landing",
  coverImageUrl: "https://example.com/cover.jpg",
  createdAt: "2026-06-20T10:00:00.000Z"
};

describe("EditCampaignModal", () => {
  it("calls onSave with the updated campaign", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <EditCampaignModal
        open
        campaign={campaign}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    const nameInput = screen.getByRole("textbox", { name: /^name$/i });
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Campaign");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        id: campaign.id,
        name: "Updated Campaign",
        status: campaign.status,
        landingUrl: campaign.landingUrl,
        coverImageUrl: campaign.coverImageUrl
      });
    });
  });
});
