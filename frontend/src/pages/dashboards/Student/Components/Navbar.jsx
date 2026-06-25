import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { keyframes } from "@mui/system";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  InputBase,
  Tooltip,
  Divider,
  Button,
  Dialog,
  DialogContent,
  Stack,
} from "@mui/material";
import {
  Search,
  NotificationsNone,
  Home,
  LightMode,
  DarkMode,
  NavigateNext,
  School,
  ShoppingBag,
  Settings,
  Update,
  Help,
  Logout,
  Error,
} from "@mui/icons-material";
 
// ─── path → page name map ─────────────────────────────────────────────────────
const PAGE_NAMES = {
  "/student":      "Dashboard",
  "/mycourses":    "My Courses",
  "/assignments":  "Assignments",
  "/quiz":         "Quiz",
  "/certificates": "Certificates",
  "/profile":      "Profile",
  "/ai-interview": "AI Interview",
};
 
// ─── Profile menu items ───────────────────────────────────────────────────────
const PROFILE_MENU = [
  { label: "My Learning",  icon: <School    sx={{ fontSize: 17, color: "#475569" }} /> },
  { label: "My Purchases", icon: <ShoppingBag sx={{ fontSize: 17, color: "#475569" }} /> },
  { label: "Settings",     icon: <Settings  sx={{ fontSize: 17, color: "#475569" }} /> },
  { label: "Updates",      icon: <Update    sx={{ fontSize: 17, color: "#475569" }} /> },
  { label: "Help Center",  icon: <Help      sx={{ fontSize: 17, color: "#475569" }} /> },
  { label: "Log Out",      icon: <Logout    sx={{ fontSize: 17, color: "#e11d48" }} />, danger: true },
];
 
// ─── Reusable outside-click hook ─────────────────────────────────────────────
function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) callback();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, callback]);
}
 
function Navbar({ title }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useOutsideClick(notifRef,   () => setNotifOpen(false));
  useOutsideClick(profileRef, () => setProfileOpen(false));

  const pageName = title || PAGE_NAMES[location.pathname] || "Dashboard";

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };
 
  // Shared icon button style
 const bellShake = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(-12deg); }
  30% { transform: rotate(12deg); }
  45% { transform: rotate(-8deg); }
  60% { transform: rotate(8deg); }
  75% { transform: rotate(-4deg); }
  100% { transform: rotate(0deg); }
`;
  
  const iconBtnSx = {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: darkMode ? "#94a3b8" : "#475569",
    transition: "all 0.2s ease",
    "&:hover": { bgcolor: darkMode ? "#334155" : "#f1f5f9" },
  };
 
  // Shared popup box style
  const popupSx = {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    bgcolor: "#fff",
    borderRadius: "14px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
    border: "1px solid #e2e8f0",
    zIndex: 1400,
    overflow: "hidden",
    animation: "fadeInDown 0.18s ease",
    "@keyframes fadeInDown": {
      from: { opacity: 0, transform: "translateY(-8px)" },
      to:   { opacity: 1, transform: "translateY(0)" },
    },
  };
 
  return (
    <>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3.5,
        py: 1.8,
        bgcolor: darkMode ? "#1e293b" : "#fff",
        borderBottom: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
        minHeight: 64,
        transition: "background 0.3s ease",
        position: "relative",
      }}
    >
      {/* ── Left: Breadcrumb ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
        <Home sx={{ fontSize: 16, color: darkMode ? "#94a3b8" : "#64748b" }} />
        <Typography sx={{ fontSize: 13.5, color: darkMode ? "#94a3b8" : "#64748b", fontWeight: 500 }}>
          Student
        </Typography>
        <NavigateNext sx={{ fontSize: 16, color: darkMode ? "#475569" : "#94a3b8" }} />
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: darkMode ? "#e2e8f0" : "#0f172a" }}>
          {pageName}
        </Typography>
      </Box>
 
      {/* ── Right: Search + actions ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
 
        {/* Search bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: darkMode ? "#0f172a" : "#f1f5f9",
            borderRadius: "50px",
            overflow: "hidden",
            width: 280,
            border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
            mr: 1,
          }}
        >
          <InputBase
            placeholder="Search..."
            sx={{
              flex: 1, fontSize: 13.5,
              color: darkMode ? "#e2e8f0" : "#475569",
              pl: 2, pr: 1,
              "& input::placeholder": { color: darkMode ? "#ffffff" : "#202122" },
            }}
          />
          <Box sx={{ bgcolor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: "50%", m: "3px", flexShrink: 0, cursor: "pointer", "&:hover": { bgcolor: "#1d4ed8" }, transition: "background 0.2s" }}>
            <Search sx={{ fontSize: 17, color: "#fff" }} />
          </Box>
        </Box>
 
        {/* ── Icon group ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
 
          {/* ── Notification bell + popup ── */}
          <Box ref={notifRef} sx={{ position: "relative" }}>
            <Tooltip title="Notifications" arrow open={!notifOpen ? undefined : false}>
              <IconButton
                sx={{ ...iconBtnSx, bgcolor: notifOpen ? (darkMode ? "#334155" : "#f1f5f9") : "transparent" ,"&:hover svg": {
      animation: `${bellShake} 0.5s ease`,
    },}}
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              >
                <NotificationsNone sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
 
            {/* Notification popup */}
            {notifOpen && (
              <Box sx={{ ...popupSx, width: 320 }}>
                {/* Header */}
                <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid #f1f5f9" }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                    Notifications
                  </Typography>
                </Box>
                {/* Empty state */}
                <Box sx={{ px: 2.5, py: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 52, height: 52, borderRadius: "50%", bgcolor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <NotificationsNone sx={{ fontSize: 26, color: "#94a3b8" }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
                    No notifications
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 1.5 }}>
                    We'll let you know when deadlines are approaching, or there is a course update
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
 
          {/* Dark / Light toggle */}
          <Tooltip title={darkMode ? "Switch to Light" : "Switch to Dark"} arrow>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{
                ...iconBtnSx,
                "&:hover": { bgcolor: darkMode ? "#334155" : "#f1f5f9", "& svg": { transform: "rotate(20deg)" } },
                "& svg": { transition: "transform 0.25s ease" },
              }}
            >
              {darkMode
                ? <LightMode sx={{ fontSize: 20, color: "#fbbf24" }} />
                : <DarkMode sx={{ fontSize: 20 }} />
              }
            </IconButton>
          </Tooltip>
 
          {/* ── Profile avatar + popup ── */}
          <Box ref={profileRef} sx={{ position: "relative" }}>
            <Tooltip title="George David" arrow open={!profileOpen ? undefined : false}>
              <Avatar
                onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                sx={{
                  bgcolor: "#1e2972",
                  width: 26, height: 26,
                  fontSize: 14, fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  outline: profileOpen ? "2px solid #2563eb" : "none",
                  outlineOffset: "2px",
                  "&:hover": { opacity: 0.88 },
                }}
              >
                D
              </Avatar>
            </Tooltip>

            {/* Profile popup */}
            {profileOpen && (
              <Box sx={{ ...popupSx, width: 200 }}>
                {PROFILE_MENU.map((item, i) => (
                  <Box key={item.label}>
                    {i === PROFILE_MENU.length - 1 && (
                      <Divider sx={{ borderColor: "#f1f5f9", mx: 1 }} />
                    )}
                    <Box
                      sx={{
                        display: "flex", alignItems: "center", gap: 1.5,
                        px: 2, py: 1.4,
                        cursor: "pointer",
                        transition: "background 0.15s",
                        "&:hover": { bgcolor: "#f8fafc" },
                      }}
                      onClick={item.danger ? () => { setProfileOpen(false); setLogoutDialogOpen(true); } : undefined}
                    >
                      {item.icon}
                      <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: item.danger ? "#e11d48" : "#0f172a" }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* ── Standalone Logout Button ── */}
          <Tooltip title="Log out of your account" arrow>
            <Box
              onClick={() => setLogoutDialogOpen(true)}
              sx={{
                display: "flex", alignItems: "center", gap: 0.8,
                px: 1.5, py: 0.7,
                borderRadius: "8px",
                bgcolor: "#fff1f2",
                border: "1px solid #fecdd3",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: "#ffe4e6", borderColor: "#fda4af" },
                ml: 0.5,
              }}
            >
              <Logout sx={{ fontSize: 15, color: "#e11d48" }} />
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#e11d48", whiteSpace: "nowrap" }}>
                Log Out
              </Typography>
            </Box>
          </Tooltip>

        </Box>
      </Box>
    </Box>

      {/* ── Logout Confirmation Dialog ── */}
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
                onClick={handleLogout}
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

export default Navbar;