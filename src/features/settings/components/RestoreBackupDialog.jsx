import PropTypes from "prop-types";
import { useRef } from "react";

import { RestoreRounded } from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

export default function RestoreBackupDialog({
  open,
  loading,
  selectedFile,
  error,
  onClose,
  onRestore,
  onFileSelect,
}) {
  const fileInputRef = useRef(null);

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onFileSelect(file);

    event.target.value = "";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Restore From Backup File
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3}>
          <Alert severity="warning">
            This replaces all business data (products, sales, customers, invoices, suppliers,
            purchase orders, and expenses) with the contents of the selected backup file. This
            cannot be undone.
          </Alert>

          <Box
            sx={{
              border: (theme) =>
                `2px dashed ${theme.palette.warning.main}`,
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Stack spacing={2} alignItems="center">
              <RestoreRounded
                color="warning"
                fontSize="large"
              />

              <Typography variant="body2">
                {selectedFile
                  ? selectedFile.name
                  : "No file selected"}
              </Typography>

              <Button
                variant="outlined"
                color="warning"
                onClick={handleBrowse}
                disabled={loading}
              >
                Choose Backup File
              </Button>
            </Stack>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Supported format: <strong>.json</strong> files created by SmartBizz&apos;s
            &quot;Backup Now&quot; action.
          </Typography>

          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : null}

          <input
            ref={fileInputRef}
            hidden
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="warning"
          onClick={onRestore}
          disabled={!selectedFile || loading}
        >
          {loading ? "Restoring..." : "Restore"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RestoreBackupDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  selectedFile: PropTypes.object,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onRestore: PropTypes.func.isRequired,
  onFileSelect: PropTypes.func.isRequired,
};

RestoreBackupDialog.defaultProps = {
  loading: false,
  selectedFile: null,
  error: "",
};