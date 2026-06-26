import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Box, Typography, Link, InputAdornment, IconButton, useTheme } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const loginSchema = yup.object().shape({
    identity: yup.string().required('Please enter your EmailId or Username'),
    password: yup.string().required('Please enter your password')
});

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({ 
        resolver: yupResolver(loginSchema) 
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const role = await login(data.identity, data.password);
            toast.success('Signed in successfully!');
            
            const routes = {
                'SUPER_ADMIN': '/dashboard/super-admin',
                'ADMIN':       '/dashboard/admin',
                'VENDOR':      '/dashboard/vendor',
                'COLLEGE':     '/dashboard/college',
                'MENTOR':      '/dashboard/mentor',
                'STUDENT':     '/dashboard/student',
            };
            navigate(routes[role] || '/auth/login');

        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: theme.customGradients?.bg || theme.palette.background.default, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            transition: 'background 0.4s ease-in-out'
        }}>
            
            {/* ── Left Side: Brand Panel Showcase ── */}
            <Box sx={{
                flex: 1,
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                padding: 6,
                background: 'linear-gradient(145deg, #16062B 0%, #320E5E 60%, #623E98 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: 300, height: 300, background: 'rgba(155,117,201,0.2)', filter: 'blur(60px)', borderRadius: '50%' }} />
                
                <Box component={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} sx={{ maxWidth: 420, color: '#fff' }}>
                    <Box sx={{ width: 52, height: 52, borderRadius: 3, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 24, mb: 3 }}>
                        E
                    </Box>
                    <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '-1px', mb: 1.5 }}>
                        EduPlatform
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, mb: 4 }}>
                        Unified Learning Management for Institutions, Organizations, Vendors & Admins
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {[
                            'Manage institutions & courses',
                            'Real-time analytics & reports',
                            'Role-based access control',
                            'Vendor subscription management',
                        ].map((text, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'rgba(255,255,255,0.85)' }}>
                                <CheckCircle sx={{ color: '#9B75C9', fontSize: 20 }} />
                                <Typography variant="body2">{text}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>

            {/* ── Right Side: Glassmorphism Login Card ── */}
            <Box sx={{ 
                width: { xs: '100%', md: 500 }, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                p: 3,
                position: 'relative',
                zIndex: 1
            }}>
                <Box 
                    component={motion.div} 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    sx={{ 
                        width: '100%',
                        maxWidth: 400,
                        p: { xs: 4, sm: 5 }, 
                        borderRadius: 5, 
                        bgcolor: theme.palette.background.paper, 
                        backdropFilter: 'blur(16px) saturate(120%)', 
                        boxShadow: theme.customGradients?.glow || 3,
                        border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.5)',
                    }}
                >
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 1, letterSpacing: '-0.5px' }} color={theme.palette.mode === 'dark' ? '#fff' : 'text.primary'}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Sign in to your admin workspace console
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        <Box>
                            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Email Id / Username</Typography>
                            <TextField 
                                placeholder="Enter email address or username" 
                                {...register('identity')} 
                                error={!!errors.identity} 
                                helperText={errors.identity?.message} 
                                fullWidth 
                                size="small"
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}
                                autoFocus
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Password</Typography>
                         <TextField 
    placeholder="Enter your password"
    type={showPassword ? 'text' : 'password'} 
    {...register('password')} 
    error={!!errors.password} 
    helperText={errors.password?.message} 
    fullWidth 
    size="small"
    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}
    slotProps={{
        input: {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                    </IconButton>
                </InputAdornment>
            )
        }
    }}
/>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                            <Link component={RouterLink} to="/auth/forgot-password" variant="body2" fontWeight="600" sx={{ color: theme.palette.mode === 'dark' ? '#CBB6E6' : '#623E98', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Forgot Password?
                            </Link>
                        </Box>

                        <Button 
                            type="submit" 
                            fullWidth 
                            variant="contained" 
                            size="large" 
                            disabled={loading}
                            component={motion.button}
                            whileTap={{ scale: 0.98 }}
                            sx={{ 
                                py: 1.4, 
                                fontWeight: '700', 
                                borderRadius: '10px', 
                                background: 'linear-gradient(90deg, #623E98, #9B75C9)',
                                textTransform: 'none',
                                fontSize: '15px',
                                letterSpacing: '0.3px',
                                boxShadow: '0 4px 15px rgba(98, 62, 152, 0.3)',
                                '&:hover': { background: 'linear-gradient(90deg, #320E5E, #623E98)' } 
                            }}
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?
                            </Typography>
                            <Link component={RouterLink} to="/auth/register" variant="body2" fontWeight="700" sx={{ color: '#ff1744', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Register
                            </Link>
                        </Box>

                        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#F1F5F9'}` }}>
                            <Typography variant="caption" sx={{ display: 'block', textTransform: 'uppercase', fontWeight: 700, tracking: 0.8, color: 'text.disabled', mb: 1 }}>
                                Supported Access Portals
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {['Super Admin', 'College Admin', 'Vendor', 'Mentor', 'Student'].map(r => (
                                    <Box key={r} sx={{ fontSize: '10px', fontWeight: 600, color: theme.palette.mode === 'dark' ? '#CBB6E6' : '#623E98', bgcolor: theme.palette.mode === 'dark' ? 'rgba(155,117,201,0.1)' : 'rgba(98,62,152,0.06)', px: 1.5, py: 0.5, borderRadius: 5 }}>
                                        {r}
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}