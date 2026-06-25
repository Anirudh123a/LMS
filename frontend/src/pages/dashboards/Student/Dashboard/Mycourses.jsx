import React, { useState } from "react";
import StudentLayout from "../Components/StudentLayout";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, LinearProgress, Button, Divider,
  Tab, Tabs, IconButton, InputBase, MenuItem, Select,
  Collapse, Slider, Chip,
} from "@mui/material";
import {
  PlayArrow, AccessTime, Group, Star, 
  Bookmark, BookmarkBorder, CheckCircle, Search,
  KeyboardArrowDown, FilterList, Close, TuneRounded,
  BookmarkBorderOutlined, AutoAwesome,
} from "@mui/icons-material";
 
// ── Data ─────────────────────────────────────────────────────────────────────
const MY_COURSES = [
  { id: 1, name: "Web Dev Pro", instructor: "Alex Johnson", tag: "WEB DEVELOPMENT", tagColor: "#4f46e5", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80", pct: 100, students: 340, hours: "24 hrs", rating: 4.8, lastAccessed: "2 hours ago", status: "Completed", statusColor: "#22c55e", modules: 12, completedModules: 12, level: "Beginner", topic: "Web Development" },
  { id: 2, name: "Data Science Bootcamp", instructor: "Sarah Kim", tag: "DATA SCIENCE", tagColor: "#0891b2", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", pct: 42, students: 280, hours: "32 hrs", rating: 4.6, lastAccessed: "Yesterday", status: "In Progress", statusColor: "#f97316", modules: 16, completedModules: 7, level: "Intermediate", topic: "Data Science & AI" },
  { id: 3, name: "UI/UX Fundamentals", instructor: "Maria Garcia", tag: "DESIGN", tagColor: "#7c3aed", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80", pct: 89, students: 210, hours: "18 hrs", rating: 4.9, lastAccessed: "3 days ago", status: "Almost Done", statusColor: "#22c55e", modules: 10, completedModules: 9, level: "Beginner", topic: "UI/UX Design" },
  { id: 4, name: "React & TypeScript Mastery", instructor: "David Chen", tag: "WEB DEVELOPMENT", tagColor: "#4f46e5", image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=600&q=80", pct: 15, students: 520, hours: "28 hrs", rating: 4.7, lastAccessed: "1 week ago", status: "Just Started", statusColor: "#6366f1", modules: 14, completedModules: 2, level: "Advanced", topic: "Web Development" },
];
 
const SUGGESTED_ALL = [
  { courseId: 1, title: "Advanced React Patterns & Performance", provider: "Meta", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png", image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&q=80", type: "Professional Certificate", rating: 4.9, students: "12K", hours: "30 hrs", badge: "Bestseller", badgeBg: "#fef9c3", badgeColor: "#854d0e" },
  { courseId: 2, title: "Node.js & Express: Full Backend Development", provider: "Coursera", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg", image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&q=80", type: "Course", rating: 4.7, students: "8K", hours: "24 hrs", badge: "New", badgeBg: "#dcfce7", badgeColor: "#15803d" },
  { courseId: 3, title: "GraphQL API Design with Apollo", provider: "Udemy", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=80", type: "Course", rating: 4.6, students: "6K", hours: "18 hrs", badge: "Free Trial", badgeBg: "#f3e8ff", badgeColor: "#7c3aed" },
  { courseId: 4, title: "DevOps & CI/CD for Web Developers", provider: "Google", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&q=80", type: "Guided Project", rating: 4.8, students: "15K", hours: "20 hrs", badge: "Free", badgeBg: "#dbeafe", badgeColor: "#1d4ed8" },
  { courseId: 1, title: "TypeScript Mastery: Basics to Advanced", provider: "Udemy", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Udemy_logo.svg", image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=400&q=80", type: "Course", rating: 4.7, students: "9K", hours: "22 hrs", badge: "Hot", badgeBg: "#fee2e2", badgeColor: "#dc2626" },
  { courseId: 2, title: "Full-Stack with Next.js & Prisma", provider: "Coursera", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80", type: "Specialisation", rating: 4.8, students: "5K", hours: "28 hrs", badge: "New", badgeBg: "#dcfce7", badgeColor: "#15803d" },
  { courseId: 3, title: "System Design for Frontend Engineers", provider: "Meta", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80", type: "Professional Certificate", rating: 4.9, students: "11K", hours: "26 hrs", badge: "Trending", badgeBg: "#fef9c3", badgeColor: "#854d0e" },
  { courseId: 4, title: "Docker & Kubernetes for Developers", provider: "Google", providerLogo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80", type: "Guided Project", rating: 4.6, students: "13K", hours: "16 hrs", badge: "Free", badgeBg: "#dbeafe", badgeColor: "#1d4ed8" },
];
 
const CATEGORY_CHIPS = ["All", "Web Development", "Data Science & AI", "Cloud & DevOps", "UI/UX Design", "Cybersecurity", "Mobile Development"];
const FILTER_TABS = ["All", "In Progress", "Completed", "Bookmarked"];
 
// ── Empty Bookmarks Component ─────────────────────────────────────────────────
function EmptyBookmarks({ onBrowse }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 10,
        px: 4,
        mb: 5,
        background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 50%, #faf5ff 100%)",
        borderRadius: "20px",
        border: "1.5px dashed #c7d2fe",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
      <Box sx={{ position: "absolute", bottom: -20, left: -20, width: 110, height: 110, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
 
      {/* Icon stack */}
      <Box sx={{ position: "relative", mb: 3 }}>
        <Box
          sx={{
            width: 88, height: 88, borderRadius: "24px",
            background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(99,102,241,0.15)",
          }}
        >
          <BookmarkBorderOutlined sx={{ fontSize: 42, color: "#6366f1" }} />
        </Box>
        {/* Floating sparkle */}
        <Box
          sx={{
            position: "absolute", top: -8, right: -8,
            width: 28, height: 28, borderRadius: "50%",
            bgcolor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <AutoAwesome sx={{ fontSize: 15, color: "#f59e0b" }} />
        </Box>
      </Box>
 
      <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", mb: 1, textAlign: "center" }}>
        No bookmarks yet
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#64748b", textAlign: "center", maxWidth: 360, lineHeight: 1.7, mb: 3.5 }}>
        Save courses you want to revisit later. Tap the{" "}
        <Box component="span" sx={{ color: "#6366f1", fontWeight: 600 }}>bookmark icon</Box>{" "}
        on any course card to add it here.
      </Typography>
 
      {/* Suggestion pills */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mb: 4 }}>
        {["Web Development", "Data Science", "UI/UX Design"].map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              fontSize: 12.5, fontWeight: 600,
              bgcolor: "#fff", color: "#4f46e5",
              border: "1.5px solid #c7d2fe",
              borderRadius: "50px",
              px: 0.5,
              "&:hover": { bgcolor: "#eef2ff" },
              cursor: "default",
            }}
          />
        ))}
      </Box>
 
      <Button
        variant="contained"
        onClick={onBrowse}
        startIcon={<Search sx={{ fontSize: 16 }} />}
        sx={{
          textTransform: "none", fontWeight: 700, fontSize: 14,
          bgcolor: "#4f46e5", color: "#fff",
          borderRadius: "12px", px: 3.5, py: 1.2,
          boxShadow: "0 4px 14px rgba(79,70,229,0.3)",
          "&:hover": { bgcolor: "#4338ca", boxShadow: "0 6px 20px rgba(79,70,229,0.35)" },
        }}
      >
        Browse All Courses
      </Button>
    </Box>
  );
}
 
// ── Filter Panel Component ────────────────────────────────────────────────────
function FilterPanel({ open, onClose, topicFilter, setTopicFilter, levelFilter, setLevelFilter, sortBy, setSortBy, onClearAll }) {
  const topics = ["All", "Web Development", "Data Science & AI", "UI/UX Design", "Cloud & DevOps", "Cybersecurity", "Mobile Development"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];
  const sorts = [
    { value: "Popular", label: "Most Popular" },
    { value: "Rating", label: "Top Rated" },
    { value: "Progress", label: "By Progress" },
  ];
 
  const activeFiltersCount = [
    topicFilter !== "All",
    levelFilter !== "All",
    sortBy !== "Popular",
  ].filter(Boolean).length;
 
  return (
    <Collapse in={open} timeout={280}>
      <Box
        sx={{
          mb: 2.5,
          border: "1.5px solid #e0e7ff",
          borderRadius: "16px",
          bgcolor: "#fafbff",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(99,102,241,0.08)",
        }}
      >
        {/* Panel header */}
        <Box
          sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 3, py: 2,
            borderBottom: "1px solid #e0e7ff",
            background: "linear-gradient(90deg, #f0f4ff 0%, #faf5ff 100%)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
            <TuneRounded sx={{ fontSize: 18, color: "#4f46e5" }} />
            <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a" }}>
              Filters & Sort
            </Typography>
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  width: 20, height: 20, borderRadius: "50%",
                  bgcolor: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <Typography sx={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{activeFiltersCount}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {activeFiltersCount > 0 && (
              <Button
                onClick={onClearAll}
                size="small"
                sx={{
                  textTransform: "none", fontSize: 12.5, color: "#6366f1",
                  fontWeight: 600, px: 1.5, py: 0.4,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#eef2ff" },
                }}
              >
                Clear all
              </Button>
            )}
            <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8", "&:hover": { bgcolor: "#e0e7ff", color: "#4f46e5" } }}>
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
 
        {/* Panel body */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, "& > *": { borderRight: "1px solid #e0e7ff" }, "& > *:last-child": { borderRight: "none" } }}>
 
          {/* Topic filter */}
          <Box sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.8, textTransform: "uppercase", mb: 1.5 }}>Topic</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {topics.map((t) => (
                <Box
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  sx={{
                    px: 2, py: 0.9, borderRadius: "10px", cursor: "pointer",
                    fontSize: 13.5, fontWeight: topicFilter === t ? 700 : 500,
                    color: topicFilter === t ? "#4f46e5" : "#475569",
                    bgcolor: topicFilter === t ? "#eef2ff" : "transparent",
                    display: "flex", alignItems: "center", gap: 1,
                    transition: "all 0.15s",
                    "&:hover": { bgcolor: topicFilter === t ? "#eef2ff" : "#f1f5f9" },
                  }}
                >
                  {topicFilter === t && (
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4f46e5", flexShrink: 0 }} />
                  )}
                  {t}
                </Box>
              ))}
            </Box>
          </Box>
 
          {/* Level filter */}
          <Box sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.8, textTransform: "uppercase", mb: 1.5 }}>Level</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {levels.map((l) => (
                <Box
                  key={l}
                  onClick={() => setLevelFilter(l)}
                  sx={{
                    px: 2, py: 0.9, borderRadius: "10px", cursor: "pointer",
                    fontSize: 13.5, fontWeight: levelFilter === l ? 700 : 500,
                    color: levelFilter === l ? "#4f46e5" : "#475569",
                    bgcolor: levelFilter === l ? "#eef2ff" : "transparent",
                    display: "flex", alignItems: "center", gap: 1,
                    transition: "all 0.15s",
                    "&:hover": { bgcolor: levelFilter === l ? "#eef2ff" : "#f1f5f9" },
                  }}
                >
                  {levelFilter === l && (
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4f46e5", flexShrink: 0 }} />
                  )}
                  {l}
                </Box>
              ))}
            </Box>
          </Box>
 
          {/* Sort */}
          <Box sx={{ p: 2.5 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: 0.8, textTransform: "uppercase", mb: 1.5 }}>Sort By</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {sorts.map((s) => (
                <Box
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  sx={{
                    px: 2, py: 0.9, borderRadius: "10px", cursor: "pointer",
                    fontSize: 13.5, fontWeight: sortBy === s.value ? 700 : 500,
                    color: sortBy === s.value ? "#4f46e5" : "#475569",
                    bgcolor: sortBy === s.value ? "#eef2ff" : "transparent",
                    display: "flex", alignItems: "center", gap: 1,
                    transition: "all 0.15s",
                    "&:hover": { bgcolor: sortBy === s.value ? "#eef2ff" : "#f1f5f9" },
                  }}
                >
                  {sortBy === s.value && (
                    <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#4f46e5", flexShrink: 0 }} />
                  )}
                  {s.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Collapse>
  );
}
 
export default function MyCourses() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarked, setBookmarked] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Popular");
  const [showAllSuggested, setShowAllSuggested] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
 
  const toggleBookmark = (id) => setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
 
  const filteredCourses = MY_COURSES.filter((c) => {
    if (activeTab === 1 && c.status === "Completed") return false;
    if (activeTab === 2 && c.status !== "Completed") return false;
    if (activeTab === 3 && !bookmarked.includes(c.id)) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase()) && !c.tag.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeCategory !== "All" && c.topic !== activeCategory) return false;
    if (topicFilter !== "All" && c.topic !== topicFilter) return false;
    if (levelFilter !== "All" && c.level !== levelFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "Popular") return b.students - a.students;
    if (sortBy === "Rating") return b.rating - a.rating;
    if (sortBy === "Progress") return b.pct - a.pct;
    return 0;
  });
 
  const suggestedVisible = showAllSuggested ? SUGGESTED_ALL : SUGGESTED_ALL.slice(0, 4);
 
  const activeFiltersCount = [
    topicFilter !== "All",
    levelFilter !== "All",
    sortBy !== "Popular",
  ].filter(Boolean).length;
 
  const selectSx = {
    fontSize: 13.5, fontWeight: 500, color: "#0f172a",
    bgcolor: "#fff", borderRadius: "50px", height: 38,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
    "& .MuiSelect-select": { py: 0, pl: 2, pr: "36px !important" },
    "& .MuiSelect-icon": { right: 10 },
  };
 
  const handleClearAllFilters = () => {
    setTopicFilter("All");
    setLevelFilter("All");
    setSortBy("Popular");
  };
 
  return (
    <StudentLayout title="My Courses">
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
        <Box sx={{ px: 3, pt: 3, pb: 3 }}>
 
          {/* ── Browse Courses heading ── */}
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#0f172a", mb: 2.5 }}>Browse Courses</Typography>
 
          {/* ── Filter bar ── */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5, flexWrap: "wrap" }}>
 
            {/* Search pill */}
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "50px", px: 2, height: 38, width: 240, "&:hover": { borderColor: "#cbd5e1" }, "&:focus-within": { borderColor: "#2563eb", boxShadow: "0 0 0 3px rgba(37,99,235,0.08)" } }}>
              <Search sx={{ fontSize: 18, color: "#2563eb", mr: 1, flexShrink: 0 }} />
              <InputBase placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} sx={{ fontSize: 13.5, color: "#0f172a", flex: 1, "& input::placeholder": { color: "#94a3b8" } }} />
            </Box>
 
            {/* Filter & Sort button — toggles panel */}
            <Button
              startIcon={<FilterList sx={{ fontSize: 15 }} />}
              onClick={() => setFilterPanelOpen(p => !p)}
              sx={{
                textTransform: "none", fontWeight: 700, fontSize: 13.5, px: 2, height: 38,
                borderRadius: "50px",
                border: filterPanelOpen ? "1.5px solid #4f46e5" : "1px solid #e2e8f0",
                bgcolor: filterPanelOpen ? "#eef2ff" : "#fff",
                color: filterPanelOpen ? "#4f46e5" : "#0f172a",
                position: "relative",
                "&:hover": { bgcolor: filterPanelOpen ? "#eef2ff" : "#f8fafc", borderColor: filterPanelOpen ? "#4f46e5" : "#cbd5e1" },
              }}
            >
              Filter & Sort
              {activeFiltersCount > 0 && (
                <Box
                  sx={{
                    position: "absolute", top: -6, right: -6,
                    width: 18, height: 18, borderRadius: "50%",
                    bgcolor: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid #fff",
                  }}
                >
                  <Typography sx={{ fontSize: 9, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{activeFiltersCount}</Typography>
                </Box>
              )}
            </Button>
 
            {/* Divider */}
            <Box sx={{ width: 1, height: 24, bgcolor: "#e2e8f0" }} />
 
            {/* Topic dropdown */}
            <Select value={topicFilter} onChange={e => setTopicFilter(e.target.value)} IconComponent={KeyboardArrowDown} displayEmpty sx={selectSx}>
              <MenuItem value="All">Topic</MenuItem>
              <MenuItem value="Web Development">Web Development</MenuItem>
              <MenuItem value="Data Science & AI">Data Science & AI</MenuItem>
              <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
              <MenuItem value="Cloud & DevOps">Cloud & DevOps</MenuItem>
            </Select>
 
            {/* Level dropdown */}
            <Select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} IconComponent={KeyboardArrowDown} displayEmpty sx={selectSx}>
              <MenuItem value="All">Level</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
 
            {/* Sort — pushed right */}
            <Select value={sortBy} onChange={e => setSortBy(e.target.value)} IconComponent={KeyboardArrowDown} sx={{ ...selectSx, ml: "auto" }}>
              <MenuItem value="Popular">Sort: Popular</MenuItem>
              <MenuItem value="Rating">Sort: Top Rated</MenuItem>
              <MenuItem value="Progress">Sort: Progress</MenuItem>
            </Select>
          </Box>
 
          {/* ── Filter Panel (slides open) ── */}
          <FilterPanel
            open={filterPanelOpen}
            onClose={() => setFilterPanelOpen(false)}
            topicFilter={topicFilter}
            setTopicFilter={setTopicFilter}
            levelFilter={levelFilter}
            setLevelFilter={setLevelFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onClearAll={handleClearAllFilters}
          />
 
          {/* ── Category chip tabs ── */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {CATEGORY_CHIPS.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Box
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    px: 2, py: 0.7,
                    borderRadius: "50px",
                    fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    bgcolor: isActive ? "#2563eb" : "#fff",
                    color: isActive ? "#fff" : "#334155",
                    border: isActive ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                    transition: "all 0.18s ease",
                    "&:hover": { borderColor: isActive ? "#2563eb" : "#94a3b8", bgcolor: isActive ? "#1d4ed8" : "#f8fafc" },
                  }}
                >
                  {cat}
                </Box>
              );
            })}
          </Box>
 
          {/* ── Tabs ── */}
          <Box sx={{ borderBottom: "1px solid #e2e8f0", mb: 3 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ "& .MuiTab-root": { textTransform: "none", fontSize: 14, fontWeight: 500, minHeight: 44, color: "#64748b", px: 3 }, "& .Mui-selected": { color: "#2563eb", fontWeight: 700 }, "& .MuiTabs-indicator": { bgcolor: "#2563eb", height: 3, borderRadius: "3px 3px 0 0" } }}>
              {FILTER_TABS.map(t => <Tab key={t} label={t} />)}
            </Tabs>
          </Box>
 
          {/* ── Empty Bookmarks state ── */}
          {activeTab === 3 && bookmarked.length === 0 && (
            <EmptyBookmarks onBrowse={() => setActiveTab(0)} />
          )}
 
          {/* ── Generic empty state (for non-bookmark filters) ── */}
          {filteredCourses.length === 0 && !(activeTab === 3 && bookmarked.length === 0) && (
            <Box sx={{ textAlign: "center", py: 8, bgcolor: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0", mb: 5 }}>
              <Typography sx={{ fontSize: 36, mb: 1 }}>🔍</Typography>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0f172a", mb: 0.5 }}>No matching courses found</Typography>
              <Typography sx={{ fontSize: 13, color: "#64748b" }}>Try adjusting your filters or clearing your search.</Typography>
              <Button onClick={() => { setSearchQuery(""); setActiveCategory("All"); setTopicFilter("All"); setLevelFilter("All"); }} sx={{ mt: 2, textTransform: "none", color: "#2563eb", fontWeight: 600 }}>Clear all filters</Button>
            </Box>
          )}
 
          {/* ── Course grid ── */}
          {filteredCourses.length > 0 && (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, mb: 6 }}>
              {filteredCourses.map((c) => {
                const isBookmarked = bookmarked.includes(c.id);
                return (
                  <Box key={c.id} onClick={() => navigate(`/course/${c.id}`)} sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", transition: "all 0.25s ease", cursor: "pointer", display: "flex", flexDirection: "column", "&:hover": { boxShadow: "0 12px 24px rgba(15,23,42,0.08)", transform: "translateY(-4px)", borderColor: "#cbd5e1" } }}>
                    <Box sx={{ position: "relative", height: 150, overflow: "hidden", bgcolor: "#f1f5f9" }}>
                      <Box component="img" src={c.image} alt={c.name} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", "&:hover": { transform: "scale(1.05)" } }} />
                      <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: c.statusColor, borderRadius: "6px", px: 1.2, py: 0.4 }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: 0.3 }}>{c.status}</Typography>
                      </Box>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleBookmark(c.id); }} sx={{ position: "absolute", top: 10, right: 10, bgcolor: "rgba(255,255,255,0.95)", width: 28, height: 28, "&:hover": { bgcolor: "#fff", transform: "scale(1.05)" } }}>
                        {isBookmarked ? <Bookmark sx={{ fontSize: 15, color: "#f59e0b" }} /> : <BookmarkBorder sx={{ fontSize: 15, color: "#475569" }} />}
                      </IconButton>
                      <Box sx={{ position: "absolute", bottom: 10, left: 12, bgcolor: "rgba(15,23,42,0.8)", borderRadius: "4px", px: 0.8, py: 0.2 }}>
                        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>{c.pct}% Complete</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 700, color: c.tagColor, letterSpacing: 0.8, mb: 0.8, textTransform: "uppercase" }}>{c.tag}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, mb: 0.5, minHeight: 40, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#64748b", mb: 1.5 }}>By {c.instructor}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5, borderTop: "1px solid #f1f5f9", pt: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Star sx={{ fontSize: 14, color: "#f59e0b" }} /><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{c.rating}</Typography></Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><Group sx={{ fontSize: 14, color: "#94a3b8" }} /><Typography sx={{ fontSize: 12, color: "#64748b" }}>{c.students}</Typography></Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}><AccessTime sx={{ fontSize: 14, color: "#94a3b8" }} /><Typography sx={{ fontSize: 12, color: "#64748b" }}>{c.hours}</Typography></Box>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                        <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>Modules: <Box component="span" sx={{ color: "#0f172a", fontWeight: 700 }}>{c.completedModules}</Box>/{c.modules}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={c.pct} sx={{ height: 5, borderRadius: 3, bgcolor: "#f1f5f9", mb: 2, "& .MuiLinearProgress-bar": { bgcolor: c.tagColor, borderRadius: 3 } }} />
                      <Box sx={{ mt: "auto" }}>
                        {c.status === "Completed" ? (
                          <Button variant="outlined" fullWidth startIcon={<CheckCircle />} onClick={(e) => { e.stopPropagation(); navigate(`/course/${c.id}`); }} sx={{ color: "#22c55e", borderColor: "#22c55e", textTransform: "none", fontWeight: 600, fontSize: 12.5, borderRadius: "9px", py: 0.9, "&:hover": { bgcolor: "#f0fdf4", borderColor: "#16a34a" } }}>
                            Review Content
                          </Button>
                        ) : (
                          <Button variant="contained" fullWidth startIcon={<PlayArrow />} onClick={(e) => { e.stopPropagation(); navigate(`/course/${c.id}`); }} sx={{ bgcolor: c.tagColor, textTransform: "none", fontWeight: 600, fontSize: 12.5, borderRadius: "9px", py: 0.9, boxShadow: "none", "&:hover": { filter: "brightness(0.95)", boxShadow: "none" } }}>
                            Resume Learning
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
 
          {/* ── Suggested Learning Paths ── */}
          <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 20, color: "#0f172a" }}>Suggested Learning Paths</Typography>
                <Typography sx={{ fontSize: 13, color: "#64748b", mt: 0.4 }}>Based on your Web Development journey</Typography>
              </Box>
              <Button
                endIcon={<KeyboardArrowDown sx={{ transform: showAllSuggested ? "rotate(180deg)" : "none", transition: "0.3s" }} />}
                onClick={() => setShowAllSuggested(p => !p)}
                sx={{ textTransform: "none", color: "#1e3a8a", fontWeight: 600, fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: "10px", px: 2.5, py: 0.8, "&:hover": { bgcolor: "#f8fafc", borderColor: "#94a3b8" } }}
              >
                {showAllSuggested ? "Show Less" : "Show More"}
              </Button>
            </Box>
 
            <Divider sx={{ my: 2.5, borderColor: "#f1f5f9" }} />
 
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
              {suggestedVisible.map((r, i) => (
                <Box key={i} onClick={() => navigate(`/course/${r.courseId}`)} sx={{ border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", bgcolor: "#fff", transition: "all 0.22s ease", cursor: "pointer", display: "flex", flexDirection: "column", "&:hover": { boxShadow: "0 10px 24px rgba(0,0,0,0.08)", transform: "translateY(-4px)", borderColor: "#cbd5e1" } }}>
                  <Box sx={{ height: 160, overflow: "hidden" }}>
                    <Box component="img" src={r.image} alt={r.title} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", "&:hover": { transform: "scale(1.04)" } }} />
                  </Box>
                  <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.2 }}>
                      <Box sx={{ width: 20, height: 20, borderRadius: "4px", overflow: "hidden", border: "1px solid #e2e8f0", flexShrink: 0, bgcolor: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box component="img" src={r.providerLogo} alt={r.provider} sx={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>{r.provider}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0f172a", lineHeight: 1.4, mb: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", minHeight: 44 }}>{r.title}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 0.8 }}>
                      <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>{r.type}</Typography>
                      <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>·</Typography>
                      <Star sx={{ fontSize: 14, color: "#f59e0b" }} />
                      <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{r.rating}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, mb: 2.5 }}>
                      <Group sx={{ fontSize: 14, color: "#94a3b8" }} />
                      <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>{r.students}</Typography>
                      <AccessTime sx={{ fontSize: 14, color: "#94a3b8", ml: 0.5 }} />
                      <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>{r.hours}</Typography>
                    </Box>
                    <Button fullWidth variant="outlined" onClick={(e) => { e.stopPropagation(); navigate(`/course/${r.id}`); }} sx={{ textTransform: "none", fontSize: 13, fontWeight: 600, bgcolor: "#1c5197", borderColor: "#1c5197", color: "#fff", borderRadius: "9px", py: 0.8, "&:hover": { bgcolor: "#163d78", borderColor: "#163d78" } }}>
                                          Start Learning
                                        </Button>
                  </Box>
                </Box>
              ))}
            </Box>
 
            {showAllSuggested && (
              <Box sx={{ textAlign: "center", mt: 2.5 }}>
                <Typography sx={{ fontSize: 12.5, color: "#94a3b8" }}>Showing all {SUGGESTED_ALL.length} suggested learning paths</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </StudentLayout>
  );
}