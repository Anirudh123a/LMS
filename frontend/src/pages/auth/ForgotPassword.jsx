import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, Container, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

// Two-step flow, used by Super Admin / Admin / Vendor / Student alike:
// Step 1: enter email -> backend emails a 6-digit OTP (role-agnostic lookup)
// Step 2: enter the OTP + a new password -> backend verifies + updates it
export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { register: registerStep1, handleSubmit: handleSubmitStep1 } = useForm();
    const { register: registerStep2, handleSubmit: handleSubmitStep2, watch } = useForm();

    const onRequestCode = async (data) => {
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email: data.email });
            setEmail(data.email);
            toast.success('If an account exists for this email, a reset code has been sent.');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const onResetPassword = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, {
                email,
                otp: data.otp,
                newPassword: data.newPassword
            });
            toast.success('Password reset successfully! Please sign in.');
            navigate('/auth/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired reset code.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 15, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center', bgcolor: 'background.paper' }}>
                <Typography variant="h5" fontWeight="700" gutterBottom>
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </Typography>

                {step === 1 ? (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Enter the email address associated with your account
                            (works for Super Admin, Admin, Vendor, and Student logins).
                        </Typography>

                        <form onSubmit={handleSubmitStep1(onRequestCode)}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                {...registerStep1('email')}
                                required
                                sx={{ mb: 3 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={submitting}
                                sx={{
                                    background: 'linear-gradient(90deg, #623E98, #9B75C9)',
                                    textTransform: 'none',
                                    fontWeight: '600',
                                    '&:hover': { background: 'linear-gradient(90deg, #320E5E, #623E98)' }
                                }}
                            >
                                Send Reset Code
                            </Button>
                        </form>
                    </>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            We sent a 6-digit code to:<br />
                            <b>{email}</b>
                        </Typography>

                        <form onSubmit={handleSubmitStep2(onResetPassword)}>
                            <TextField
                                fullWidth
                                label="Enter 6-Digit OTP"
                                inputProps={{ maxLength: 6 }}
                                {...registerStep2('otp')}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                {...registerStep2('newPassword')}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Confirm New Password"
                                type="password"
                                {...registerStep2('confirmPassword')}
                                required
                                sx={{ mb: 3 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={submitting}
                                sx={{
                                    background: 'linear-gradient(90deg, #623E98, #9B75C9)',
                                    textTransform: 'none',
                                    fontWeight: '600',
                                    '&:hover': { background: 'linear-gradient(90deg, #320E5E, #623E98)' }
                                }}
                            >
                                Reset Password
                            </Button>
                        </form>

                        <Typography variant="body2" sx={{ mt: 2 }}>
                            <Link component="button" onClick={() => setStep(1)} sx={{ cursor: 'pointer' }}>
                                Didn't get a code? Try again
                            </Link>
                        </Typography>
                    </>
                )}

                <Typography variant="body2" sx={{ mt: 3 }}>
                    <Link component={RouterLink} to="/auth/login">Back to Sign In</Link>
                </Typography>
            </Box>
        </Container>
    );
}
