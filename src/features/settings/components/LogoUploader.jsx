import PropTypes from "prop-types";
import { useRef } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import SettingsCard from "./SettingsCard";

export default function LogoUploader({
  logo,
  businessName,
  onUpload,
  onRemove,
  disabled = false,
  uploading = false,
  error = "",
}) {
  const inputRef = useRef(null);

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    onUpload(file);

    event.target.value = "";
  };

  return (
    <SettingsCard
      title="Business Logo"
      description="Upload the logo displayed on invoices, receipts and reports."
    >
      <Stack
        spacing={3}
        alignItems="center"
      >
        <Box sx={{ position: "relative", width: 120, height: 120 }}>
          <Avatar
            src={logo || undefined}
            alt={businessName}
            sx={{
              width: 120,
              height: 120,
              fontSize: 36,
            }}
          >
            {!logo &&
              businessName?.charAt(0)?.toUpperCase()}
          </Avatar>

          {uploading ? (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.45)",
              }}
            >
              <CircularProgress size={32} sx={{ color: "#fff" }} />
            </Box>
          ) : null}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          PNG, JPG or WEBP, up to 2MB
          <br />
          Recommended size: 512 × 512 pixels
        </Typography>

        {error ? (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        ) : null}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
        >
          <Button
            variant="contained"
            onClick={handleBrowse}
            disabled={disabled || uploading}
          >
            {uploading ? "Uploading..." : logo ? "Replace Logo" : "Upload Logo"}
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={!logo || disabled || uploading}
            onClick={onRemove}
          >
            Remove
          </Button>
        </Stack>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileChange}
        />
      </Stack>
    </SettingsCard>
  );
}

LogoUploader.propTypes = {
  logo: PropTypes.string,
  businessName: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  uploading: PropTypes.bool,
  error: PropTypes.string,
};

LogoUploader.defaultProps = {
  logo: null,
  businessName: "",
  disabled: false,
  uploading: false,
  error: "",
};