import React, { useState, useRef } from "react";
import StudentLayout from "../Components/StudentLayout";
import ProfileImage from "../assets/Profile.png";
import {
  Box, Typography, Avatar, Button, Divider,
  LinearProgress, Chip, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, InputAdornment, Paper, List,
  ListItem, ListItemText, ClickAwayListener,
} from "@mui/material";
import {
  Edit, CameraAlt, School, Email, Phone, LocationOn,
  LinkedIn, GitHub, Language, MenuBook, EmojiEvents,
  Star, CheckCircle, Code, BarChart, Brush, AccessTime,
  CalendarMonth, Close, Save, Search,
} from "@mui/icons-material";
 
// ─── Default Student data ─────────────────────────────────────────────────────
const DEFAULT_STUDENT = {
  name:     "George David",
  initial:  "G",
  role:     "Student",
  bio:      "Passionate full-stack developer in the making. Currently focused on mastering React and Data Science. Love building things that matter.",
  email:    "georgedavid@edu.com",
  phone:    "+91 98765 43210",
  location: "Chennai, Tamil Nadu",
  college:  "KGiSL Institute of Information Management",
  degree:   "B.Tech Computer Science",
  year:     "3rd Year — 2022–2026",
  joined:   "January 2025",
  linkedin: "linkedin.com/in/georgedavid",
  github:   "github.com/georgedavid",
  website:  "georgedavid.dev",
};
 
// ─── All available skills for search ─────────────────────────────────────────
const ALL_SKILLS = [
  "HTML & CSS", "JavaScript", "React", "Python", "SQL", "Figma",
  "TypeScript", "Node.js", "Express.js", "MongoDB", "PostgreSQL",
  "Vue.js", "Angular", "Next.js", "Tailwind CSS", "Bootstrap",
  "Java", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin",
  "Docker", "Kubernetes", "AWS", "Firebase", "GraphQL",
  "REST API", "Git", "GitHub", "Linux", "Machine Learning",
  "Data Science", "TensorFlow", "PyTorch", "Pandas", "NumPy",
  "Web Development", "Mobile Development", "UI/UX Design",
  "Photoshop", "Illustrator", "After Effects", "Blender",
  "Cyber Security", "Networking", "DevOps", "Agile", "Scrum",
  "Advanced React", "Redux", "Webpack", "Vite", "Jest",
];
 
// ─── Default selected skills ──────────────────────────────────────────────────
const DEFAULT_SELECTED_SKILLS = [
  "HTML & CSS", "JavaScript", "React", "Python", "SQL", "Figma",
];
 
// ─── Enrolled courses (static) ────────────────────────────────────────────────
const COURSES = [
  { name: "Web Dev Pro",           tag: "WEB DEVELOPMENT", tagColor: "#4f46e5", pct: 68, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&q=80", icon: <Code sx={{ fontSize: 13, color: "#4f46e5" }} />, rating: 4.8, hours: "24 hrs" },
  { name: "Data Science Bootcamp", tag: "DATA SCIENCE",    tagColor: "#0891b2", pct: 42, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&q=80", icon: <BarChart sx={{ fontSize: 13, color: "#0891b2" }} />, rating: 4.6, hours: "32 hrs" },
  { name: "UI/UX Fundamentals",    tag: "DESIGN",          tagColor: "#7c3aed", pct: 89, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&q=80", icon: <Brush sx={{ fontSize: 13, color: "#7c3aed" }} />,   rating: 4.9, hours: "18 hrs" },
];
 
// ─── Certificates (static) ────────────────────────────────────────────────────
const CERTS = [
  { title: "HTML & CSS Mastery",    date: "Apr 12, 2026", image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=200&q=80" },
  { title: "JavaScript Essentials", date: "Mar 5, 2026",  image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=200&q=80" },
];
 
// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Enrolled",     value: "4",   icon: <MenuBook sx={{ fontSize: 18, color: "#6366f1" }} />,    bg: "#ede9fe" },
  { label: "Completed",    value: "1",   icon: <CheckCircle sx={{ fontSize: 18, color: "#22c55e" }} />, bg: "#dcfce7" },
  { label: "Certificates", value: "2",   icon: <EmojiEvents sx={{ fontSize: 18, color: "#f59e0b" }} />, bg: "#fef9c3" },
  { label: "Avg Score",    value: "85%", icon: <Star sx={{ fontSize: 18, color: "#f97316" }} />,        bg: "#ffedd5" },
];
 
// ─── Add Skills Section Component ─────────────────────────────────────────────
function AddSkillsSection({ selectedSkills, onSkillsChange }) {
  const [customSkill,  setCustomSkill]  = useState("");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
 
  const filteredSkills = ALL_SKILLS.filter(
    (s) =>
      !selectedSkills.includes(s) &&
      s.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const handleAddFromDropdown = (skill) => {
    if (!selectedSkills.includes(skill)) {
      onSkillsChange([...selectedSkills, skill]);
    }
    setSearchQuery("");
    setDropdownOpen(false);
  };
 
  const handleAddCustom = () => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      onSkillsChange([...selectedSkills, trimmed]);
      setCustomSkill("");
    }
  };
 
  const handleRemoveSkill = (skill) => {
    onSkillsChange(selectedSkills.filter((s) => s !== skill));
  };
 
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
 
      {/* Skills display card */}
      <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a", mb: 2 }}>Skills</Typography>
        {selectedSkills.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>
            No skills added yet. Use the section below to add skills.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                onDelete={() => handleRemoveSkill(skill)}
                size="small"
                sx={{
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  fontWeight: 600,
                  fontSize: 12,
                  height: 28,
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  "& .MuiChip-deleteIcon": {
                    fontSize: 15,
                    color: "#94a3b8",
                    "&:hover": { color: "#ef4444" },
                  },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
 
      {/* Add Skills card */}
      <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a", mb: 2.5 }}>Add Skills</Typography>
 
        {/* Custom skill */}
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#334155", mb: 1 }}>
          Custom Skill{" "}
          <Typography component="span" sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>(Optional)</Typography>
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, mb: 2.5 }}>
          <TextField
            placeholder="Enter a custom skill (e.g., Advanced React)"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
            fullWidth
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px", fontSize: 13, bgcolor: "#f8fafc",
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused fieldset": { borderColor: "#6366f1" },
              },
            }}
          />
          <Button
            onClick={handleAddCustom}
            disabled={!customSkill.trim()}
            variant="contained"
            sx={{
              textTransform: "none", fontWeight: 600, fontSize: 13,
              bgcolor: "#4f46e5", borderRadius: "10px", px: 2, flexShrink: 0,
              boxShadow: "none",
              "&:hover": { bgcolor: "#4338ca", boxShadow: "none" },
              "&.Mui-disabled": { bgcolor: "#e2e8f0", color: "#94a3b8" },
            }}
          >
            Add
          </Button>
        </Box>
 
        {/* Searchable dropdown */}
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#334155", mb: 1 }}>
          Select your Skills{" "}
          <Typography component="span" sx={{ color: "#ef4444", fontSize: 13 }}>*</Typography>
        </Typography>
 
        <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
          <Box sx={{ position: "relative" }}>
            <TextField
              placeholder="Select your skills..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setDropdownOpen(true); }}
              onFocus={() => setDropdownOpen(true)}
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px", fontSize: 13, bgcolor: "#f8fafc",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#94a3b8" },
                  "&.Mui-focused fieldset": { borderColor: "#6366f1" },
                },
              }}
            />
 
            {dropdownOpen && filteredSkills.length > 0 && (
              <Paper elevation={4} sx={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 1300, borderRadius: "10px", maxHeight: 220, overflowY: "auto", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                <List dense disablePadding>
                  {filteredSkills.map((skill, idx) => (
                    <ListItem
                      key={skill}
                      button
                      onClick={() => handleAddFromDropdown(skill)}
                      sx={{ py: 1, px: 2, borderBottom: idx < filteredSkills.length - 1 ? "1px solid #f1f5f9" : "none", "&:hover": { bgcolor: "#f0f4ff" }, cursor: "pointer" }}
                    >
                      <ListItemText primary={skill} primaryTypographyProps={{ fontSize: 13, fontWeight: 500, color: "#334155" }} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
 
            {dropdownOpen && searchQuery && filteredSkills.length === 0 && (
              <Paper elevation={4} sx={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 1300, borderRadius: "10px", border: "1px solid #e2e8f0", p: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                <Typography sx={{ fontSize: 13, color: "#94a3b8", textAlign: "center" }}>
                  No matching skills. Use "Custom Skill" above to add it.
                </Typography>
              </Paper>
            )}
          </Box>
        </ClickAwayListener>
      </Box>
    </Box>
  );
}
 
// ─── Edit Dialog (NO Skills section) ─────────────────────────────────────────
function EditProfileDialog({ open, onClose, student, onSave }) {
  const [form, setForm] = useState({ ...student });
 
  React.useEffect(() => {
    if (open) setForm({ ...student });
  }, [open]);
 
  const handleField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
 
  const handleSave = () => {
    const updated = { ...form, initial: form.name?.trim()[0]?.toUpperCase() || student.initial };
    onSave(updated);
    onClose();
  };
 
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px", fontSize: 13, bgcolor: "#f8fafc",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
    },
    "& .MuiInputLabel-root": { fontSize: 13, color: "#94a3b8" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  };
 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
      <DialogTitle sx={{ bgcolor: "#0f172a", px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: "#6366f1", borderRadius: "8px", p: 0.7, display: "flex" }}>
            <Edit sx={{ fontSize: 16, color: "#fff" }} />
          </Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Edit Profile</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#fff", bgcolor: "#1e293b" } }}>
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>
 
      <DialogContent sx={{ px: 3, py: 3, bgcolor: "#f8fafc" }}>
        {/* Personal Info */}
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#6366f1", letterSpacing: 0.8, mb: 1.5, textTransform: "uppercase" }}>Personal Info</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <TextField label="Full Name" value={form.name}     onChange={handleField("name")}     fullWidth sx={fieldSx} />
          <TextField label="Email"     value={form.email}    onChange={handleField("email")}    fullWidth sx={fieldSx} />
          <TextField label="Phone"     value={form.phone}    onChange={handleField("phone")}    fullWidth sx={fieldSx} />
          <TextField label="Location"  value={form.location} onChange={handleField("location")} fullWidth sx={fieldSx} />
          <TextField label="Bio" value={form.bio} onChange={handleField("bio")} fullWidth multiline minRows={2} sx={{ ...fieldSx, gridColumn: "1 / -1" }} />
        </Box>
 
        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />
 
        {/* Academic Details */}
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#6366f1", letterSpacing: 0.8, mb: 1.5, textTransform: "uppercase" }}>Academic Details</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}>
          <TextField label="College" value={form.college} onChange={handleField("college")} fullWidth sx={{ ...fieldSx, gridColumn: "1 / -1" }} />
          <TextField label="Degree"  value={form.degree}  onChange={handleField("degree")}  fullWidth sx={fieldSx} />
          <TextField label="Year"    value={form.year}    onChange={handleField("year")}    fullWidth sx={fieldSx} />
        </Box>
 
        <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />
 
        {/* Social Links */}
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#6366f1", letterSpacing: 0.8, mb: 1.5, textTransform: "uppercase" }}>Social Links</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
          <TextField label="LinkedIn" value={form.linkedin} onChange={handleField("linkedin")} fullWidth sx={fieldSx} InputProps={{ startAdornment: <LinkedIn sx={{ fontSize: 16, color: "#0a66c2", mr: 0.8 }} /> }} />
          <TextField label="GitHub"   value={form.github}   onChange={handleField("github")}   fullWidth sx={fieldSx} InputProps={{ startAdornment: <GitHub   sx={{ fontSize: 16, color: "#0f172a", mr: 0.8 }} /> }} />
          <TextField label="Website"  value={form.website}  onChange={handleField("website")}  fullWidth sx={fieldSx} InputProps={{ startAdornment: <Language sx={{ fontSize: 16, color: "#6366f1", mr: 0.8 }} /> }} />
        </Box>
      </DialogContent>
 
      <DialogActions sx={{ px: 3, py: 2, bgcolor: "#fff", borderTop: "1px solid #e2e8f0", gap: 1 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b", fontWeight: 600, fontSize: 13, borderRadius: "10px", px: 2.5, "&:hover": { bgcolor: "#f1f5f9" } }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" startIcon={<Save sx={{ fontSize: 16 }} />}
          sx={{ textTransform: "none", fontWeight: 700, fontSize: 13, bgcolor: "#4f46e5", borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#4338ca" }, boxShadow: "none" }}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
 
// ─── Main Profile Component ───────────────────────────────────────────────────
export default function Profile() {
  const [avatarSrc,      setAvatarSrc]      = useState(null);
  const [student,        setStudent]        = useState({ ...DEFAULT_STUDENT });
  const [selectedSkills, setSelectedSkills] = useState([...DEFAULT_SELECTED_SKILLS]);
  const [editOpen,       setEditOpen]       = useState(false);
  const fileInputRef = useRef(null);
 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
 
  return (
    <StudentLayout>
      <Box sx={{ flex: 1, overflowY: "auto", p: 3, bgcolor: "#f8fafc" }}>
 
        {/* ── TOP: Cover + Avatar + basic info ── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", mb: 3 }}>
          <Box sx={{ height: 140, background: "linear-gradient(135deg, #1e2d5a 0%, #312e81 50%, #4f46e5 100%)", position: "relative" }}>
            <Box sx={{ position: "absolute", top: -30, right: -20, width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.05)" }} />
            <Box sx={{ position: "absolute", bottom: -50, right: 120, width: 130, height: 130, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.04)" }} />
          </Box>
 
          <Box sx={{ px: 3.5, pb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mt: "-44px", mb: 2 }}>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                {avatarSrc ? (
                  <Box component="img" src={avatarSrc} sx={{ width: 88, height: 88, borderRadius: "50%", border: "4px solid #fff", objectFit: "cover", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }} />
                ) : (
                  <Avatar   src={ProfileImage}
                    alt="Profile" sx={{ width: 88, height: 88, bgcolor: "#1e2972", fontSize: 32, fontWeight: 800, border: "4px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.14)" }}>
                    {student.initial}
                  </Avatar>
                )}
                <Tooltip title="Change photo" arrow>
                  <IconButton onClick={() => fileInputRef.current.click()} size="small"
                    sx={{ position: "absolute", bottom: 2, right: 2, width: 26, height: 26, bgcolor: "#2563eb", border: "2px solid #fff", "&:hover": { bgcolor: "#1d4ed8" }, boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                    <CameraAlt sx={{ fontSize: 13, color: "#fff" }} />
                  </IconButton>
                </Tooltip>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
              </Box>
 
              <Button startIcon={<Edit sx={{ fontSize: 15 }} />} variant="outlined" onClick={() => setEditOpen(true)}
                sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, borderColor: "#e2e8f0", color: "#475569", borderRadius: "10px", px: 2, py: 0.8, mt: 3, "&:hover": { bgcolor: "#f8fafc", borderColor: "#94a3b8" } }}>
                Edit Profile
              </Button>
            </Box>
 
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}>{student.name}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.6, mb: 1.5, flexWrap: "wrap" }}>
              <Chip label={student.role}   size="small" sx={{ bgcolor: "#fecdd3", color: "#be123c", fontWeight: 700, fontSize: 11, height: 22 }} />
              <Chip label={student.degree} size="small" sx={{ bgcolor: "#ede9fe", color: "#6d28d9", fontWeight: 600, fontSize: 11, height: 22 }} />
              <Chip label={student.year}   size="small" sx={{ bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 600, fontSize: 11, height: 22 }} />
            </Box>
            <Typography sx={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, maxWidth: 680, mb: 2 }}>{student.bio}</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5 }}>
              {[
                { icon: <Email sx={{ fontSize: 15, color: "#6366f1" }} />,        text: student.email },
                { icon: <Phone sx={{ fontSize: 15, color: "#22c55e" }} />,        text: student.phone },
                { icon: <LocationOn sx={{ fontSize: 15, color: "#f97316" }} />,   text: student.location },
                { icon: <CalendarMonth sx={{ fontSize: 15, color: "#0891b2" }} />, text: `Joined ${student.joined}` },
              ].map((item) => (
                <Box key={item.text} sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                  {item.icon}
                  <Typography sx={{ fontSize: 12.5, color: "#475569" }}>{item.text}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
 
        {/* ── STATS ROW ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3 }}>
          {STATS.map((s) => (
            <Box key={s.label} sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2, display: "flex", alignItems: "center", gap: 2, transition: "all 0.2s", cursor: "default", "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.07)", transform: "translateY(-2px)" } }}>
              <Box sx={{ width: 42, height: 42, borderRadius: "10px", bgcolor: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</Box>
              <Box>
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{s.label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
 
        {/* ── MAIN GRID ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 3 }}>
 
          {/* ── Left ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
 
            {/* Academic Details */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a", mb: 2 }}>Academic Details</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                {[
                  { icon: <School sx={{ fontSize: 18, color: "#6366f1" }} />,        label: "College", value: student.college },
                  { icon: <MenuBook sx={{ fontSize: 18, color: "#0891b2" }} />,       label: "Degree",  value: student.degree },
                  { icon: <CalendarMonth sx={{ fontSize: 18, color: "#f97316" }} />,  label: "Year",    value: student.year },
                  { icon: <Email sx={{ fontSize: 18, color: "#22c55e" }} />,          label: "Email",   value: student.email },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", p: 1.5, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                    <Box sx={{ mt: 0.2, flexShrink: 0 }}>{item.icon}</Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.5, mb: 0.3 }}>{item.label.toUpperCase()}</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{item.value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
 
            {/* Enrolled Courses */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Enrolled Courses</Typography>
                <Typography sx={{ fontSize: 13, color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>View All</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {COURSES.map((c) => (
                  <Box key={c.name} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, border: "1px solid #f1f5f9", borderRadius: "10px", transition: "all 0.18s", cursor: "pointer", "&:hover": { bgcolor: "#f8fafc", borderColor: "#e2e8f0", transform: "translateX(3px)" } }}>
                    <Box sx={{ width: 56, height: 42, borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #e2e8f0" }}>
                      <Box component="img" src={c.image} alt={c.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.3 }}>
                        {c.icon}
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: c.tagColor, letterSpacing: 0.5 }}>{c.tag}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mb: 0.5 }}>{c.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress variant="determinate" value={c.pct} sx={{ flex: 1, height: 4, borderRadius: 2, bgcolor: "#eff6ff", "& .MuiLinearProgress-bar": { bgcolor: "#2563eb", borderRadius: 2 } }} />
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#475569", flexShrink: 0 }}>{c.pct}%</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                        <Star sx={{ fontSize: 12, color: "#f59e0b" }} />
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>{c.rating}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
                        <AccessTime sx={{ fontSize: 12, color: "#94a3b8" }} />
                        <Typography sx={{ fontSize: 11, color: "#64748b" }}>{c.hours}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
 
            {/* Skills + Add Skills */}
            <AddSkillsSection selectedSkills={selectedSkills} onSkillsChange={setSelectedSkills} />
          </Box>
 
          {/* ── Right ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
 
            {/* Social Links */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a", mb: 2 }}>Social Links</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {[
                  { icon: <LinkedIn sx={{ fontSize: 18, color: "#0a66c2" }} />, label: "LinkedIn", value: student.linkedin, bg: "#dbeafe" },
                  { icon: <GitHub   sx={{ fontSize: 18, color: "#0f172a" }} />, label: "GitHub",   value: student.github,   bg: "#f1f5f9" },
                  { icon: <Language sx={{ fontSize: 18, color: "#6366f1" }} />, label: "Website",  value: student.website,  bg: "#ede9fe" },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.2, border: "1px solid #f1f5f9", borderRadius: "10px", cursor: "pointer", transition: "all 0.15s", "&:hover": { bgcolor: "#f8fafc", borderColor: "#e2e8f0" } }}>
                    <Box sx={{ width: 34, height: 34, borderRadius: "8px", bgcolor: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.icon}</Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.4 }}>{item.label.toUpperCase()}</Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#334155", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
 
            {/* Certificates */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Certificates</Typography>
                <Typography sx={{ fontSize: 13, color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>View All</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {CERTS.map((c, i) => (
                  <Box key={c.title}>
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", cursor: "pointer", p: 1, borderRadius: "8px", transition: "all 0.15s", "&:hover": { bgcolor: "#f8fafc" } }}>
                      <Box sx={{ width: 56, height: 42, borderRadius: "8px", overflow: "hidden", flexShrink: 0, border: "1px solid #e2e8f0", position: "relative" }}>
                        <Box component="img" src={c.image} alt={c.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{c.title}</Typography>
                        <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.3 }}>{c.date}</Typography>
                      </Box>
                      <Box sx={{ bgcolor: "#dcfce7", borderRadius: "6px", px: 0.8, py: 0.3 }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#15803d" }}>Verified</Typography>
                      </Box>
                    </Box>
                    {i < CERTS.length - 1 && <Divider sx={{ borderColor: "#f8fafc", mt: 1 }} />}
                  </Box>
                ))}
              </Box>
            </Box>
 
            {/* Personal Info */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a", mb: 2 }}>Personal Info</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {[
                  { label: "Full Name", value: student.name },
                  { label: "Phone",     value: student.phone },
                  { label: "Location",  value: student.location },
                  { label: "College",   value: student.college },
                  { label: "Joined",    value: student.joined },
                ].map((item) => (
                  <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", py: 0.6 }}>
                    <Typography sx={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, flexShrink: 0, mr: 1 }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: "#334155", fontWeight: 600, textAlign: "right" }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
 
          </Box>
        </Box>
      </Box>
 
      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        student={student}
        onSave={setStudent}
      />
    </StudentLayout>
  );
}