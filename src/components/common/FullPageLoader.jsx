import { Box, CircularProgress } from "@mui/material";

export default function FullPageLoader() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      width="100%"
    >
      <CircularProgress />
    </Box>
  );
}