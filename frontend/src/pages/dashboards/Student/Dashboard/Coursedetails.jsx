import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentLayout from "../Components/StudentLayout";
import {
  Box, Typography, Button, Chip, Divider, Tab, Tabs,
  LinearProgress, Avatar, IconButton,
} from "@mui/material";
import {
  Star, Group, AccessTime, EmojiEvents, PlayArrow,
  Favorite, FavoriteBorder, CheckCircle, ExpandMore,
  ExpandLess, OndemandVideo, Download, PhoneAndroid,
  VerifiedUser, Replay, Videocam, Code, Forum,
  Facebook, Twitter, LinkedIn, Link as LinkIcon,
  ArrowBack, ArrowForward,
} from "@mui/icons-material";
 
// ── Course data keyed by id ──────────────────────────────────────────────────
const COURSE_DB = {
  1: {
    id: 1,
    title: "React.js – The Complete Guide\nfor Beginners to Advanced",
    shortTitle: "Web Dev Pro",
    tagLabel: "Web Development",
    tagColor: "#4f46e5",
    description: "Learn React from scratch and build real-world web applications. Covers hooks, context API, React Router, state management, and modern best practices.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    heroIcon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    price: 499,
    originalPrice: 1999,
    discount: 75,
    rating: 4.8,
    reviews: 2400,
    students: 12542,
    hours: 18,
    lectures: 85,
    sections: 18,
    instructor: { name: "John Smith", title: "Senior Frontend Developer", avatar: "JS", color: "#4f46e5" },
    whatYouLearn: [
      "React fundamentals and core concepts",
      "Components, Props, and State",
      "Hooks (useState, useEffect, useContext)",
      "React Router for navigation",
      "Context API and State Management",
      "Build real-world projects",
    ],
    curriculum: [
      { title: "Introduction to React", lectures: 6, duration: "1h 15m" },
      { title: "React Components", lectures: 8, duration: "2h 10m" },
      { title: "State and Props", lectures: 7, duration: "1h 45m" },
      { title: "React Hooks", lectures: 10, duration: "2h 30m" },
      { title: "React Router", lectures: 6, duration: "1h 20m" },
      { title: "Context API", lectures: 5, duration: "1h 10m" },
      { title: "Final Project", lectures: 12, duration: "3h 00m" },
    ],
    includes: [
      { icon: <OndemandVideo />, text: "18 Hours on-demand video" },
      { icon: <Download />, text: "Downloadable resources" },
      { icon: <Code />, text: "Practice exercises" },
      { icon: <Code />, text: "Code examples" },
      { icon: <PhoneAndroid />, text: "Access on mobile and TV" },
      { icon: <VerifiedUser />, text: "Certificate of completion" },
      { icon: <Replay />, text: "30-day money-back guarantee" },
    ],
    thisIncludes: [
      { icon: <Videocam />, text: "HD video content" },
      { icon: <Download />, text: "Downloadable resources" },
      { icon: <Code />, text: "Practice exercises" },
      { icon: <Code />, text: "Code examples" },
      { icon: <Forum />, text: "Community support" },
    ],
  },
  2: {
    id: 2,
    title: "Data Science Bootcamp\nFrom Zero to Hero",
    shortTitle: "Data Science Bootcamp",
    tagLabel: "Data Science",
    tagColor: "#0891b2",
    description: "Master data science with Python, Pandas, NumPy, and machine learning. Build real projects and earn a professional certificate.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    heroIcon: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Pandas_logo.svg",
    price: 699,
    originalPrice: 2499,
    discount: 72,
    rating: 4.6,
    reviews: 1800,
    students: 9800,
    hours: 32,
    lectures: 120,
    sections: 22,
    instructor: { name: "Sarah Kim", title: "Senior Data Scientist", avatar: "SK", color: "#0891b2" },
    whatYouLearn: [
      "Python for data science",
      "Pandas and NumPy mastery",
      "Data visualization with Matplotlib",
      "Machine learning algorithms",
      "Statistical analysis",
      "Real-world data projects",
    ],
    curriculum: [
      { title: "Python Basics", lectures: 8, duration: "2h 00m" },
      { title: "NumPy & Pandas", lectures: 12, duration: "3h 20m" },
      { title: "Data Visualization", lectures: 10, duration: "2h 45m" },
      { title: "Machine Learning", lectures: 15, duration: "4h 10m" },
      { title: "Deep Learning", lectures: 10, duration: "3h 00m" },
      { title: "Capstone Project", lectures: 8, duration: "2h 30m" },
    ],
    includes: [
      { icon: <OndemandVideo />, text: "32 Hours on-demand video" },
      { icon: <Download />, text: "Downloadable datasets" },
      { icon: <Code />, text: "Jupyter notebooks" },
      { icon: <PhoneAndroid />, text: "Access on mobile and TV" },
      { icon: <VerifiedUser />, text: "Certificate of completion" },
      { icon: <Replay />, text: "30-day money-back guarantee" },
    ],
    thisIncludes: [
      { icon: <Videocam />, text: "HD video content" },
      { icon: <Download />, text: "Downloadable resources" },
      { icon: <Code />, text: "Practice notebooks" },
      { icon: <Forum />, text: "Community support" },
    ],
  },
  3: {
    id: 3,
    title: "UI/UX Fundamentals\nDesign Like a Pro",
    shortTitle: "UI/UX Fundamentals",
    tagLabel: "Design",
    tagColor: "#7c3aed",
    description: "Learn UI/UX design from scratch. Master Figma, design systems, prototyping, user research, and modern design principles.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    heroIcon: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    price: 399,
    originalPrice: 1599,
    discount: 75,
    rating: 4.9,
    reviews: 3100,
    students: 15200,
    hours: 18,
    lectures: 72,
    sections: 14,
    instructor: { name: "Maria Garcia", title: "Lead UX Designer", avatar: "MG", color: "#7c3aed" },
    whatYouLearn: [
      "Design thinking process",
      "Figma from beginner to advanced",
      "User research and personas",
      "Wireframing and prototyping",
      "Design systems and components",
      "Responsive and mobile-first design",
    ],
    curriculum: [
      { title: "Design Fundamentals", lectures: 6, duration: "1h 30m" },
      { title: "Figma Basics", lectures: 10, duration: "2h 45m" },
      { title: "User Research", lectures: 7, duration: "1h 50m" },
      { title: "Wireframing", lectures: 8, duration: "2h 00m" },
      { title: "Prototyping", lectures: 9, duration: "2h 20m" },
      { title: "Design Systems", lectures: 7, duration: "1h 45m" },
    ],
    includes: [
      { icon: <OndemandVideo />, text: "18 Hours on-demand video" },
      { icon: <Download />, text: "Figma templates" },
      { icon: <Code />, text: "Design assets" },
      { icon: <PhoneAndroid />, text: "Access on mobile and TV" },
      { icon: <VerifiedUser />, text: "Certificate of completion" },
      { icon: <Replay />, text: "30-day money-back guarantee" },
    ],
    thisIncludes: [
      { icon: <Videocam />, text: "HD video content" },
      { icon: <Download />, text: "Downloadable templates" },
      { icon: <Code />, text: "Design exercises" },
      { icon: <Forum />, text: "Community support" },
    ],
  },
  4: {
    id: 4,
    title: "React & TypeScript Mastery\nBuild Production Apps",
    shortTitle: "React & TypeScript Mastery",
    tagLabel: "Web Development",
    tagColor: "#4f46e5",
    description: "Take your React skills to the next level with TypeScript. Build scalable, type-safe production applications with modern tooling.",
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&q=80",
    heroIcon: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    price: 599,
    originalPrice: 2199,
    discount: 73,
    rating: 4.7,
    reviews: 2100,
    students: 8900,
    hours: 28,
    lectures: 95,
    sections: 16,
    instructor: { name: "David Chen", title: "Full-Stack Engineer", avatar: "DC", color: "#6366f1" },
    whatYouLearn: [
      "TypeScript fundamentals",
      "React with TypeScript",
      "Generic types and interfaces",
      "State management with Redux Toolkit",
      "Testing with Jest and RTL",
      "Build and deploy production apps",
    ],
    curriculum: [
      { title: "TypeScript Basics", lectures: 8, duration: "2h 00m" },
      { title: "React + TS Setup", lectures: 6, duration: "1h 30m" },
      { title: "Components & Types", lectures: 10, duration: "2h 45m" },
      { title: "State Management", lectures: 12, duration: "3h 10m" },
      { title: "Testing", lectures: 8, duration: "2h 00m" },
      { title: "Production Build", lectures: 7, duration: "1h 50m" },
    ],
    includes: [
      { icon: <OndemandVideo />, text: "28 Hours on-demand video" },
      { icon: <Download />, text: "Starter templates" },
      { icon: <Code />, text: "Practice projects" },
      { icon: <PhoneAndroid />, text: "Access on mobile and TV" },
      { icon: <VerifiedUser />, text: "Certificate of completion" },
      { icon: <Replay />, text: "30-day money-back guarantee" },
    ],
    thisIncludes: [
      { icon: <Videocam />, text: "HD video content" },
      { icon: <Download />, text: "Downloadable resources" },
      { icon: <Code />, text: "Code examples" },
      { icon: <Forum />, text: "Community support" },
    ],
  },
};
 
const RECOMMENDED = [
  { title: "Advanced React Patterns & Performance", provider: "Meta", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png", image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80", type: "Professional Certificate", rating: 4.9, badge: "Bestseller", badgeBg: "#fef9c3", badgeColor: "#854d0e", students: "12K", hours: "30 hrs" },
  { title: "Node.js & Express: Full Backend Development", provider: "Coursera", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&q=80", type: "Course", rating: 4.7, badge: "New", badgeBg: "#dcfce7", badgeColor: "#15803d", students: "8K", hours: "24 hrs" },
  { title: "GraphQL API Design with Apollo", provider: "Udemy", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80", type: "Course", rating: 4.6, badge: "Free Trial", badgeBg: "#f3e8ff", badgeColor: "#7c3aed", students: "6K", hours: "18 hrs" },
  { title: "DevOps & CI/CD for Web Developers", provider: "Google", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=80", type: "Guided Project", rating: 4.8, badge: "Free", badgeBg: "#dbeafe", badgeColor: "#1d4ed8", students: "15K", hours: "20 hrs" },
];
 
// ── countdown timer ───────────────────────────────────────────────────────────
function useCountdown() {
  const [time, setTime] = useState({ d: 2, h: 23, m: 45, s: 10 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) return prev;
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}
 
function CountBox({ value, label }) {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box sx={{ bgcolor: "#0f172a", borderRadius: "8px", px: 1.5, py: 1, minWidth: 44 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
          {String(value).padStart(2, "0")}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 10, color: "#94a3b8", mt: 0.5 }}>{label}</Typography>
    </Box>
  );
}
 
export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = COURSE_DB[Number(id)] || COURSE_DB[1];
  const [activeTab, setActiveTab] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const countdown = useCountdown();
 
  return (
    <StudentLayout>
      <Box sx={{ p: 3 }}>
 
        {/* ── HERO SECTION ── */}
        <Box sx={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)",
          borderRadius: "16px", p: 3, mb: 3, position: "relative", overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 220,
        }}>
          {/* bg decoration */}
          <Box sx={{ position: "absolute", top: -40, right: "38%", width: 200, height: 200, borderRadius: "50%", bgcolor: "rgba(99,102,241,0.15)" }} />
          <Box sx={{ position: "absolute", bottom: -30, right: "45%", width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(139,92,246,0.1)" }} />
 
          <Box sx={{ zIndex: 1, maxWidth: "58%" }}>
            {/* Tag */}
            <Chip label={course.tagLabel} size="small" sx={{ bgcolor: course.tagColor, color: "#fff", fontSize: 11, fontWeight: 700, mb: 1.5, borderRadius: "6px" }} />
 
            {/* Title */}
            <Typography sx={{ color: "#fff", fontSize: 24, fontWeight: 800, lineHeight: 1.3, mb: 1.2, whiteSpace: "pre-line" }}>
              {course.title}
            </Typography>
 
            {/* Description */}
            <Typography sx={{ color: "#c7d2fe", fontSize: 13, lineHeight: 1.7, mb: 2 }}>
              {course.description}
            </Typography>
 
            {/* Stats row */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 2.5 }}>
              {[
                { icon: <Star sx={{ fontSize: 14, color: "#fbbf24" }} />, text: `${course.rating}`, sub: `(${(course.reviews/1000).toFixed(1)}k reviews)` },
                { icon: <Group sx={{ fontSize: 14, color: "#a5b4fc" }} />, text: course.students.toLocaleString(), sub: "Students Enrolled" },
                { icon: <AccessTime sx={{ fontSize: 14, color: "#a5b4fc" }} />, text: `${course.hours} Hours`, sub: "Total Duration" },
                { icon: <EmojiEvents sx={{ fontSize: 14, color: "#a5b4fc" }} />, text: "Certificate", sub: "Completion" },
              ].map((s, i) => (
                <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {s.icon}
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.text}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 10.5, color: "#94a3b8" }}>{s.sub}</Typography>
                </Box>
              ))}
            </Box>
 
            {/* Instructor */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: course.instructor.color, width: 36, height: 36, fontSize: 13, fontWeight: 700 }}>
                {course.instructor.avatar}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 10.5, color: "#94a3b8" }}>Instructor</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{course.instructor.name}</Typography>
                <Typography sx={{ fontSize: 11, color: "#a5b4fc" }}>{course.instructor.title}</Typography>
              </Box>
              <Button variant="outlined" startIcon={<PlayArrow />} sx={{ ml: 3, color: "#fff", borderColor: "rgba(255,255,255,0.4)", textTransform: "none", fontWeight: 600, fontSize: 12.5, borderRadius: "9px", px: 2, "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "#fff" } }}>
                Preview Course
              </Button>
            </Box>
          </Box>
 
          {/* Hero icon */}
          <Box sx={{ zIndex: 1, flexShrink: 0, mr: 2 }}>
            <Box sx={{
              width: 160, height: 160, borderRadius: "20px",
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(10px)",
              animation: "float 4s ease-in-out infinite",
              "@keyframes float": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
            }}>
              <Box component="img" src={course.heroIcon} alt={course.shortTitle} sx={{ width: 110, height: 110, objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
            </Box>
            {/* Wishlist button */}
            <Box sx={{ position: "absolute", top: 16, right: 16 }}>
              <IconButton onClick={() => setWishlist(!wishlist)} sx={{ bgcolor: "rgba(255,255,255,0.9)", width: 36, height: 36, "&:hover": { bgcolor: "#fff" } }}>
                {wishlist ? <Favorite sx={{ fontSize: 18, color: "#ef4444" }} /> : <FavoriteBorder sx={{ fontSize: 18, color: "#475569" }} />}
              </IconButton>
            </Box>
          </Box>
        </Box>
 
        {/* ── MAIN CONTENT + RIGHT SIDEBAR ── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 3 }}>
 
          {/* ── LEFT: Tabs content ── */}
          <Box>
            {/* Tabs */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", mb: 3, overflow: "hidden" }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: "1px solid #e2e8f0", px: 2, "& .MuiTab-root": { textTransform: "none", fontSize: 13.5, fontWeight: 500, minHeight: 48, color: "#64748b", px: 2 }, "& .Mui-selected": { color: "#4f46e5", fontWeight: 700 }, "& .MuiTabs-indicator": { bgcolor: "#4f46e5", height: 3 } }}>
                {["Overview", "Curriculum", "Instructor", "Reviews (2.4k)", "FAQ"].map(t => <Tab key={t} label={t} />)}
              </Tabs>
 
              <Box sx={{ p: 3 }}>
                {/* OVERVIEW TAB */}
                {activeTab === 0 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 1 }}>About this course</Typography>
                    <Typography sx={{ fontSize: 13.5, color: "#475569", lineHeight: 1.8, mb: 3 }}>
                      This comprehensive {course.shortTitle} course is designed to take you from beginner to advanced level. You'll learn core concepts, modern patterns, and build multiple projects that you can add to your portfolio.
                    </Typography>
 
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 1.5 }}>What you'll learn</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.2, mb: 3 }}>
                      {course.whatYouLearn.map((item, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                          <CheckCircle sx={{ fontSize: 16, color: "#4f46e5", mt: 0.2, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: 12.5, color: "#334155" }}>{item}</Typography>
                        </Box>
                      ))}
                    </Box>
 
                    {/* Curriculum preview */}
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 0.5 }}>Course Curriculum</Typography>
                    <Typography sx={{ fontSize: 12.5, color: "#64748b", mb: 1.5 }}>
                      {course.sections} Sections • {course.lectures} Lectures • {course.hours}h total
                    </Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                      {course.curriculum.map((sec, i) => (
                        <Box key={i}>
                          <Box onClick={() => setExpandedSection(expandedSection === i ? null : i)} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.8, cursor: "pointer", "&:hover": { bgcolor: "#f8fafc" }, bgcolor: expandedSection === i ? "#f0f4ff" : "#fff" }}>
                            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{i + 1}. {sec.title}</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                              <Typography sx={{ fontSize: 12, color: "#64748b" }}>{sec.lectures} Lectures • {sec.duration}</Typography>
                              {expandedSection === i ? <ExpandLess sx={{ fontSize: 18, color: "#64748b" }} /> : <ExpandMore sx={{ fontSize: 18, color: "#64748b" }} />}
                            </Box>
                          </Box>
                          {expandedSection === i && (
                            <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 1.5, borderTop: "1px solid #f1f5f9" }}>
                              {Array.from({ length: Math.min(sec.lectures, 3) }).map((_, j) => (
                                <Box key={j} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.8 }}>
                                  <PlayArrow sx={{ fontSize: 14, color: "#4f46e5" }} />
                                  <Typography sx={{ fontSize: 12.5, color: "#475569" }}>Lecture {j + 1}: {sec.title} – Part {j + 1}</Typography>
                                  <Typography sx={{ fontSize: 11, color: "#94a3b8", ml: "auto" }}>12:00</Typography>
                                </Box>
                              ))}
                            </Box>
                          )}
                          {i < course.curriculum.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
 
                {/* CURRICULUM TAB */}
                {activeTab === 1 && (
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 2 }}>Full Curriculum</Typography>
                    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                      {course.curriculum.map((sec, i) => (
                        <Box key={i}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", px: 2.5, py: 2, bgcolor: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{i + 1}. {sec.title}</Typography>
                            <Typography sx={{ fontSize: 12, color: "#64748b" }}>{sec.lectures} Lectures • {sec.duration}</Typography>
                          </Box>
                          {i < course.curriculum.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
 
                {/* INSTRUCTOR TAB */}
                {activeTab === 2 && (
                  <Box>
                    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: course.instructor.color, width: 72, height: 72, fontSize: 24, fontWeight: 700 }}>{course.instructor.avatar}</Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{course.instructor.name}</Typography>
                        <Typography sx={{ fontSize: 13, color: "#64748b" }}>{course.instructor.title}</Typography>
                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Star sx={{ fontSize: 14, color: "#fbbf24" }} /><Typography sx={{ fontSize: 12 }}>{course.rating} Rating</Typography></Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}><Group sx={{ fontSize: 14, color: "#94a3b8" }} /><Typography sx={{ fontSize: 12 }}>{course.students.toLocaleString()} Students</Typography></Box>
                        </Box>
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 13.5, color: "#475569", lineHeight: 1.8 }}>
                      {course.instructor.name} is an experienced {course.instructor.title} with over 10 years in the industry. They have taught thousands of students worldwide and are passionate about making complex concepts accessible to everyone.
                    </Typography>
                  </Box>
                )}
 
                {/* REVIEWS TAB */}
                {activeTab === 3 && (
                  <Box>
                    <Box sx={{ display: "flex", gap: 4, mb: 3, alignItems: "center" }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontSize: 48, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{course.rating}</Typography>
                        <Box sx={{ display: "flex", gap: 0.3, justifyContent: "center", my: 0.5 }}>
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} sx={{ fontSize: 18, color: i < Math.floor(course.rating) ? "#fbbf24" : "#e2e8f0" }} />)}
                        </Box>
                        <Typography sx={{ fontSize: 12, color: "#64748b" }}>Course Rating</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map(s => (
                          <Box key={s} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <LinearProgress variant="determinate" value={s === 5 ? 70 : s === 4 ? 20 : 6} sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: "#fbbf24", borderRadius: 4 } }} />
                            <Box sx={{ display: "flex", gap: 0.3 }}>{Array.from({ length: s }).map((_, i) => <Star key={i} sx={{ fontSize: 11, color: "#fbbf24" }} />)}</Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 13.5, color: "#64748b" }}>Showing top reviews from {(course.reviews / 1000).toFixed(1)}k students</Typography>
                  </Box>
                )}
 
                {/* FAQ TAB */}
                {activeTab === 4 && (
                  <Box>
                    {["Is this course for beginners?", "What are the prerequisites?", "How long do I have access?", "Is there a certificate?"].map((q, i) => (
                      <Box key={i} sx={{ mb: 2, p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #f1f5f9" }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a", mb: 0.5 }}>Q: {q}</Typography>
                        <Typography sx={{ fontSize: 13, color: "#64748b" }}>A: Yes! This course is designed for all skill levels. Whether you're a complete beginner or have some experience, you'll find valuable content here.</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
 
            {/* Recommended section */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: 17, color: "#0f172a" }}>Recommended For You</Typography>
                  <Typography sx={{ fontSize: 12.5, color: "#64748b", mt: 0.3 }}>Based on your Web Development journey</Typography>
                </Box>
                <Button endIcon={<ArrowForward />} sx={{ textTransform: "none", color: "#2563eb", fontWeight: 600, fontSize: 13, border: "1px solid #bfdbfe", borderRadius: "10px", px: 2, "&:hover": { bgcolor: "#eff6ff" } }}>Show More</Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2 }}>
                {RECOMMENDED.map((r, i) => (
                  <Box key={i} sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", transition: "all 0.22s", cursor: "pointer", "&:hover": { boxShadow: "0 8px 28px rgba(0,0,0,0.10)", transform: "translateY(-3px)" } }}>
                    <Box sx={{ position: "relative", height: 110, overflow: "hidden" }}>
                      <Box component="img" src={r.image} alt={r.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <Box sx={{ position: "absolute", top: 8, right: 8, bgcolor: r.badgeBg, borderRadius: "20px", px: 1.2, py: 0.3 }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: r.badgeColor }}>{r.badge}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.8 }}>
                        <Box sx={{ width: 18, height: 18, borderRadius: "3px", overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0 }}>
                          <Box component="img" src={r.providerLogo} alt={r.provider} sx={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                        </Box>
                        <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "#64748b" }}>{r.provider}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, mb: 0.8, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.title}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 1 }}>
                        <Typography sx={{ fontSize: 10.5, color: "#64748b" }}>{r.type}</Typography>
                        <Typography sx={{ fontSize: 10, color: "#94a3b8" }}>·</Typography>
                        <Star sx={{ fontSize: 12, color: "#f59e0b" }} />
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>{r.rating}</Typography>
                      </Box>
                      <Button fullWidth variant="outlined" sx={{ textTransform: "none", fontSize: 11.5, fontWeight: 600, borderColor: "#e2e8f0", color: "#4f46e5", borderRadius: "8px", py: 0.6, "&:hover": { bgcolor: "#eff6ff", borderColor: "#4f46e5" } }}>Enroll Now</Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
 
          {/* ── RIGHT SIDEBAR ── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
 
            {/* Price card */}
            <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", p: 2.5, position: "sticky", top: 16 }}>
 
              {/* Price */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>₹{course.price}</Typography>
                <Typography sx={{ fontSize: 16, color: "#94a3b8", textDecoration: "line-through" }}>₹{course.originalPrice}</Typography>
                <Chip label={`${course.discount}% OFF`} size="small" sx={{ bgcolor: "#fef9c3", color: "#854d0e", fontSize: 11, fontWeight: 800 }} />
              </Box>
              <Typography sx={{ fontSize: 12, color: "#ef4444", fontWeight: 500, mb: 1.5 }}>⏰ Limited time offer! Deal ends in</Typography>
 
              {/* Countdown */}
              <Box sx={{ display: "flex", gap: 1.5, mb: 2.5, alignItems: "flex-start" }}>
                <CountBox value={countdown.d} label="Days" />
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", mt: 0.5 }}>:</Typography>
                <CountBox value={countdown.h} label="Hours" />
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", mt: 0.5 }}>:</Typography>
                <CountBox value={countdown.m} label="Mins" />
                <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", mt: 0.5 }}>:</Typography>
                <CountBox value={countdown.s} label="Secs" />
              </Box>
 
              {/* CTA buttons */}
              <Button fullWidth variant="contained" startIcon={<EmojiEvents />} sx={{ bgcolor: "#4f46e5", textTransform: "none", fontWeight: 700, fontSize: 14, borderRadius: "10px", py: 1.3, mb: 1.2, "&:hover": { bgcolor: "#4338ca" } }}>
                Enroll Now
              </Button>
              <Button fullWidth variant="outlined" startIcon={<FavoriteBorder />} sx={{ borderColor: "#e2e8f0", color: "#475569", textTransform: "none", fontWeight: 600, fontSize: 13.5, borderRadius: "10px", py: 1.1, "&:hover": { bgcolor: "#f8fafc" } }}>
                Add to Wishlist
              </Button>
 
              <Divider sx={{ my: 2 }} />
 
              {/* Course includes */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {course.includes.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box sx={{ color: "#64748b", display: "flex", "& svg": { fontSize: 16 } }}>{item.icon}</Box>
                    <Typography sx={{ fontSize: 12.5, color: "#475569" }}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
 
              <Divider sx={{ my: 2 }} />
 
              {/* This course includes */}
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a", mb: 1.2 }}>This course includes:</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {course.thisIncludes.map((item, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box sx={{ color: "#4f46e5", display: "flex", "& svg": { fontSize: 15 } }}>{item.icon}</Box>
                    <Typography sx={{ fontSize: 12.5, color: "#475569" }}>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
 
              <Divider sx={{ my: 2 }} />
 
              {/* Share */}
              <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0f172a", mb: 1.2 }}>Share this course</Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {[
                  { icon: <Facebook />, color: "#1877f2", bg: "#e7f3ff" },
                  { icon: <Twitter />, color: "#1da1f2", bg: "#e8f5fe" },
                  { icon: <LinkedIn />, color: "#0a66c2", bg: "#e8f0f9" },
                  { icon: <LinkIcon />, color: "#475569", bg: "#f1f5f9" },
                ].map((s, i) => (
                  <IconButton key={i} size="small" sx={{ bgcolor: s.bg, color: s.color, width: 34, height: 34, "&:hover": { filter: "brightness(0.92)" } }}>
                    {React.cloneElement(s.icon, { sx: { fontSize: 16 } })}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </StudentLayout>
  );
}