import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Button, TextField, Grid, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

const emptyForm = { mentorName: '', email: '', password: '', mobile: '', department: '' };

// Helper to always get fresh auth header
const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default function CollegeDashboard() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchMentors = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/college/mentors`,
                authHeader()
            );
            setMentors(res.data.mentors || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load mentors.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMentors(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCreate = async () => {
        if (!form.mentorName || !form.email || !form.password) {
            toast.error('Mentor name, email and password are required.');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/college/create-mentor`,
                form,
                authHeader()
            );
            toast.success('Mentor created successfully.');
            setOpen(false);
            setForm(emptyForm);
            fetchMentors();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create mentor.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout title="College Dashboard">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    Manage mentors for your college.
                </Typography>
                <Button variant="contained" onClick={() => setOpen(true)} sx={{ fontWeight: 700 }}>
                    + Add Mentor
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : mentors.length === 0 ? (
                    <Typography color="text.secondary" sx={{ p: 2 }}>No mentors created yet.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Mentor Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mentors.map(m => (
                                <TableRow key={m.id}>
                                    <TableCell>{m.mentor_name}</TableCell>
                                    <TableCell>{m.email}</TableCell>
                                    <TableCell>{m.mobile || '—'}</TableCell>
                                    <TableCell>{m.department || '—'}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={m.status} color={m.status === 'ACTIVE' ? 'success' : 'default'} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create Mentor</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField name="mentorName" label="Mentor Name" fullWidth value={form.mentorName} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="department" label="Department" fullWidth value={form.department} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="email" label="Login Email" type="email" fullWidth value={form.email} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="password" label="Login Password" type="password" fullWidth value={form.password} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="mobile" label="Mobile" fullWidth value={form.mobile} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={submitting}>
                        {submitting ? 'Creating…' : 'Create Mentor'}
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
}