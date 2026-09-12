import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

import navigation from "../../constants/navigation";
import useAuth from "../../features/auth/hooks/useAuth";

const SIDEBAR_WIDTH = 280;

export default function Sidebar({ mobileOpen = false, onMobileClose = () => {} }) {
  const { user } = useAuth();

  const visibleNavigation = navigation.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  );

  const handleNavigate = () => {
    onMobileClose();
  };

  const brandHeader = (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} color="primary">
        SBS
      </Typography>

      <Typography variant="body2" color="text.secondary">
        SmartBizzSystem
      </Typography>
    </Box>
  );

  const navList = (
    <List sx={{ flex: 1, mt: 1, overflowY: "auto" }}>
      {visibleNavigation.map((item) => {
        const Icon = item.icon;

        return (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={handleNavigate}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,

              "&.active": {
                bgcolor: "primary.main",
                color: "white",

                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        );
      })}
    </List>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", lg: "none" },

          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: SIDEBAR_WIDTH,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {brandHeader}
        <Divider />
        {navList}
      </Drawer>

      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          height: "100vh",
          bgcolor: "background.paper",
          borderRight: 1,
          borderColor: "divider",
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
        }}
      >
        {brandHeader}
        <Divider />
        {navList}
      </Box>
    </>
  );
}