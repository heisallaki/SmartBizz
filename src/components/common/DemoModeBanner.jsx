import { Box, Button, Typography } from "@mui/material";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import { useNavigate } from "react-router-dom";

import useAuth from "../../features/auth/hooks/useAuth";
import { endDemoSession } from "../../utils/demoMode";

export default function DemoModeBanner() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleExit = () => {
    endDemoSession(logout);
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 1, sm: 2 },
        px: { xs: 2, sm: 3 },
        py: 1,
        textAlign: "center",
        color: "#F9FAFB",
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(15,118,110,0.92))",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <ScienceRoundedIcon fontSize="small" />

        <Typography variant="body2" fontWeight={600}>
          Live Demo Mode — you are exploring with sample data. Nothing you do here is saved.
        </Typography>
      </Box>

      <Button
        onClick={handleExit}
        size="small"
        variant="outlined"
        sx={{
          color: "#F9FAFB",
          borderColor: "rgba(255,255,255,0.5)",
          fontWeight: 700,
          flexShrink: 0,
          "&:hover": {
            borderColor: "#F9FAFB",
            background: "rgba(255,255,255,0.12)",
          },
        }}
      >
        Exit Demo
      </Button>
    </Box>
  );
}