import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from "@mui/material";
import type { Creative } from "../types/Creative";

interface CreativeTableProps {
  creatives: Creative[];
  deletingCreativeId: string | null;
  onDeleteCreative: (creativeId: string) => void;
}

export function CreativeTable({
  creatives,
  deletingCreativeId,
  onDeleteCreative
}: CreativeTableProps) {
  return (
    <TableContainer component={Paper} elevation={0} variant="outlined">
      <Table size="small" aria-label="Campaign creatives">
        <TableHead
          sx={{
            "& .MuiTableCell-head": {
              backgroundColor: "#f3f4f6",
              color: "#374151",
              fontWeight: 700
            }
          }}
        >
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Created</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {creatives.map((creative) => {
            const isDeleting = deletingCreativeId === creative.id;

            return (
              <TableRow
                key={creative.id}
                hover
                sx={{ "&:last-child td": { borderBottom: 0 } }}
              >
                <TableCell
                  sx={{
                    maxWidth: 260,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "monospace"
                  }}
                  title={creative.id}
                >
                  {creative.id}
                </TableCell>
                <TableCell>
                  <a href={creative.assetUrl} target="_blank" rel="noreferrer">
                    Open image
                  </a>
                </TableCell>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {new Date(creative.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Remove creative">
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={isDeleting}
                        aria-label={`Remove creative ${creative.id}`}
                        onClick={() => onDeleteCreative(creative.id)}
                        sx={{ width: 32, height: 32 }}
                      >
                        <span aria-hidden="true" style={{ fontSize: 24 }}>
                          {isDeleting ? "..." : "\u2212"}
                        </span>
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}