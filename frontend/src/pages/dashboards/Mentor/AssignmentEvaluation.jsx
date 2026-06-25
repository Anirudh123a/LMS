import { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Chip, IconButton, Link, Tooltip } from '@mui/material';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

const mockSubmissions = [
  { id: 'SUB001', studentName: 'Alex Mercer', submittedDate: '2026-06-20', fileUrl: '#', status: 'Pending', marks: '', maxMarks: 100 },
  { id: 'SUB002', studentName: 'Sarah Connor', submittedDate: '2026-06-19', fileUrl: '#', status: 'Graded', marks: '85', maxMarks: 100 },
  { id: 'SUB003', studentName: 'David Lightman', submittedDate: '2026-06-21', fileUrl: '#', status: 'Pending', marks: '', maxMarks: 100 },
];

export default function AssignmentEvaluation({ assignmentName = "Advanced React Architecture - Project 1" }) {
  const [submissions, setSubmissions] = useState(mockSubmissions);

  // Handle live score entry adjustments
  const handleGradeChange = (id, value) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, marks: value } : sub)
    );
  };

  // Submit and lock grade
  const handleSubmitGrade = (id) => {
    setSubmissions(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          if (!sub.marks || isNaN(sub.marks)) return sub; 
          return { ...sub, status: 'Graded' };
        }
        return sub;
      })
    );
  };

  // Enable re-editing of an already submitted or graded score
  const handleEditGrade = (id) => {
    setSubmissions(prev =>
      prev.map(sub => sub.id === id ? { ...sub, status: 'Pending' } : sub)
    );
  };

  // Delete evaluation pipeline entry cleanly
  const handleDeleteSubmission = (id) => {
    if (window.confirm("Delete this submission metric data row permanentely?")) {
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: '#f8fafc', minHeight: '100%' }}>
      {/* Header Info */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#16062B', mb: 0.5 }}>
            Assignment Evaluation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reviewing submissions for: <strong>{assignmentName}</strong>
          </Typography>
        </Box>
        <Chip 
          label={`${submissions.filter(s => s.status === 'Pending').length} Pending Review`} 
          variant="soft" 
          sx={{ fontWeight: 600, bgcolor: 'rgba(237, 108, 2, 0.1)', color: '#ed6c02' }}
        />
      </Box>

      {/* Evaluation Table Panel Layout */}
      <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <Table aria-label="submissions evaluation table">
          <TableHead sx={{ bgcolor: '#f1f5f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Submission Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Attachment</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#475569', width: '200px' }}>Grade Marks</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', pr: 3 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td': { border: 0 }, '&:hover': { bgcolor: '#f8fafc' } }}>
                
                <TableCell sx={{ fontWeight: 600, color: '#16062B' }}>{row.studentName}</TableCell>
                <TableCell sx={{ color: '#475569' }}>{row.submittedDate}</TableCell>
                
                <TableCell>
                  <Link href={row.fileUrl} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: '#623E98', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                    View Work <OpenInNewRoundedIcon sx={{ fontSize: '0.9rem' }} />
                  </Link>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={row.status} 
                    size="small"
                    sx={{ 
                      fontWeight: 700, 
                      bgcolor: row.status === 'Graded' ? '#d1fae5' : '#e0f2fe', 
                      color: row.status === 'Graded' ? '#059669' : '#0369a1' 
                    }} 
                  />
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      value={row.marks}
                      onChange={(e) => handleGradeChange(row.id, e.target.value)}
                      disabled={row.status === 'Graded'}
                      size="small"
                      placeholder="0"
                      inputProps={{ min: 0, max: row.maxMarks, style: { textAlign: 'center', fontWeight: 600 } }}
                      sx={{ 
                        width: '70px',
                        '& .MuiOutlinedInput-root': {
                          height: '36px',
                          '&:focus-within fieldset': { borderColor: '#623E98' }
                        }
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                      / {row.maxMarks}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="right" sx={{ pr: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                    {row.status === 'Graded' ? (
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={() => handleEditGrade(row.id)}
                        sx={{ 
                          textTransform: 'none', 
                          fontWeight: 600, 
                          height: '32px',
                          color: '#623E98',
                          borderColor: '#623E98',
                          '&:hover': {
                            bgcolor: '#F3EBFB',
                            borderColor: '#320E5E'
                          }
                        }}
                      >
                        Review Score
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        size="small"
                        onClick={() => handleSubmitGrade(row.id)}
                        disabled={!row.marks}
                        sx={{ 
                          bgcolor: '#623E98', 
                          textTransform: 'none', 
                          fontWeight: 600, 
                          height: '32px',
                          boxShadow: 'none',
                          '&:hover': { bgcolor: '#320E5E' } 
                        }}
                      >
                        Evaluate
                      </Button>
                    )}

                    <Tooltip title="Edit Metadata">
                      <IconButton size="small" onClick={() => handleEditGrade(row.id)} sx={{ color: '#64748b', '&:hover': { color: '#623E98', bgcolor: '#F3EBFB' } }}>
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete Entry Row">
                      <IconButton size="small" onClick={() => handleDeleteSubmission(row.id)} sx={{ color: '#94a3b8', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}>
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}