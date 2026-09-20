import { Box, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export function LegalSection({ heading, children }) {
  return (
    <Box sx={{ mb: 4, "&:last-child": { mb: 0 } }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {heading}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
        {children}
      </Typography>
    </Box>
  );
}

export default function LegalPageLayout({ title, subtitle, lastUpdated, children }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        sx={{
          background: "linear-gradient(135deg,#7C3AED,#0F766E)",
          color: "#F9FAFB",
          px: { xs: 3, sm: 6 },
          py: { xs: 5, sm: 7 },
        }}
      >
        <Container maxWidth="md" disableGutters>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            fontWeight={800}
            sx={{ textDecoration: "none", color: "inherit", display: "inline-block" }}
          >
            SmartBizz
          </Typography>

          <Typography variant="h3" fontWeight={800} sx={{ mt: 2, fontSize: { xs: "1.75rem", sm: "2.5rem" } }}>
            {title}
          </Typography>

          {subtitle ? (
            <Typography variant="body1" sx={{ mt: 1.5, opacity: 0.92, maxWidth: 640 }}>
              {subtitle}
            </Typography>
          ) : null}

          {lastUpdated ? (
            <Typography variant="caption" sx={{ display: "block", mt: 3, opacity: 0.8 }}>
              Last updated: {lastUpdated}
            </Typography>
          ) : null}
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: 1,
            borderColor: "divider",
          }}
        >
          {children}
        </Paper>
      </Container>
    </Box>
  );
}