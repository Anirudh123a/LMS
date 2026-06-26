import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function VerifyOtp() {
    const location = useLocation();
    const navigate = useNavigate();
    const targetEmailAddress = location.state?.email || '';
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-otp`, { 
                email: targetEmailAddress, 
                otp: data.otp, 
                purpose: 'REGISTER' 
            });
            toast.success('Email verified successfully!');
            navigate('/auth/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired OTP code.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 15, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    Verify Your Email
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    We have sent a 6-digit verification code to:<br />
                    <b>{targetEmailAddress}</b>
                </Typography>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField 
                        fullWidth 
                        label="Enter 6-Digit OTP" 
                        inputProps={{ maxLength: 6 }} 
                        {...register('otp')} 
                        required 
                        sx={{ mb: 3 }} 
                    />
                    
                    <Button 
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        size="large"
                        sx={{ 
                            background: 'linear-gradient(90deg, #623E98, #9B75C9)',
                            textTransform: 'none',
                            fontWeight: '600',
                            '&:hover': { background: 'linear-gradient(90deg, #320E5E, #623E98)' }
                        }}
                    >
                        Verify Code
                    </Button>
                </form>
            </Box>
        </Container>
    );
}