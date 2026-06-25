import React, { useState } from "react";
import StudentLayout from "../Components/StudentLayout";
import {
  Box, Typography, LinearProgress, Button, Chip,
  Divider, Tab, Tabs, Avatar,
} from "@mui/material";
import {
  PlayArrow, AccessTime, CheckCircle, Schedule,
  Quiz as QuizIcon, TrendingUp, Person,
  CalendarToday, Visibility, Assignment, FilterList,
  BarChart, Timer, EmojiEvents, Star,
} from "@mui/icons-material";
 
// ── animated counter ──────────────────────────────────────────────────────────
function useCounter(target, duration = 1200) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}
 
// ── data ──────────────────────────────────────────────────────────────────────
const QUIZ_LIST = [
  {
    id: 1,
    title: "React Hooks Quiz",
    course: "Web Development – Pro",
    mentor: "Alex Johnson",
    mentorAvatar: "AJ",
    avatarColor: "#4f46e5",
    icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    iconBg: "#e0e7ff",
    status: "Assigned",
    statusColor: "#6366f1",
    statusBg: "#e0e7ff",
    dueDate: "Jun 25, 2026",
    dueTime: "08:00 PM",
    dueColor: "#ef4444",
    questions: 20,
    duration: "30 mins",
    marks: 50,
    difficulty: "Medium",
    diffColor: "#f97316",
    diffBg: "#fff7ed",
    action: "Start Quiz",
    actionColor: "#4f46e5",
  },
  {
    id: 2,
    title: "JavaScript Advanced Concepts",
    course: "JavaScript Mastery",
    mentor: "Sarah Williams",
    mentorAvatar: "SW",
    avatarColor: "#0891b2",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    iconBg: "#fef9c3",
    status: "Assigned",
    statusColor: "#6366f1",
    statusBg: "#e0e7ff",
    dueDate: "Jun 27, 2026",
    dueTime: "08:20 PM",
    dueColor: "#ef4444",
    questions: 15,
    duration: "25 mins",
    marks: 40,
    difficulty: "Easy",
    diffColor: "#22c55e",
    diffBg: "#f0fdf4",
    action: "Start Quiz",
    actionColor: "#4f46e5",
  },
  {
    id: 3,
    title: "TypeScript Fundamentals",
    course: "TypeScript Essentials",
    mentor: "Michael Brown",
    mentorAvatar: "MB",
    avatarColor: "#3b82f6",
    icon: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    iconBg: "#dbeafe",
    status: "Assigned",
    statusColor: "#6366f1",
    statusBg: "#e0e7ff",
    dueDate: "Jun 30, 2026",
    dueTime: "07:20 PM",
    dueColor: "#f97316",
    questions: 25,
    duration: "35 mins",
    marks: 60,
    difficulty: "Hard",
    diffColor: "#ef4444",
    diffBg: "#fef2f2",
    action: "Start Quiz",
    actionColor: "#4f46e5",
  },
  {
    id: 4,
    title: "MongoDB Basics",
    course: "Database Management",
    mentor: "Emily Davis",
    mentorAvatar: "ED",
    avatarColor: "#22c55e",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
    iconBg: "#f0fdf4",
    status: "Upcoming",
    statusColor: "#0891b2",
    statusBg: "#e0f2fe",
    dueDate: "Jul 02, 2026",
    dueTime: "10:00 AM",
    dueColor: "#0891b2",
    questions: 20,
    duration: "30 mins",
    marks: 50,
    difficulty: "Medium",
    diffColor: "#f97316",
    diffBg: "#fff7ed",
    action: "View Details",
    actionColor: "#0891b2",
  },
  {
    id: 5,
    title: "CSS Flexbox & Grid Quiz",
    course: "CSS Mastery",
    mentor: "Alex Johnson",
    mentorAvatar: "AJ",
    avatarColor: "#4f46e5",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
    iconBg: "#e0e7ff",
    status: "Completed",
    statusColor: "#22c55e",
    statusBg: "#f0fdf4",
    dueDate: "Jun 18, 2026",
    dueTime: "",
    dueColor: "#22c55e",
    questions: 18,
    duration: "20 mins",
    marks: 40,
    difficulty: "Easy",
    diffColor: "#22c55e",
    diffBg: "#f0fdf4",
    action: "View Results",
    actionColor: "#22c55e",
    score: 36,
    pct: 90,
  },
  {
    id: 6,
    title: "Node.js REST API Quiz",
    course: "Backend Development",
    mentor: "Chris Lee",
    mentorAvatar: "CL",
    avatarColor: "#7c3aed",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    iconBg: "#f3e8ff",
    status: "Missed",
    statusColor: "#ef4444",
    statusBg: "#fef2f2",
    dueDate: "Jun 10, 2026",
    dueTime: "",
    dueColor: "#ef4444",
    questions: 22,
    duration: "30 mins",
    marks: 55,
    difficulty: "Hard",
    diffColor: "#ef4444",
    diffBg: "#fef2f2",
    action: "View Details",
    actionColor: "#ef4444",
  },
];
 
const UPCOMING_SCHEDULE = [
  { title: "React Hooks Quiz",       time: "08:00 PM", date: "Today",     color: "#ef4444", bg: "#fef2f2" },
  { title: "JS Advanced Concepts",   time: "08:20 PM", date: "Tomorrow",  color: "#f97316", bg: "#fff7ed" },
  { title: "TypeScript Quiz",        time: "07:20 PM", date: "This Week", color: "#6366f1", bg: "#e0e7ff" },
  { title: "MongoDB Basics",         time: "10:00 AM", date: "Jul 02, 2026", color: "#0891b2", bg: "#e0f2fe" },
];
 
const PREV_RESULTS = [
  { title: "CSS Flexbox & Grid", course: "CSS Mastery",  score: 36, total: 40, pct: 90, grade: "A+", feedback: "Excellent work!", color: "#22c55e", date: "Jun 18, 2026" },
  { title: "HTML Fundamentals",  course: "Web Dev Pro",  score: 28, total: 40, pct: 70, grade: "B",  feedback: "Good, review more.", color: "#f97316", date: "Jun 05, 2026" },
];
 
const FILTER_TABS = ["All", "Assigned", "Upcoming", "Completed", "Missed"];
 
// ── Hero stat bubble ──────────────────────────────────────────────────────────
function HeroStat({ icon, value, label, color, iconBg, suffix = "" }) {
  const animated = useCounter(Number(value));
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box sx={{ width: 44, height: 44, borderRadius: "50%", bgcolor: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{animated}{suffix}</Typography>
        <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.2 }}>{label}</Typography>
      </Box>
    </Box>
  );
}
 
// ── Main Page ─────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAll, setShowAll] = useState(false);
 
  const filtered = QUIZ_LIST.filter(q => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return q.status === "Assigned";
    if (activeTab === 2) return q.status === "Upcoming";
    if (activeTab === 3) return q.status === "Completed";
    if (activeTab === 4) return q.status === "Missed";
    return true;
  });
 
  const displayed = showAll ? filtered : filtered.slice(0, 10);
 
  return (
    <StudentLayout>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
 
        {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
        <Box sx={{
          background: "linear-gradient(135deg, #0f0c3d 0%, #1a1065 35%, #2d1b8e 65%, #3730a3 100%)",
          borderRadius: "16px", p: 3, position: "relative", overflow: "hidden", minHeight: 168,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* bg circles */}
          <Box sx={{ position: "absolute", top: -40, right: "25%", width: 220, height: 220, borderRadius: "50%", bgcolor: "rgba(99,102,241,0.15)" }} />
          <Box sx={{ position: "absolute", bottom: -30, left: "30%", width: 140, height: 140, borderRadius: "50%", bgcolor: "rgba(139,92,246,0.12)" }} />
          {/* stars */}
          {[{t:10,l:"55%",s:3},{t:60,l:"62%",s:2},{t:25,l:"72%",s:4}].map((s,i)=>(
            <Box key={i} sx={{ position:"absolute", top:`${s.t}%`, left:s.l, width:s.s, height:s.s, borderRadius:"50%", bgcolor:"rgba(255,255,255,0.7)", animation:`twinkle ${1.5+i*0.4}s ease-in-out infinite`, "@keyframes twinkle":{"0%,100%":{opacity:0.3},"50%":{opacity:1}} }} />
          ))}
 
          {/* Left text */}
          <Box sx={{ zIndex: 1 }}>
            <Typography sx={{ color: "#a5b4fc", fontSize: 12, mb: 0.6, letterSpacing: 0.5 }}>Your Quizzes</Typography>
            <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 800, mb: 0.5 }}>Ready for your quizzes?</Typography>
            <Typography sx={{ color: "#c7d2fe", fontSize: 13, mb: 2.5 }}>Test your knowledge and track your progress.</Typography>
            <Box sx={{ display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" }}>
              <HeroStat icon={<QuizIcon sx={{ fontSize: 22, color: "#818cf8" }} />}    value={6} label="Total"     color="#818cf8" iconBg="rgba(129,140,248,0.2)" />
              <HeroStat icon={<Schedule sx={{ fontSize: 22, color: "#f97316" }} />}    value={3} label="Pending"   color="#f97316" iconBg="rgba(249,115,22,0.2)" />
              <HeroStat icon={<CheckCircle sx={{ fontSize: 22, color: "#22c55e" }} />} value={1} label="Completed" color="#22c55e" iconBg="rgba(34,197,94,0.2)" />
              <HeroStat icon={<TrendingUp sx={{ fontSize: 22, color: "#fbbf24" }} />}  value={90} label="Avg Score" color="#fbbf24" iconBg="rgba(251,191,36,0.2)" suffix="%" />
            </Box>
          </Box>
 
          {/* Right SVG */}
          <Box sx={{ zIndex: 1, flexShrink: 0, mr: 1, animation: "float 4s ease-in-out infinite", "@keyframes float":{"0%,100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-10px)"}} }}>
            <svg width="130" height="110" viewBox="0 0 130 110" fill="none">
              <rect x="20" y="10" width="90" height="90" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
              <rect x="32" y="24" width="66" height="8" rx="4" fill="rgba(255,255,255,0.3)"/>
              <rect x="32" y="38" width="50" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <rect x="32" y="50" width="58" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <rect x="32" y="62" width="44" height="6" rx="3" fill="rgba(255,255,255,0.2)"/>
              <circle cx="100" cy="30" r="18" fill="#4f46e5"/>
              <text x="100" y="36" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">✓</text>
              <circle cx="22" cy="88" r="12" fill="#22c55e" opacity="0.8"/>
              <text x="22" y="93" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">A+</text>
            </svg>
          </Box>
        </Box>
 
        {/* ── ASSIGNED QUIZZES SECTION (full width) ───────────────────────── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
 
          {/* Section header */}
          <Box sx={{ px: 2.5, pt: 2.5, pb: 0 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 17, color: "#0f172a" }}>Assigned Quizzes</Typography>
                <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.3 }}>Quizzes assigned by your mentors</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: 12, color: "#64748b" }}>Sort by: Due Date</Typography>
                <FilterList sx={{ fontSize: 16, color: "#94a3b8" }} />
              </Box>
            </Box>
 
            {/* Filter tabs */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
              {FILTER_TABS.map((t, i) => (
                <Box key={t} onClick={() => { setActiveTab(i); setShowAll(false); }} sx={{ px: 2, py: 0.6, borderRadius: "20px", cursor: "pointer", fontWeight: activeTab === i ? 700 : 500, fontSize: 13, transition: "all 0.15s", bgcolor: activeTab === i ? "#4f46e5" : "#f1f5f9", color: activeTab === i ? "#fff" : "#475569", "&:hover": { bgcolor: activeTab === i ? "#4338ca" : "#e2e8f0" } }}>
                  {t}
                </Box>
              ))}
            </Box>
 
            <Divider sx={{ mt: 2, borderColor: "#f1f5f9" }} />
          </Box>
 
          {/* Quiz rows */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {displayed.length === 0 ? (
              <Box sx={{ p: 6, textAlign: "center" }}>
                <Typography sx={{ fontSize: 36, mb: 1 }}>📋</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>No quizzes found</Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b" }}>Try a different filter tab</Typography>
              </Box>
            ) : (
              displayed.map((q, idx) => (
                <Box key={q.id}>
                  <Box sx={{ px: 2.5, py: 2, display: "flex", alignItems: "center", gap: 2.5, transition: "all 0.18s", "&:hover": { bgcolor: "#f8fafc" } }}>
 
                    {/* Course icon */}
                    <Box sx={{ width: 52, height: 52, borderRadius: "12px", bgcolor: q.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <Box component="img" src={q.icon} alt={q.title} sx={{ width: 32, height: 32, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                    </Box>
 
                    {/* Title + course + mentor */}
                    <Box sx={{ width: 220, flexShrink: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{q.title}</Typography>
                        <Chip label={q.status} size="small" sx={{ fontSize: 10, fontWeight: 700, bgcolor: q.statusBg, color: q.statusColor, height: 20, borderRadius: "6px", flexShrink: 0 }} />
                      </Box>
                      <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 0.5 }}>{q.course}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Avatar sx={{ bgcolor: q.avatarColor, width: 16, height: 16, fontSize: 8, fontWeight: 700 }}>{q.mentorAvatar[0]}</Avatar>
                        <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>Mentor: {q.mentor}</Typography>
                      </Box>
                    </Box>
 
                    {/* Meta: questions, duration, marks */}
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <QuizIcon sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography sx={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{q.questions} Questions</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <Timer sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography sx={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{q.duration}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <BarChart sx={{ fontSize: 14, color: "#94a3b8" }} />
                        <Typography sx={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{q.marks} Marks</Typography>
                      </Box>
                      <Chip label={q.difficulty} size="small" sx={{ fontSize: 10.5, fontWeight: 700, bgcolor: q.diffBg, color: q.diffColor, height: 22, borderRadius: "6px" }} />
                      {q.status === "Completed" && q.pct && (
                        <Chip label={`Score: ${q.pct}%`} size="small" sx={{ fontSize: 10.5, fontWeight: 700, bgcolor: "#f0fdf4", color: "#22c55e", height: 22, borderRadius: "6px" }} />
                      )}
                    </Box>
 
                    {/* Due date */}
                    <Box sx={{ textAlign: "right", flexShrink: 0, minWidth: 110 }}>
                      <Typography sx={{ fontSize: 10.5, color: "#94a3b8" }}>
                        {q.status === "Completed" ? "Completed on" : q.status === "Upcoming" ? "Starts:" : "Due:"}
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: q.dueColor }}>{q.dueDate}</Typography>
                      {q.dueTime && <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: q.dueColor }}>{q.dueTime}</Typography>}
                    </Box>
 
                    {/* Action button */}
                    <Button
                      variant={q.status === "Assigned" ? "contained" : "outlined"}
                      size="small"
                      startIcon={q.action === "Start Quiz" ? <PlayArrow sx={{ fontSize: 14 }} /> : <Visibility sx={{ fontSize: 14 }} />}
                      sx={{
                        textTransform: "none", fontWeight: 700, fontSize: 12.5, borderRadius: "9px",
                        px: 2.2, py: 0.8, whiteSpace: "nowrap", flexShrink: 0,
                        bgcolor: q.status === "Assigned" ? q.actionColor : "transparent",
                        color: q.status === "Assigned" ? "#fff" : q.actionColor,
                        borderColor: q.actionColor,
                        "&:hover": { filter: "brightness(0.9)", bgcolor: q.status === "Assigned" ? q.actionColor : `${q.actionColor}15` },
                      }}
                    >
                      {q.action}
                    </Button>
                  </Box>
                  {idx < displayed.length - 1 && <Divider sx={{ borderColor: "#f1f5f9", mx: 2.5 }} />}
                </Box>
              ))
            )}
 
            {/* Load more */}
            {filtered.length > 10 && (
              <Box sx={{ textAlign: "center", py: 2, borderTop: "1px solid #f1f5f9" }}>
                <Button onClick={() => setShowAll(!showAll)} endIcon={<FilterList sx={{ transform: showAll ? "rotate(180deg)" : "none", transition: "0.3s" }} />}
                  sx={{ textTransform: "none", color: "#4f46e5", fontWeight: 600, fontSize: 13, border: "1px solid #e0e7ff", borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#eff6ff" } }}>
                  {showAll ? "Show Less" : "Load More"}
                </Button>
              </Box>
            )}
          </Box>
        </Box>
 
        {/* ── UPCOMING SCHEDULE (full width, horizontal cards) ────────────── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarToday sx={{ fontSize: 17, color: "#6366f1" }} />
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Upcoming Schedule</Typography>
            </Box>
            <Typography sx={{ fontSize: 12.5, color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>View Calendar</Typography>
          </Box>
          <Divider sx={{ borderColor: "#f1f5f9" }} />
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {UPCOMING_SCHEDULE.map((s, i) => (
              <Box key={i} sx={{ p: 2, borderRight: i < UPCOMING_SCHEDULE.length - 1 ? "1px solid #f1f5f9" : "none", cursor: "pointer", transition: "all 0.15s", "&:hover": { bgcolor: "#f8fafc" } }}>
                <Box sx={{ display: "inline-block", bgcolor: s.bg, borderRadius: "6px", px: 1, py: 0.3, mb: 1 }}>
                  <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: s.color }}>{s.date}</Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mb: 0.5, lineHeight: 1.3 }}>{s.title}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 12, color: "#94a3b8" }} />
                  <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>{s.time}</Typography>
                </Box>
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.6 }}>
                  <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: s.color }} />
                  <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: s.color }}>Quiz</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
 
        {/* ── PERFORMANCE OVERVIEW (full width, 3 cols) ───────────────────── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BarChart sx={{ fontSize: 18, color: "#6366f1" }} />
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Performance Overview</Typography>
            </Box>
            {/* Best performance badge */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, bgcolor: "#1e2d5a", borderRadius: "10px", px: 2, py: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 10.5, color: "#a5b4fc" }}>🏆 Best Performance</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>CSS Flexbox & Grid Quiz</Typography>
                <Typography sx={{ fontSize: 10.5, color: "#94a3b8" }}>36/40 marks · Jun 18, 2026</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Star sx={{ fontSize: 16, color: "#fbbf24" }} />
                <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>90%</Typography>
                <Chip label="A+" size="small" sx={{ fontSize: 11, fontWeight: 800, bgcolor: "#22c55e", color: "#fff", height: 22 }} />
              </Box>
            </Box>
          </Box>
 
          {/* 3-col progress bars */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
            {[
              { label: "Average Score",        pct: 90, color: "#22c55e", sub: "Across all quizzes" },
              { label: "Completion Rate",       pct: 60, color: "#4f46e5", sub: "Quizzes completed" },
              { label: "On-time Submission",    pct: 75, color: "#f97316", sub: "Submitted before due" },
            ].map((p) => (
              <Box key={p.label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, color: "#0f172a", fontWeight: 700 }}>{p.label}</Typography>
                    <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>{p.sub}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 22, fontWeight: 800, color: p.color }}>{p.pct}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={p.pct} sx={{ height: 10, borderRadius: 5, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: p.color, borderRadius: 5 } }} />
              </Box>
            ))}
          </Box>
        </Box>
 
        {/* ── PREVIOUS RESULTS (full width) ────────────────────────────────── */}
        <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", p: 2.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <EmojiEvents sx={{ fontSize: 18, color: "#6366f1" }} />
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Previous Quiz Results</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: "#6366f1", fontWeight: 600, cursor: "pointer" }}>View All</Typography>
          </Box>
 
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {PREV_RESULTS.map((r, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, borderRadius: "12px", bgcolor: "#f8fafc", border: "1px solid #f1f5f9", transition: "all 0.2s", "&:hover": { bgcolor: "#f0f4ff", borderColor: "#e0e7ff", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }, cursor: "pointer" }}>
                <Box sx={{ width: 54, height: 54, borderRadius: "12px", bgcolor: `${r.color}18`, border: `2px solid ${r.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 900, color: r.color }}>{r.grade}</Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.3 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{r.title}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: r.color }}>{r.score}/{r.total}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11.5, color: "#64748b", mb: 0.8 }}>{r.course} · {r.date}</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <LinearProgress variant="determinate" value={r.pct} sx={{ flex: 1, height: 7, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: r.color, borderRadius: 4 } }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: r.color, flexShrink: 0 }}>{r.pct}%</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "#64748b", mt: 0.6, fontStyle: "italic" }}>💬 {r.feedback}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
 
      </Box>
    </StudentLayout>
  );
}