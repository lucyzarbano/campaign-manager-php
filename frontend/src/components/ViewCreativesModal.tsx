import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Campaign } from "../types/Campaign";
import type { Creative } from "../types/Creative";
import {
    create_creative,
    delete_creative,
    fetch_creatives_by_campaign_id
} from "../api/creative";
import { CreativeTable } from "./CreativeTable";
import { file_to_data_url } from "../utils/files";

interface ViewCreativeModalProps {
    open: boolean;
    campaign: Campaign;
    onClose: () => void;
}

export function ViewCreativeModal({
    open,
    campaign,
    onClose
}: ViewCreativeModalProps) {
    const [creatives, setCreatives] = useState<Creative[]>([]);
    const [error, setError] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [selectedFile, setSelectedFile] = useState<File>();
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingCreativeId, setDeletingCreativeId] = useState<string | null>(
        null
    );
    const [uploadError, setUploadError] = useState("");

    const loadCreatives = async (selectedCampaign: Campaign) => {
        try {
            setIsLoading(true);
            setError("");
            const campaignCreatives = await fetch_creatives_by_campaign_id(
                selectedCampaign.id
            );
            setCreatives(campaignCreatives);
        } catch {
            setError("Unable to load creatives for this campaign");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCreative = async (creativeId: string) => {
        try {
            setDeletingCreativeId(creativeId);
            setDeleteError("");
            await delete_creative(campaign.id, creativeId);
            await loadCreatives(campaign);
        } catch (error) {
            setDeleteError(
                error instanceof Error
                    ? error.message
                    : "Unable to delete creative"
            );
        } finally {
            setDeletingCreativeId(null);
        }
    };

    const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0]);
        setUploadError("");
    };

    const handleCreateCreative = async () => {
        if (!selectedFile) {
            setUploadError("Please select an image first");
            return;
        }

        try {
            setIsUploading(true);
            setUploadError("");
            const assetUrl = await file_to_data_url(selectedFile);
            await create_creative(campaign.id, { assetUrl });
            await loadCreatives(campaign);
            setSelectedFile(undefined);
        } catch (error) {
            setUploadError(
                error instanceof Error
                    ? error.message
                    : "Unable to upload creative"
            );
        } finally {
            setIsUploading(false);
        }
    };

    useEffect(() => {
        let isCancelled = false;

        fetch_creatives_by_campaign_id(campaign.id)
            .then((campaignCreatives) => {
                if (!isCancelled) {
                    setCreatives(campaignCreatives);
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setError("Unable to load creatives for this campaign");
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [campaign.id]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2
                    }}
                >
                    <Box>
                        <Typography variant="h6" component="h2">
                            Campaign creatives
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {campaign.name}
                        </Typography>
                    </Box>
                    <Chip
                        label={`${creatives.length} / 3`}
                        color={creatives.length >= 3 ? "warning" : "default"}
                        size="small"
                    />
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                    {isLoading && (
                        <Box className="feedback-state" role="status">
                            <CircularProgress size={24} />
                            <Typography>Loading creatives...</Typography>
                        </Box>
                    )}

                    {!isLoading && error && (
                        <Alert severity="error">{error}</Alert>
                    )}

                    {!isLoading && !error && creatives.length === 0 && (
                        <Alert severity="info">
                            No creatives found for this campaign.
                        </Alert>
                    )}

                    {!isLoading && !error && creatives.length > 0 && (
                        <CreativeTable
                            creatives={creatives}
                            deletingCreativeId={deletingCreativeId}
                            onDeleteCreative={handleDeleteCreative}
                        />
                    )}

                    {deleteError && <Alert severity="error">{deleteError}</Alert>}

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2">Upload creative</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Images must be exactly 320 x 480 pixels.
                        </Typography>
                    </Box>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.5}
                        sx={{ alignItems: { sm: "center" } }}
                    >
                        <Button component="label" variant="outlined">
                            Choose image
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleUploadFile}
                            />
                        </Button>

                        <Typography
                            variant="body2"
                            color={selectedFile ? "text.primary" : "text.secondary"}
                            sx={{ overflowWrap: "anywhere", flex: 1 }}
                        >
                            {selectedFile?.name ?? "No image selected"}
                        </Typography>

                        <Button
                            variant="contained"
                            onClick={handleCreateCreative}
                            disabled={!selectedFile || isUploading}
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </Stack>

                    {uploadError && <Alert severity="error">{uploadError}</Alert>}
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}