import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField
} from "@mui/material";

type StatusFilter = "" | "0" | "1";

interface CampaignFiltersProps {
  campaignId: string;
  search: string;
  status: StatusFilter;
  onCampaignIdChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onApply: () => void;
  onReset: () => void;
}

export function CampaignFilters({
  campaignId,
  search,
  status,
  onCampaignIdChange,
  onSearchChange,
  onStatusChange,
  onApply,
  onReset
}: CampaignFiltersProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply();
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: 2, mb: 2 }}
      elevation={0}
      variant="outlined"
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ alignItems: { md: "center" } }}
      >
        <TextField
          label="Campaign ID"
          type="number"
          size="small"
          value={campaignId}
          onChange={(event) => onCampaignIdChange(event.target.value)}
          slotProps={{ htmlInput: { min: 1 } }}
          sx={{ minWidth: { xs: "100%", md: 160 } }}
        />

        <TextField
          label="Search by name"
          size="small"
          fullWidth
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onApply();
            }
          }}
        />

        <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as StatusFilter)
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="1">Active</MenuItem>
            <MenuItem value="0">Paused</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" sx={{ minWidth: 96 }}>
          Apply
        </Button>

        <Button
          type="button"
          variant="outlined"
          onClick={onReset}
          sx={{ minWidth: 96 }}
        >
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}