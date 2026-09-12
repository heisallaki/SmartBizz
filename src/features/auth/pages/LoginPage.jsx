import { Box, Paper, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background:
          "linear-gradient(135deg,#7C3AED,#0F766E)",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 3, sm: 4, md: 5 },
          width: { xs: "100%", sm: 420 },
          maxWidth: 420,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          SBS
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
        >
          Welcome back
        </Typography>

        <LoginForm />
      </Paper>
    </Box>
  );
}