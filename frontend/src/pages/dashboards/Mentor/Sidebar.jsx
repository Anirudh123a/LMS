import { Box, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import VideoLibraryRoundedIcon from '@mui/icons-material/VideoLibraryRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const navItems = [
  { label: 'Dashboard', Icon: DashboardRoundedIcon, path: '/mentor', end: true },
  { label: 'My Courses', Icon: VideoLibraryRoundedIcon, path: '/mentor/courses', end: false },
  { label: 'Assignments', Icon: AssignmentRoundedIcon, path: '/mentor/assignments', end: false },
  { label: 'Students', Icon: PeopleRoundedIcon, path: '/mentor/students', end: false },
  { label: 'Profile Settings', Icon: AccountCircleRoundedIcon, path: '/mentor/profile', end: false },
];

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onClose) onClose();
    // Add your runtime sign-out clear configurations here
    navigate('/login');
  };

  return (
    <Box
      component="aside"
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #16062B 0%, #320E5E 30%, #623E98 65%, #9B75C9 100%)',
        boxShadow: '0 0 20px rgba(155, 117, 201, 0.6)',
        overflow: 'hidden',
      }}
    >
      {/* Brand Header */}
      <Box sx={{ px: 2.5, pt: 3, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 30, height: 30, bgcolor: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <SchoolRoundedIcon sx={{ color: '#320E5E', fontSize: '1rem' }} />
        </Box>
        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>
          LMS
        </Typography>
      </Box>

      {/* Sub-Header Title Shield */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Box sx={{ display: 'inline-block', background: 'linear-gradient(135deg, #9B75C9, #CBB6E6, #F3EBFB)', color: '#16062B', px: 1.25, py: 0.3, borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Mentor Panel
        </Box>
      </Box>

      {/* Primary Navigation Routing List */}
      <List sx={{ px: 1.5, flex: 1, overflowY: 'auto' }} disablePadding>
        {navItems.map(({ label, Icon, path, end }) => (
          <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={path}
              end={end}
              onClick={() => onClose && onClose()}
              sx={{
                borderRadius: '8px',
                py: 0.9, 
                px: 1.5,
                color: '#CBB6E6',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '& .MuiListItemIcon-root': {
                  transition: 'transform 0.25s ease',
                },
                '&.active': {
                  bgcolor: 'rgba(255, 255, 255, 0.16)',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                },
                '&:hover:not(.active)': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  transform: 'translateX(4px)',
                  '& .MuiListItemIcon-root': { 
                    color: '#fff',
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Actions Utility Area */}
      <Box sx={{ p: 1.5, mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 1, mx: 1 }} />


        {/* Animated Logout Button */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              py: 0.9,
              px: 1.5,
              color: '#282121',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.15)',
                color: '#282121',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)',
                transform: 'translateY(-1px)',
                '& .MuiListItemIcon-root': { 
                  color: '#282121',
                  transform: 'rotate(-15deg) scale(1.1)',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'inherit', transition: 'transform 0.2s ease' }}>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );
}