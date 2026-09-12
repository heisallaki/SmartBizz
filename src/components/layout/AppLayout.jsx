import { Suspense, useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import LoadingState from "../common/LoadingState";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",       
        overflow: "hidden",    
        bgcolor: "background.default",
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerClose} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",     
          overflow: "hidden",  
          minWidth: 0,
        }}
      >
        <TopNavbar onMenuClick={handleDrawerToggle} />

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            py: { xs: 2, sm: 3, md: 4 },
            overflowY: "auto",
          }}
        >
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}