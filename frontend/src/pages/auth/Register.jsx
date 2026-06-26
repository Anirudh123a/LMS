import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, MenuItem, Container, Typography, Box, Link, InputAdornment, LinearProgress, Grid, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

const registerSchema = yup.object().shape({
    rollNo: yup.string().required('Roll number is required'),
    studentName: yup.string().required('Name is required'),
    email: yup.string().email('Invalid format').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Must be a valid email format').required('Email is required'),
    mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits').required('Mobile number is required'),
    password: yup.string().min(8, 'Minimum 8 characters').matches(/[A-Z]/, 'Need uppercase').matches(/[a-z]/, 'Need lowercase').matches(/[0-9]/, 'Need a number').matches(/[^A-Za-z0-9]/, 'Need a special char').required('Password is required'),
    college: yup.string().required('Select your college'),
    course: yup.string().required('Select your course'),
    year: yup.string().required('Select year'),
    semester: yup.string().required('Select semester')
});

export default function Register() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [collegeOptions, setCollegeOptions] = useState([]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ resolver: yupResolver(registerSchema) });

    const passwordValue = watch('password', '');

    useEffect(() => {
axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/colleges`)
            .then(res => setCollegeOptions(res.data.colleges || []))
            .catch(() => setCollegeOptions([]));
    }, []);


    const getPasswordMetrics = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score += 25;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 25;
        if (/[0-9]/.test(pwd)) score += 25;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
        
        if (score <= 25) return { val: score, label: 'Weak', color: 'error' };
        if (score <= 75) return { val: score, label: 'Medium', color: 'warning' };
        return { val: score, label: 'Strong', color: 'success' };
    };

    const strength = getPasswordMetrics(passwordValue);

    const onSubmit = async (data) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, data);
            toast.success('Registration initiated! Verification code sent.');
            navigate('/auth/verify-otp', { state: { email: data.email } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error executing account initialization.');
        }
    };

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: theme.customGradients?.bg || 'linear-gradient(to right, #ece9e6, #ffffff)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            py: { xs: 4, md: 6 }, 
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            transition: 'background 0.4s ease-in-out'
        }}>
            {/* Background Aesthetic Glowing Orbs */}
            <Box sx={{
                position: 'absolute', top: '5%', right: '5%', width: 250, height: 250,
                background: 'radial-gradient(circle, rgba(155,117,201,0.3) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0
            }} />

            <Container maxWidth="sm" sx={{ zIndex: 1, position: 'relative' }}>
                <Box 
                    component={motion.div} 
                    initial={{ opacity: 0, y: 30 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    sx={{ 
                        p: { xs: 3, sm: 5 }, 
                        borderRadius: 5, 
                        bgcolor: theme.palette.background.paper, 
                        backdropFilter: 'blur(16px) saturate(120%)', 
                        boxShadow: theme.customGradients?.glow || theme.shadows[3],
                        border: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.5)',
                    }}
                >
                    <Typography variant="h4" align="center" fontWeight="800" sx={{ mb: 1, letterSpacing: '-0.5px' }} color={theme.palette.mode === 'dark' ? '#fff' : 'text.primary'}>
                        Sign Up
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                        Create your student account profile
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Roll No</Typography>
                                <TextField placeholder="Enter your roll number" {...register('rollNo')} error={!!errors.rollNo} helperText={errors.rollNo?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}/>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Name</Typography>
                                <TextField placeholder="Enter your name" {...register('studentName')} error={!!errors.studentName} helperText={errors.studentName?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}/>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Email</Typography>
                                <TextField placeholder="Enter your email address" {...register('email')} error={!!errors.email} helperText={errors.email?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}/>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Mobile Number</Typography>
                                <TextField placeholder="Enter your mobile number" {...register('mobile')} error={!!errors.mobile} helperText={errors.mobile?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}/>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Password</Typography>
                                <TextField 
                                    placeholder="Create a password"
                                    type={showPassword ? 'text' : 'password'} 
                                    {...register('password')} 
                                    error={!!errors.password} 
                                    helperText={errors.password?.message} 
                                    fullWidth 
                                    size="small"
                                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                {passwordValue && (
                                    <Box sx={{ mt: 1.5 }}>
                                        <LinearProgress variant="determinate" value={strength.val} color={strength.color} sx={{ height: 5, borderRadius: 2 }} />
                                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontWeight: '700' }} color={`${strength.color}.main`}>
                                            Password Strength: {strength.label}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>College</Typography>
                                <TextField select defaultValue="" {...register('college')} error={!!errors.college} helperText={errors.college?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}>
                                    {collegeOptions.length === 0 ? (
                                        <MenuItem value="" disabled>No colleges available yet</MenuItem>
                                    ) : (
                                        collegeOptions.map(c => (
                                            <MenuItem key={c.id} value={String(c.id)}>{c.college_name}</MenuItem>
                                        ))
                                    )}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Course</Typography>
                                <TextField select defaultValue="" {...register('course')} error={!!errors.course} helperText={errors.course?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}>
                                    <MenuItem value="mca">Master of Computer Applications (MCA)</MenuItem>
                                    <MenuItem value="be">Bachelor of Engineering (BE)</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Year</Typography>
                                <TextField select defaultValue="" {...register('year')} error={!!errors.year} helperText={errors.year?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}>
                                    <MenuItem value="1">First Year</MenuItem>
                                    <MenuItem value="2">Second Year</MenuItem>
                                    <MenuItem value="3">Third Year</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" fontWeight="600" sx={{ mb: 0.8, color: 'text.secondary', fontSize: '0.85rem' }}>Semester</Typography>
                                <TextField select defaultValue="" {...register('semester')} error={!!errors.semester} helperText={errors.semester?.message} fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' }}}>
                                    <MenuItem value="1">Semester I</MenuItem>
                                    <MenuItem value="2">Semester II</MenuItem>
                                    <MenuItem value="3">Semester III</MenuItem>
                                    <MenuItem value="4">Semester IV</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 1 }}>
                                <Button 
                                    type="submit" 
                                    fullWidth 
                                    variant="contained" 
                                    size="large" 
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
                                    Sign Up
                                </Button>
                            </Grid>
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 3, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?
                            </Typography>
                            <Link component={RouterLink} to="/auth/login" fontWeight="700" color="primary.main" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                                Sign In
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}