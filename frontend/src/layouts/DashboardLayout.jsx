import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children, title }) {
    const { logout, user } = useAuth();

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f5f7f8' }}>
            <AppBar position="static" color="primary" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>LMS Management Center Layer ({user?.role})</Typography>
                    <Button color="inherit" onClick={logout} sx={{ fontWeight: 'bold' }}>Terminate Session</Button>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="700" color="text.primary">{title}</Typography>
                {children}
            </Container>
        </Box>
    );
}