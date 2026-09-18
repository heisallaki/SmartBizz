import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

function getErrorMessage(error) {
  if (isRouteErrorResponse(error)) {
    return error.statusText || error.data?.message || "This page ran into a problem.";
  }
  if (error instanceof Error) return error.message;
  return "This page ran into an unexpected problem.";
}

export default function RouteErrorBoundary() {
  const navigate = useNavigate();
  const error = useRouteError();

  const message = getErrorMessage(error);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        px: 2,
        py: 6,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          p: { xs: 4, sm: 5 },
          borderRadius: 4,
          border: 1,
          borderColor: "divider",
        }}
      >
        <ErrorOutlineRoundedIcon color="error" sx={{ fontSize: 56, mb: 2 }} />

        <Typography variant="h6" fontWeight={700} gutterBottom>
          This page ran into a problem
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {message}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={handleReload}
          >
            Reload Page
          </Button>

          <Button
            variant="contained"
            startIcon={<DashboardRoundedIcon />}
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}