import React, { useState } from "react";
import StudentLayout from "../Components/StudentLayout";
import {
  Box, Typography, Button, Chip, Divider, Tab, Tabs,
  LinearProgress, IconButton, Avatar,
} from "@mui/material";
import {
  FileDownload, LinkedIn, Twitter, Visibility,
  FilterList, ArrowForward, EmojiEvents, Share,
  CheckCircle, PlayArrow, Verified,
} from "@mui/icons-material";
 
// ── Earned Certificates ───────────────────────────────────────────────────────
const EARNED_CERTS = [
  {
    id: 1, title: "React Development",       course: "Web Development – Pro",
    issued: "Jun 13, 2026", status: "Verified", statusColor: "#22c55e",
    borderColor: "#4f46e5", badgeColor: "#fbbf24",
    credentialId: "EDU-2026-001",
  },
  {
    id: 2, title: "JavaScript Advanced",      course: "JavaScript Mastery",
    issued: "Jun 06, 2026", status: "Verified", statusColor: "#22c55e",
    borderColor: "#f97316", badgeColor: "#fbbf24",
    credentialId: "EDU-2026-002",
  },
  {
    id: 3, title: "TypeScript Essentials",    course: "TypeScript Course",
    issued: "May 20, 2026", status: "Virtual", statusColor: "#6366f1",
    borderColor: "#0891b2", badgeColor: "#a78bfa",
    credentialId: "EDU-2026-003",
  },
  {
    id: 4, title: "CSS Mastery",              course: "Frontend Development",
    issued: "May 20, 2026", status: "Verified", statusColor: "#22c55e",
    borderColor: "#7c3aed", badgeColor: "#fbbf24",
    credentialId: "EDU-2026-004",
  },
  {
    id: 5, title: "HTML Fundamentals",        course: "Web Basics",
    issued: "May 13, 2026", status: "View",    statusColor: "#6366f1",
    borderColor: "#4f46e5", badgeColor: "#fbbf24",
    credentialId: "EDU-2026-005",
  },
  {
    id: 6, title: "MongoDB Basics",           course: "Database Management",
    issued: "Apr 30, 2026", status: "View",    statusColor: "#6366f1",
    borderColor: "#22c55e", badgeColor: "#34d399",
    credentialId: "EDU-2026-006",
  },
  {
    id: 7, title: "Node.js Fundamentals",     course: "Backend Development",
    issued: "Apr 18, 2026", status: "View",    statusColor: "#6366f1",
    borderColor: "#0891b2", badgeColor: "#fbbf24",
    credentialId: "EDU-2026-007",
  },
  {
    id: 8, title: "Git & GitHub",             course: "DevOps Basics",
    issued: "Apr 05, 2026", status: "View",    statusColor: "#6366f1",
    borderColor: "#ef4444", badgeColor: "#fbbf24",
    credentialId: "EDU-2026-008",
  },
];
 
// ── In Progress ───────────────────────────────────────────────────────────────
const IN_PROGRESS = [
  {
    title: "Advanced JavaScript", course: "JavaScript Mastery",
    icon: "JS", iconBg: "#fef9c3", iconColor: "#854d0e",
    pct: 70, modules: 4, totalModules: 4, color: "#f97316",
  },
  {
    title: "Advanced TypeScript", course: "TypeScript Course",
    icon: "TS", iconBg: "#dbeafe", iconColor: "#1e40af",
    pct: 45, modules: 0, totalModules: 5, color: "#3b82f6",
  },
  {
    title: "MongoDB Advanced", course: "Database Management",
    icon: "MG", iconBg: "#f0fdf4", iconColor: "#15803d",
    pct: 36, modules: 1, totalModules: 6, color: "#22c55e",
  },
];
 
// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  { icon: "🏢", label: "Industry Recognized",  desc: "Our certificates are recognized by top companies worldwide", color: "#6366f1", bg: "#e0e7ff" },
  { icon: "🔗", label: "Share Anywhere",        desc: "Share your achievements on LinkedIn and social media",        color: "#22c55e", bg: "#dcfce7" },
  { icon: "⬇️", label: "Download & Print",      desc: "Download high-quality certificates for your records",        color: "#0891b2", bg: "#e0f2fe" },
  { icon: "💼", label: "Career Boost",          desc: "Enhance your resume and advance your career",                color: "#f97316", bg: "#fff7ed" },
  { icon: "♾️", label: "Lifetime Access",       desc: "Access your certificates anytime, anywhere",                 color: "#a855f7", bg: "#f3e8ff" },
];
 
// ── Recently Earned table ─────────────────────────────────────────────────────
const RECENT = [
  { title: "React Development",    course: "Web Development – Pro", icon: "RD", iconBg: "#e0e7ff", iconColor: "#4f46e5", issued: "Jun 13, 2026", credId: "EDU-2026-001" },
  { title: "JavaScript Advanced",  course: "JavaScript Mastery",    icon: "JS", iconBg: "#fef9c3", iconColor: "#854d0e", issued: "Jun 06, 2026", credId: "EDU-2026-002" },
  { title: "TypeScript Essentials",course: "TypeScript Course",     icon: "TS", iconBg: "#dbeafe", iconColor: "#1e40af", issued: "May 20, 2026", credId: "EDU-2026-003" },
];
 
// ── Certificate Card (earned) ─────────────────────────────────────────────────
function CertCard({ cert }) {
  return (
    <Box sx={{ border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", bgcolor: "#fff", transition: "all 0.22s", cursor: "pointer", "&:hover": { boxShadow: "0 8px 28px rgba(0,0,0,0.11)", transform: "translateY(-3px)", borderColor: "#94a3b8" } }}>
 
      {/* Certificate preview */}
      <Box sx={{ position: "relative", bgcolor: "#fafafa", border: `3px solid ${cert.borderColor}22`, m: 1.5, borderRadius: "8px", py: 2.5, px: 2, textAlign: "center" }}>
        {/* Corner decorations */}
        <Box sx={{ position: "absolute", top: 4, left: 4, width: 16, height: 16, border: `2px solid ${cert.borderColor}66`, borderRight: "none", borderBottom: "none" }} />
        <Box sx={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, border: `2px solid ${cert.borderColor}66`, borderLeft: "none", borderBottom: "none" }} />
        <Box sx={{ position: "absolute", bottom: 4, left: 4, width: 16, height: 16, border: `2px solid ${cert.borderColor}66`, borderRight: "none", borderTop: "none" }} />
        <Box sx={{ position: "absolute", bottom: 4, right: 4, width: 16, height: 16, border: `2px solid ${cert.borderColor}66`, borderLeft: "none", borderTop: "none" }} />
 
        <Typography sx={{ fontSize: 8, fontWeight: 700, color: "#94a3b8", letterSpacing: 1.5, textTransform: "uppercase", mb: 0.3 }}>CERTIFICATE</Typography>
        <Typography sx={{ fontSize: 7.5, color: "#94a3b8", letterSpacing: 0.8, mb: 1 }}>of Completion</Typography>
        <Box sx={{ width: 28, height: 2, bgcolor: cert.borderColor, mx: "auto", mb: 1, borderRadius: 1 }} />
        <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: "#1e293b", lineHeight: 1.3 }}>{cert.title}</Typography>
        <Box sx={{ width: 20, height: 1, bgcolor: "#cbd5e1", mx: "auto", mt: 1, mb: 0.5 }} />
        <Typography sx={{ fontSize: 7, color: "#94a3b8" }}>EduPlatform</Typography>
 
        {/* Medal badge */}
        <Box sx={{ position: "absolute", bottom: -10, right: 10, width: 28, height: 28, borderRadius: "50%", bgcolor: cert.badgeColor, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)", fontSize: 14 }}>🏅</Box>
      </Box>
 
      {/* Card body */}
      <Box sx={{ px: 1.8, pb: 1.8, pt: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mb: 0.3 }}>{cert.title}</Typography>
        <Typography sx={{ fontSize: 11, color: "#64748b", mb: 0.5 }}>{cert.course}</Typography>
        <Typography sx={{ fontSize: 10.5, color: "#94a3b8", mb: 1 }}>Issued on: {cert.issued}</Typography>
 
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Chip
            label={cert.status}
            size="small"
            icon={cert.status === "Verified" ? <Verified sx={{ fontSize: 11, color: `${cert.statusColor} !important` }} /> : undefined}
            sx={{ fontSize: 10, fontWeight: 700, height: 20, bgcolor: cert.statusColor === "#22c55e" ? "#dcfce7" : "#e0e7ff", color: cert.statusColor, borderRadius: "6px" }}
          />
          <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5" } }}>
            <FileDownload sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
 
// ── Main ──────────────────────────────────────────────────────────────────────
export default function Certificates() {
  const [activeTab, setActiveTab] = useState(0);
  const [showAll, setShowAll] = useState(false);
 
  const TABS = ["All Certificates", "Verified", "By Course", "By Date"];
  const displayed = showAll ? EARNED_CERTS : EARNED_CERTS.slice(0, 4);
 
  return (
    <StudentLayout title="Certificates">
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
 
        {/* ── Filter Tabs + Filter btn ───────────────────────────────────── */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": { textTransform: "none", fontSize: 13, fontWeight: 500, minHeight: 36, color: "#64748b", px: 2, py: 0 },
              "& .Mui-selected": { color: "#4f46e5", fontWeight: 700 },
              "& .MuiTabs-indicator": { bgcolor: "#4f46e5", height: 3, borderRadius: 2 },
            }}
          >
            {TABS.map(t => <Tab key={t} label={t} />)}
          </Tabs>
          <Button
            startIcon={<FilterList />}
            sx={{ textTransform: "none", color: "#64748b", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: "10px", px: 2, "&:hover": { bgcolor: "#f1f5f9" } }}
          >
            Filter
          </Button>
        </Box>
 
        {/* ── Earned Certificates ───────────────────────────────────────── */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 2 }}>Earned Certificates</Typography>
 
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
            {displayed.map(cert => <CertCard key={cert.id} cert={cert} />)}
          </Box>
 
          {/* Load more */}
          <Box sx={{ textAlign: "center", mt: 2.5 }}>
            <Button
              onClick={() => setShowAll(!showAll)}
              endIcon={<ArrowForward sx={{ fontSize: 14, transform: showAll ? "rotate(90deg)" : "rotate(90deg)", transition: "0.3s" }} />}
              sx={{ textTransform: "none", color: "#4f46e5", fontWeight: 600, fontSize: 13, border: "1px solid #e0e7ff", borderRadius: "20px", px: 3, py: 0.7, "&:hover": { bgcolor: "#eff6ff" } }}
            >
              {showAll ? "Show Less ▲" : "Load More ▼"}
            </Button>
          </Box>
        </Box>
 
        {/* ── Certificates In Progress ──────────────────────────────────── */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 2 }}>Certificates In Progress</Typography>
 
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
            {IN_PROGRESS.map((c, i) => (
              <Box key={i} sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", p: 2.5, transition: "all 0.2s", "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.08)", borderColor: "#94a3b8" } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ width: 42, height: 42, borderRadius: "10px", bgcolor: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 800, color: c.iconColor }}>{c.icon}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{c.title}</Typography>
                    <Typography sx={{ fontSize: 11.5, color: "#64748b" }}>{c.course}</Typography>
                  </Box>
                </Box>
 
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.6 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: c.color }}>{c.pct}% Complete</Typography>
                </Box>
                <LinearProgress
                  variant="determinate" value={c.pct}
                  sx={{ height: 7, borderRadius: 4, bgcolor: "#f1f5f9", mb: 1.2, "& .MuiLinearProgress-bar": { bgcolor: c.color, borderRadius: 4 } }}
                />
 
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 11, color: "#64748b" }}>
                    {c.modules} of {c.totalModules} modules completed
                  </Typography>
                  <Button
                    size="small"
                    endIcon={<ArrowForward sx={{ fontSize: 13 }} />}
                    sx={{ textTransform: "none", color: c.color, fontWeight: 700, fontSize: 12, p: 0, minWidth: 0, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
                  >
                    Continue
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
 
        {/* ── Certificate Benefits ──────────────────────────────────────── */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "#0f172a", mb: 2 }}>Certificate Benefits</Typography>
 
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}>
            {BENEFITS.map((b, i) => (
              <Box key={i} sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", p: 2, textAlign: "center", transition: "all 0.2s", cursor: "pointer", "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.09)", transform: "translateY(-3px)", borderColor: b.color } }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: b.bg, display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 1.2, fontSize: 22 }}>
                  {b.icon}
                </Box>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", mb: 0.6 }}>{b.label}</Typography>
                <Typography sx={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>{b.desc}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
 
        {/* ── Recently Earned + Share Your Achievement ──────────────────── */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 2.5 }}>
 
          {/* Recently Earned table */}
          <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden" }}>
            <Box sx={{ px: 2.5, py: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>Recently Earned</Typography>
            </Box>
 
            {/* Table header */}
            <Box sx={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1fr", px: 2.5, py: 1.2, bgcolor: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              {["Certificate", "Course", "Issued Date", "Credential ID", "Action"].map(h => (
                <Typography key={h} sx={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</Typography>
              ))}
            </Box>
 
            {/* Rows */}
            {RECENT.map((r, i) => (
              <Box key={i}>
                <Box sx={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1.5fr 1fr", px: 2.5, py: 1.8, alignItems: "center", transition: "all 0.15s", "&:hover": { bgcolor: "#f8fafc" } }}>
                  {/* Certificate */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: "8px", bgcolor: r.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 800, color: r.iconColor }}>{r.icon}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a" }}>{r.title}</Typography>
                  </Box>
                  {/* Course */}
                  <Typography sx={{ fontSize: 12, color: "#64748b" }}>{r.course}</Typography>
                  {/* Date */}
                  <Typography sx={{ fontSize: 12, color: "#475569" }}>{r.issued}</Typography>
                  {/* Credential */}
                  <Typography sx={{ fontSize: 11.5, color: "#6366f1", fontWeight: 600 }}>{r.credId}</Typography>
                  {/* Actions */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#4f46e5" } }}>
                      <Visibility sx={{ fontSize: 15 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#22c55e" } }}>
                      <FileDownload sx={{ fontSize: 15 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "#64748b", "&:hover": { color: "#0891b2" } }}>
                      <Share sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Box>
                </Box>
                {i < RECENT.length - 1 && <Divider sx={{ borderColor: "#f1f5f9", mx: 2.5 }} />}
              </Box>
            ))}
 
            {/* View All */}
            <Box sx={{ px: 2.5, py: 1.8, borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
              <Button endIcon={<ArrowForward sx={{ fontSize: 14 }} />} sx={{ textTransform: "none", color: "#4f46e5", fontWeight: 600, fontSize: 13, "&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}>
                View All Certificates
              </Button>
            </Box>
          </Box>
 
          {/* Share Your Achievement */}
          <Box sx={{ bgcolor: "#fff", border: "1px solid #e2e8f0", borderRadius: "14px", p: 2.5, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", position: "relative", overflow: "hidden" }}>
            {/* bg decoration */}
            <Box sx={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", bgcolor: "#f3e8ff", opacity: 0.5 }} />
            <Box sx={{ position: "absolute", bottom: -15, left: -15, width: 70, height: 70, borderRadius: "50%", bgcolor: "#e0e7ff", opacity: 0.4 }} />
 
            {/* Trophy illustration */}
            <Box sx={{ position: "relative", zIndex: 1, mb: 1.5 }}>
              <Box sx={{ fontSize: 64, lineHeight: 1 }}>🏆</Box>
              <Box sx={{ position: "absolute", bottom: 0, right: -8, width: 24, height: 24, borderRadius: "50%", bgcolor: "#a855f7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>⭐</Box>
              <Box sx={{ position: "absolute", top: 4, left: -10, width: 18, height: 18, borderRadius: "50%", bgcolor: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>✦</Box>
            </Box>
 
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: "#0f172a", mb: 0.5, position: "relative", zIndex: 1 }}>
              Share Your Achievement
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#64748b", mb: 2.5, lineHeight: 1.5, position: "relative", zIndex: 1 }}>
              Showcase your skills and achievements
            </Typography>
 
            {/* LinkedIn */}
            <Button
              fullWidth
              startIcon={<LinkedIn />}
              sx={{
                textTransform: "none", fontWeight: 700, fontSize: 13, borderRadius: "10px",
                py: 1, mb: 1.2, bgcolor: "#0077b5", color: "#fff",
                "&:hover": { bgcolor: "#005f8e" }, position: "relative", zIndex: 1,
              }}
            >
              Share on LinkedIn
            </Button>
 
           
          </Box>
        </Box>
 
      </Box>
    </StudentLayout>
  );
}