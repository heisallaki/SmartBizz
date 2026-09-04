import { Box, Button, Typography } from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import { Link } from "react-router-dom";

function BrandIconBackdrop() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: "blur(9px)",
          opacity: 0.3,
        }}
      >
        <defs>
          <linearGradient id="cartGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
          <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>

        <g transform="translate(70,260) scale(16)">
          <path
            d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"
            fill="url(#cartGradient)"
          />
        </g>

        <g transform="translate(980,120)">
          <rect x="0" y="220" width="46" height="160" rx="8" fill="url(#barGradient)" />
          <rect x="70" y="160" width="46" height="220" rx="8" fill="url(#barGradient)" />
          <rect x="140" y="100" width="46" height="280" rx="8" fill="url(#barGradient)" />
          <rect x="210" y="40" width="46" height="340" rx="8" fill="url(#barGradient)" />

          <g transform="translate(-10,-40) scale(11)">
            <path
              d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"
              fill="url(#arrowGradient)"
            />
          </g>
        </g>
      </Box>
    </Box>
  );
}

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        px: 3,
        py: 6,
        background:
          "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(124,58,237,0.35), transparent 45%), radial-gradient(circle at 50% 90%, rgba(15,118,110,0.35), transparent 50%), linear-gradient(135deg, #0B1220 0%, #111827 50%, #0B1220 100%)",
      }}
    >
      <BrandIconBackdrop />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
          textAlign: "center",
          borderRadius: 6,
          px: { xs: 4, sm: 6 },
          py: { xs: 5, sm: 7 },
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: { xs: "4.5rem", sm: "6rem" },
            lineHeight: 1,
            letterSpacing: "-0.03em",
            backgroundImage: "linear-gradient(135deg, #60A5FA, #A855F7 55%, #2DD4BF)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{
            color: "#F9FAFB",
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          Page not found
        </Typography>

        <Typography
          sx={{
            color: "rgba(229,231,235,0.75)",
            mb: 4,
            fontSize: "0.95rem",
            lineHeight: 1.7,
          }}
        >
          The page you are looking for does not exist, was moved, or is
          temporarily unavailable. Let's get you back to managing your
          business.
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          size="large"
          startIcon={<DashboardRoundedIcon />}
          sx={{
            px: 4,
            py: 1.4,
            fontWeight: 700,
            borderRadius: 3,
            background: "linear-gradient(135deg, #2563EB, #7C3AED)",
            boxShadow: "0 10px 30px rgba(124,58,237,0.35)",
            "&:hover": {
              background: "linear-gradient(135deg, #1D4ED8, #6D28D9)",
              boxShadow: "0 12px 34px rgba(124,58,237,0.45)",
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}