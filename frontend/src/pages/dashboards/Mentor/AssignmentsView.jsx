import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Divider,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  Select,
} from '@mui/material';

import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import RateReviewRoundedIcon from '@mui/icons-material/RateReviewRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

const mockStudents = [
  { id: 'all', name: 'All Enrolled Students' },
  { id: 's1', name: 'Arjun Patel' },
  { id: 's2', name: 'Meera Shah' },
  { id: 's3', name: 'Vikram Nair' },
  { id: 's4', name: 'Rohan Sharma' },
];

const mockCourses = [
  { id: 'c1', title: 'Web Dev Pro: Mastering HTML, CSS & JS' },
  { id: 'c2', title: 'React Advanced: Architecture & Hooks' },
  { id: 'c3', title: 'Data Science Fundamentals with Python' },
];

const initialAssignments = [
  { id: 1, student: 'Arjun Patel', course: 'Web Dev Pro', assignment: 'Module 3: Portfolio Layout', submitted: 'Jun 19, 4:30 PM', status: 'Pending', submissionText: 'Here is my completed personal portfolio submission built using semantic HTML and flexbox layouts.', link: 'https://github.com/arjun/portfolio', dueDate: '2026-06-25', description: 'Complete a responsive personal portfolio website.' },
  { id: 2, student: 'Meera Shah', course: 'React Advanced', assignment: 'Final Project: Dashboard UI', submitted: 'Jun 18, 9:15 AM', status: 'Pending', submissionText: 'Implemented complex global context state management, reusable charts grids, and integrated strict routing systems.', link: 'https://github.com/meera/react-dashboard', dueDate: '2026-06-28', description: 'Build an optimized administrative workspace panel.' },
  { id: 3, student: 'Vikram Nair', course: 'Data Science', assignment: 'Lab 4: Data Linear Regressions', submitted: 'Jun 17, 2:00 PM', status: 'Graded', submissionText: 'Cleaned the dataset and calculated accurate standard error variables within the matrix module arrays.', link: 'https://github.com/vikram/ds-regression', grade: 'A', feedback: 'Excellent variable analysis.', dueDate: '2026-06-15', description: 'Analyze linear regression trends on localized climate datasets.' },
];

export default function AssignmentsView() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create', or 'edit'
  
  // Grading Modal State
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  // Creation & Editing State Form Control
  const [editingId, setEditingId] = useState(null);
  const [taskForm, setTaskForm] = useState({
  title: '',
  courseId: '',
  studentId: '',
  dueDate: '',
  description: '',
});

  const handleOpenReview = (assignment) => {
    setSelectedAssignment(assignment);
    setGrade(assignment.grade || '');
    setFeedback(assignment.feedback || '');
    setOpenModal(true);
  };

  const handleCloseReview = () => {
    setOpenModal(false);
    setSelectedAssignment(null);
  };

  const handleSubmitGrade = () => {
    setAssignments(prev =>
      prev.map(item =>
        item.id === selectedAssignment.id
          ? { ...item, status: 'Graded', grade: grade, feedback: feedback }
          : item
      )
    );
    handleCloseReview();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateMode = () => {
    setEditingId(null);
    setTaskForm({ title: '', courseId: '', studentId: '', dueDate: '', description: '' });
    setViewMode('create');
  };

  const handleOpenEditMode = (assignment) => {
    const matchedCourse = mockCourses.find(c => assignment.course === c.title.split(':')[0]);
    const matchedStudent = mockStudents.find(s => s.name === assignment.student);

    setEditingId(assignment.id);
    setTaskForm({
      title: assignment.assignment,
      courseId: matchedCourse ? matchedCourse.id : '',
      studentId: matchedStudent ? matchedStudent.id : '',
      dueDate: assignment.dueDate || '',
      description: assignment.description || '',
    });
    setViewMode('edit');
  };

  const handleDeleteAssignment = (id) => {
    if (window.confirm("Are you sure you want to completely remove this assignment entry?")) {
      setAssignments(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const matchedCourse = mockCourses.find(c => c.id === taskForm.courseId);
    const matchedStudent = mockStudents.find(s => s.id === taskForm.studentId);

    if (viewMode === 'edit') {
      setAssignments(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...item,
                student: matchedStudent ? matchedStudent.name : item.student,
                course: matchedCourse ? matchedCourse.title.split(':')[0] : item.course,
                assignment: taskForm.title,
                dueDate: taskForm.dueDate,
                description: taskForm.description,
              }
            : item
        )
      );
    } else {
      const createdRecord = {
        id: Date.now(),
        student: matchedStudent ? matchedStudent.name : 'Assigned Student',
        course: matchedCourse ? matchedCourse.title.split(':')[0] : 'General Course',
        assignment: taskForm.title,
        submitted: 'Not submitted yet',
        status: 'Pending',
        submissionText: 'Task assigned by instructor. Awaiting student submission file payload upload.',
        link: '#',
        dueDate: taskForm.dueDate,
        description: taskForm.description,
      };
      setAssignments([createdRecord, ...assignments]);
    }

    setViewMode('list');
    setTaskForm({ title: '', courseId: '', studentId: '', dueDate: '', description: '' });
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* ── MODE 1: LIST VIEW TERMINAL ── */}
{viewMode === 'list' && (
  <>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
          Assignment Evaluation Terminal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review student project pipelines, input numeric metric scores, and leave feedback.
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineRoundedIcon />}
        onClick={handleOpenCreateMode}
        sx={{ bgcolor: '#623E98', '&:hover': { bgcolor: '#320E5E' }, boxShadow: 'none', textTransform: 'none', fontWeight: 600 }}
      >
        Assign New Task
      </Button>
    </Box>

    <Card sx={{ width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
      <CardContent sx={{ p: '0px !important' }}>
        <TableContainer sx={{ width: '100%' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Task Target</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Submitted</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Grade Metric</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', pr: 3 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignments.map((row) => {
                // Splits strings like "Jun 19, 4:30 PM" into date ("Jun 19,") and full time ("4:30 PM")
                const commaIndex = row.submitted.indexOf(',');
                const datePart = commaIndex !== -1 ? row.submitted.substring(0, commaIndex + 1) : row.submitted;
                const timePart = commaIndex !== -1 ? row.submitted.substring(commaIndex + 1).trim() : '';

                return (
                  <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#16062B' }}>{row.student}</TableCell>
                    <TableCell sx={{ color: '#334155' }}>{row.course}</TableCell>
                    <TableCell sx={{ color: '#475569', fontWeight: 500 }}>{row.assignment}</TableCell>
                    
                    {/* Fixed Date & Complete Time Line Breakdown */}
                    <TableCell sx={{ color: '#64748b', verticalAlign: 'middle' }}>
                      <Typography variant="body2" component="div" sx={{ fontWeight: 500 }}>
                        {datePart}
                      </Typography>
                      {timePart && (
                        <Typography variant="body2" component="div" sx={{ whiteSpace: 'nowrap', color: '#94a3b8' }}>
                          {timePart}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          bgcolor: row.status === 'Graded' ? '#d1fae5' : '#fef3c7',
                          color: row.status === 'Graded' ? '#059669' : '#d97706',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#623E98' }}>
                      {row.grade ? row.grade : <Typography variant="caption" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>Unevaluated</Typography>}
                    </TableCell>
                    
                    {/* Corrected order: Actions (Edit/Delete) sit before button controllers */}
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                        
                        <Tooltip title="Edit Assignment Settings">
                          <IconButton size="small" onClick={() => handleOpenEditMode(row)} sx={{ color: '#64748b', '&:hover': { color: '#623E98', bgcolor: '#F3EBFB' } }}>
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Task Record">
                          <IconButton size="small" onClick={() => handleDeleteAssignment(row.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}>
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Button
                          variant={row.status === 'Graded' ? 'outlined' : 'contained'}
                          size="small"
                          onClick={() => handleOpenReview(row)}
                          sx={{
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontWeight: 600,
                            height: '32px',
                            width: '110px',
                            ml: 1,
                            bgcolor: row.status === 'Graded' ? 'transparent' : '#623E98',
                            borderColor: '#623E98',
                            color: row.status === 'Graded' ? '#623E98' : '#ffffff',
                            '&:hover': {
                              bgcolor: row.status === 'Graded' ? '#F3EBFB' : '#320E5E',
                              borderColor: '#320E5E',
                            },
                          }}
                        >
                          {row.status === 'Graded' ? 'Review Score' : 'Evaluate'}
                        </Button>

                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  </>
)}

{/* ── MODE 2: FORM FOR CREATE & ALLOCATE/EDIT TASK ── */}
{(viewMode === 'create' || viewMode === 'edit') && (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
    
    {/* Navigation Header Panel */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button 
        variant="outlined" 
        size="small" 
        onClick={() => setViewMode('list')} 
        sx={{ minWidth: 40, height: 40, p: 1, borderColor: '#e2e8f0', color: '#16062B', '&:hover': { bgcolor: '#f8fafc' } }}
      >
        <ArrowBackRoundedIcon fontSize="small" />
      </Button>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#16062B' }}>
          {viewMode === 'edit' ? 'Modify Assignment Settings' : 'Create & Allocate Assignment'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Design and configure workspace tasks for structured learner management.
        </Typography>
      </Box>
    </Box>

    {/* Form Card Layout — Expanded completely across row */}
    <Card sx={{ width: '100%', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderRadius: '12px' }}>
      <CardContent 
        component="form" 
        onSubmit={handleFormSubmit} 
        sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 3.5 }}
      >
        <Typography variant="h6" sx={{ color: '#16062B', fontWeight: 700 }}>
          Task Parameters
        </Typography>
        <Divider sx={{ mt: -1.5 }} />

        {/* Assignment Title */}
        <TextField 
          fullWidth 
          required 
          label="Assignment Title" 
          name="title" 
          value={taskForm.title || ''} 
          onChange={handleFormChange} 
          variant="outlined" 
        />

        {/* Course Track and Target Recipient balanced side by side */}
        <Grid container spacing={2}>
  <Grid item xs={12} md={5}>
    {/* Associated Course Track */}
    <FormControl fullWidth>
      <Select
        displayEmpty
        value={taskForm.courseId}
        name="courseId"
        onChange={handleFormChange}
        renderValue={(selected) =>
          selected
            ? mockCourses.find(c => c.id === selected)?.title
            : (
              <Typography sx={{ color: '#64748B' }}>
                Associated Course Track *
              </Typography>
            )
        }
      >
        {mockCourses.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} md={3}>
    {/* Target Student */}
    <FormControl fullWidth>
      <Select
        displayEmpty
        value={taskForm.studentId}
        name="studentId"
        onChange={handleFormChange}
        renderValue={(selected) =>
          selected
            ? mockStudents.find(s => s.id === selected)?.name
            : (
              <Typography sx={{ color: '#64748B' }}>
                Target Student *
              </Typography>
            )
        }
      >
        {mockStudents.map((s) => (
          <MenuItem key={s.id} value={s.id}>
            {s.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} md={4}>
    {/* Due Date */}
    <TextField
      fullWidth
      required
      //label="Submission Due Date"
      name="dueDate"
      type="date"
      value={taskForm.dueDate}
      onChange={handleFormChange}
      InputLabelProps={{ shrink: true }}
    />
  </Grid>
</Grid>
        
        {/* Syllabus Instructions */}
        <TextField 
          fullWidth 
          required 
          multiline 
          rows={6} 
          label="Syllabus Instructions & Rubric Matrix" 
          name="description" 
          value={taskForm.description || ''} 
          onChange={handleFormChange} 
          placeholder="Write precise task milestones, execution specifications..." 
          variant="outlined"
        />

        <Divider />
        
        {/* Action Button Set */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={() => setViewMode('list')} 
            sx={{ textTransform: 'none', fontWeight: 600, px: 3, height: '40px' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ bgcolor: '#623E98', '&:hover': { bgcolor: '#320E5E' }, px: 4, height: '40px', boxShadow: 'none', textTransform: 'none', fontWeight: 600 }}
          >
            {viewMode === 'edit' ? 'Save Adjustments' : 'Dispatch Assignment'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
)}

      {/* ── SEPARATE DIALOG LAYER: GRADING MODAL ── */}
      {selectedAssignment && (
        <Dialog open={openModal} onClose={handleCloseReview} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 800, color: '#16062B', pb: 1 }}>Evaluate Submission Profile</DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Student Candidate</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: '#16062B' }}>{selectedAssignment.student}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Task Target</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#623E98' }}>{selectedAssignment.assignment} ({selectedAssignment.course})</Typography>
              </Grid>
            </Grid>

            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>STUDENT SUBMISSION NOTE:</Typography>
              <Typography variant="body2" sx={{ color: '#334155', mb: 2, lineHeight: 1.5 }}>"{selectedAssignment.submissionText}"</Typography>
              {selectedAssignment.link !== '#' && (
                <>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Repository Links:</Typography>
                  <a href={selectedAssignment.link} target="_blank" rel="noreferrer" style={{ color: '#623E98', textDecoration: 'none', fontWeight: 600 }}>{selectedAssignment.link}</a>
                </>
              )}
            </Box>

            <Divider />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#16062B', mb: -1.5 }}>Grading Matrix Assessment</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField select fullWidth label="Assign Grade Letter" value={grade} onChange={(e) => setGrade(e.target.value)} size="small">
                  {['A+', 'A', 'B+', 'B', 'C', 'F'].map((g) => (<MenuItem key={g} value={g}>{g}</MenuItem>))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Constructive Feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
            <Button variant="outlined" color="inherit" onClick={handleCloseReview} sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" disabled={!grade} onClick={handleSubmitGrade} sx={{ bgcolor: '#623E98', '&:hover': { bgcolor: '#320E5E' }, px: 3, textTransform: 'none', fontWeight: 600 }}>Submit Score Profile</Button>
          </DialogActions>
        </Dialog>
      )}

    </Box>
  );
}