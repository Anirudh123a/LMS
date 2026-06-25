import { useState, useRef } from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, Button,
  Chip, TextField, MenuItem, Divider, Stack, IconButton,
  InputAdornment, Paper, Fade, Snackbar, Alert, Tooltip
} from '@mui/material';
import PeopleRoundedIcon           from '@mui/icons-material/PeopleRounded';
import AccessTimeRoundedIcon       from '@mui/icons-material/AccessTimeRounded';
import ArrowBackRoundedIcon        from '@mui/icons-material/ArrowBackRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import CloudUploadRoundedIcon      from '@mui/icons-material/CloudUploadRounded';
import InsertDriveFileRoundedIcon  from '@mui/icons-material/InsertDriveFileRounded';
import DeleteOutlineRoundedIcon    from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon              from '@mui/icons-material/AddRounded';
import EditRoundedIcon             from '@mui/icons-material/EditRounded';
import MenuBookRoundedIcon         from '@mui/icons-material/MenuBookRounded';
import TitleRoundedIcon            from '@mui/icons-material/TitleRounded';
import CheckCircleRoundedIcon      from '@mui/icons-material/CheckCircleRounded';
import FolderSpecialRoundedIcon    from '@mui/icons-material/FolderSpecialRounded';
import DynamicFeedRoundedIcon      from '@mui/icons-material/DynamicFeedRounded';
import ExpandMoreRoundedIcon       from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon       from '@mui/icons-material/ExpandLessRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import VideoLibraryRoundedIcon     from '@mui/icons-material/VideoLibraryRounded';
import LinkRoundedIcon             from '@mui/icons-material/LinkRounded';
import ArticleRoundedIcon          from '@mui/icons-material/ArticleRounded';
import { useNavigate }             from 'react-router-dom';

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

/* ── localStorage helpers ── */
export const STORAGE_KEY = 'lms_courses';

const SEED = [
  {
    id: 1,
    title: 'Web Dev Pro: Mastering HTML, CSS & JS',
    category: 'Web Development',
    subCategory: 'Frontend Basics',
    students: 340,
    duration: '24',
    status: 'Published',
    synopsis: 'A comprehensive dive into the building blocks of the modern web.',
    image: 'https://images.unsplash.com/photo-1547658719-da2b81166b58?auto=format&fit=crop&w=600&q=80',
    fileName: 'syllabus_core_web.pdf',
    modules: [
      {
        id: 1, title: 'HTML Fundamentals', duration: '3', expanded: false,
        subModules: [
          { id: 101, title: 'Introduction to HTML', duration: '30', videoUrl: '', videoFile: null },
          { id: 102, title: 'Semantic Tags & Structure', duration: '45', videoUrl: '', videoFile: null },
        ]
      },
      {
        id: 2, title: 'CSS Grid & Flexbox', duration: '4', expanded: false,
        subModules: [
          { id: 201, title: 'CSS Basics Recap', duration: '20', videoUrl: '', videoFile: null },
        ]
      },
    ],
  },
  {
    id: 2,
    title: 'React Advanced: Architecture & Hooks',
    category: 'Web Development',
    subCategory: 'React Frameworks',
    students: 280,
    duration: '18',
    status: 'Published',
    synopsis: 'Deep dive into React hooks, context, state management patterns.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    fileName: 'react_adv_map.pdf',
    modules: [
      {
        id: 1, title: 'Introduction & Environment Setup', duration: '2', expanded: false,
        subModules: [
          { id: 101, title: 'Setting up React App', duration: '25', videoUrl: '', videoFile: null },
        ]
      },
    ],
  },
];

export function loadCourses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : SEED;
  } catch { return SEED; }
}

export function saveCourses(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
}

/* ── Sub-module row ── */
function SubModuleRow({ sub, moduleId, onUpdate, onDelete }) {
  const videoInputRef = useRef(null);

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpdate(moduleId, sub.id, 'videoFile', { name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
      onUpdate(moduleId, sub.id, 'videoUrl', '');
    }
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', gap: 1.5,
      bgcolor: '#f9fafb', border: `1px solid ${P.border}`,
      borderRadius: '8px', p: 2, position: 'relative',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <PlayCircleOutlineRoundedIcon sx={{ color: P.brandMid, fontSize: '1rem', flexShrink: 0 }} />
        <TextField
          size="small" label="Lesson Title" value={sub.title}
          onChange={e => onUpdate(moduleId, sub.id, 'title', e.target.value)}
          sx={{ ...fieldSx, flex: 1, minWidth: 160 }}
        />
        <TextField
          size="small" type="number" label="Duration"
          value={sub.duration}
          onChange={e => onUpdate(moduleId, sub.id, 'duration', e.target.value)}
          InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '0.72rem', color: P.muted, fontWeight: 600 }}>min</Typography></InputAdornment> }}
          sx={{ ...fieldSx, width: 110 }}
        />
        <Tooltip title="Delete lesson">
          <IconButton size="small" onClick={() => onDelete(moduleId, sub.id)}
            sx={{ border: `1px solid ${P.border}`, borderRadius: '6px', p: 0.6, color: P.muted,
              '&:hover': { bgcolor: '#fff0f0', borderColor: '#fca5a5', color: '#ef4444' } }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Video attachment */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <TextField
          size="small" label="Video URL (YouTube / Vimeo)"
          value={sub.videoUrl || ''}
          onChange={e => { onUpdate(moduleId, sub.id, 'videoUrl', e.target.value); onUpdate(moduleId, sub.id, 'videoFile', null); }}
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
      {sub.videoFile && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: P.brandLight, borderRadius: '6px', px: 1.5, py: 0.8 }}>
          <VideoLibraryRoundedIcon sx={{ fontSize: '0.9rem', color: P.brand }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: P.brand, flex: 1 }}>{sub.videoFile.name}</Typography>
          <Typography sx={{ fontSize: '0.72rem', color: P.brandMid }}>{sub.videoFile.size}</Typography>
          <IconButton size="small" onClick={() => onUpdate(moduleId, sub.id, 'videoFile', null)}
            sx={{ p: 0.3, color: P.brand, '&:hover': { color: '#ef4444' } }}>
            <DeleteOutlineRoundedIcon sx={{ fontSize: '0.85rem' }} />
          </IconButton>
        </Box>
      )}
      {sub.videoUrl && !sub.videoFile && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: P.brandLight, borderRadius: '6px', px: 1.5, py: 0.8 }}>
          <LinkRoundedIcon sx={{ fontSize: '0.9rem', color: P.brand }} />
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: P.brand, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.videoUrl}</Typography>
        </Box>
      )}
    </Box>
  );
}

/* ── Module Row (Coursera-style expandable section) ── */
export function ModuleRow({ mod, index, onUpdate, onDelete, onAddSubModule, onUpdateSubModule, onDeleteSubModule }) {
  const [expanded, setExpanded] = useState(true);
  const totalMins = (mod.subModules || []).reduce((s, sm) => s + (parseFloat(sm.duration) || 0), 0);

  return (
    <Paper elevation={0} sx={{
      border: `1px solid ${P.border}`, borderRadius: '8px', overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
    }}>
      {/* Module header */}
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
          {index + 1}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }} onClick={e => e.stopPropagation()}>
          <TextField
            fullWidth size="small" placeholder={`Module ${index + 1} title, e.g. Introduction to the Course`}
            value={mod.title}
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
          {mod.subModules?.length > 0 && (
            <Chip label={`${mod.subModules.length} lesson${mod.subModules.length !== 1 ? 's' : ''}`} size="small"
              sx={{ fontSize: '0.72rem', fontWeight: 700, bgcolor: P.brandLight, color: P.brand, height: '22px' }} />
          )}
          <Tooltip title="Delete module">
            <IconButton size="small" onClick={e => { e.stopPropagation(); onDelete(mod.id); }}
              sx={{ border: `1px solid ${P.border}`, borderRadius: '6px', p: 0.6,
                '&:hover': { bgcolor: '#fff0f0', borderColor: '#fca5a5', color: '#ef4444' } }}>
              <DeleteOutlineRoundedIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
          {expanded ? <ExpandLessRoundedIcon sx={{ color: P.muted, fontSize: '1.2rem' }} /> : <ExpandMoreRoundedIcon sx={{ color: P.muted, fontSize: '1.2rem' }} />}
        </Box>
      </Box>

      {/* Sub-modules */}
      {expanded && (
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {(mod.subModules || []).map(sub => (
            <SubModuleRow
              key={sub.id}
              sub={sub}
              moduleId={mod.id}
              onUpdate={onUpdateSubModule}
              onDelete={onDeleteSubModule}
            />
          ))}
          <Button
            variant="outlined" size="small"
            startIcon={<AddRoundedIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => onAddSubModule(mod.id)}
            sx={{
              borderStyle: 'dashed', borderColor: P.brandMid, color: P.brand,
              borderRadius: '6px', textTransform: 'none', fontWeight: 600, fontSize: '0.82rem',
              alignSelf: 'flex-start', px: 2, py: 0.8,
              '&:hover': { bgcolor: P.brandLight, borderStyle: 'solid' }
            }}
          >
            Add Lesson
          </Button>
        </Box>
      )}
    </Paper>
  );
}

/* ═══════════════════════════════════════════════════════ */
export default function CoursesView() {
  const navigate     = useNavigate();
  const fileInputRef = useRef(null);

  const [courses, setCourses] = useState(loadCourses);
  const [view, setView]       = useState('list');
  const [toast, setToast]     = useState({ open: false, msg: '' });

  const blankForm = () => ({
    title: '', category: 'Web Development', subCategory: '',
    duration: '', status: 'Published', synopsis: '', image: '',
  });
  const [form, setForm]                 = useState(blankForm);
  const [attachedFile, setAttachedFile] = useState(null);
  const [modules, setModules]           = useState([]);

  const showToast = (msg) => setToast({ open: true, msg });
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachedFile({ name: file.name, size: (file.size / (1024 * 1024)).toFixed(2) + ' MB' });
  };

  /* Module CRUD */
  const addModule = () => setModules(prev => [...prev, {
    id: Date.now(), title: '', duration: '1', expanded: true,
    subModules: []
  }]);
  const updateModule = (id, field, value) =>
    setModules(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  const deleteModule = (id) => setModules(prev => prev.filter(m => m.id !== id));

  /* Sub-module CRUD */
  const addSubModule = (moduleId) =>
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, subModules: [...(m.subModules || []), { id: Date.now(), title: '', duration: '10', videoUrl: '', videoFile: null }] }
      : m
    ));
  const updateSubModule = (moduleId, subId, field, value) =>
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, subModules: m.subModules.map(s => s.id === subId ? { ...s, [field]: value } : s) }
      : m
    ));
  const deleteSubModule = (moduleId, subId) =>
    setModules(prev => prev.map(m => m.id === moduleId
      ? { ...m, subModules: m.subModules.filter(s => s.id !== subId) }
      : m
    ));

  const handleCreate = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(), ...form, students: 0,
      image: form.image.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      fileName: attachedFile ? attachedFile.name : null,
      modules,
    };
    const updated = [created, ...courses];
    setCourses(updated);
    saveCourses(updated);
    setView('list');
    setForm(blankForm());
    setModules([]);
    setAttachedFile(null);
    showToast('Course created successfully!');
  };

  const goEdit = (course) => {
    localStorage.setItem('lms_editing_id', String(course.id));
    navigate('/mentor/courses/edit');
  };

  const totalLessons = modules.reduce((s, m) => s + (m.subModules?.length || 0), 0);
  const totalMins = modules.reduce((s, m) =>
    s + (m.subModules || []).reduce((ss, sm) => ss + (parseFloat(sm.duration) || 0), 0), 0);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: P.bg, pb: 8 }}>

      {/* ════ LIST VIEW ════ */}
      {view === 'list' && (
        <Fade in>
          <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, sm: 3, md: 5 }, pt: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 5 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, color: P.ink, fontSize: { xs: '1.5rem', md: '1.75rem' }, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  My Courses
                </Typography>
                <Typography sx={{ color: P.muted, mt: 0.5, fontSize: '0.9rem' }}>
                  {courses.length} course{courses.length !== 1 ? 's' : ''} published
                </Typography>
              </Box>
              <Button
                variant="contained" startIcon={<AddRoundedIcon />}
                onClick={() => { setForm(blankForm()); setModules([]); setAttachedFile(null); setView('create'); }}
                sx={{
                  bgcolor: P.brand, fontWeight: 700, px: 3, height: '44px',
                  borderRadius: '8px', textTransform: 'none', fontSize: '0.92rem',
                  boxShadow: '0 2px 8px rgba(0,86,210,0.3)',
                  '&:hover': { bgcolor: P.brandDark, boxShadow: '0 4px 12px rgba(0,86,210,0.4)' },
                }}
              >
                New Course
              </Button>
            </Box>

            {courses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 14, color: P.muted }}>
                <MenuBookRoundedIcon sx={{ fontSize: '3.5rem', mb: 2, opacity: 0.3 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>No courses yet</Typography>
                <Typography sx={{ fontSize: '0.9rem' }}>Create your first course to get started.</Typography>
              </Box>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(3,1fr)', xl: 'repeat(4,1fr)' },
                gap: 3,
              }}>
                {courses.map(course => (
                  <CourseCard key={course.id} course={course} onEdit={goEdit} />
                ))}
              </Box>
            )}
          </Box>
        </Fade>
      )}

      {/* ════ CREATE VIEW ════ */}
      {view === 'create' && (
        <Fade in>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, sm: 3, md: 5 }, pt: { xs: 3, md: 5 } }}>
            {/* Back header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
              <IconButton onClick={() => setView('list')}
                sx={{ border: `1px solid ${P.border}`, bgcolor: P.white, borderRadius: '8px',
                  '&:hover': { bgcolor: P.brandLight, borderColor: P.brandMid } }}>
                <ArrowBackRoundedIcon sx={{ color: P.ink, fontSize: '1.1rem' }} />
              </IconButton>
              <Box>
                <Typography sx={{ fontWeight: 800, color: P.ink, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
                  Create a New Course
                </Typography>
                <Typography sx={{ color: P.muted, fontSize: '0.88rem', mt: 0.2 }}>
                  Add course details, build your curriculum, and attach resources.
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleCreate}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '380px 1fr' }, gap: 4, alignItems: 'flex-start' }}>

                {/* LEFT — Course Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Card sx={sectionCardSx}>
                    <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <ArticleRoundedIcon sx={{ color: P.brand, fontSize: '1.1rem' }} />
                      <Typography sx={{ fontWeight: 700, color: P.ink, fontSize: '1rem' }}>Course Details</Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2.5}>
                        <TextField fullWidth required label="Course Title" name="title" value={form.title} onChange={handleFormChange}
                          placeholder="e.g. Complete JavaScript Developer Course"
                          InputProps={{ startAdornment: <InputAdornment position="start"><TitleRoundedIcon sx={{ color: '#cbd5e1', fontSize: '1rem' }} /></InputAdornment> }}
                          sx={fieldSx} />

                        <TextField select fullWidth label="Category" name="category" value={form.category} onChange={handleFormChange}
                          InputProps={{ startAdornment: <InputAdornment position="start"><FolderSpecialRoundedIcon sx={{ color: '#cbd5e1', fontSize: '1rem' }} /></InputAdornment> }}
                          sx={fieldSx}>
                          {['Web Development','Data Science','UI/UX Design','Cloud & DevOps'].map(c =>
                            <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </TextField>

                        <TextField fullWidth required label="Sub-category" name="subCategory" value={form.subCategory}
                          onChange={handleFormChange} placeholder="e.g. React Frameworks"
                          InputProps={{ startAdornment: <InputAdornment position="start"><DynamicFeedRoundedIcon sx={{ color: '#cbd5e1', fontSize: '1rem' }} /></InputAdornment> }}
                          sx={fieldSx} />

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                          <TextField required type="number" label="Duration (hrs)" name="duration" value={form.duration}
                            onChange={handleFormChange} placeholder="24"
                            InputProps={{ endAdornment: <InputAdornment position="end"><Typography sx={{ fontSize: '0.72rem', color: P.muted, fontWeight: 600 }}>HRS</Typography></InputAdornment> }}
                            sx={fieldSx} />
                          <TextField select label="Status" name="status" value={form.status} onChange={handleFormChange} sx={fieldSx}>
                            <MenuItem value="Published">Published</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                          </TextField>
                        </Box>

                        <TextField fullWidth multiline rows={3} label="Short Description" name="synopsis" value={form.synopsis}
                          onChange={handleFormChange} placeholder="What will students learn? Keep it compelling." sx={fieldSx} />

                        <TextField fullWidth label="Cover Image URL (optional)" name="image" value={form.image}
                          onChange={handleFormChange} placeholder="https://images.unsplash.com/..." sx={fieldSx} />
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Resource Attachment */}
                  <Card sx={sectionCardSx}>
                    <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <InsertDriveFileRoundedIcon sx={{ color: P.brand, fontSize: '1.1rem' }} />
                      <Typography sx={{ fontWeight: 700, color: P.ink, fontSize: '1rem' }}>Resource Attachment</Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".pdf,.zip,.doc,.docx" />
                      <Box onClick={() => fileInputRef.current.click()} sx={{
                        border: `2px dashed ${P.border}`, borderRadius: '8px', p: 3, textAlign: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                        '&:hover': { borderColor: P.brand, bgcolor: P.brandLight },
                      }}>
                        <CloudUploadRoundedIcon sx={{ fontSize: '2rem', color: '#94a3b8', mb: 0.5 }} />
                        <Typography sx={{ fontWeight: 700, color: P.slate, fontSize: '0.88rem', mb: 0.3 }}>Upload syllabus or resources</Typography>
                        <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem' }}>PDF, ZIP · up to 25 MB</Typography>
                      </Box>
                      {attachedFile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: P.successBg, border: '1px solid #a7f3d0', p: 1.5, borderRadius: '8px', mt: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                            <InsertDriveFileRoundedIcon sx={{ color: P.success, flexShrink: 0, fontSize: '1.1rem' }} />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 700, color: P.success, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{attachedFile.name}</Typography>
                              {attachedFile.size && <Typography sx={{ color: '#16a34a', fontSize: '0.75rem' }}>{attachedFile.size}</Typography>}
                            </Box>
                          </Box>
                          <Button size="small" color="error" onClick={() => setAttachedFile(null)} sx={{ fontWeight: 700, textTransform: 'none', fontSize: '0.78rem' }}>Remove</Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Box>

                {/* RIGHT — Curriculum */}
                <Card sx={{ ...sectionCardSx, minHeight: 400 }}>
                  <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${P.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <MenuBookRoundedIcon sx={{ color: P.brand, fontSize: '1.1rem' }} />
                        <Typography sx={{ fontWeight: 700, color: P.ink, fontSize: '1rem' }}>Curriculum</Typography>
                      </Box>
                      {modules.length > 0 && (
                        <Typography sx={{ color: P.muted, fontSize: '0.8rem', mt: 0.3 }}>
                          {modules.length} section{modules.length !== 1 ? 's' : ''} · {totalLessons} lesson{totalLessons !== 1 ? 's' : ''} · {totalMins} min
                        </Typography>
                      )}
                    </Box>
                    <Button variant="contained" size="small" startIcon={<AddRoundedIcon sx={{ fontSize: '0.9rem' }} />} onClick={addModule}
                      sx={{ bgcolor: P.brand, color: P.white, fontWeight: 700, borderRadius: '6px', textTransform: 'none',
                        height: '36px', px: 2, fontSize: '0.82rem', boxShadow: 'none',
                        '&:hover': { bgcolor: P.brandDark, boxShadow: 'none' } }}>
                      Add Section
                    </Button>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    {modules.length === 0 ? (
                      <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                        border: `2px dashed ${P.border}`, borderRadius: '8px', textAlign: 'center', bgcolor: '#f9fafb' }}>
                        <MenuBookRoundedIcon sx={{ fontSize: '2.5rem', color: '#cbd5e1' }} />
                        <Box>
                          <Typography sx={{ fontWeight: 700, color: P.slate, fontSize: '0.95rem' }}>No sections yet</Typography>
                          <Typography sx={{ color: P.muted, fontSize: '0.85rem' }}>Add a section to start building your curriculum.</Typography>
                        </Box>
                        <Button variant="outlined" startIcon={<AddRoundedIcon />} onClick={addModule}
                          sx={{ borderColor: P.brand, color: P.brand, borderRadius: '6px', textTransform: 'none', fontWeight: 600 }}>
                          Add First Section
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {modules.map((mod, index) => (
                          <ModuleRow
                            key={mod.id} mod={mod} index={index}
                            onUpdate={updateModule} onDelete={deleteModule}
                            onAddSubModule={addSubModule}
                            onUpdateSubModule={updateSubModule}
                            onDeleteSubModule={deleteSubModule}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Action buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: `1px solid ${P.border}` }}>
                <Button variant="outlined" color="inherit" onClick={() => setView('list')}
                  sx={{ borderColor: P.border, color: P.slate, fontWeight: 700, borderRadius: '8px', height: '44px', px: 3, textTransform: 'none' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" startIcon={<AddCircleOutlineRoundedIcon />}
                  sx={{ bgcolor: P.brand, fontWeight: 700, px: 4, height: '44px', borderRadius: '8px', textTransform: 'none',
                    boxShadow: '0 2px 8px rgba(0,86,210,0.3)', '&:hover': { bgcolor: P.brandDark } }}>
                  Create Course
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      )}

      <Snackbar open={toast.open} autoHideDuration={3500} onClose={() => setToast(t => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" icon={<CheckCircleRoundedIcon fontSize="inherit" />}
          onClose={() => setToast(t => ({ ...t, open: false }))}
          sx={{ borderRadius: '8px', fontWeight: 600, bgcolor: P.successBg, color: P.success,
            border: '1px solid #a7f3d0', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

/* ── Course Card ── */
function CourseCard({ course, onEdit }) {
  const totalLessons = (course.modules || []).reduce((s, m) => s + (m.subModules?.length || 0), 0);
  return (
    <Card sx={{
      borderRadius: '8px', border: `1px solid ${P.border}`, boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
      overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '420px',
      transition: 'box-shadow 0.2s, transform 0.2s',
      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
    }}>
      {/* Image — fixed 150px */}
      <Box sx={{ position: 'relative', height: 150, flexShrink: 0, overflow: 'hidden', bgcolor: '#e5e7eb' }}>
        <CardMedia
          component="img"
          image={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'; }}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <Chip label={course.status} size="small" sx={{
          position: 'absolute', top: 10, right: 10, fontSize: '0.7rem', fontWeight: 700, height: '22px',
          bgcolor: course.status === 'Published' ? '#d1fae5' : '#f1f5f9',
          color: course.status === 'Published' ? '#065f46' : P.slate,
        }} />
      </Box>

      {/* Content — fills remaining 270px */}
      <CardContent sx={{ p: 2, pb: '12px !important', display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

        {/* Category — fixed 18px */}
        <Typography sx={{ color: P.brand, fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.4, flexShrink: 0 }}>
          {course.category}
        </Typography>

        {/* Title — fixed 2 lines = ~44px */}
        <Box sx={{ height: '44px', flexShrink: 0, overflow: 'hidden', mb: 0.6 }}>
          <Typography sx={{
            fontWeight: 700, fontSize: '0.93rem', lineHeight: 1.4, color: P.ink,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.title}
          </Typography>
        </Box>

        {/* Synopsis — fixed 2 lines = ~40px */}
        <Box sx={{ height: '40px', flexShrink: 0, overflow: 'hidden', mb: 1 }}>
          <Typography sx={{
            fontSize: '0.76rem', color: P.muted, lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {course.synopsis}
          </Typography>
        </Box>

        {/* PDF attachment — fixed 30px */}
        <Box sx={{ height: '30px', flexShrink: 0, mb: 1, overflow: 'hidden' }}>
          {course.fileName ? (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 0.8, height: '100%',
              bgcolor: '#f8fafc', border: `1px solid ${P.border}`,
              borderRadius: '6px', px: 1.2,
            }}>
              <InsertDriveFileRoundedIcon sx={{ fontSize: '0.8rem', color: P.muted, flexShrink: 0 }} />
              <Typography sx={{
                fontSize: '0.72rem', fontWeight: 600, color: P.slate,
                overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
              }}>
                {course.fileName}
              </Typography>
            </Box>
          ) : (
            <Typography sx={{ fontSize: '0.71rem', color: '#c0c8d0', fontStyle: 'italic', lineHeight: '30px' }}>
              No resource attached
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 1, flexShrink: 0 }} />

        {/* Stats — fixed 24px */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 1, flexShrink: 0, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {[
            { icon: <PeopleRoundedIcon sx={{ fontSize: '0.75rem' }} />, label: `${course.students?.toLocaleString()} students` },
            { icon: <AccessTimeRoundedIcon sx={{ fontSize: '0.75rem' }} />, label: `${course.duration} hrs` },
            { icon: <PlayCircleOutlineRoundedIcon sx={{ fontSize: '0.75rem' }} />, label: `${totalLessons} lessons` },
          ].map(({ icon, label }, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.3, flexShrink: 0 }}>
              <Box sx={{ color: P.muted }}>{icon}</Box>
              <Typography sx={{ fontSize: '0.72rem', color: P.muted, fontWeight: 500, whiteSpace: 'nowrap' }}>{label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Edit button — fills remaining space */}
        <Box sx={{ mt: 'auto', flexShrink: 0 }}>
          <Button
            fullWidth variant="outlined"
            startIcon={<EditRoundedIcon sx={{ fontSize: '0.85rem' }} />}
            onClick={() => onEdit(course)}
            sx={{
              borderColor: P.border, color: P.brand, fontWeight: 700,
              borderRadius: '6px', height: '36px', textTransform: 'none', fontSize: '0.82rem',
              '&:hover': { borderColor: P.brand, bgcolor: P.brandLight },
            }}
          >
            Edit Course
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}