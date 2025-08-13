import React, { useContext } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import WorkIcon from "@mui/icons-material/Work";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { ServiceReqContext } from "./structure/serviceReq/ServiceReqProvider";
import { useNavigate } from "react-router-dom";
import RateReviewIcon from "@mui/icons-material/RateReview";
import {
  Logout, // Default logout icon (→)
  ExitToApp, // Alternative (⬆→)
  PowerSettingsNew, // Power symbol (⏻)
} from "@mui/icons-material";
const drawerWidth = 280;

interface NavBarProps {
  role: string;
  name: string;
}

const NavbarHomeowner: React.FC<NavBarProps> = ({ role }) => {
  const context = useContext(ServiceReqContext);
  const navigate = useNavigate();
  if (!context) return null;

  const { openServiceReqModal } = context;

  const allItems = [
    {
      name: "Dashboard Overview",
      icon: <DashboardIcon color="error" />,
      onClick: () => navigate("/hmdashboard"),
    },
    {
      name: "Create Service Request",
      icon: <AddCircleOutlineIcon color="info" />,
      onClick: () => {
        openServiceReqModal();
        document.activeElement?.blur();
      },
    },
    {
      name: "My Service Requests",
      icon: <ListAltIcon color="warning" />,
      onClick: () => navigate("/hmServiceReqlist"),
    },
    {
      name: "Jobs",
      icon: <WorkIcon color="success" />,
      onClick: () => navigate("/hmJoblist"),
    },
    {
      name: "Quotes",
      icon: <RequestQuoteIcon color="error" />,
      onClick: () => navigate("/quotes"),
    },

    {
      name: "Reviews",
      icon: <RateReviewIcon color="primary" />,
      onClick: () => navigate("/review"),
    },
    {
      name: "Payments",
      icon: <PaymentIcon color="info" />,
      onClick: () => navigate("/payments"),
    },
    {
      name: "Profile / Account",
      icon: <AccountCircleIcon color="error" />,
      onClick: () => navigate("/account"),
    },
  ];

  // Role-based filtering
  const hiddenForRoles: Record<string, string[]> = {
    homeowner: ["Quotes"],
    provider: ["Create Service Request"],
  };

  //!filtering based on roles
  const filteredItems = allItems.filter(
    (item) => !hiddenForRoles[role]?.includes(item.name)
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "linear-gradient(90deg, #00425f, #0096c7)",
          // background: "linear-gradient(90deg, #131fa8, #c75cf4)",
          // background: "linear-gradient(135deg,rgb(119, 86, 172) 0%, #d65db1 100%)",
          borderRadius: "2px",
        },
      }}
    >
      <Toolbar sx={{ p: 2 }}>
        <Typography
          sx={{ color: "white" }}
          variant="h6"
          noWrap
          component="div"
          fontWeight="bold"
        >
          Dashboard
        </Typography>
      </Toolbar>
      <Divider />

      <List>
        {filteredItems.map((item, index) => (
          <ListItemButton key={index} onClick={item.onClick}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              sx={{
                color: "#ffffff", // White text (ideal for #d65db1 background)
                "& .MuiTypography-root": {
                  // Target the nested Typography component
                  fontWeight: 500, // Optional: Adjust font weight
                },
              }}
              primary={
                item.name === "My Service Requests"
                  ? role === "provider"
                    ? "Service Requests"
                    : "My Service Requests"
                  : item.name
              }
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PowerSettingsNew sx={{ color: "#9d4400" }} />}
          fullWidth
          sx={{
            background: "#e6f4f1",
            color: "#9d4400",
            borderColor: "#9d4400",
            borderRadius: "8px",
            py: 1.5,
            textTransform: "none",
            fontSize: "16px",
            fontWeight: 500,
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#9d4400",
              color: "#fff",
              borderColor: "#9d4400",
              boxShadow: "0 4px 12px rgba(157, 68, 0, 0.2)",
              transform: "translateY(-1px)",
              "& .MuiSvgIcon-root": {
                color: "#fff", // Ensures icon color changes on hover
              },
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};

export default NavbarHomeowner;
