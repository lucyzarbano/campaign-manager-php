import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CampaignFilters } from "../../components/CampaignFilters";


describe("CampaignFilters", () => {
  it("calls onApply when the Apply button is clicked", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();

    render(
      <CampaignFilters
        campaignId=""
        search=""
        status=""
        onCampaignIdChange={vi.fn()}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onApply={onApply}
        onReset={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /apply/i }));

    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when the Reset button is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <CampaignFilters
        campaignId=""
        search=""
        status=""
        onCampaignIdChange={vi.fn()}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onApply={vi.fn()}
        onReset={onReset}
      />
    );

    await user.click(screen.getByRole("button", { name: /reset/i }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("calls onSearchChange when the search field changes", () => {
    const onSearchChange = vi.fn();

    render(
      <CampaignFilters
        campaignId=""
        search=""
        status=""
        onCampaignIdChange={vi.fn()}
        onSearchChange={onSearchChange}
        onStatusChange={vi.fn()}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const searchInput = screen.getByRole("textbox", {
      name: /search by name/i,
    });

    fireEvent.change(searchInput, {
      target: { value: "summer" },
    });

    expect(onSearchChange).toHaveBeenCalledWith("summer");
  });

  it("calls onStatusChange when status changes", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();

    render(
      <CampaignFilters
        campaignId=""
        search=""
        status=""
        onCampaignIdChange={vi.fn()}
        onSearchChange={vi.fn()}
        onStatusChange={onStatusChange}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );
    const statusSelect = screen.getByRole("combobox");

    await user.click(statusSelect);
    await user.click(screen.getByRole("option", { name: /active/i }));
    expect(onStatusChange).toHaveBeenCalledWith("1");
  });

  it("calls onCampaignIdChange when the ID field changes", () => {
    const onCampaignIdChange = vi.fn();

    render(
      <CampaignFilters
        campaignId=""
        search=""
        status=""
        onCampaignIdChange={onCampaignIdChange}
        onSearchChange={vi.fn()}
        onStatusChange={vi.fn()}
        onApply={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const campaignIdFilter = screen.getByRole("spinbutton", {
      name: /campaign id/i
    });

    fireEvent.change(campaignIdFilter, { target: { value: "7" } });

    expect(onCampaignIdChange).toHaveBeenCalledWith("7");
  });
});
