import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import { useNavigate } from "react-router-dom";

import LoginForm from "../components/LoginForm";
import useAuth from "../hooks/useAuth";
import { startDemoSession } from "../../../utils/demoMode";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTryDemo = () => {
    startDemoSession(login);
    navigate("/");
  };

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

        <Divider sx={{ my: 3 }}>or</Divider>

        <Button
          fullWidth
          size="large"
          variant="outlined"
          startIcon={<ScienceRoundedIcon />}
          onClick={handleTryDemo}
          sx={{ fontWeight: 700 }}
        >
          Try Live Demo
        </Button>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          mt={1.5}
        >
          No account needed. Explore with sample data.
        </Typography>
      </Paper>
    </Box>
  );
}