import { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Drawer,
  IconButton,
  Divider,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tooltip as MuiTooltip
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Component Imports
import Sidebar from './Sidebar';
import Header from './Header';

// Material Icons
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

// ── 1. DESIGN SYSTEM WITH SMOOTH GLOBALS ──
const mentorTheme = createTheme({
  palette: {
    primary: {
      main: '#623E98',
      light: '#F3EBFB',
      dark: '#320E5E',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#16062B',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    overline: { letterSpacing: '0.04em', fontWeight: 600 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 30px -5px rgba(98, 62, 152, 0.12), 0 4px 12px -2px rgba(98, 62, 152, 0.04)',
            borderColor: 'rgba(98, 62, 152, 0.2)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { 
          textTransform: 'none', 
          borderRadius: 8, 
          fontWeight: 600, 
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:active': { transform: 'scale(0.97)' }
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: '1px solid #f1f5f9', padding: '16px' },
      },
    },
  },
});

// ── 2. DATA STORES ──
const statsData = [
  { title: 'My Courses', value: '12', icon: <MenuBookRoundedIcon fontSize="small" />, subtitle: '+1 new published', subtitleColor: '#22c55e' },
  { title: 'Total Students', value: '2,840', icon: <PeopleRoundedIcon fontSize="small" />, subtitle: '+124 enrolled', subtitleColor: '#22c55e' },
  { title: 'Pending Assignments', value: '15', icon: <AssignmentRoundedIcon fontSize="small" />, subtitle: '3 need review', subtitleColor: '#ef4444' },
  { title: 'Avg Rating', value: '4.7', icon: <StarBorderRoundedIcon fontSize="small" />, subtitle: '↑0.2 out of 5.0', subtitleColor: '#22c55e' },
];

const chartData = [
  { name: 'Web Dev', students: 340, fill: '#623E98' },
  { name: 'Data Sci', students: 210, fill: '#7C52BA' },
  { name: 'UI/UX', students: 280, fill: '#9B75C9' },
  { name: 'DevOps', students: 160, fill: '#BCA1DF' },
  { name: 'ML/AI', students: 195, fill: '#DCCEF4' },
];

const scheduleEvents = [
  { title: 'Live Q&A Session', sub: 'Web Dev Pro · Today, 3:00 PM', type: 'live', color: '#623E98' },
  { title: 'Assignment Deadline', sub: 'React Advanced · Tomorrow, 11:59 PM', type: 'deadline', color: '#ef4444' },
  { title: 'Interview Session', sub: 'Job Placement · Jun 22, 2:00 PM', type: 'event', color: '#9B75C9' },
];

const assignmentRows = [
  { id: 1, student: 'Arjun Patel', avatar: 'AP', course: 'Web Dev Pro', module: 'Module 3 layout', submitted: 'Today, 4:30 PM', status: 'Urgent', risk: 'Low Risk', progress: 88 },
  { id: 2, student: 'Sarah Jenkins', avatar: 'SJ', course: 'UI/UX Foundations', module: 'High-Fi Prototyping', submitted: 'Yesterday', status: 'Pending', risk: 'On Track', progress: 45 },
  { id: 3, student: 'Michael Chang', avatar: 'MC', course: 'Data Sci Masterclass', module: 'Pandas Cleaning', submitted: '2 days ago', status: 'Pending', risk: 'Needs Support', progress: 22 },
];

// ── 3. ANIMATED COMPONENTS ──

function StatCard({ title, value, icon, subtitle, subtitleColor, index }) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Card sx={{ 
      bgcolor: '#ffffff', 
      height: '100%', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)'
    }}>
      <CardContent sx={{ p: '20px !important', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: 'primary.light', 
            color: 'primary.main', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'transform 0.3s ease',
            '.MuiCard-root:hover &': { transform: 'scale(1.1) rotate(6deg)' }
          }}>
            {icon}
          </Box>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="overline" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem', lineHeight: 1.1, textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h4" color="text.primary" sx={{ mt: 0.5, mb: 0.25, fontSize: '1.6rem', fontWeight: 800 }}>
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: subtitleColor }} />
              <Typography variant="caption" sx={{ color: subtitleColor, fontWeight: 600, fontSize: '0.75rem' }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function PerformanceChart() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <Card sx={{ width: '100%', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentRoundedIcon sx={{ color: 'primary.main' }} />
            <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#16062B' }}>
              Active Course Distribution
            </Typography>
          </Box>
          <Chip label="Live Metrics" size="small" icon={<TrendingUpRoundedIcon />} sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 600 }} />
        </Box>

        {/* 🛠️ FIXED: Set absolute height configuration across all device breakpoints */}
        <Box sx={{ width: '100%', height: { xs: 260, sm: 300, md: 320 } }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={65} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 600, fontSize: 11 }} />
              <Tooltip 
                cursor={{ fill: 'rgba(98, 62, 152, 0.04)', radius: 4 }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '0.85rem' }} 
              />
              <Bar dataKey="students" radius={[0, 6, 6, 0]} barSize={16} onMouseEnter={(_, index) => setActiveIndex(index)} onMouseLeave={() => setActiveIndex(null)}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                    fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    style={{ transition: 'all 0.2s ease', cursor: 'pointer' }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

function UpcomingSchedule() {
  return (
    <Card sx={{ height: '100%', bgcolor: '#ffffff', width: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
          <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#16062B' }}>
            Action Center
          </Typography>
          <Button variant="text" size="small" sx={{ color: 'primary.main', fontSize: '0.8rem' }}>View Calendar</Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {scheduleEvents.map((ev, i) => (
            <Box 
              key={i} 
              sx={{ 
                display: 'flex', 
                alignItems: 'stretch', 
                gap: 2, 
                p: 2, 
                borderRadius: '12px', 
                bgcolor: '#f8fafc', 
                border: '1px solid #f1f5f9', 
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)', 
                '&:hover': { 
                  borderColor: ev.color, 
                  bgcolor: '#ffffff', 
                  boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
                  transform: 'translateX(4px)'
                } 
              }}
            >
              <Box sx={{ width: 4, borderRadius: '4px', bgcolor: ev.color, flexShrink: 0 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#16062B', lineHeight: 1.3 }}>
                  {ev.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                  {ev.sub}
                </Typography>
              </Box>
              {ev.type === 'live' && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: '#ef4444', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

function PendingAssignments() {
  return (
    <Card sx={{ width: '100%', borderRadius: 4, bgcolor: '#ffffff' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#16062B' }}>
              Submissions Requiring Attention
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Review requests queued up within the last 48 hours
            </Typography>
          </Box>
          <AvatarGroup max={4}>
            <Avatar sx={{ bgcolor: '#623E98', fontSize: '0.75rem' }}>+12</Avatar>
            <Avatar sx={{ bgcolor: '#9B75C9', fontSize: '0.75rem' }}>RB</Avatar>
            <Avatar sx={{ bgcolor: '#320E5E', fontSize: '0.75rem' }}>LN</Avatar>
          </AvatarGroup>
        </Box>

        <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {['Student Profile', 'Target Course', 'Timeline', 'Work Tracker', 'Severity Status', 'Action'].map((header, idx) => (
                  <TableCell key={header} align={idx === 5 ? 'right' : 'left'} sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0', py: 1.5 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {assignmentRows.map((row) => (
                <TableRow key={row.id} hover sx={{ '&:hover': { bgcolor: 'rgba(248, 250, 252, 0.6)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 700, fontSize: '0.85rem', width: 36, height: 36 }}>
                        {row.avatar}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600, color: '#16062B', fontSize: '0.9rem' }}>{row.student}</Typography>
                    </Box>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#16062B' }}>{row.course}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>{row.module}</Typography>
                  </TableCell>

                  <TableCell sx={{ color: '#64748b', fontSize: '0.85rem' }}>{row.submitted}</TableCell>

                  <TableCell sx={{ width: '160px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress variant="determinate" value={row.progress} sx={{ flexGrow: 1, height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 3 } }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{row.progress}%</Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Chip 
                      label={row.status} 
                      size="small" 
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '0.72rem',
                        bgcolor: row.status === 'Urgent' ? '#fef2f2' : '#fef3c7', 
                        color: row.status === 'Urgent' ? '#ef4444' : '#d97706',
                        border: `1px solid ${row.status === 'Urgent' ? '#fca5a5' : '#fde68a'}`
                      }} 
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Button variant="contained" size="small" endIcon={<LaunchRoundedIcon sx={{ fontSize: '0.9rem !important' }} />} sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
                      Evaluate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

// ── 4. RENDER ARCHITECTURE CONTROL ENGINE ──
export function DashboardView() {
  const [mountAnimate, setMountAnimate] = useState(false);
  useEffect(() => {
    setMountAnimate(true);
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3, 
      boxSizing: 'border-box',
      opacity: mountAnimate ? 1 : 0,
      transform: mountAnimate ? 'transparent' : 'translateY(10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }
      `}} />
      
      {/* Top Cards Metric Section */}
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2.5} alignItems="stretch">
          {statsData.map((stat, idx) => (
            <Grid item xs={12} sm={6} lg={3} key={stat.title} sx={{ display: 'flex' }}>
              <StatCard {...stat} index={idx} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Analytics Layout Split Grid System: Fixed mobile flex container widths */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'stretch' }}>
        <Box sx={{ width: '100%', flexGrow: 1 }}>
          <PerformanceChart />
        </Box>
        <Box sx={{ width: { xs: '100%', md: '340px', lg: '380px' }, flexShrink: 0 }}>
          <UpcomingSchedule />
        </Box>
      </Box>

      {/* Lower Evaluation Activity Tables */}
      <Box sx={{ width: '100%' }}>
        <PendingAssignments />
      </Box>
    </Box>
  );
}

// ── 5. MASTER CONTROLLER LAYOUT WRAPPER SHELL ──
export default function MentorLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={mentorTheme}>
      <CssBaseline />

      <Box sx={{ display: 'flex', width: '100%', height: '100vh', overflow: 'hidden', bgcolor: '#f8fafc' }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: 260, border: 'none', boxSizing: 'border-box' },
          }}
        >
          <Sidebar onClose={handleDrawerToggle} />
        </Drawer>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: 260, flexShrink: 0, bgcolor: '#ffffff' }}>
          <Sidebar />
         </Box>

        <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'calc(100% - 260px)' }, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxSizing: 'border-box' }}>
          <Header onMenuToggle={handleDrawerToggle} />

          <Box component="main" sx={{ width: '100%', height: 'calc(100vh - 64px)', overflowY: 'auto', p: { xs: 2, md: 3 }, boxSizing: 'border-box' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}