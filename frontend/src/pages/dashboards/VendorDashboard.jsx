import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Typography, Button, TextField, Grid, Paper, Table, TableHead,
    TableRow, TableCell, TableBody, Chip, Dialog, DialogTitle, DialogContent,
    DialogActions, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';

const emptyForm = { collegeName: '', collegeCode: '', email: '', password: '', address: '', phone: '' };

export default function VendorDashboard() {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const fetchColleges = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendor/colleges`);
            setColleges(res.data.colleges || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load colleges.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchColleges(); }, []);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleCreate = async () => {
        if (!form.collegeName || !form.collegeCode || !form.email || !form.password) {
            toast.error('College name, code, email and password are required.');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/vendor/create-college`, form);
            toast.success('College created successfully.');
            setOpen(false);
            setForm(emptyForm);
            fetchColleges();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create college.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout title="Vendor Dashboard">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                    Manage the colleges you have created.
                </Typography>
                <Button variant="contained" onClick={() => setOpen(true)} sx={{ fontWeight: 700 }}>
                    + Add College
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                ) : colleges.length === 0 ? (
                    <Typography color="text.secondary" sx={{ p: 2 }}>No colleges created yet.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>College Name</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {colleges.map(c => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.college_name}</TableCell>
                                    <TableCell>{c.college_code}</TableCell>
                                    <TableCell>{c.email || '—'}</TableCell>
                                    <TableCell>{c.phone || '—'}</TableCell>
                                    <TableCell>
                                        <Chip size="small" label={c.status} color={c.status === 'ACTIVE' ? 'success' : 'default'} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create College</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField name="collegeName" label="College Name" fullWidth value={form.collegeName} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="collegeCode" label="College Code" fullWidth value={form.collegeCode} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="email" label="Login Email" type="email" fullWidth value={form.email} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="password" label="Login Password" type="password" fullWidth value={form.password} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="phone" label="Phone" fullWidth value={form.phone} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField name="address" label="Address" fullWidth value={form.address} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate} disabled={submitting}>
                        {submitting ? 'Creating…' : 'Create College'}
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardLayout>
    );
}
