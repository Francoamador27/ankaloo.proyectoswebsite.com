import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { LogOut, Settings, Home, Users, ListChecks, Briefcase } from "lucide-react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  CssBaseline,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import UseAuth from "../hooks/useAuth";
import useCont from "../hooks/useCont";

const drawerWidth = 240;
const collapsedWidth = 72;

const menuItems = [
  { text: "Postulaciones", icon: <Users size={20} />, path: "/rrhh-dash/postulaciones" },
  { text: "Posiciones Abiertas", icon: <ListChecks size={20} />, path: "/rrhh-dash/vacantes" },
  { text: "Configuración", icon: <Settings size={20} />, path: "/rrhh-dash/configuracion" },
];

const RRHHSidebar = () => {
  const { company } = useCont();
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { logout, user } = UseAuth({ middleware: "auth" });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : collapsedWidth,
            transition: "width 0.3s ease",
            overflowX: "hidden",
            overflow: "hidden",
            boxShadow: 2,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            color: "#1c1c1c",
            borderRight: "1px solid #f1f5f9",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, minHeight: 64 }}>
          {open ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Briefcase size={22} style={{ color: "#fdce27" }} />
              <Typography variant="body2" fontWeight={900} sx={{ color: "#1c1c1c", fontSize: "0.8rem", letterSpacing: "0.03em", lineHeight: 1.2 }}>
                Gestión de<br />RRHH
              </Typography>
            </Box>
          ) : (
            <Tooltip title="Gestión de RRHH" placement="right">
              <Box sx={{ mx: "auto" }}>
                <Briefcase size={22} style={{ color: "#fdce27" }} />
              </Box>
            </Tooltip>
          )}

          <Tooltip title={open ? "Contraer menú" : "Expandir menú"} placement="right">
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{ ml: open ? 0 : "auto", color: "#1c1c1c", "&:hover": { color: "#fdce27" } }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ borderColor: "#f1f5f9" }} />

        {/* Info usuario */}
        {open && user && (
          <Box sx={{ px: 2, py: 1.5, backgroundColor: "#f8f9fa", borderBottom: "1px solid", borderColor: "#f1f5f9" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }} display="block" fontWeight={700}>
              Bienvenido,
            </Typography>
            <Typography variant="body2" fontWeight={600} noWrap sx={{ color: "#1c1c1c" }}>
              {user.name || user.email}
            </Typography>
          </Box>
        )}

        {/* Menú */}
        <List sx={{ flexGrow: 1, py: 1, overflow: "auto", minHeight: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");

            return (
              <Tooltip key={item.text} title={!open ? item.text : ""} placement="right">
                <NavLink to={item.path} style={{ textDecoration: "none", color: "inherit" }}>
                  <ListItemButton
                    selected={isActive}
                    sx={{
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 2,
                      backgroundColor: isActive ? "rgba(253, 206, 39, 0.1)" : "transparent",
                      color: isActive ? "#d9a800" : "#1c1c1c",
                      "&:hover": { backgroundColor: "#f8f9fa", color: "#d9a800" },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(253, 206, 39, 0.15)",
                        "&:hover": { backgroundColor: "rgba(253, 206, 39, 0.2)" },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: isActive ? 800 : 500, letterSpacing: "0.02em" }}
                      />
                    )}
                  </ListItemButton>
                </NavLink>
              </Tooltip>
            );
          })}
        </List>

        <Divider sx={{ borderColor: "#f1f5f9" }} />

        {/* Link al sitio */}
        {open && (
          <Tooltip title="Ver sitio web" placement="right">
            <ListItemButton
              component="a"
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ justifyContent: "initial", px: 2.5, mx: 1, my: 0.5, borderRadius: 2, color: "#64748b", "&:hover": { color: "#1c1c1c" } }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: "center", color: "inherit" }}>
                <Home size={18} />
              </ListItemIcon>
              <ListItemText primary="Ver sitio" primaryTypographyProps={{ fontSize: "0.8rem", fontWeight: 500 }} />
            </ListItemButton>
          </Tooltip>
        )}

        {/* Logout */}
        <Tooltip title={!open ? "Cerrar sesión" : ""} placement="right">
          <ListItemButton
            onClick={logout}
            sx={{
              justifyContent: open ? "initial" : "center",
              px: 2.5, mx: 1, my: 1,
              borderRadius: 1,
              maxHeight: "50px",
              backgroundColor: "error.main",
              color: "white",
              "&:hover": { backgroundColor: "error.dark" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "white" }}>
              <LogOut size={20} />
            </ListItemIcon>
            {open && (
              <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: "0.875rem", fontWeight: 600 }} />
            )}
          </ListItemButton>
        </Tooltip>
      </Drawer>

      <Box component="main" className="bg-gray-50 min-h-screen" sx={{ flexGrow: 1, p: 3, transition: "margin 0.3s ease" }}>
        <Box sx={{ minHeight: 64 }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default RRHHSidebar;
