import { Box, Typography, IconButton, InputBase, Badge, Avatar } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

export default function Header({ onMenuToggle }) {
  const date = format(new Date(), 'EEEE, MMMM d, yyyy');
  const location = useLocation();

  // Dynamically compute the Header Title based on the active path
  const getHeaderTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/mentor/courses')) return 'My Courses';
    if (path.includes('/mentor/assignments')) return 'Assignments';
    if (path.includes('/mentor/students')) return 'Students Profile';
    if (path.includes('/mentor/profile')) return 'Profile Settings';
    if (path.includes('/mentor/help')) return 'Help & Support';
    
    return 'Dashboard'; // Fallback / default title
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, md: 3 }, py: 1.5, bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', flexShrink: 0, minHeight: 64 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={onMenuToggle} sx={{ display: { md: 'none' }, p: 0.5 }}>
          <MenuRoundedIcon sx={{ color: '#16062B' }} />
        </IconButton>
        <Box>
          <Typography variant="h6" color="text.primary" sx={{ lineHeight: 1.2, fontWeight: 700 }}>
            {getHeaderTitle()}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>
            {date}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.5, py: 0.6, width: 240, '&:focus-within': { borderColor: '#623E98', boxShadow: '0 0 0 3px rgba(98, 62, 152, 0.15)' }, transition: 'all 0.2s' }}>
          <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', mr: 1 }} />
          <InputBase placeholder="Search..." sx={{ flex: 1, fontSize: '0.875rem', color: 'text.primary' }} />
        </Box>

        <IconButton size="small" sx={{ bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <Badge color="error" variant="dot">
            <NotificationsNoneRoundedIcon sx={{ fontSize: '1.2rem', color: '#64748b' }} />
          </Badge>
        </IconButton>

        <Box 
          component={NavLink}
          to="/mentor/profile"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            textDecoration: 'none',
            cursor: 'pointer',
            p: 0.5,
            borderRadius: '8px',
            transition: 'background 0.2s',
            '&:hover': { bgcolor: '#f1f5f9' }
          }}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: '#623E98', fontSize: '0.85rem', fontWeight: 700 }}>M</Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
              Mentor
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', display: 'block' }}>
              mentor@college.edu
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}