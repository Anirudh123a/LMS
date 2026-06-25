import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogContent,
  Button,
  Stack,
} from "@mui/material";
import {
  Close,
  Menu,
  Dashboard,
  MenuBook,
  Assignment,
  EmojiEvents,
  Person,
  Help,
  Logout,
  Psychology,
  Error, // Changed from ErrorOutline to solve the exact pre-bundling crash
} from "@mui/icons-material";

const NAV_ITEMS = [
  { label: "Dashboard", icon: <Dashboard sx={{ fontSize: 20 }} />, path: "/student" },
  { label: "My Courses", icon: <MenuBook sx={{ fontSize: 20 }} />, path: "/mycourses" },
  { label: "Assignments", icon: <Assignment sx={{ fontSize: 20 }} />, path: "/assignments" },
  { label: "Certificates", icon: <EmojiEvents sx={{ fontSize: 20 }} />, path: "/certificates" },
  { label: "Profile", icon: <Person sx={{ fontSize: 20 }} />, path: "/profile" },
  { label: "AI Interview", icon: <Psychology sx={{ fontSize: 20 }} />, path: "/aiinterview", isAI: true },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // State to control Logout Modal visibility
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Read the state from localStorage so it persists when you change routes
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  // Helper function to toggle and save state
  const toggleSidebar = (e) => {
    e.stopPropagation();
    setSidebarOpen((prev) => {
      const newState = !prev;
      localStorage.setItem("sidebarOpen", JSON.stringify(newState));
      return newState;
    });
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    e.stopPropagation(); 
    navigate(path);
  };

  // Handler for confirmed logout action execution
  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    navigate("/login"); 
  };

  return (
    <>
      <Box
        sx={{
          width: sidebarOpen ? 240 : 70,
          minWidth: sidebarOpen ? 240 : 70,
          bgcolor: "#0f172a", // Slate 900
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          transition: "width 0.22s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
          overflow: "hidden",
          borderRight: "1px solid #1e293b",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            px: sidebarOpen ? 2.5 : 1,
            py: 2.5,
            borderBottom: "1px solid #1e293b",
            minHeight: 70,
          }}
        >
          {sidebarOpen && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <Box sx={{ bgcolor: "#4f46e5", borderRadius: "10px", p: 0.8, display: "flex", flexShrink: 0 }}>
                <MenuBook sx={{ color: "#fff", fontSize: 20 }} />
              </Box>
              <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: "0.5px", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>
                EduPlatform
              </Typography>
            </Box>
          )}

          <IconButton
            size="small"
            onClick={toggleSidebar}
            sx={{ color: "#94a3b8", "&:hover": { color: "#fff", bgcolor: "#1e293b" }, flexShrink: 0 }}
          >
            {sidebarOpen ? <Close fontSize="small" /> : <Menu fontSize="small" />}
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <List dense sx={{ px: sidebarOpen ? 1.5 : 1, mt: 2.5, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Tooltip key={item.label} title={!sidebarOpen ? item.label : ""} placement="right" arrow>
                <ListItem disablePadding sx={{ display: "block", mb: 0.8 }}>
                  <ListItemButton
                    onClick={(e) => handleNavigation(e, item.path)}
                    sx={{
                      borderRadius: "10px",
                      py: 1.2,
                      px: sidebarOpen ? 2 : 1,
                      justifyContent: sidebarOpen ? "flex-start" : "center",
                      background: isActive && item.isAI 
                        ? "linear-gradient(135deg, #4f46e5, #7c3aed)" 
                        : isActive 
                        ? "rgba(79, 70, 229, 0.15)" 
                        : "transparent",
                      borderLeft: isActive && !item.isAI ? "4px solid #4f46e5" : "4px solid transparent",
                      borderRadius: isActive && !item.isAI ? "0px 10px 10px 0px" : "10px",
                      "&:hover": {
                        background: item.isAI 
                          ? "linear-gradient(135deg, #4338ca, #6d28d9)" 
                          : isActive 
                          ? "rgba(79, 70, 229, 0.2)" 
                          : "#1e293b",
                      },
                      color: isActive ? "#fff" : "#cbd5e1",
                      minWidth: 0,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarOpen ? 34 : 0,
                        color: isActive ? "#818cf8" : item.isAI ? "#c4b5fd" : "#94a3b8",
                        justifyContent: "center",
                        pointerEvents: "none", 
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {sidebarOpen && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, pointerEvents: "none" }}>
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: isActive ? 800 : 700, // Strong, rich corporate weight
                            color: isActive ? "#fff" : "#94a3b8",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.3px",
                            fontFamily: "'Inter', sans-serif"
                          }}
                        />
                        {item.isAI && (
                          <Box
                            sx={{
                              bgcolor: "rgba(168,85,247,0.25)",
                              border: "1px solid rgba(168,85,247,0.5)",
                              borderRadius: "6px",
                              px: 0.8,
                              py: 0.2,
                              display: "flex",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#d8b4fe", letterSpacing: 0.5 }}>
                              NEW
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          })}
        </List>

        {/* Bottom Actions — Help & Logout */}
        <Box sx={{ px: sidebarOpen ? 1.5 : 1, pb: 3, borderTop: "1px solid #1e293b", pt: 2 }}>
          <Tooltip title={!sidebarOpen ? "Help & Support" : ""} placement="right" arrow>
            <ListItem disablePadding sx={{ display: "block", mb: 0.8 }}>
              <ListItemButton
                onClick={(e) => e.stopPropagation()} 
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  px: sidebarOpen ? 2 : 1,
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  "&:hover": { bgcolor: "#1e293b" },
                }}
              >
                <ListItemIcon sx={{ minWidth: sidebarOpen ? 34 : 0, color: "#94a3b8", justifyContent: "center", pointerEvents: "none" }}>
                  <Help sx={{ fontSize: 20 }} />
                </ListItemIcon>
                {sidebarOpen && (
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>
                    Help & Support
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>

          <Tooltip title={!sidebarOpen ? "Logout" : ""} placement="right" arrow>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={(e) => {
                  e.stopPropagation();
                  setLogoutDialogOpen(true);
                }}
                sx={{
                  borderRadius: "10px",
                  py: 1.2,
                  px: sidebarOpen ? 2 : 1,
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  "&:hover": { bgcolor: "rgba(239, 68, 68, 0.12)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: sidebarOpen ? 34 : 0, color: "#f87171", justifyContent: "center", pointerEvents: "none" }}>
                  <Logout sx={{ fontSize: 20 }} />
                </ListItemIcon>
                {sidebarOpen && (
                  <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#f87171", whiteSpace: "nowrap", fontFamily: "'Inter', sans-serif" }}>
                    Logout
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </Box>
      </Box>

      {/* ── Premium High-End Logout Dialog Popup ── */}
      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        BackdropProps={{
          sx: { backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }
        }}
        PaperProps={{
          sx: {
            bgcolor: "#ffffff",
            color: "#0f172a",
            borderRadius: "20px",
            p: 1,
            maxWidth: 360,
            boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.15)"
          }
        }}
      >
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Stack alignItems="center" spacing={2.5} textAlign="center">
            {/* Safe & Universally Supported Alert Icon Wrapper */}
            <Box sx={{ bgcolor: "#fef2f2", p: 1.8, borderRadius: "50%", display: "inline-flex" }}>
              <Error sx={{ color: "#ef4444", fontSize: 36 }} />
            </Box>
            
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 19, color: "#0f172a", mb: 1, fontFamily: "'Inter', sans-serif" }}>
                Oh no! Leaving so soon?
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: 13.5, fontWeight: 600, lineHeight: 1.5, px: 1, fontFamily: "'Inter', sans-serif" }}>
                Are you sure you want to log out? You will need to sign back in to continue tracking your learning progress.
              </Typography>
            </Box>

            {/* Premium Action Control Block */}
            <Stack direction="row" spacing={1.5} sx={{ width: "100%", pt: 1 }}>
              <Button 
                fullWidth
                variant="outlined"
                onClick={() => setLogoutDialogOpen(false)}
                sx={{ 
                  textTransform: "none", 
                  color: "#475569", 
                  borderColor: "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 14,
                  borderRadius: "12px",
                  py: 1.2,
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": { bgcolor: "#f8fafc", borderColor: "#94a3b8" }
                }}
              >
                Cancel
              </Button>
              <Button 
                fullWidth
                onClick={handleConfirmLogout}
                variant="contained"
                sx={{ 
                  textTransform: "none", 
                  bgcolor: "#ef4444", 
                  color: "#fff", 
                  fontWeight: 800,
                  fontSize: 14,
                  borderRadius: "12px",
                  py: 1.2,
                  boxShadow: "none",
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": { bgcolor: "#dc2626", boxShadow: "none" }
                }}
              >
                Yes, Log out
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Sidebar;