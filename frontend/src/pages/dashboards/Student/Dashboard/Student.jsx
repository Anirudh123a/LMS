import React, { useState, useRef } from "react";
import StudentLayout from "../Components/StudentLayout";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, LinearProgress, Button, Chip, Divider,
} from "@mui/material";
import {
  PlayArrow, FileDownload, CheckCircle, AutoStories,
  WorkspacePremium, Quiz, MenuBook, Assignment, EmojiEvents,
  AccessTime, Group, OpenInNew, LinkedIn, Star, Timer,
  ArrowForward, Person, School, ExpandMore,
  ChevronLeft, ChevronRight,
} from "@mui/icons-material";

// ─── Stat cards ───────────────────────────────────────────────────────────────
const STATS = [
  { label: "ENROLLED COURSES", value: 4,    sub: "In Progress", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80", icon: <MenuBook sx={{ fontSize: 16, color: "#334155" }} /> },
  { label: "ASSIGNMENTS",      value: 3,    sub: "Pending",     image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80", icon: <Assignment sx={{ fontSize: 16, color: "#334155" }} /> },
  { label: "CERTIFICATES",     value: 2,    sub: "Earned",      image: "https://cdn.dribbble.com/userupload/18288845/file/original-a5a1d7972c866e7cb3052dd0e94848f8.jpg?crop=545x178-3974x2750&format=webp&resize=400x300&vertical=center", icon: <EmojiEvents sx={{ fontSize: 16, color: "#334155" }} /> },
  { label: "AVG COMPLETION",   value: "72%", sub: "This Month", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80", icon: <CheckCircle sx={{ fontSize: 16, color: "#334155" }} /> },
];

// ─── Courses ──────────────────────────────────────────────────────────────────
const COURSES = [
  {
    id: 1,
    name: "Web Dev Pro",
    module: "Module 5 – React Hooks",
    pct: 68,
    color: "#4f46e5",
    tag: "WEB DEVELOPMENT",
    tagColor: "#4f46e5",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
    students: 340,
    hours: "24 hrs video",
    mentor: "Alex Johnson",
    institution: "Sri Venkateswara Institute",
    badge: "Core Module",
    badgeBg: "#e0e7ff",
    badgeColor: "#4f46e5",
  },
  {
    id: 2,
    name: "Data Science Bootcamp",
    module: "Module 3 – Pandas",
    pct: 42,
    color: "#0891b2",
    tag: "DATA SCIENCE",
    tagColor: "#0891b2",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    students: 280,
    hours: "32 hrs video",
    mentor: "Sarah Kim",
    institution: "Sri Venkateswara Institute",
    badge: "Elective",
    badgeBg: "#e0f2fe",
    badgeColor: "#0891b2",
  },
  {
    id: 3,
    name: "UI/UX Fundamentals",
    module: "Module 7 – Prototyping",
    pct: 89,
    color: "#7c3aed",
    tag: "DESIGN",
    tagColor: "#7c3aed",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    students: 210,
    hours: "18 hrs video",
    mentor: "Maria Garcia",
    institution: "Sri Venkateswara Institute",
    badge: "Lab",
    badgeBg: "#f3e8ff",
    badgeColor: "#7c3aed",
  },
  {
    id: 4,
    name: "React & TypeScript Mastery",
    module: "Module 2 – TypeScript Basics",
    pct: 15,
    color: "#4f46e5",
    tag: "WEB DEVELOPMENT",
    tagColor: "#4f46e5",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&q=80",
    students: 520,
    hours: "28 hrs video",
    mentor: "David Chen",
    institution: "Sri Venkateswara Institute",
    badge: "Advanced",
    badgeBg: "#e0e7ff",
    badgeColor: "#4f46e5",
  },
  {
    id: 5,
    name: "Python for Data Analysis",
    module: "Module 4 – NumPy & Pandas",
    pct: 55,
    color: "#ca8a04",
    tag: "DATA SCIENCE",
    tagColor: "#ca8a04",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
    students: 410,
    hours: "20 hrs video",
    mentor: "Priya Nair",
    institution: "Sri Venkateswara Institute",
    badge: "Elective",
    badgeBg: "#fef9c3",
    badgeColor: "#ca8a04",
  },
  {
    id: 6,
    name: "Cloud Fundamentals (AWS)",
    module: "Module 1 – Cloud Overview",
    pct: 30,
    color: "#ea580c",
    tag: "CLOUD & DEVOPS",
    tagColor: "#ea580c",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    students: 360,
    hours: "22 hrs video",
    mentor: "Raj Kumar",
    institution: "Sri Venkateswara Institute",
    badge: "Core Module",
    badgeBg: "#ffedd5",
    badgeColor: "#ea580c",
  },
];

// ─── Suggested Skill Paths ────────────────────────────────────────────────────
const SKILL_PATHS = [
  { id: 1, title: "Java for Web Developers",      skills: "Computer Programming",     courses: 4, badge: "Popular",  badgeBg: "#dcfce7", badgeColor: "#15803d", iconBg: "#e0f2fe", iconColor: "#0891b2", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80", icon: "java" },
  { id: 2, title: "Front-End Web Development",    skills: "HTML, CSS, JavaScript",    courses: 6, badge: "New",      badgeBg: "#dbeafe", badgeColor: "#1d4ed8", iconBg: "#ede9fe", iconColor: "#7c3aed", image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&q=80", icon: "frontend" },
  { id: 3, title: "Data Science Essentials",      skills: "Python, Pandas, ML",       courses: 5, badge: "Popular",  badgeBg: "#dcfce7", badgeColor: "#15803d", iconBg: "#fef9c3", iconColor: "#b45309", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80", icon: "data" },
  { id: 4, title: "AI & Machine Learning",        skills: "ML, Deep Learning",        courses: 4, badge: "New",      badgeBg: "#dbeafe", badgeColor: "#1d4ed8", iconBg: "#fce7f3", iconColor: "#be185d", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80", icon: "ai" },
  { id: 5, title: "Cloud Computing Basics",       skills: "AWS, Cloud Services",      courses: 3, badge: "Trending", badgeBg: "#ffedd5", badgeColor: "#c2410c", iconBg: "#ffedd5", iconColor: "#ea580c", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80", icon: "cloud" },
  { id: 6, title: "Python Programming",           skills: "Python, OOP, Libraries",   courses: 5, badge: "Popular",  badgeBg: "#dcfce7", badgeColor: "#15803d", iconBg: "#fef9c3", iconColor: "#ca8a04", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&q=80", icon: "python" },
  { id: 7, title: "React & TypeScript",           skills: "React, TypeScript, Hooks", courses: 4, badge: "Trending", badgeBg: "#ffedd5", badgeColor: "#c2410c", iconBg: "#e0e7ff", iconColor: "#4f46e5", image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80", icon: "react" },
  { id: 8, title: "DevOps & CI/CD",               skills: "Docker, Kubernetes, Git",  courses: 6, badge: "New",      badgeBg: "#dbeafe", badgeColor: "#1d4ed8", iconBg: "#f0fdf4", iconColor: "#16a34a", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=80", icon: "devops" },
];

// ─── Skill path SVG icons ─────────────────────────────────────────────────────
function SkillIcon({ type, color, size = 24 }) {
  const s = { width: size, height: size, display: "block" };
  if (type === "java") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <text x="3" y="24" fontSize="22" fontWeight="800" fill={color} fontFamily="monospace">{"{}"}</text>
    </svg>
  );
  if (type === "frontend") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <polyline points="9,10 4,16 9,22" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="23,10 28,16 23,22" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="19" y1="8" x2="13" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
  if (type === "data") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <rect x="3" y="18" width="5" height="10" rx="1" fill={color}/>
      <rect x="11" y="12" width="5" height="16" rx="1" fill={color} opacity="0.75"/>
      <rect x="19" y="6" width="5" height="22" rx="1" fill={color} opacity="0.5"/>
    </svg>
  );
  if (type === "ai") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <circle cx="16" cy="16" r="5" stroke={color} strokeWidth="2"/>
      <circle cx="16" cy="4"  r="2" fill={color}/>
      <circle cx="16" cy="28" r="2" fill={color}/>
      <circle cx="4"  cy="16" r="2" fill={color}/>
      <circle cx="28" cy="16" r="2" fill={color}/>
      <line x1="16" y1="11" x2="16" y2="6"  stroke={color} strokeWidth="1.5"/>
      <line x1="16" y1="21" x2="16" y2="26" stroke={color} strokeWidth="1.5"/>
      <line x1="11" y1="16" x2="6"  y2="16" stroke={color} strokeWidth="1.5"/>
      <line x1="21" y1="16" x2="26" y2="16" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
  if (type === "cloud") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <path d="M8 22 C4 22 3 17 7 16 C6 10 13 8 16 13 C18 10 24 11 23 16 C27 16 27 22 23 22 Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "python") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <path d="M10 5 C7 5 6 7 6 10 L6 13 L16 13 L16 15 L5 15 C3 15 2 17 2 19 L2 22 C2 25 3 27 6 27 L10 27 L10 24 L8 24 L8 22 L16 22 L24 22 L24 27 L26 27 C29 27 30 25 30 22 L30 19 C30 17 29 15 27 15 L16 15 L16 13 L26 13 L26 10 C26 7 25 5 22 5 Z" fill={color} opacity="0.85"/>
      <circle cx="11" cy="9.5" r="1.5" fill="#fff"/>
      <circle cx="21" cy="22.5" r="1.5" fill="#fff"/>
    </svg>
  );
  if (type === "react") return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1.8"/>
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1.8" transform="rotate(60 16 16)"/>
      <ellipse cx="16" cy="16" rx="13" ry="5" stroke={color} strokeWidth="1.8" transform="rotate(120 16 16)"/>
      <circle cx="16" cy="16" r="2.5" fill={color}/>
    </svg>
  );
  return (
    <svg viewBox="0 0 32 32" style={s} fill="none">
      <rect x="3" y="5" width="26" height="18" rx="2" stroke={color} strokeWidth="2"/>
      <line x1="3" y1="17" x2="29" y2="17" stroke={color} strokeWidth="1.5"/>
      <line x1="13" y1="23" x2="19" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="9"  y1="28" x2="23" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9"  cy="11" r="1.5" fill={color}/>
      <circle cx="16" cy="11" r="1.5" fill={color}/>
      <circle cx="23" cy="11" r="1.5" fill={color}/>
    </svg>
  );
}

// ─── Suggested Learning Paths ─────────────────────────────────────────────────
const SUGGESTED_ALL = [
  { id: 1, title: "Advanced React Patterns & Performance",       provider: "Meta",     providerLogo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",                image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80", type: "Professional Certificate", rating: 4.9, students: "12K", hours: "30 hrs" },
  { id: 2, title: "Node.js & Express: Full Backend Development", provider: "Coursera", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg",   image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&q=80", type: "Course",                   rating: 4.7, students: "8K",  hours: "24 hrs" },
  { id: 3, title: "GraphQL API Design with Apollo",              provider: "Udemy",    providerLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg",              image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80", type: "Course",                   rating: 4.6, students: "6K",  hours: "18 hrs" },
  { id: 4, title: "DevOps & CI/CD for Web Developers",          provider: "Google",   providerLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",        image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=80", type: "Guided Project",           rating: 4.8, students: "15K", hours: "20 hrs" },
  { id: 5, title: "TypeScript Mastery: From Basics to Advanced", provider: "Udemy",   providerLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg",              image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&q=80", type: "Course",                   rating: 4.7, students: "9K",  hours: "22 hrs" },
  { id: 6, title: "Full-Stack with Next.js & Prisma",           provider: "Coursera", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg",   image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80", type: "Specialisation",           rating: 4.8, students: "5K",  hours: "28 hrs" },
  { id: 7, title: "System Design for Frontend Engineers",        provider: "Meta",     providerLogo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png",                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80", type: "Professional Certificate", rating: 4.9, students: "11K", hours: "26 hrs" },
  { id: 8, title: "Docker & Kubernetes for Developers",          provider: "Google",   providerLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80", type: "Guided Project",           rating: 4.6, students: "13K", hours: "16 hrs" },
];

// ─── Hero stat box ────────────────────────────────────────────────────────────
function HeroStatBox({ value, label }) {
  return (
    <Box sx={{ bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "10px", px: 2.2, py: 1.6, backdropFilter: "blur(6px)", minWidth: 90, flex: 1 }}>
      <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</Typography>
      <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: 0.8, mt: 0.4, textTransform: "uppercase" }}>{label}</Typography>
    </Box>
  );
}

// ─── Floating Carousel Arrow ──────────────────────────────────────────────────
function CarouselArrow({ direction, onClick }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Box
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        ...(direction === "left" ? { left: -20 } : { right: -20 }),
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: "50%",
        bgcolor: hovered ? "#4f46e5" : "#fff",
        color: hovered ? "#fff" : "#334155",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: hovered
          ? "0 8px 24px rgba(79,70,229,0.45)"
          : "0 4px 16px rgba(15,23,42,0.14)",
        border: hovered ? "1.5px solid #4f46e5" : "1.5px solid #e2e8f0",
        transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
        userSelect: "none",
      }}
    >
      {direction === "left"
        ? <ChevronLeft sx={{ fontSize: 22, transition: "color 0.22s" }} />
        : <ChevronRight sx={{ fontSize: 22, transition: "color 0.22s" }} />
      }
    </Box>
  );
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [showAllSuggested, setShowAllSuggested] = useState(false);
  const skillScrollRef = useRef(null);
  const courseScrollRef = useRef(null);

  const suggestedVisible = showAllSuggested ? SUGGESTED_ALL : SUGGESTED_ALL.slice(0, 4);

  const scrollSkills = (dir) => {
    if (skillScrollRef.current) {
      skillScrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  const scrollCourses = (dir) => {
    if (courseScrollRef.current) {
      courseScrollRef.current.scrollBy({ left: dir * 340, behavior: "smooth" });
    }
  };

  return (
    <StudentLayout title="Dashboard">
      <Box sx={{ p: 3 }}>

        {/* ── Hero Banner ── */}
        <Box sx={{ background: "linear-gradient(135deg, #1a1065 0%, #2d1b8e 40%, #3730a3 75%, #4338ca 100%)", borderRadius: "16px", p: 3.5, mb: 3, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 160 }}>
          <Box sx={{ position: "absolute", top: -50, left: "38%", width: 280, height: 280, borderRadius: "50%", bgcolor: "rgba(139,92,246,0.2)" }} />
          <Box sx={{ position: "absolute", top: -20, left: "58%", width: 180, height: 180, borderRadius: "50%", bgcolor: "rgba(99,102,241,0.15)" }} />
          <Box sx={{ position: "absolute", bottom: -40, left: "48%", width: 140, height: 140, borderRadius: "50%", bgcolor: "rgba(167,139,250,0.1)" }} />
          {[{t:"14%",l:"53%"},{t:"58%",l:"67%"},{t:"22%",l:"80%"}].map((d,i) => (
            <Box key={i} sx={{ position:"absolute", top:d.t, left:d.l, width:3, height:3, borderRadius:"50%", bgcolor:"rgba(255,255,255,0.75)", animation:`tw${i} ${1.4+i*0.35}s ease-in-out infinite`, [`@keyframes tw${i}`]:{"0%,100%":{opacity:0.2},"50%":{opacity:1}} }} />
          ))}

          <Box sx={{ zIndex: 1, flex: 1 }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", bgcolor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "20px", px: 1.8, py: 0.5, mb: 1.8 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Student</Typography>
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13, mb: 0.4, fontWeight: 500 }}>Welcome back</Typography>
            <Typography sx={{ color: "#fff", fontSize: 28, fontWeight: 800, mb: 0.6, lineHeight: 1.2 }}>George David</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 13, mb: 2.5 }}>You've logged 26 hrs this month. Keep the momentum!</Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button variant="contained" startIcon={<PlayArrow sx={{ fontSize: 16 }} />} sx={{ bgcolor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 13, borderRadius: "10px", px: 2.5, py: 1, backdropFilter: "blur(6px)", "&:hover": { bgcolor: "rgba(255,255,255,0.28)" }, boxShadow: "none" }}>
                Resume Course
              </Button>
              <Button variant="outlined" onClick={() => navigate("/mycourses")} sx={{ border: "1.5px solid rgba(255,255,255,0.55)", color: "#fff", textTransform: "none", fontWeight: 700, fontSize: 13, borderRadius: "10px", px: 2.5, py: 1, "&:hover": { bgcolor: "rgba(255,255,255,0.1)", border: "1.5px solid #fff" } }}>
                View Assigned Courses
              </Button>
            </Box>
          </Box>

          <Box sx={{ zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.2, flexShrink: 0, ml: 4 }}>
            <HeroStatBox value="4"   label="Courses" />
            <HeroStatBox value="2"   label="Certificates" />
            <HeroStatBox value="72%" label="Avg Completion" />
          </Box>
        </Box>

        {/* ── Stat cards ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 3 }}>
          {STATS.map((s) => (
            <Box key={s.label} sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden", transition: "all 0.22s ease", cursor: "pointer", "&:hover": { transform: "translateY(-3px)", boxShadow: "0 8px 24px rgba(0,0,0,0.10)", borderColor: "#64748b" } }}>
              <Box sx={{ position: "relative", height: 72, overflow: "hidden" }}>
                <Box component="img" src={s.image} alt={s.label} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <Box sx={{ position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.18)" }} />
                <Box sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#fff", borderRadius: "8px", p: 0.65, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}>{s.icon}</Box>
              </Box>
              <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
                <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", letterSpacing: 0.8, mb: 0.5 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: 30, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography sx={{ fontSize: 12, color: "#475569", fontWeight: 500, mt: 0.3 }}>{s.sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ── My Courses — Netflix-style carousel ── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "12px", p: 2.5, border: "1px solid #e2e8f0", mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>My Courses</Typography>
            <Typography
              onClick={() => navigate("/mycourses")}
              sx={{ fontSize: 13, color: "#6366f1", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Browse More
            </Typography>
          </Box>

          {/* Carousel wrapper with floating arrows */}
          <Box sx={{ position: "relative" }}>
            <CarouselArrow direction="left" onClick={() => scrollCourses(-1)} />

            <Box
              ref={courseScrollRef}
              sx={{
                display: "flex",
                gap: "24px",
                overflowX: "auto",
                scrollBehavior: "smooth",
                pb: 1,
                px: "4px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {COURSES.map((c) => (
                <Box
                  key={c.id}
                  onClick={() => navigate(`/course/${c.id}`)}
                  sx={{
                    minWidth: 300,
                    maxWidth: 300,
                    flexShrink: 0,
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
                    cursor: "pointer",
                    bgcolor: "#fff",
                    "&:hover": {
                      boxShadow: "0 12px 36px rgba(79,70,229,0.15)",
                      transform: "translateY(-5px)",
                      borderColor: "#a5b4fc",
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: 148, overflow: "hidden" }}>
                    <Box
                      component="img"
                      src={c.image}
                      alt={c.name}
                      sx={{
                        width: "100%", height: "100%", objectFit: "cover", display: "block",
                        transition: "transform 0.38s ease",
                        ".MuiBox-root:hover > &": { transform: "scale(1.08)" },
                      }}
                    />
                    <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                    <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: c.badgeBg, borderRadius: "20px", px: 1, py: 0.3 }}>
                      <Typography sx={{ fontSize: 9.5, fontWeight: 700, color: c.badgeColor }}>{c.badge}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.8 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.6 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 700, color: c.tagColor, letterSpacing: 0.6 }}>{c.tag}</Typography>
                      <Box sx={{ bgcolor: "#dcfce7", borderRadius: "20px", px: 1, py: 0.2 }}><Typography sx={{ fontSize: 10, fontWeight: 700, color: "#15803d" }}>Enrolled</Typography></Box>
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.3, mb: 0.6 }}>{c.name}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.4 }}>
                      <Person sx={{ fontSize: 12, color: "#94a3b8" }} />
                      <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>Mentor: {c.mentor}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                      <School sx={{ fontSize: 12, color: "#94a3b8" }} />
                      <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>Assigned by: {c.institution}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <LinearProgress variant="determinate" value={c.pct} sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: "#eff6ff", "& .MuiLinearProgress-bar": { bgcolor: c.color, borderRadius: 3 } }} />
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#475569", flexShrink: 0 }}>{c.pct}%</Typography>
                    </Box>
                    <Box sx={{ borderTop: "1px solid #f1f5f9", pt: 1, display: "flex", justifyContent: "flex-end" }}>
                      <Button size="small" variant="contained" startIcon={<PlayArrow sx={{ fontSize: 12 }} />} onClick={(e) => { e.stopPropagation(); navigate(`/course/${c.id}`); }} sx={{ bgcolor: "#1c5197", textTransform: "none", fontWeight: 700, fontSize: 12.5, borderRadius: "9px", py: 0.9, px: 4, "&:hover": { bgcolor: "#163d78" }, boxShadow: "none" }}>
                        Continue Learning
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <CarouselArrow direction="right" onClick={() => scrollCourses(1)} />
          </Box>
        </Box>

        {/* ── Suggested Skill Paths — Netflix-style carousel ── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", p: 2.5, mb: 3 }}>
          {/* Header — only View All, no arrow buttons here */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Suggested Skill Paths</Typography>
              <Typography sx={{ fontSize: 11.5, color: "#94a3b8", mt: 0.2 }}>Curated paths to help you build in-demand skills</Typography>
            </Box>
            <Typography
              sx={{ fontSize: 13, color: "#6366f1", fontWeight: 600, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              View All
            </Typography>
          </Box>

          {/* Carousel wrapper with floating arrows */}
          <Box sx={{ position: "relative" }}>
            <CarouselArrow direction="left" onClick={() => scrollSkills(-1)} />

            <Box
              ref={skillScrollRef}
              sx={{
                display: "flex",
                gap: "24px",
                overflowX: "auto",
                scrollBehavior: "smooth",
                pb: 1,
                px: "4px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {SKILL_PATHS.map((path) => (
                <Box
                  key={path.id}
                  sx={{
                    minWidth: 300,
                    maxWidth: 300,
                    flexShrink: 0,
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    overflow: "hidden",
                    bgcolor: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    "&:hover": {
                      boxShadow: "0 16px 40px rgba(79,70,229,0.16)",
                      transform: "translateY(-6px)",
                      borderColor: "#a5b4fc",
                    },
                    "&:hover .skill-img": { transform: "scale(1.07)" },
                    "&:hover .view-path-btn": {
                      bgcolor: "#4f46e5",
                      color: "#fff",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  {/* Image — taller */}
                  <Box sx={{ position: "relative", height: 168, overflow: "hidden", flexShrink: 0 }}>
                    <Box
                      component="img"
                      src={path.image}
                      alt={path.title}
                      className="skill-img"
                      sx={{
                        width: "100%", height: "100%", objectFit: "cover", display: "block",
                        transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
                      }}
                    />
                    {/* Gradient overlay */}
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.5) 0%, transparent 50%)" }} />
                    {/* Badge */}
                    <Box sx={{ position: "absolute", top: 10, left: 10, bgcolor: path.badgeBg, borderRadius: "20px", px: 1.4, py: 0.4, backdropFilter: "blur(4px)" }}>
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: path.badgeColor, letterSpacing: 0.3 }}>{path.badge}</Typography>
                    </Box>
                    {/* Course count chip on image bottom */}
                    <Box sx={{ position: "absolute", bottom: 10, right: 10, bgcolor: "rgba(255,255,255,0.92)", borderRadius: "8px", px: 1.2, py: 0.4, backdropFilter: "blur(4px)" }}>
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "#334155" }}>{path.courses} Courses</Typography>
                    </Box>
                  </Box>

                  {/* Body */}
                  <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                    {/* Icon + title row */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                      <Box sx={{
                        width: 44, height: 44, borderRadius: "12px",
                        bgcolor: path.iconBg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                      }}>
                        <SkillIcon type={path.icon} color={path.iconColor} size={24} />
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.35, pt: 0.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {path.title}
                      </Typography>
                    </Box>

                    {/* Skills */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 2, flexWrap: "wrap" }}>
                      {path.skills.split(", ").map((skill) => (
                        <Box
                          key={skill}
                          sx={{
                            px: 1.2, py: 0.3, bgcolor: "#f1f5f9",
                            borderRadius: "6px",
                            fontSize: 11, fontWeight: 600, color: "#475569",
                          }}
                        >
                          {skill}
                        </Box>
                      ))}
                    </Box>

                    {/* View Path CTA */}
                    <Box
                      className="view-path-btn"
                      sx={{
                        mt: "auto",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 0.8,
                        py: 1.1,
                        borderRadius: "10px",
                        border: "1.5px solid #c7d2fe",
                        bgcolor: "#f5f3ff",
                        color: "#4f46e5",
                        fontWeight: 700,
                        fontSize: 13.5,
                        cursor: "pointer",
                        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                        letterSpacing: 0,
                      }}
                    >
                      View Path
                      <ArrowForward sx={{ fontSize: 15 }} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <CarouselArrow direction="right" onClick={() => scrollSkills(1)} />
          </Box>
        </Box>

        {/* ── Suggested Learning Paths ── */}
        <Box sx={{ mt: 0, bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: 18, color: "#0f172a" }}>Suggested Learning Paths</Typography>
              <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.3 }}>Based on your Web Development journey</Typography>
            </Box>
            <Button
              endIcon={<ExpandMore sx={{ transform: showAllSuggested ? "rotate(180deg)" : "none", transition: "0.3s" }} />}
              onClick={() => setShowAllSuggested(prev => !prev)}
              sx={{ textTransform: "none", color: "#2563eb", fontWeight: 600, fontSize: 13, border: "1px solid #bfdbfe", borderRadius: "10px", px: 2, "&:hover": { bgcolor: "#eff6ff" } }}
            >
              {showAllSuggested ? "Show Less" : "Show More"}
            </Button>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {suggestedVisible.map((r) => (
              <Box key={r.id} onClick={() => navigate(`/course/${r.id}`)} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", bgcolor: "#fff", transition: "all 0.22s ease", cursor: "pointer", display: "flex", flexDirection: "column", "&:hover": { boxShadow: "0 8px 32px rgba(0,0,0,0.12)", transform: "translateY(-4px)", borderColor: "#94a3b8" } }}>
                <Box sx={{ position: "relative", height: 140, overflow: "hidden" }}>
                  <Box component="img" src={r.image} alt={r.title} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }} />
                </Box>
                <Box sx={{ p: 1.8, flex: 1, display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: "4px", overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0, bgcolor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Box component="img" src={r.providerLogo} alt={r.provider} sx={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { e.target.style.display = "none"; }} />
                    </Box>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>{r.provider}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, mb: 0.8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: 36 }}>{r.title}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.8 }}>
                    <Typography sx={{ fontSize: 11, color: "#64748b" }}>{r.type}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>·</Typography>
                    <Star sx={{ fontSize: 13, color: "#f59e0b" }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{r.rating}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Group sx={{ fontSize: 12, color: "#94a3b8" }} /><Typography sx={{ fontSize: 11, color: "#64748b" }}>{r.students}</Typography></Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><AccessTime sx={{ fontSize: 12, color: "#94a3b8" }} /><Typography sx={{ fontSize: 11, color: "#64748b" }}>{r.hours}</Typography></Box>
                  </Box>
                  <Box sx={{ mt: "auto" }}>
                    <Button fullWidth variant="outlined" onClick={(e) => { e.stopPropagation(); navigate(`/course/${r.id}`); }} sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, bgcolor: "#1c5197", borderColor: "#1c5197", color: "#fff", borderRadius: "9px", py: 0.8, "&:hover": { bgcolor: "#163d78", borderColor: "#163d78" } }}>
                      Start Learning
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {showAllSuggested && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography sx={{ fontSize: 12.5, color: "#94a3b8" }}>Showing all {SUGGESTED_ALL.length} suggested learning paths</Typography>
            </Box>
          )}
        </Box>

      </Box>
    </StudentLayout>
  );
}
