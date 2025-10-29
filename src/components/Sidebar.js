import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import TimelineIcon from "@mui/icons-material/Timeline";
import LogoutIcon from "@mui/icons-material/Logout";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";

const Sidebar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const getMenuItems = (role) => {
    const baseItems = [
      { path: "/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
      { path: "/pcl/gestion", label: "Gestión PCL", icon: <DescriptionIcon /> },
    ];

    if (role === "Administrador") {
      baseItems.push({
        path: "/admin/usuarios",
        label: "Gestión Usuarios",
        icon: <PeopleIcon />,
      });
    } else if (role === "Evaluador Médico" || role === "Médico") {
      baseItems.push({
        path: "/dictamen/ingreso",
        label: "Ingreso Dictamen",
        icon: <MedicalInformationIcon />,
      });
    } else if (role === "Revisor de recursos") {
      baseItems.push({
        path: "/apelaciones/trazabilidad",
        label: "Trazabilidad Apelaciones",
        icon: <TimelineIcon />,
      });
    }

    return baseItems;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 3,
          background: theme.palette.primary.main,
          color: "#fff",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#fff",
            color: theme.palette.primary.main,
            width: 60,
            height: 60,
            mb: 1,
          }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>
        <Typography variant="h6" fontWeight="bold">
          PCL App
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Rol: {user?.role}
        </Typography>
      </Box>

      {/* MENÚ */}
      <List>
        {getMenuItems(user.role).map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* LOGOUT */}
      <Box sx={{ mt: "auto", mb: 2 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
