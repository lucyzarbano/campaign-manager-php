import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import { useState } from "react";
import type { Campaign } from "../types/Campaign";
import type { CampaignUpdate } from "../types/CampaignUpdate";

interface EditCampaignModalProps {
    open: boolean;
    campaign: Campaign;
    onClose: () => void;
    onSave: (campaign: CampaignUpdate) => Promise<void>;
}

export function EditCampaignModal({
    open,
    campaign,
    onClose,
    onSave
}: EditCampaignModalProps) {
    const [name, setName] = useState(campaign.name);
    const [status, setStatus] = useState<"1" | "0">(
        String(campaign.status) as "0" | "1"
    );
    const [landingUrl, setLandingUrl] = useState(campaign.landingUrl);
    const [coverImageUrl, setCoverImageUrl] = useState(campaign.coverImageUrl);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setIsSaving(true);
            await onSave({
                id: campaign.id,
                name,
                status: Number(status) as 0 | 1,
                landingUrl,
                coverImageUrl
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit campaign</DialogTitle>
            <Divider />

            <DialogContent>
                <Stack
                    component="form"
                    id="edit-campaign-form"
                    spacing={2}
                    sx={{ pt: 1 }}
                    onSubmit={handleSubmit}
                >
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        fullWidth
                        required
                    />

                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            value={status}
                            onChange={(event) =>
                                setStatus(event.target.value as "0" | "1")
                            }
                        >
                            <MenuItem value="1">Active</MenuItem>
                            <MenuItem value="0">Paused</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        label="Landing URL"
                        type="url"
                        value={landingUrl}
                        onChange={(event) => setLandingUrl(event.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Cover image URL"
                        type="url"
                        value={coverImageUrl}
                        onChange={(event) => setCoverImageUrl(event.target.value)}
                        fullWidth
                        required
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    form="edit-campaign-form"
                    variant="contained"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}