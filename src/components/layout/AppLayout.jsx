import { Suspense, useState } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import LoadingState from "../common/LoadingState";
import DemoModeBanner from "../common/DemoModeBanner";
import Seo from "../common/Seo";
import navigation from "../../constants/navigation";
import { isDemoMode } from "../../utils/demoMode";

function useActivePageMeta(pathname) {
  const activeItem = navigation.find((item) => item.path === pathname);

  return {
    title: activeItem?.title || "Dashboard",
    description: activeItem?.subtitle
      ? `${activeItem.subtitle} — manage your business with SmartBizzSystem.`
      : "Manage your business with SmartBizzSystem.",
  };
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { title: activePageTitle, description: activePageDescription } =
    useActivePageMeta(location.pathname);

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
      <Seo
        noindex
        title={activePageTitle}
        description={activePageDescription}
        path={location.pathname}
      />

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

        {isDemoMode() ? <DemoModeBanner /> : null}

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