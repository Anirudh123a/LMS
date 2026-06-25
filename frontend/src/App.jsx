import { createContext, useState, useMemo, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTheme, ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CollegesPage from './pages/dashboards/SuperAdmin/CollegesPage';


// ── Auth Pages ──────────────────────────────────────────────────
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyOtp from './pages/auth/VerifyOtp';

// ── Dashboards & Shell Layouts ──────────────────────────────────
import AdminDashboard from './pages/dashboards/AdminDashboard';
import StudentDashboard from './pages/dashboards/Student/Dashboard/Student';
import OrganizationDashboard from './pages/dashboards/OrganizationDashboard';
import VendorDashboard from './pages/dashboards/VendorDashboard';
import CollegeDashboard from './pages/dashboards/CollegeDashboard';

// ── Split SuperAdmin Views ──────────────────────────────────────
import Layout from './pages/dashboards/SuperAdmin/Layout';
import DashboardPage from './pages/dashboards/SuperAdmin/DashboardPage';
import AdminsPage from './pages/dashboards/SuperAdmin/AdminsPage';
import AnalyticsPage from './pages/dashboards/SuperAdmin/AnalyticsPage';
import MonitoringPage from './pages/dashboards/SuperAdmin/MonitoringPage';
import OrganizationsPage from './pages/dashboards/SuperAdmin/OrganizationsPage';
import ReportsPage from './pages/dashboards/SuperAdmin/ReportsPage';
import SettingsPage from './pages/dashboards/SuperAdmin/SettingsPage';
import VendorsPage from './pages/dashboards/SuperAdmin/VendorsPage';

// ── Split Mentor Views ──────────────────────────────────────────
import MentorLayout, { DashboardView } from "./pages/dashboards/Mentor/MentorLayout"; 
import CoursesView from "./pages/dashboards/Mentor/CoursesView";
import AssignmentsView from "./pages/dashboards/Mentor/AssignmentsView";
import StudentsView from "./pages/dashboards/Mentor/StudentsView";
import ProfileView from './pages/dashboards/Mentor/ProfileView';
import CourseEditView from './pages/dashboards/Mentor/CourseEditView'; 

// ── Theme Switcher Context ─────────────────────────────────────
const ThemeModeContext = createContext({ toggleTheme: () => {} });
export const useThemeMode = () => useContext(ThemeModeContext);

// ── Protected Route Wrapper (RBAC Enforcement) ────────────────
function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading, logout } = useAuth();

  if (loading) return <div style={loadingStyle}>Loading…</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRoutes = {
      SUPER_ADMIN:  '/dashboard/super-admin',
      ADMIN:        '/dashboard/admin',
      STUDENT:      '/dashboard/student',
      ORGANIZATION: '/dashboard/organization',
      MENTOR:       '/dashboard/mentor',
      VENDOR:       '/dashboard/vendor',
      COLLEGE:      '/dashboard/college',
    };

    if (!roleRoutes[user.role]) {
      logout();
      return <Navigate to="/auth/login" replace />;
    }

    return <Navigate to={roleRoutes[user.role]} replace />;
  }

  return children;
}

// ── Public Route Wrapper (Auth Guard) ──────────────────────────
function PublicRoute({ children }) {
  const { user, loading, logout } = useAuth();

  if (loading) return <div style={loadingStyle}>Loading…</div>;

  if (user) {
  // In ProtectedRoute - replace roleRoutes with this:
const roleRoutes = {
  SUPER_ADMIN:  '/dashboard/super-admin',
  ADMIN:        '/dashboard/admin',
  STUDENT:      '/dashboard/student',
  ORGANIZATION: '/dashboard/organization',
  MENTOR:       '/dashboard/mentor',
  VENDOR:       '/dashboard/vendor',
  COLLEGE:      '/dashboard/college',
};

    if (roleRoutes[user.role]) {
      return <Navigate to={roleRoutes[user.role]} replace />;
    } else {
      logout();
      return children;
    }
  }

  return children;
}

// ── Client Application Router Engine ───────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* Root Path Index Default Fallback */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* ── Public Auth Routing Deck ── */}
      <Route path="/auth/login"           element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/auth/register"        element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/auth/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/auth/verify-otp"      element={<PublicRoute><VerifyOtp /></PublicRoute>} />

      {/* ── Nested Super Admin Dashboard Configuration ── */}
      <Route 
        path="/dashboard/super-admin" 
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="colleges" element={<CollegesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="vendors" element={<VendorsPage />} />
      </Route>
      
      {/* ── Other Protected Dashboards ── */}
      <Route path="/dashboard/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard/student" element={
        <ProtectedRoute allowedRoles={['STUDENT']}>
          <StudentDashboard />
        </ProtectedRoute>
      } />

      <Route path="/dashboard/vendor" element={
        <ProtectedRoute allowedRoles={['VENDOR']}>
          <VendorDashboard />
        </ProtectedRoute>
      } />

      <Route path="/dashboard/college" element={
        <ProtectedRoute allowedRoles={['COLLEGE']}>
          <CollegeDashboard />
        </ProtectedRoute>
      } />

      <Route path="/dashboard/organization" element={
        <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'ORGANIZATION']}>
          <OrganizationDashboard />
        </ProtectedRoute>
      } />

      {/* ── Nested Mentor Dashboard Configuration ── */}
      <Route 
        path="/dashboard/mentor" 
        element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'MENTOR']}>
            <MentorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardView />} />
        <Route path="courses" element={<CoursesView />} /> 
        <Route path="courses/edit" element={<CourseEditView />} />
        <Route path="assignments" element={<AssignmentsView />} />
        <Route path="students" element={<StudentsView />} />
        <Route path="profile" element={<ProfileView />} />
      </Route>

      {/* Missing Global Route Link Fallback */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

// ── Application Master Controller Mount Entrypoint ─────────────
export default function App() {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'dark');

  const themeMode = useMemo(() => ({
    toggleTheme: () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light';
        localStorage.setItem('themeMode', next);
        return next;
      });
    }
  }), []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary:   { main: '#623E98' },
      secondary: { main: '#9B75C9' },
      background: {
        default: mode === 'dark' ? '#16062B' : '#F3EBFB',
        paper:   mode === 'dark' ? 'rgba(50, 14, 94, 0.4)' : 'rgba(255, 255, 255, 0.85)',
      }
    },
    typography: { fontFamily: '"Inter", sans-serif' },
    customGradients: {
      bg: mode === 'dark'
        ? 'linear-gradient(135deg, #16062B 0%, #320E5E 30%, #623E98 65%, #9B75C9 100%)'
        : 'linear-gradient(135deg, #9B75C9, #CBB6E6, #F3EBFB)',
      glow: '0 0 20px rgba(155, 117, 201, 0.6)'
    }
  }), [mode]);

  return (
    <ThemeModeContext.Provider value={themeMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1100 }}>
              <IconButton
                onClick={themeMode.toggleTheme}
                color="inherit"
                sx={{ bgcolor: theme.palette.background.paper, boxShadow: theme.customGradients.glow }}
              >
                {mode === 'dark' ? <Brightness7Icon sx={{ color: '#F2D03B' }} /> : <Brightness4Icon />}
              </IconButton>
            </Box>

            <AppRoutes />
            <ToastContainer position="top-right" autoClose={4000} />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

const loadingStyle = {
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  height:         '100vh',
  fontSize:       14,
  color:          '#94A3B8',
  fontFamily:     '"Inter", sans-serif',
};