import {
  Button,
  Chip,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import type { Campaign } from "../types/Campaign";

interface CampaignTableProps {
  campaigns: Campaign[];
  page: number;
  totalPages: number;
  favoriteCampaignIds: number[];
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onEditCampaign: (campaign: Campaign) => void;
  onToggleFavorite: (campaign: Campaign) => void;
  onViewCreatives: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  page,
  totalPages,
  favoriteCampaignIds,
  onPageChange,
  onEditCampaign,
  onToggleFavorite,
  onViewCreatives
}: CampaignTableProps) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      variant="outlined"
      sx={{ overflowX: "auto" }}
    >
      <Table
        size="small"
        sx={{ minWidth: 1050 }}
        aria-label="Campaigns"
      >
        <TableHead
          sx={{
            "& .MuiTableCell-head": {
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontWeight: 700,
              whiteSpace: "nowrap"
            }
          }}
        >
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Landing</TableCell>
            <TableCell>Cover</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell align="center">Favorite</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {campaigns.map((campaign) => {
            const isFavorite = favoriteCampaignIds.includes(campaign.id);

            return (
              <TableRow
                key={campaign.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell>{campaign.id}</TableCell>

                <TableCell sx={{ minWidth: 300, fontWeight: 500 }}>
                  {campaign.name}
                </TableCell>

                <TableCell>
                  <Chip
                    label={campaign.status === 1 ? "Active" : "Paused"}
                    color={campaign.status === 1 ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  <a href={campaign.landingUrl} target="_blank" rel="noreferrer">
                    Open landing
                  </a>
                </TableCell>

                <TableCell>
                  <a
                    href={campaign.coverImageUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View cover
                  </a>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => onEditCampaign(campaign)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => onViewCreatives(campaign)}
                  >
                    Creatives
                  </Button>
                </TableCell>

                <TableCell align="center">
                  <Tooltip
                    title={
                      isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    <IconButton
                      color={isFavorite ? "warning" : "default"}
                      aria-label={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      onClick={() => onToggleFavorite(campaign)}
                    >
                      <span aria-hidden="true" className="favorite-star">
                        {isFavorite ? "\u2605" : "\u2606"}
                      </span>
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Pagination
        count={totalPages}
        page={page}
        boundaryCount={2}
        onChange={onPageChange}
        sx={{
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          py: 2
        }}
      />
    </TableContainer>
  );
}