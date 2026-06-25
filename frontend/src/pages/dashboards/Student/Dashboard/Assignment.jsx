import React, { useState } from "react";
import StudentLayout from "../Components/StudentLayout";
import {
  Box, Typography, LinearProgress, Button, Chip, Divider,
  Avatar, IconButton, Tab, Tabs, Dialog, DialogContent,
} from "@mui/material";
import {
  Assignment as AssignmentIcon, CheckCircle, Schedule,
  Star, Close, PlayArrow, CalendarToday, Person,
  MenuBook, Warning, ArrowForward, EmojiEvents, Code,
  Quiz as QuizIcon, OpenInNew, Terminal,
} from "@mui/icons-material";
 
// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_ASSIGNMENTS = [
  {
    id: 1, type: "Project", tag: "WEB DEVELOPMENT",
    title: "Build a Responsive Portfolio Website",
    subject: "Web Dev Pro", subjectColor: "#4f46e5",
    subjectImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    mentor: "Alex Johnson", mentorAvatar: "AJ", mentorColor: "#4f46e5",
    dueDate: "Jun 25, 2026", status: "pending", priority: "High", priorityColor: "#ef4444",
    totalMarks: 100,
    description: "Create a fully responsive portfolio website using HTML, CSS, and JavaScript. Include at least 4 sections: Hero, About, Projects, and Contact. Make sure it works on mobile, tablet, and desktop.",
    tasks: [
      { id: 1, text: "Design the wireframe layout", done: true },
      { id: 2, text: "Build the HTML structure", done: true },
      { id: 3, text: "Style with CSS and make responsive", done: false },
      { id: 4, text: "Add JavaScript interactivity", done: false },
      { id: 5, text: "Deploy to GitHub Pages", done: false },
    ],
  },
  {
    id: 2, type: "Project", tag: "DATA SCIENCE",
    title: "Machine Learning Model – Titanic Dataset",
    subject: "Data Science Bootcamp", subjectColor: "#0891b2",
    subjectImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&q=80",
    mentor: "Sarah Kim", mentorAvatar: "SK", mentorColor: "#0891b2",
    dueDate: "May 20, 2026", status: "completed", priority: "Low", priorityColor: "#22c55e",
    totalMarks: 80, score: 68,
    feedback: "Great work on feature engineering! Next time try tuning hyperparameters.",
    description: "Build a classification model on the Titanic dataset using Pandas and Scikit-learn. Submit Jupyter notebook.",
    tasks: [
      { id: 1, text: "Preprocess and clean dataset", done: true },
      { id: 2, text: "Feature engineering", done: true },
      { id: 3, text: "Train classification model", done: true },
      { id: 4, text: "Evaluate with accuracy and F1", done: true },
      { id: 5, text: "Submit notebook", done: true },
    ],
  },
  {
    id: 3, type: "Project", tag: "DESIGN",
    title: "UI/UX Case Study – Mobile App Redesign",
    subject: "UI/UX Fundamentals", subjectColor: "#7c3aed",
    subjectImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    mentor: "Maria Garcia", mentorAvatar: "MG", mentorColor: "#7c3aed",
    dueDate: "Jun 30, 2026", status: "pending", priority: "Medium", priorityColor: "#f97316",
    totalMarks: 100,
    description: "Choose a mobile app and create a redesign proposal in Figma with user research and prototypes.",
    tasks: [
      { id: 1, text: "Select app and conduct user research", done: false },
      { id: 2, text: "Create low-fi wireframes", done: false },
      { id: 3, text: "Build hi-fi prototype in Figma", done: false },
      { id: 4, text: "Write design rationale", done: false },
      { id: 5, text: "Record a 3-min walkthrough video", done: false },
    ],
  },
  {
    id: 4, type: "MCQ Assessment", tag: "WEB DEVELOPMENT",
    title: "JavaScript ES6+ Quiz & Coding Challenge",
    subject: "Web Dev Pro", subjectColor: "#4f46e5",
    subjectImage: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=600&q=80",
    mentor: "Alex Johnson", mentorAvatar: "AJ", mentorColor: "#4f46e5",
    dueDate: "Jun 22, 2026", status: "overdue", priority: "High", priorityColor: "#ef4444",
    totalMarks: 50, questions: 20, duration: "30 mins",
    description: "Complete the 20-question ES6+ quiz covering arrow functions, destructuring, spread/rest operators, and async/await.",
    tasks: [],
  },
  {
    id: 5, type: "MCQ Assessment", tag: "DATA SCIENCE",
    title: "Pandas & NumPy Fundamentals Test",
    subject: "Data Science Bootcamp", subjectColor: "#0891b2",
    subjectImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    mentor: "Sarah Kim", mentorAvatar: "SK", mentorColor: "#0891b2",
    dueDate: "Jun 28, 2026", status: "in-progress", priority: "Medium", priorityColor: "#f97316",
    totalMarks: 40, questions: 15, duration: "25 mins",
    description: "Test your knowledge of Pandas DataFrames, Series, merging, groupby, and NumPy array operations.",
    tasks: [],
  },
  {
    id: 6, type: "MCQ Assessment", tag: "DESIGN",
    title: "UI/UX Principles & Heuristics Quiz",
    subject: "UI/UX Fundamentals", subjectColor: "#7c3aed",
    subjectImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    mentor: "Maria Garcia", mentorAvatar: "MG", mentorColor: "#7c3aed",
    dueDate: "Jun 18, 2026", status: "completed", priority: "Low", priorityColor: "#22c55e",
    totalMarks: 30, score: 27, questions: 12, duration: "20 mins",
    feedback: "Excellent understanding of Nielsen's heuristics! Minor mistakes in accessibility.",
    description: "Answer 12 multiple choice questions covering Nielsen's 10 usability heuristics and accessibility principles.",
    tasks: [],
  },
  {
    id: 7, type: "Coding", tag: "WEB DEVELOPMENT",
    title: "Build a REST API with Node.js & Express",
    subject: "Web Dev Pro", subjectColor: "#4f46e5",
    subjectImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&q=80",
    mentor: "Alex Johnson", mentorAvatar: "AJ", mentorColor: "#4f46e5",
    dueDate: "Jul 05, 2026", status: "pending", priority: "High", priorityColor: "#ef4444",
    totalMarks: 120,
    description: "Build a fully functional REST API using Node.js and Express with CRUD operations, JWT authentication, and MongoDB integration. Deploy to Railway or Render.",
    tasks: [],
  },
  {
    id: 8, type: "Coding", tag: "DATA SCIENCE",
    title: "End-to-End Data Pipeline with Pandas & SQL",
    subject: "Data Science Bootcamp", subjectColor: "#0891b2",
    subjectImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    mentor: "Sarah Kim", mentorAvatar: "SK", mentorColor: "#0891b2",
    dueDate: "Jun 28, 2026", status: "in-progress", priority: "Medium", priorityColor: "#f97316",
    totalMarks: 100,
    description: "Design and implement a data pipeline that ingests raw CSV files, cleans them with Pandas, stores in SQLite, and visualizes results with Matplotlib.",
    tasks: [],
  },
];
 
// ── Config ────────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:       { label: "Pending",     bg: "#fef9c3", color: "#854d0e",  icon: <Schedule sx={{ fontSize: 11 }} /> },
  "in-progress": { label: "In Progress", bg: "#dbeafe", color: "#1e40af",  icon: <PlayArrow sx={{ fontSize: 11 }} /> },
  completed:     { label: "Completed",   bg: "#dcfce7", color: "#15803d",  icon: <CheckCircle sx={{ fontSize: 11 }} /> },
  overdue:       { label: "Overdue",     bg: "#fee2e2", color: "#b91c1c",  icon: <Warning sx={{ fontSize: 11 }} /> },
};
 
const TYPE_CONFIG = {
  "Project":        { icon: <AssignmentIcon sx={{ fontSize: 13 }} />, color: "#4f46e5", bg: "#e0e7ff" },
  "MCQ Assessment": { icon: <QuizIcon sx={{ fontSize: 13 }} />,       color: "#0891b2", bg: "#e0f2fe" },
  "Coding":         { icon: <Code sx={{ fontSize: 13 }} />,           color: "#7c3aed", bg: "#f3e8ff" },
};
 
// ── Status filter pills ───────────────────────────────────────────────────────
const STATUS_PILLS = [
  { label: "All",         value: "all" },
  { label: "Pending",     value: "pending" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed",   value: "completed" },
  { label: "Overdue",     value: "overdue" },
];
 
// ── Type tabs ─────────────────────────────────────────────────────────────────
const TYPE_TABS = ["All", "Projects", "MCQ Assessments", "Coding"];
 
// ── Compiler Modal ────────────────────────────────────────────────────────────
function CompilerModal({ assignment: a, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden", height: "90vh" } }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#0f172a", px: 3, py: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Terminal sx={{ fontSize: 17, color: "#fff" }} />
          </Box>
          <Box>
            <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{a.title}</Typography>
            <Typography sx={{ color: "#94a3b8", fontSize: 11.5 }}>{a.subject} · {a.mentor}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip label={`${a.totalMarks} pts`} size="small" sx={{ bgcolor: "#1e293b", color: "#94a3b8", fontSize: 11, fontWeight: 600 }} />
          <Chip label={`Due: ${a.dueDate}`} size="small" sx={{ bgcolor: "#1e293b", color: "#f97316", fontSize: 11, fontWeight: 600 }} />
          <IconButton onClick={onClose} size="small" sx={{ color: "#94a3b8", "&:hover": { color: "#fff", bgcolor: "#1e293b" } }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>
 
      <Box sx={{ display: "flex", flex: 1, height: "calc(100% - 64px)", overflow: "hidden" }}>
        {/* Left: Problem description */}
        <Box sx={{ width: 340, flexShrink: 0, borderRight: "1px solid #e2e8f0", overflow: "auto", p: 2.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mb: 1 }}>Problem Description</Typography>
          <Typography sx={{ fontSize: 12.5, color: "#475569", lineHeight: 1.75, mb: 2 }}>{a.description}</Typography>
 
          <Divider sx={{ mb: 2 }} />
 
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0f172a", mb: 1.2 }}>Expected Output</Typography>
          <Box sx={{ bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", p: 1.5, mb: 2 }}>
            <Typography sx={{ fontSize: 11.5, color: "#475569", fontFamily: "monospace", lineHeight: 1.6 }}>
              {"// Your solution should pass all test cases\n// Input → Expected Output\n// Test 1: Basic CRUD operations\n// Test 2: Auth middleware\n// Test 3: Error handling"}
            </Typography>
          </Box>
 
          <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0f172a", mb: 1.2 }}>Constraints</Typography>
          {["Use only Node.js built-ins + Express", "No external DB clients (use sqlite3)", "JWT must expire in 24h", "All routes must return JSON"].map((c, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.8 }}>
              <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "#6366f1", mt: 0.7, flexShrink: 0 }} />
              <Typography sx={{ fontSize: 12, color: "#475569" }}>{c}</Typography>
            </Box>
          ))}
        </Box>
 
        {/* Right: Code editor area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#1e1e2e", overflow: "hidden" }}>
          {/* Editor toolbar */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.2, bgcolor: "#16213e", borderBottom: "1px solid #2d2d44" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {["JavaScript", "Python", "TypeScript"].map((lang, i) => (
                <Box key={lang} sx={{ px: 1.5, py: 0.4, borderRadius: "6px", bgcolor: i === 0 ? "#4f46e5" : "transparent", cursor: "pointer" }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? "#fff" : "#64748b" }}>{lang}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button size="small" variant="outlined" sx={{ textTransform: "none", fontSize: 11.5, borderColor: "#2d2d44", color: "#94a3b8", borderRadius: "7px", py: 0.4, "&:hover": { borderColor: "#4f46e5", color: "#818cf8" } }}>
                Reset
              </Button>
              <Button size="small" variant="contained" startIcon={<PlayArrow sx={{ fontSize: 13 }} />}
                sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 700, bgcolor: "#22c55e", borderRadius: "7px", py: 0.4, "&:hover": { bgcolor: "#16a34a" }, boxShadow: "none" }}>
                Run Code
              </Button>
              <Button size="small" variant="contained"
                sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 700, bgcolor: "#4f46e5", borderRadius: "7px", py: 0.4, "&:hover": { bgcolor: "#4338ca" }, boxShadow: "none" }}>
                Submit
              </Button>
            </Box>
          </Box>
 
          {/* Fake code area */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2.5, fontFamily: "monospace" }}>
            {[
              { n: 1,  line: "const express = require('express');",           color: "#cdd6f4" },
              { n: 2,  line: "const jwt = require('jsonwebtoken');",           color: "#cdd6f4" },
              { n: 3,  line: "",                                               color: "" },
              { n: 4,  line: "const app = express();",                         color: "#89b4fa" },
              { n: 5,  line: "app.use(express.json());",                       color: "#89b4fa" },
              { n: 6,  line: "",                                               color: "" },
              { n: 7,  line: "// TODO: Define your routes below",              color: "#6c7086" },
              { n: 8,  line: "app.get('/api/users', async (req, res) => {",    color: "#a6e3a1" },
              { n: 9,  line: "  // Write your solution here",                  color: "#6c7086" },
              { n: 10, line: "  res.json({ message: 'Hello World' });",        color: "#cdd6f4" },
              { n: 11, line: "});",                                             color: "#a6e3a1" },
              { n: 12, line: "",                                               color: "" },
              { n: 13, line: "app.listen(3000, () => console.log('Ready'));",  color: "#f38ba8" },
            ].map(({ n, line, color }) => (
              <Box key={n} sx={{ display: "flex", gap: 2, mb: 0.2 }}>
                <Typography sx={{ fontSize: 12, color: "#45475a", minWidth: 24, textAlign: "right", fontFamily: "monospace", userSelect: "none" }}>{n}</Typography>
                <Typography sx={{ fontSize: 12, color: color || "#cdd6f4", fontFamily: "monospace" }}>{line}</Typography>
              </Box>
            ))}
          </Box>
 
          {/* Output terminal */}
          <Box sx={{ borderTop: "1px solid #2d2d44", bgcolor: "#11111b", p: 2, maxHeight: 120 }}>
            <Typography sx={{ fontSize: 11, color: "#94a3b8", mb: 0.8, fontWeight: 600 }}>OUTPUT</Typography>
            <Typography sx={{ fontSize: 11.5, color: "#a6e3a1", fontFamily: "monospace" }}>{">"} Server ready on port 3000</Typography>
            <Typography sx={{ fontSize: 11.5, color: "#94a3b8", fontFamily: "monospace" }}>{">"} Run your code to see output...</Typography>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
 
// ── Assignment Detail Modal ────────────────────────────────────────────────────
function AssignmentModal({ assignment: a, onClose }) {
  const tc = TYPE_CONFIG[a.type];
  const cfg = STATUS_CONFIG[a.status];
 
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: "16px", overflow: "hidden" } }}>
      {/* Header image */}
      <Box sx={{ position: "relative", height: 160, overflow: "hidden" }}>
        <Box component="img" src={a.subjectImage} alt={a.title}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.5)" }} />
        <Box sx={{ position: "absolute", inset: 0, p: 3, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
            <Chip label={a.tag} size="small" sx={{ bgcolor: a.subjectColor, color: "#fff", fontWeight: 700, fontSize: 10 }} />
            <Chip label={a.type} size="small"
              icon={React.cloneElement(tc.icon, { sx: { fontSize: 11, color: tc.color + " !important" } })}
              sx={{ bgcolor: tc.bg, color: tc.color, fontWeight: 700, fontSize: 10 }} />
            <Chip label={cfg.label} size="small"
              icon={React.cloneElement(cfg.icon, { sx: { fontSize: 11, color: cfg.color + " !important" } })}
              sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 10 }} />
            {a.questions && <Chip label={`${a.questions} Questions`} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10 }} />}
            {a.duration   && <Chip label={a.duration} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 10 }} />}
          </Box>
          <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 800, lineHeight: 1.3 }}>{a.title}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"
          sx={{ position: "absolute", top: 12, right: 12, bgcolor: "rgba(0,0,0,0.45)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.7)" } }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>
 
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 270px" }}>
 
          {/* Left — Description only */}
          <Box sx={{ p: 3, borderRight: "1px solid #f1f5f9" }}>
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a", mb: 1 }}>Description</Typography>
            <Typography sx={{ fontSize: 13, color: "#475569", lineHeight: 1.75, mb: 3 }}>{a.description}</Typography>
 
            {/* Mentor feedback (completed only) */}
            {a.status === "completed" && a.feedback && (
              <Box sx={{ bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", p: 2, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.8 }}>
                  <EmojiEvents sx={{ fontSize: 16, color: "#22c55e" }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Mentor Feedback</Typography>
                </Box>
                <Typography sx={{ fontSize: 12.5, color: "#166534", lineHeight: 1.6 }}>{a.feedback}</Typography>
              </Box>
            )}
 
            {/* Action button */}
            <Box sx={{ pt: 1 }}>
              {a.type === "MCQ Assessment" && (
                <Button fullWidth variant="contained" startIcon={<QuizIcon />}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: 13.5, borderRadius: "10px", py: 1.3, bgcolor: "#0891b2", "&:hover": { bgcolor: "#0e7490" }, boxShadow: "none" }}>
                  {a.status === "completed" ? "View Results" : "Open Assessment"}
                </Button>
              )}
              {a.type === "Project" && a.status !== "completed" && (
                <Button fullWidth variant="contained" startIcon={<PlayArrow />}
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: 13.5, borderRadius: "10px", py: 1.3, bgcolor: a.subjectColor, "&:hover": { filter: "brightness(0.9)" }, boxShadow: "none" }}>
                  {a.status === "overdue" ? "Submit Now" : "Open Assignment"}
                </Button>
              )}
              {a.type === "Project" && a.status === "completed" && (
                <Button fullWidth variant="outlined"
                  sx={{ textTransform: "none", fontWeight: 700, fontSize: 13.5, borderRadius: "10px", py: 1.3, borderColor: "#e2e8f0", color: "#475569", "&:hover": { bgcolor: "#f8fafc" } }}>
                  View Submission
                </Button>
              )}
            </Box>
          </Box>
 
          {/* Right sidebar — info + mentor */}
          <Box sx={{ p: 2.5, bgcolor: "#f8fafc" }}>
            {/* Score (completed) */}
            {a.status === "completed" && a.score !== undefined && (
              <Box sx={{ bgcolor: "#fff", border: "1px solid #bbf7d0", borderRadius: "12px", p: 2, mb: 2, textAlign: "center" }}>
                <EmojiEvents sx={{ fontSize: 26, color: "#22c55e", mb: 0.5 }} />
                <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#15803d" }}>
                  {a.score}
                  <Typography component="span" sx={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>/{a.totalMarks}</Typography>
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>Final Score</Typography>
                <LinearProgress variant="determinate" value={(a.score / a.totalMarks) * 100}
                  sx={{ height: 6, borderRadius: 3, mt: 1.2, bgcolor: "#dcfce7", "& .MuiLinearProgress-bar": { bgcolor: "#22c55e", borderRadius: 3 } }} />
              </Box>
            )}
 
            {/* Info rows */}
            {[
              { icon: <CalendarToday sx={{ fontSize: 13 }} />, label: "Due Date",    value: a.dueDate,            valueColor: a.status === "overdue" ? "#ef4444" : "#0f172a" },
              { icon: <Person sx={{ fontSize: 13 }} />,        label: "Mentor",      value: a.mentor },
              { icon: <MenuBook sx={{ fontSize: 13 }} />,      label: "Subject",     value: a.subject },
              { icon: <AssignmentIcon sx={{ fontSize: 13 }} />,label: "Type",        value: a.type },
              { icon: <Star sx={{ fontSize: 13 }} />,          label: "Total Marks", value: `${a.totalMarks} pts` },
              ...(a.questions ? [{ icon: <QuizIcon sx={{ fontSize: 13 }} />, label: "Questions", value: `${a.questions} Qs` }] : []),
              ...(a.duration  ? [{ icon: <Schedule sx={{ fontSize: 13 }} />, label: "Duration",  value: a.duration }] : []),
            ].map((row) => (
              <Box key={row.label} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 1.6 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: "8px", bgcolor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#64748b" }}>
                  {row.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 500 }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: row.valueColor || "#0f172a" }}>{row.value}</Typography>
                </Box>
              </Box>
            ))}
 
            <Divider sx={{ borderColor: "#e2e8f0", my: 1.5 }} />
 
            {/* Mentor card */}
            <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", p: 1.8 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b", mb: 1 }}>Assigned Mentor</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: a.mentorColor, width: 36, height: 36, fontSize: 12, fontWeight: 700 }}>{a.mentorAvatar}</Avatar>
                <Box>
                  <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{a.mentor}</Typography>
                  <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{a.subject}</Typography>
                </Box>
              </Box>
              <Button fullWidth variant="outlined" size="small"
                sx={{ mt: 1.5, borderColor: "#e2e8f0", color: "#475569", textTransform: "none", fontSize: 12, borderRadius: "8px", "&:hover": { borderColor: a.subjectColor, color: a.subjectColor } }}>
                Message Mentor
              </Button>
            </Box>
 
            {/* Priority */}
            <Box sx={{ mt: 1.5, bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", p: 1.8 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b", mb: 0.8 }}>Priority Level</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: a.priorityColor }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: a.priorityColor }}>{a.priority}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
 
// ── Assignment Card ────────────────────────────────────────────────────────────
function AssignmentCard({ a, onOpen }) {
  const cfg = STATUS_CONFIG[a.status];
  const tc  = TYPE_CONFIG[a.type];
  const doneTasks = a.tasks.filter(t => t.done).length;
  const pct = a.tasks.length > 0 ? Math.round((doneTasks / a.tasks.length) * 100) : 0;
 
  const ctaLabel =
    a.type === "Coding"         ? "Open Compiler"
    : a.type === "MCQ Assessment"
      ? (a.status === "completed" ? "View Results" : "Start Assessment")
    : a.status === "completed"  ? "View Submission"
    : a.status === "overdue"    ? "Submit Now"
    : "Open Assignment";
 
  return (
    <Box onClick={onOpen}
      sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", transition: "all 0.22s", cursor: "pointer", display: "flex", flexDirection: "column", "&:hover": { boxShadow: "0 10px 32px rgba(0,0,0,0.11)", transform: "translateY(-3px)", borderColor: "#94a3b8" } }}>
 
      {/* Image strip */}
      <Box sx={{ position: "relative", height: 100, overflow: "hidden" }}>
        <Box component="img" src={a.subjectImage} alt={a.subject}
          sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.6)" }} />
        <Box sx={{ position: "absolute", inset: 0, p: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: tc.bg, borderRadius: "6px", px: 1, py: 0.3 }}>
            {React.cloneElement(tc.icon, { sx: { fontSize: 11, color: tc.color } })}
            <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: tc.color }}>{a.type}</Typography>
          </Box>
          <Chip label={cfg.label} size="small"
            icon={React.cloneElement(cfg.icon, { sx: { fontSize: 10, color: cfg.color + " !important" } })}
            sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: 9.5, height: 20 }} />
        </Box>
        {a.status === "completed" && a.score !== undefined && (
          <Box sx={{ position: "absolute", bottom: 8, right: 10 }}>
            <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{a.score}/{a.totalMarks}</Typography>
          </Box>
        )}
        {a.status === "overdue" && (
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, bgcolor: "rgba(239,68,68,0.85)", py: 0.5, textAlign: "center" }}>
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#fff" }}>⚠ OVERDUE</Typography>
          </Box>
        )}
        {a.type === "MCQ Assessment" && (
          <Box sx={{ position: "absolute", bottom: 8, left: 10, display: "flex", gap: 0.8 }}>
            {a.questions && <Chip label={`${a.questions} Qs`} size="small" sx={{ bgcolor: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9.5, height: 18, fontWeight: 700 }} />}
            {a.duration  && <Chip label={a.duration}          size="small" sx={{ bgcolor: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9.5, height: 18 }} />}
          </Box>
        )}
        {a.type === "Coding" && (
          <Box sx={{ position: "absolute", bottom: 8, left: 10 }}>
            <Chip label="Compiler Ready" size="small" sx={{ bgcolor: "rgba(124,58,237,0.8)", color: "#fff", fontSize: 9.5, height: 18, fontWeight: 700 }} />
          </Box>
        )}
      </Box>
 
      {/* Body */}
      <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.35, mb: 0.8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {a.title}
        </Typography>
 
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.2 }}>
          <Avatar sx={{ bgcolor: a.mentorColor, width: 18, height: 18, fontSize: 8, fontWeight: 700 }}>{a.mentorAvatar}</Avatar>
          <Typography sx={{ fontSize: 11, color: "#64748b" }}>{a.mentor}</Typography>
          <Typography sx={{ fontSize: 10, color: "#cbd5e1" }}>·</Typography>
          <Typography sx={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.subject}</Typography>
        </Box>
 
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.2, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <CalendarToday sx={{ fontSize: 11, color: a.status === "overdue" ? "#ef4444" : "#94a3b8" }} />
            <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: a.status === "overdue" ? "#ef4444" : "#475569" }}>Due {a.dueDate}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Star sx={{ fontSize: 11, color: "#f59e0b" }} />
            <Typography sx={{ fontSize: 10.5, color: "#475569" }}>{a.totalMarks} pts</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: a.priorityColor }} />
            <Typography sx={{ fontSize: 10.5, color: a.priorityColor, fontWeight: 600 }}>{a.priority}</Typography>
          </Box>
        </Box>
 
        {/* Progress bar — only for Projects */}
        {a.type === "Project" && a.tasks.length > 0 && (
          <Box sx={{ mb: 1.2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
              <Typography sx={{ fontSize: 10.5, color: "#64748b" }}>{doneTasks}/{a.tasks.length} tasks</Typography>
              <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: a.subjectColor }}>{pct}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={pct}
              sx={{ height: 5, borderRadius: 3, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: a.status === "completed" ? "#22c55e" : a.subjectColor, borderRadius: 3 } }} />
          </Box>
        )}
 
        {/* CTA */}
        <Box sx={{ mt: "auto", pt: 1.2, borderTop: "1px solid #f1f5f9" }}>
          <Button fullWidth variant="contained" size="small"
            startIcon={a.type === "Coding" ? <Terminal sx={{ fontSize: 13 }} /> : a.type === "MCQ Assessment" ? <QuizIcon sx={{ fontSize: 13 }} /> : <PlayArrow sx={{ fontSize: 13 }} />}
            endIcon={<ArrowForward sx={{ fontSize: 13 }} />}
            sx={{
              textTransform: "none", fontWeight: 700, fontSize: 12, borderRadius: "9px", py: 0.8, boxShadow: "none",
              bgcolor: a.status === "completed"
                ? "transparent"
                : a.type === "Coding"
                ? "#7c3aed"
                : a.type === "MCQ Assessment"
                ? "#0891b2"
                : a.subjectColor,
              borderColor: a.status === "completed" ? "#e2e8f0" : "transparent",
              border: a.status === "completed" ? "1px solid #e2e8f0" : "none",
              color: a.status === "completed" ? "#475569" : "#fff",
              "&:hover": {
                filter: a.status !== "completed" ? "brightness(0.9)" : "none",
                bgcolor: a.status === "completed" ? "#f8fafc" : undefined,
                boxShadow: "none",
              },
            }}>
            {ctaLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
 
// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Assignments() {
  const [typeTab,    setTypeTab]    = useState(0);
  const [statusPill, setStatusPill] = useState("all");
  const [selected,   setSelected]   = useState(null);
  const [compilerAssignment, setCompilerAssignment] = useState(null);
  const [assignments, setAssignments] = useState(ALL_ASSIGNMENTS);
 
  // Filter by type tab
  const byType = typeTab === 0 ? assignments
    : typeTab === 1 ? assignments.filter(a => a.type === "Project")
    : typeTab === 2 ? assignments.filter(a => a.type === "MCQ Assessment")
    :                 assignments.filter(a => a.type === "Coding");
 
  // Filter by status pill
  const filtered = statusPill === "all" ? byType : byType.filter(a => a.status === statusPill);
 
  const handleCardClick = (a) => {
    if (a.type === "Coding") {
      setCompilerAssignment(a);
    } else {
      setSelected(a);
    }
  };
 
  return (
    <StudentLayout title="Assignments">
      <Box sx={{ p: 3 }}>
 
        {/* ── Status Pill Filter (image style) ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, flexWrap: "wrap" }}>
          {STATUS_PILLS.map((pill) => {
            const isActive = statusPill === pill.value;
            return (
              <Box
                key={pill.value}
                onClick={() => setStatusPill(pill.value)}
                sx={{
                  px: 2.2,
                  py: 0.75,
                  borderRadius: "22px",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  transition: "all 0.15s",
                  bgcolor: isActive ? "#4f46e5" : "#fff",
                  color: isActive ? "#fff" : "#475569",
                  border: isActive ? "1.5px solid #4f46e5" : "1.5px solid #e2e8f0",
                  boxShadow: isActive ? "0 2px 8px rgba(79,70,229,0.25)" : "none",
                  "&:hover": {
                    bgcolor: isActive ? "#4338ca" : "#f8fafc",
                    borderColor: isActive ? "#4338ca" : "#cbd5e1",
                  },
                  userSelect: "none",
                }}
              >
                {pill.label}
              </Box>
            );
          })}
        </Box>
 
        {/* ── Type Tabs ── */}
        <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", px: 2.5, pt: 1.5, pb: 0, mb: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Tabs
              value={typeTab}
              onChange={(_, v) => { setTypeTab(v); }}
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontSize: 13.5, fontWeight: 500, minHeight: 44, color: "#64748b", px: 2 },
                "& .Mui-selected": { color: "#4f46e5", fontWeight: 700 },
                "& .MuiTabs-indicator": { bgcolor: "#4f46e5", height: 3, borderRadius: 2 },
              }}
            >
              {TYPE_TABS.map(t => <Tab key={t} label={t} />)}
            </Tabs>
            <Typography sx={{ fontSize: 12.5, color: "#94a3b8", pr: 0.5 }}>
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
 
        {/* ── Assignment Grid ── */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CheckCircle sx={{ fontSize: 48, color: "#22c55e", mb: 1.5 }} />
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#0f172a", mb: 0.5 }}>All caught up!</Typography>
            <Typography sx={{ fontSize: 13, color: "#64748b" }}>No assignments in this category right now.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2.5 }}>
            {filtered.map(a => (
              <AssignmentCard key={a.id} a={a} onOpen={() => handleCardClick(a)} />
            ))}
          </Box>
        )}
      </Box>
 
      {/* Assignment Detail Modal */}
      {selected && (
        <AssignmentModal
          assignment={selected}
          onClose={() => setSelected(null)}
        />
      )}
 
      {/* Compiler Modal */}
      {compilerAssignment && (
        <CompilerModal
          assignment={compilerAssignment}
          onClose={() => setCompilerAssignment(null)}
        />
      )}
    </StudentLayout>
  );
}