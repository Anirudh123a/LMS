import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  IconButton,
  InputBase,
} from '@mui/material';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

// Mock student roster database match
const studentRoster = [
  { id: 1, name: 'Arjun Patel', email: 'arjun.patel@student.edu', course: 'Web Dev Pro', progress: 78, completedModules: '7/9', joinDate: 'Jan 10, 2026', initial: 'AP' },
  { id: 2, name: 'Meera Shah', email: 'meera.shah@student.edu', course: 'React Advanced', progress: 92, completedModules: '11/12', joinDate: 'Feb 14, 2026', initial: 'MS' },
  { id: 3, name: 'Vikram Nair', email: 'vikram.nair@student.edu', course: 'Data Science', progress: 45, completedModules: '4/10', joinDate: 'Mar 02, 2026', initial: 'VN' },
  { id: 4, name: 'Rohan Sharma', email: 'rohan.sharma@student.edu', course: 'Web Dev Pro', progress: 100, completedModules: '9/9', joinDate: 'Jan 12, 2026', initial: 'RS' },
  { id: 5, name: 'Ananya Rao', email: 'ananya.rao@student.edu', course: 'UI/UX Design', progress: 60, completedModules: '5/8', joinDate: 'Apr 19, 2026', initial: 'AR' },
];

export default function StudentsView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Search filter implementation
  const filteredStudents = studentRoster.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3, boxSizing: 'border-box' }}>
      
      {/* Dynamic Header Block */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" color="text.primary" sx={{ fontWeight: 800 }}>
            Student Roster
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor learning speeds, track global progress bars, and interact with active learners.
          </Typography>
        </Box>

        {/* Local Table Search Field */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', px: 1.5, py: 0.6, width: { xs: '100%', sm: 260 }, '&:focus-within': { borderColor: '#623E98' }, transition: 'all 0.2s' }}>
          <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: '1.1rem', mr: 1 }} />
          <InputBase 
            placeholder="Search student or course..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flex: 1, fontSize: '0.875rem', color: 'text.primary' }} 
          />
        </Box>
      </Box>

      {/* Main Student Data Grid Workspace */}
      <Card sx={{ width: '100%', bgcolor: '#ffffff' }}>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                {['Student Profile', 'Enrolled Course', 'Track Progress', 'Modules Finished', 'Enrollment Date', 'Contact'].map((header, idx) => (
                  <TableCell key={header} align={idx === 5 ? 'right' : 'left'} sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} hover>
                  
                  {/* Identity Avatar Column */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: '#F3EBFB', color: '#623E98', fontSize: '0.85rem', fontWeight: 700 }}>
                        {student.initial}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: '#16062B', fontSize: '0.875rem', lineHeight: 1.2 }}>
                          {student.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {student.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Active Course Title */}
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {student.course}
                  </TableCell>

                  {/* Visual Progress Bars */}
                  <TableCell sx={{ width: 200 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={student.progress} 
                        sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#F3EBFB', '& .MuiLinearProgress-bar': { bgcolor: '#623E98' } }}
                      />
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#16062B', minWidth: 28 }}>
                        {student.progress}%
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Fractional Module Markers */}
                  <TableCell sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>
                    {student.completedModules}
                  </TableCell>

                  {/* Calendar Registration Timestamp */}
                  <TableCell sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                    {student.joinDate}
                  </TableCell>

                  {/* Interactive Messaging Portal Call */}
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      sx={{ 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px', 
                        color: '#623E98',
                        '&:hover': { bgcolor: '#F3EBFB', borderColor: '#623E98' } 
                      }}
                      href={`mailto:${student.email}`}
                    >
                      <MailOutlineRoundedIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}

              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#64748b' }}>
                    No students found matching your search term.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

    </Box>
  );
}