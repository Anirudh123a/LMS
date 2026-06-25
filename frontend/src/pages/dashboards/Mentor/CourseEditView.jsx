import { useState, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button,
  TextField, MenuItem, Divider, IconButton,
  InputAdornment, Fade, Snackbar, Alert, Chip, Tooltip
} from '@mui/material';
import ArrowBackRoundedIcon        from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon             from '@mui/icons-material/SaveRounded';
import AddRoundedIcon              from '@mui/icons-material/AddRounded';
import MenuBookRoundedIcon         from '@mui/icons-material/MenuBookRounded';
import TitleRoundedIcon            from '@mui/icons-material/TitleRounded';
import CloudUploadRoundedIcon      from '@mui/icons-material/CloudUploadRounded';
import InsertDriveFileRoundedIcon  from '@mui/icons-material/InsertDriveFileRounded';
import CheckCircleRoundedIcon      from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon    from '@mui/icons-material/DeleteOutlineRounded';
import ExpandMoreRoundedIcon       from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon       from '@mui/icons-material/ExpandLessRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import VideoLibraryRoundedIcon     from '@mui/icons-material/VideoLibraryRounded';
import LinkRoundedIcon             from '@mui/icons-material/LinkRounded';
import ArticleRoundedIcon          from '@mui/icons-material/ArticleRounded';
import FolderSpecialRoundedIcon    from '@mui/icons-material/FolderSpecialRounded';
import DynamicFeedRoundedIcon      from '@mui/icons-material/DynamicFeedRounded';
import { useNavigate }             from 'react-router-dom';

import { loadCourses, saveCourses } from './CoursesView';

/* ── palette ── */
const P = {
  brand:      '#0056D2',
  brandDark:  '#003A8C',
  brandLight: '#E8F0FE',
  brandMid:   '#4A90D9',
  ink:        '#1c1d1f',
  slate:      '#3d3d3d',
  muted:      '#6a6f73',
  border:     '#d1d7dc',
  surface:    '#ffffff',
  bg:         '#f7f9fc',
  white:      '#ffffff',
  success:    '#1e6055',
  successBg:  '#e5f5f3',
  pill:       '#f0f0f0',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    bgcolor: P.white,
    fontSize: '0.92rem',
    '& fieldset': { borderColor: P.border },
    '&:hover fieldset':    { borderColor: P.brandMid },
    '&.Mui-focused fieldset': { borderColor: P.brand, borderWidth: '2px' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: P.brand },
  '& .MuiInputLabel-root': { fontSize: '0.92rem' },
};

const sectionCardSx = {
  borderRadius: '8px',
  border: `1px solid ${P.border}`,
  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
  bgcolor: P.white,
  overflow: 'hidden',
};

/* ── Section Item Row (With Video & Document Attachments) ── */
function SectionRow({ section, moduleId, onUpdate, onDelete }) {
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate(moduleId, section.id, 'videoFile', { name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
      onUpdate(moduleId, section.id, 'videoUrl', '');
    }
  };

  const handleDocumentFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate(moduleId, section.id, 'docFile', { name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
    }
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', gap: 1.5,
      bgcolor: '#f9fafb', border: `1px solid ${P.border}`,
      borderRadius: '8px', p: 2,
    }}>
      {/* Title, Duration, Delete Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <PlayCircleOutlineRoundedIcon sx={{ color: P.brandMid, fontSize: '1rem', flexShrink: 0 }} />
        <TextField
          size="small" label="Section Title" value={section.title || ''}
          onChange={e => onUpdate(moduleId, section.id, 'title', e.target.value)}
          placeholder="e.g. Section 1: Intro to React"
          sx={{ ...fieldSx, flex: 1, minWidth: 160 }}
        />
        <TextField
          size="small" type="number" label="Duration"
          value={section.duration || ''}
          onChange={e => onUpdate(moduleId, section.id, 'duration', e.target.value)}
          InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '0.72rem', color: P.muted, fontWeight: 600 }}>min</Typography></InputAdornment> }}
          sx={{ ...fieldSx, width: 110 }}
        />
        <Tooltip title="Delete Section">
          <IconButton size="small" onClick={() => onDelete(moduleId, section.id)}
            sx={{ border: `1px solid ${P.border}`, borderRadius: '6px', p: 0.6, color: P.muted,
              '&:hover': { bgcolor: '#fff0f0', borderColor: '#fca5a5', color: '#ef4444' } }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Video Management */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField
          size="small" label="Video URL (YouTube / Vimeo)"
          value={section.videoUrl || ''}
          onChange={e => { onUpdate(moduleId, section.id, 'videoUrl', e.target.value); onUpdate(moduleId, section.id, 'videoFile', null); }}
          placeholder="https://youtube.com/watch?v=..."
          InputProps={{ startAdornment: <InputAdornment position="start"><LinkRoundedIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} /></InputAdornment> }}
          sx={{ ...fieldSx, flex: 1, minWidth: 200 }}
        />
        <Typography sx={{ fontSize: '0.78rem', color: P.muted, alignSelf: 'center', flexShrink: 0 }}>or</Typography>
        <Box>
          <input type="file" ref={videoInputRef} style={{ display: 'none' }} accept="video/*" onChange={handleVideoFile} />
          <Button size="small" variant="outlined" startIcon={<VideoLibraryRoundedIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => videoInputRef.current.click()}
            sx={{ borderColor: P.border, color: P.slate, borderRadius: '6px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
              height: '36px', '&:hover': { borderColor: P.brand, color: P.brand, bgcolor: P.brandLight } }}>
            Upload Video
          </Button>
        </Box>
      </Box>

      {/* Resource PDF/Doc File Attachments (Configured Specifically for Section context) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
        <input type="file" ref={documentInputRef} style={{ display: 'none' }} accept=".pdf,.zip,.doc,.docx" onChange={handleDocumentFile} />
        <Button size="small" variant="outlined" startIcon={<CloudUploadRoundedIcon sx={{ fontSize: '0.9rem' }} />}
          onClick={() => documentInputRef.current.click()}
          sx={{ borderColor: P.border, color: P.slate, borderRadius: '6px', textTransform: 'none', fontWeight: 600, fontSize: '0.78rem',
            height: '32px', '&:hover': { borderColor: P.brand, color: P.brand, bgcolor: P.brandLight } }}>
          Attach Resources (PDF/ZIP)
        </Button>
      </Box>

      {/* Conditional File Status Previews */}
      {section.videoFile && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: P.brandLight, borderRadius: '6px', px: 1.5, py: 0.8 }}>
          <VideoLibraryRoundedIcon sx={{ fontSize: '0.9rem', color: P.brand }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: P.brand, flex: 1 }}>[Video] {section.videoFile.name}</Typography>
          <Typography sx={{ fontSize: '0.72rem', color: P.brandMid }}>{section.videoFile.size}</Typography>
          <IconButton size="small" onClick={() => onUpdate(moduleId, section.id, 'videoFile', null)}
            sx={{ p: 0.3, color: P.brand, '&:hover': { color: '#ef4444' } }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: '0.85rem' }} />
          </IconButton>
        </Box>
      )}

      {section.docFile && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#e5f5f3', borderRadius: '6px', px: 1.5, py: 0.8, border: '1px solid #bfdffe' }}>
          <InsertDriveFileRoundedIcon sx={{ fontSize: '0.9rem', color: P.success }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: P.success, flex: 1 }}>[Doc/PDF] {section.docFile.name}</Typography>
          {section.docFile.size && <Typography sx={{ fontSize: '0.72rem', color: P.success }}>{section.docFile.size}</Typography>}
          <IconButton size="small" onClick={() => onUpdate(moduleId, section.id, 'docFile', null)}
            sx={{ p: 0.3, color: P.success, '&:hover': { color: '#ef4444' } }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: '0.85rem' }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

/* ── Module Container Row ── */
function ModuleRow({ mod, index, onUpdate, onDelete, onAddSection, onUpdateSection, onDeleteSection }) {
  const [expanded, setExpanded] = useState(true);
  const totalMins = (mod.sections || []).reduce((s, sec) => s + (parseFloat(sec.duration) || 0), 0);

  return (
    <Box sx={{
      border: `1px solid ${P.border}`, borderRadius: '8px', overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    }}>
      {/* Header Container */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 2, p: '14px 16px',
        bgcolor: expanded ? '#f0f4ff' : P.white, cursor: 'pointer',
        borderBottom: expanded ? `1px solid ${P.border}` : 'none',
        transition: 'background 0.2s',
      }} onClick={() => setExpanded(e => !e)}>
        
        <Box sx={{
          width: 28, height: 28, borderRadius: '6px', flexShrink: 0,
          bgcolor: P.brand, color: P.white,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 800,
        }}>
          M{index + 1}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }} onClick={e => e.stopPropagation()}>
          <TextField
            fullWidth size="small"
            placeholder={`Module ${index + 1} Title, e.g. Basics of JavaScript`}
            value={mod.title || ''}
            onChange={e => onUpdate(mod.id, 'title', e.target.value)}
            sx={{
              ...fieldSx,
              '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], bgcolor: 'transparent', fontWeight: 700 },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {totalMins > 0 && (
            <Chip label={`${totalMins} min`} size="small"
              sx={{ fontSize: '0.72rem', fontWeight: 700, bgcolor: P.pill, color: P.slate, height: '22px' }} />
          )}
          {mod.sections?.length > 0 && (
            <Chip label={`${mod.sections.length} Section${mod.sections.length !== 1 ? 's' : ''}`} size="small"
              sx={{ fontSize: '0.72rem', fontWeight: 700, bgcolor: P.brandLight, color: P.brand, height: '22px' }} />
          )}
          <Tooltip title="Delete Module">
            <IconButton size="small" onClick={e => { e.stopPropagation(); onDelete(mod.id); }}
              sx={{ border: `1px solid ${P.border}`, borderRadius: '6px', p: 0.6,
                '&:hover': { bgcolor: '#fff0f0', borderColor: '#fca5a5', color: '#ef4444' } }}>
              <DeleteOutlineRoundedIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
          {expanded ? <ExpandLessRoundedIcon sx={{ color: P.muted }} /> : <ExpandMoreRoundedIcon sx={{ color: P.muted }} />}
        </Box>
      </Box>

      {/* Expanded Sections Container */}
      {expanded && (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#fafbff' }}>
          {(mod.sections || []).map(sec => (
            <SectionRow
              key={sec.id} section={sec} moduleId={mod.id}
              onUpdate={onUpdateSection} onDelete={onDeleteSection}
            />
          ))}
          <Button
            variant="outlined" size="small"
            startIcon={<AddRoundedIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => onAddSection(mod.id)}
            sx={{
              borderStyle: 'dashed', borderColor: P.brandMid, color: P.brand,
              borderRadius: '6px', textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
              alignSelf: 'flex-start', px: 2, py: 0.8,
              '&:hover': { bgcolor: P.brandLight, borderStyle: 'solid' }
            }}
          >
            Add Module
          </Button>
        </Box>
      )}
    </Box>
  );
}

/* ── Main View Component ── */
export default function CourseEditView() {
  const navigate = useNavigate();

  const [ready, setReady]       = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [toast, setToast]       = useState({ open: false, msg: '', severity: 'success' });
  const [saving, setSaving]     = useState(false);

  const [courseId, setCourseId] = useState(null);
  const [form, setForm]         = useState({ title: '', category: 'Web Development', subCategory: '', duration: '', status: 'Published', synopsis: '', image: '' });
  const [modules, setModules]   = useState([]);

  useEffect(() => {
    const id = parseInt(localStorage.getItem('lms_editing_id'), 10);
    if (!id) { setNotFound(true); setReady(true); return; }
    const courses = loadCourses();
    const course  = courses.find(c => c.id === id);
    if (!course) { setNotFound(true); setReady(true); return; }

    setCourseId(id);
    setForm({
      title:       course.title       || '',
      category:    course.category    || 'Web Development',
      subCategory: course.subCategory || '',
      duration:    course.duration    || '',
      status:      course.status      || 'Published',
      synopsis:    course.synopsis    || '',
      image:       course.image       || '',
    });
    
    // Mapping payload structure backwards compatibility to Module -> Sections structure
    setModules((course.modules || []).map(m => ({
      ...m,
      sections: (m.sections || m.subModules || []).map(s => ({ ...s }))
    })));
    setReady(true);
  }, []);

  const showToast = (msg, severity = 'success') => setToast({ open: true, msg, severity });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /* Module level hooks */
  const addModule    = () => setModules(prev => [...prev, { id: Date.now(), title: '', sections: [] }]);
  const updateModule = (id, f, v) => setModules(prev => prev.map(m => m.id === id ? { ...m, [f]: v } : m));
  const deleteModule = (id) => setModules(prev => prev.filter(m => m.id !== id));

  /* Section level hooks */
  const addSection = (moduleId) =>
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, sections: [...(m.sections || []), { id: Date.now(), title: '', duration: '10', videoUrl: '', videoFile: null, docFile: null }] }
      : m));
      
  const updateSection = (moduleId, sectionId, field, value) =>
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, sections: m.sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s) }
      : m));
      
  const deleteSection = (moduleId, sectionId) =>
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, sections: m.sections.filter(s => s.id !== sectionId) }
      : m));

  const handleSave = () => {
    setSaving(true);
    const courses = loadCourses();
    const updated = courses.map(c =>
      c.id === courseId ? { ...c, ...form, modules } : c
    );
    saveCourses(updated);
    showToast('Changes saved successfully!');
    setTimeout(() => { setSaving(false); navigate('/mentor/courses'); }, 900);
  };

  const totalSections = modules.reduce((s, m) => s + (m.sections?.length || 0), 0);
  const totalMins = modules.reduce((s, m) =>
    s + (m.sections || []).reduce((ss, sec) => ss + (parseFloat(sec.duration) || 0), 0), 0);

  if (!ready) return null;

  if (notFound) return (
    <Box sx={{ p: 6, textAlign: 'center' }}>
      <Typography sx={{ color: P.ink, mb: 2, fontWeight: 700, fontSize: '1.1rem' }}>Course not found.</Typography>
      <Button variant="contained" onClick={() => navigate('/mentor/courses')}>Back to Courses</Button>
    </Box>
  );

  return (
    <Fade in>
      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: P.bg, pb: 8 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 5 }, pt: { xs: 3, md: 5 } }}>

          {/* Page header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/mentor/courses')} sx={{ border: `1px solid ${P.border}`, bgcolor: P.white }}>
                  <ArrowBackRoundedIcon sx={{ color: P.ink, fontSize: '1.1rem' }} />
                </IconButton>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: P.ink, fontSize: { xs: '1.1rem', md: '1.4rem' } }}>
                    Edit Course Structure
                  </Typography>
                  <Typography sx={{ color: P.muted, fontSize: '0.85rem' }}>
                    {modules.length} Module{modules.length !== 1 ? 's' : ''} · {totalSections} Section{totalSections !== 1 ? 's' : ''} · {totalMins} min total
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Button variant="outlined" color="inherit" onClick={() => navigate('/mentor/courses')} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
                <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={handleSave} disabled={saving} sx={{ bgcolor: P.brand, borderRadius: '8px', textTransform: 'none' }}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Layout Columns */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 4 }}>
            
            {/* Left Column: Metadata */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card sx={sectionCardSx}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ArticleRoundedIcon sx={{ color: P.brand }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Course Details</Typography>
                </Box>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField fullWidth required label="Course Title" name="title" value={form.title} onChange={handleFormChange} sx={fieldSx} />
                  <TextField select fullWidth label="Category" name="category" value={form.category} onChange={handleFormChange} sx={fieldSx}>
                    {['Web Development','Data Science','UI/UX Design','Cloud & DevOps'].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </TextField>
                  <TextField fullWidth required label="Sub-category" name="subCategory" value={form.subCategory} onChange={handleFormChange} sx={fieldSx} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <TextField required type="number" label="Duration (hrs)" name="duration" value={form.duration} onChange={handleFormChange} sx={fieldSx} />
                    <TextField select label="Status" name="status" value={form.status} onChange={handleFormChange} sx={fieldSx}>
                      <MenuItem value="Published">Published</MenuItem>
                      <MenuItem value="Draft">Draft</MenuItem>
                    </TextField>
                  </Box>
                  <TextField fullWidth multiline rows={3} label="Short Description" name="synopsis" value={form.synopsis} onChange={handleFormChange} sx={fieldSx} />
                </CardContent>
              </Card>
            </Box>

            {/* Right Column: Restructured Curriculum */}
            <Card sx={{ ...sectionCardSx, minHeight: 500 }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <MenuBookRoundedIcon sx={{ color: P.brand }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Curriculum Layout</Typography>
                  </Box>
                </Box>
                <Button variant="contained" size="small" startIcon={<AddRoundedIcon />} onClick={addModule} sx={{ bgcolor: P.brand, textTransform: 'none' }}>
                  Add Module
                </Button>
              </Box>
              <CardContent sx={{ p: 3 }}>
                {modules.length === 0 ? (
                  <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: `2px dashed ${P.border}`, borderRadius: '8px', textAlign: 'center' }}>
                    <MenuBookRoundedIcon sx={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
                    <Typography sx={{ fontWeight: 700, color: P.slate }}>No modules yet</Typography>
                    <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={addModule} sx={{ textTransform: 'none' }}>Add First Module</Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {modules.map((mod, index) => (
                      <ModuleRow
                        key={mod.id} mod={mod} index={index}
                        onUpdate={updateModule} onDelete={deleteModule}
                        onAddSection={addSection}
                        onUpdateSection={updateSection}
                        onDeleteSection={deleteSection}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast(t => ({ ...t, open: false }))}>
          <Alert severity={toast.severity} onClose={() => setToast(t => ({ ...t, open: false }))} sx={{ borderRadius: '8px' }}>
            {toast.msg}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
}