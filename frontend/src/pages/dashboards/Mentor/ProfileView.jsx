import { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Stack,
  IconButton,
  Chip,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import BusinessCenterRoundedIcon from '@mui/icons-material/BusinessCenterRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

const initialProfileData = {
  name: 'Dr. Sarah Jenkins',
  title: 'Lead Full-Stack Instructor & System Architect',
  email: 'sarah.jenkins@academy.com',
  bio: 'Passionate software engineering mentor with over 10 years of industry experience deploying distributed cloud systems. Dedicated to helping students bridge the gap between core syntax and scalable technical architecture.',
  website: 'https://sarahjenkins.dev',
  linkedin: 'https://linkedin.com/in/sarah-jenkins-demo',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
};

const resumeSkills = ['React.js', 'Node.js', 'System Architecture', 'Cloud Deployment', 'REST APIs', 'TypeScript', 'SQL / NoSQL'];

export default function ProfileView() {
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(initialProfileData);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialProfileData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const temporaryPreviewUrl = URL.createObjectURL(file);
      setEditForm((prev) => ({ ...prev, avatarUrl: temporaryPreviewUrl }));
    }
  };

  const handleSaveSubmit = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
      
      {/* ── RESUME HEADER MASTER CARD ── */}
      <Card sx={{ width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRadius: '16px', overflow: 'hidden' }}>
        <Box sx={{ height: '140px', bgcolor: '#1e293b', width: '100%' }} />
        
        <CardContent sx={{ px: { xs: 3, md: 5 }, pb: 4, pt: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-65px', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={isEditing ? editForm.avatarUrl : profile.avatarUrl}
                sx={{ width: 130, height: 130, border: '5px solid #ffffff', boxShadow: '0px 8px 16px rgba(0,0,0,0.1)', bgcolor: '#ffffff' }}
              />
              {isEditing && (
                <>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} style={{ display: 'none' }} accept="image/*" />
                  <IconButton
                    onClick={() => fileInputRef.current.click()}
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      bgcolor: '#623E98',
                      color: '#ffffff',
                      p: 1,
                      '&:hover': { bgcolor: '#320E5E' },
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}
                  >
                    <PhotoCameraRoundedIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Box>

            {!isEditing && (
              <Button
                variant="outlined"
                startIcon={<EditRoundedIcon />}
                onClick={() => setIsEditing(true)}
                sx={{ color: '#623E98', borderColor: '#623E98', textTransform: 'none', fontWeight: 700, px: 3, height: '40px', borderRadius: '8px', mb: 1, '&:hover': { bgcolor: '#F3EBFB', borderColor: '#320E5E' } }}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {isEditing ? editForm.name || 'Your Name' : profile.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#623E98', mt: 0.5 }}>
              {isEditing ? editForm.title || 'Professional Title' : profile.title}
            </Typography>
          </Box>

          <Divider sx={{ my: 3, borderColor: '#f1f5f9' }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 2, sm: 4 }} sx={{ flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#475569' }}>
              <EmailRoundedIcon sx={{ fontSize: '1.25rem', color: '#64748b' }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{isEditing ? editForm.email : profile.email}</Typography>
            </Box>
            {(isEditing ? editForm.website : profile.website) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#475569' }}>
                <LanguageRoundedIcon sx={{ fontSize: '1.25rem', color: '#64748b' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{isEditing ? editForm.website : profile.website}</Typography>
              </Box>
            )}
            {(isEditing ? editForm.linkedin : profile.linkedin) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#475569' }}>
                <LinkedInIcon sx={{ fontSize: '1.25rem', color: '#64748b' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{isEditing ? editForm.linkedin : profile.linkedin}</Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ── CORE DETAILS CONTAINER SHEET ── */}
      <Card sx={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRadius: '16px' }}>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          
          {!isEditing ? (
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2 }}>Professional Summary</Typography>
                <Typography variant="body1" sx={{ color: '#334155', lineHeight: 1.8, textAlign: 'justify' }}>{profile.bio || 'No structural biography summary loaded yet.'}</Typography>
              </Box>

              <Divider sx={{ borderColor: '#f1f5f9' }} />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2.5 }}>Verified Track Credentials</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <BusinessCenterRoundedIcon sx={{ color: '#623E98', fontSize: '2rem' }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>Verified Certified Educator Account</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>EduPlatform Academic Network Authority</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2.5, bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2.5 }}>
                      <MenuBookRoundedIcon sx={{ color: '#623E98', fontSize: '2rem' }} />
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a' }}>Senior Engineering Curriculum Architect</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>Mastering Cloud Operations and Core Tracks</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ borderColor: '#f1f5f9' }} />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 2 }}>Expertise Skillsets</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {resumeSkills.map((skill) => (
                    <Chip key={skill} label={skill} sx={{ bgcolor: '#f1f5f9', color: '#334155', fontWeight: 600, px: 1, fontSize: '0.85rem', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  ))}
                </Box>
              </Box>
            </Stack>
          ) : (
            <Box component="form" onSubmit={handleSaveSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>Edit Public Credentials</Typography>
              <Divider sx={{ mt: -2, borderColor: '#f1f5f9' }} />

              <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
                {/* Top Row Layout Sections */}
                <Grid item xs={12} md={4}>
                  <TextField fullWidth required label="Full Legal Name" name="name" value={editForm.name || ''} onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth required label="Professional Title Designation" name="title" value={editForm.title || ''} onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField fullWidth required label="Contact Email Address" name="email" type="email" value={editForm.email || ''} onChange={handleInputChange} variant="outlined" />
                </Grid>
                
                {/* Summary Row Layout Track */}
                <Grid item xs={12} sx={{ width: '100%' }}>
                  <TextField 
                    fullWidth 
                    required 
                    multiline 
                    rows={5} 
                    label="Professional Summary Statement" 
                    name="bio" 
                    value={editForm.bio || ''} 
                    onChange={handleInputChange} 
                    placeholder="Describe your credentials, industry experiences, core skills sets..." 
                    variant="outlined" 
                  />
                </Grid>

                {/* Unified Network Section Heading inside Grid to block line-breaks cleanly */}
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0f172a' }}>Professional Networks</Typography>
                </Grid>
                
                {/* Bottom Networks Row */}
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="Personal Portfolio Web URL" name="website" value={editForm.website || ''} onChange={handleInputChange} variant="outlined" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="LinkedIn Public URL" name="linkedin" value={editForm.linkedin || ''} onChange={handleInputChange} variant="outlined" />
                </Grid>
              </Grid>

              <Divider sx={{ my: 1, borderColor: '#f1f5f9' }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" color="inherit" startIcon={<CancelRoundedIcon />} onClick={handleCancel} sx={{ textTransform: 'none', fontWeight: 600, height: '40px', px: 3, borderRadius: '8px' }}>Cancel</Button>
                <Button type="submit" variant="contained" startIcon={<SaveRoundedIcon />} sx={{ bgcolor: '#623E98', '&:hover': { bgcolor: '#320E5E' }, boxShadow: 'none', px: 4, height: '40px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>Save Changes</Button>
              </Box>
            </Box>
          )}

        </CardContent>
      </Card>
    </Box>
  );
}