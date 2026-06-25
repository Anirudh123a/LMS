import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

// ════════════════════════════════════════════════════════════════
//  SHARED DATA
// ════════════════════════════════════════════════════════════════
const enrollmentData = [
  { month: "Jan", value: 1280 }, { month: "Feb", value: 1450 },
  { month: "Mar", value: 1320 }, { month: "Apr", value: 1890 },
  { month: "May", value: 2100 }, { month: "Jun", value: 2480 },
];
const completionTrend = [
  { month: "Jan", completed: 320, pending: 210, dropped: 80 },
  { month: "Feb", completed: 410, pending: 190, dropped: 60 },
  { month: "Mar", completed: 380, pending: 230, dropped: 90 },
  { month: "Apr", completed: 520, pending: 170, dropped: 55 },
  { month: "May", completed: 610, pending: 150, dropped: 40 },
  { month: "Jun", completed: 720, pending: 130, dropped: 35 },
];
const courseStatusData = [
  { name: "Completed", value: 42 }, { name: "In Progress", value: 31 },
  { name: "Pending", value: 18 },   { name: "Dropped", value: 9 },
];
const COURSE_COLORS = ["#22C55E", "#3B6CF4", "#F59E0B", "#EF4444"];

const monitoringStats = [
  { label: "Course Completion Count", value: "2,960", change: "+14.2%", icon: "✅", color: "#22C55E", bg: "#F0FDF4" },
  { label: "Pending Enrollments",     value: "1,180", change: "-3.1%",  icon: "⏳", color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Dropped Courses",         value: "360",   change: "-8.5%",  icon: "❌", color: "#EF4444", bg: "#FEF2F2" },
  { label: "Active Learners Today",   value: "3,842", change: "+6.7%",  icon: "🟢", color: "#3B6CF4", bg: "#EFF6FF" },
  { label: "Avg. Completion Rate",    value: "69.2%", change: "+2.1%",  icon: "📈", color: "#8B5CF6", bg: "#F5F3FF" },
  { label: "Certificates Issued",     value: "1,740", change: "+22%",   icon: "🏅", color: "#06B6D4", bg: "#ECFEFF" },
];

const recentActivities = [
  { icon: "📋", title: "New enrollment — Priya Sharma",      sub: "Data Science Bootcamp", time: "2m ago",  color: "#3B6CF4" },
  { icon: "✅", title: "Course published — Dr. Arjun Mehta", sub: "ML Fundamentals",       time: "14m ago", color: "#22C55E" },
  { icon: "⚠️", title: "Report pending — Ravi Kumar",        sub: "Web Dev Basics",        time: "32m ago", color: "#F59E0B" },
  { icon: "👤", title: "New user registered — Sneha Iyer",   sub: "Student account",       time: "1h ago",  color: "#8B5CF6" },
  { icon: "❌", title: "Course dropped — Kiran Rao",         sub: "Advanced React",        time: "2h ago",  color: "#EF4444" },
  { icon: "📊", title: "Report submitted — Prof. Nair",      sub: "Analytics Q2",          time: "3h ago",  color: "#06B6D4" },
];

const topCourses = [
  { name: "Data Science Bootcamp", enrolled: 1240, completed: 820, pending: 280, dropped: 140, rate: 66 },
  { name: "ML Fundamentals",       enrolled: 980,  completed: 710, pending: 190, dropped: 80,  rate: 72 },
  { name: "Web Dev Basics",        enrolled: 870,  completed: 540, pending: 230, dropped: 100, rate: 62 },
  { name: "Advanced React",        enrolled: 650,  completed: 480, pending: 120, dropped: 50,  rate: 74 },
  { name: "UI/UX Design",          enrolled: 540,  completed: 390, pending: 110, dropped: 40,  rate: 72 },
];

const pendingReports = [
  { id:1, title: "Q2 Enrollment Summary",      by: "Prof. Arjun Mehta", due: "Today",   priority: "High",   status: "Pending", type: "Enrollment" },
  { id:2, title: "Course Completion Analysis", by: "Dr. Sneha Iyer",    due: "Tomorrow",priority: "Medium", status: "Pending", type: "Analytics"  },
  { id:3, title: "Vendor Performance Report",  by: "Admin",             due: "Jun 25",  priority: "High",   status: "Pending", type: "Progress"   },
  { id:4, title: "Student Feedback Review",    by: "Ravi Kumar",        due: "Jun 26",  priority: "Low",    status: "Pending", type: "Analytics"  },
  { id:5, title: "Batch D Review",             by: "Mr. Nair",          due: "Jun 27",  priority: "Medium", status: "Pending", type: "Progress"   },
  { id:6, title: "Certificate Issuance Log",   by: "Admin",             due: "Jun 22",  priority: "Low",    status: "Completed",type:"Certificate" },
  { id:7, title: "Dropout Analysis Q2",        by: "Dr. Rao",           due: "Jun 30",  priority: "High",   status: "Pending", type: "Analytics"  },
];

const users = [
  { id:1,  name: "Priya Sharma",   email: "priya@edu.com",   role: "Student",    college: "MIT OpenCourseWare", status: "Active",    joined: "Jan 10, 2026" },
  { id:2,  name: "Arjun Mehta",    email: "arjun@edu.com",   role: "Instructor", college: "Stanford Extension", status: "Active",    joined: "Feb 01, 2026" },
  { id:3,  name: "Sneha Iyer",     email: "sneha@edu.com",   role: "Student",    college: "Harvard Online",     status: "Active",    joined: "Mar 05, 2026" },
  { id:4,  name: "Kiran Rao",      email: "kiran@edu.com",   role: "Student",    college: "MIT OpenCourseWare", status: "Inactive",  joined: "Apr 12, 2026" },
  { id:5,  name: "Ravi Kumar",     email: "ravi@edu.com",    role: "Staff",      college: "Admin",              status: "Active",    joined: "Jan 20, 2026" },
  { id:6,  name: "Neha Patel",     email: "neha@edu.com",    role: "Student",    college: "Coursera Partners",  status: "Pending",   joined: "Jun 01, 2026" },
  { id:7,  name: "Prof. Nair",     email: "nair@edu.com",    role: "Instructor", college: "Stanford Extension", status: "Active",    joined: "Feb 14, 2026" },
  { id:8,  name: "Divya Singh",    email: "divya@edu.com",   role: "Student",    college: "Harvard Online",     status: "Active",    joined: "Mar 22, 2026" },
];

const courses = [
  { id:1, name: "Data Science Bootcamp", college: "MIT OpenCourseWare", instructor: "Dr. Mehta",  enrolled: 1240, completion: 66, modules: 16, duration: "6 months", status: "Active"     },
  { id:2, name: "ML Fundamentals",       college: "Stanford Extension", instructor: "Dr. Rao",    enrolled: 980,  completion: 72, modules: 12, duration: "4 months", status: "Active"     },
  { id:3, name: "Web Dev Basics",        college: "Harvard Online",     instructor: "Prof. Nair", enrolled: 870,  completion: 62, modules: 10, duration: "3 months", status: "Active"     },
  { id:4, name: "Advanced React",        college: "Coursera Partners",  instructor: "Ms. Iyer",   enrolled: 650,  completion: 74, modules: 8,  duration: "2 months", status: "Completing" },
  { id:5, name: "UI/UX Design",          college: "MIT OpenCourseWare", instructor: "Prof. Das",  enrolled: 540,  completion: 72, modules: 10, duration: "3 months", status: "Active"     },
];

const enrollments = [
  { id:1,  student: "Priya Sharma", course: "Data Science Bootcamp", college: "MIT",             date: "Jan 10, 2026", status: "Active",    progress: 72 },
  { id:2,  student: "Arjun Mehta",  course: "ML Fundamentals",       college: "Stanford",        date: "Feb 01, 2026", status: "Active",    progress: 55 },
  { id:3,  student: "Sneha Iyer",   course: "Web Dev Basics",        college: "Harvard",         date: "Mar 05, 2026", status: "Completed", progress: 100 },
  { id:4,  student: "Kiran Rao",    course: "Advanced React",        college: "Coursera",        date: "Apr 12, 2026", status: "Dropped",   progress: 38 },
  { id:5,  student: "Neha Patel",   course: "UI/UX Design",          college: "MIT",             date: "Jun 01, 2026", status: "Pending",   progress: 0  },
  { id:6,  student: "Divya Singh",  course: "Data Science Bootcamp", college: "MIT",             date: "Mar 22, 2026", status: "Active",    progress: 61 },
  { id:7,  student: "Ravi Kumar",   course: "ML Fundamentals",       college: "Stanford",        date: "Jan 20, 2026", status: "Completed", progress: 100 },
];

const colleges = [
  { id:1, name: "MIT OpenCourseWare",  plan: "Institutional", courses: 89, students: 4200, revenue: "₹84,000",  status: "Active"   },
  { id:2, name: "Stanford Extension",  plan: "Institutional", courses: 74, students: 3800, revenue: "₹76,000",  status: "Active"   },
  { id:3, name: "Harvard Online",      plan: "Premium",       courses: 61, students: 3200, revenue: "₹48,000",  status: "Active"   },
  { id:4, name: "Coursera Partners",   plan: "Institutional", courses: 120,students: 5100, revenue: "₹102,000", status: "Active"   },
  { id:5, name: "Yale Open Courses",   plan: "Premium",       courses: 45, students: 980,  revenue: "₹14,700",  status: "Inactive" },
];

const vendors = [
  { id:1, name: "EduTech Pro",  plan: "Enterprise", sold: 1240, revenue: "₹24,800", status: "Active"   },
  { id:2, name: "SkillBridge",  plan: "Business",   sold: 870,  revenue: "₹13,050", status: "Active"   },
  { id:3, name: "LearnQuest",   plan: "Enterprise", sold: 650,  revenue: "₹13,000", status: "Active"   },
  { id:4, name: "AcademiX",     plan: "Starter",    sold: 430,  revenue: "₹4,300",  status: "Inactive" },
  { id:5, name: "TutorHub",     plan: "Business",   sold: 310,  revenue: "₹4,650",  status: "Active"   },
];

const navItems = [
  { icon: "⊞", label: "Dashboard"   },
  { icon: "👥", label: "Users"       },
  { icon: "📚", label: "Courses"     },
  { icon: "🎓", label: "Colleges"    },
  { icon: "🛒", label: "Vendors"     },
  { icon: "📋", label: "Enrollments" },
  { icon: "📊", label: "Reports"     },
  { icon: "🖥",  label: "Monitoring"  },
];

const pageMeta = {
  Dashboard:   { title: "Dashboard",   subtitle: "Monday, June 23, 2026"           },
  Users:       { title: "Users",       subtitle: "Manage all platform users"        },
  Courses:     { title: "Courses",     subtitle: "All courses across organizations" },
  Colleges:    { title: "Colleges",    subtitle: "Institutional subscribers"        },
  Vendors:     { title: "Vendors",     subtitle: "Vendor subscriptions & plans"     },
  Enrollments: { title: "Enrollments", subtitle: "Track student enrollments"        },
  Reports:     { title: "Reports",     subtitle: "Analytics and exports"            },
  Monitoring:  { title: "Monitoring",  subtitle: "Live platform health metrics"     },
};

const pageActions = {
  Users:       "+ Add User",
  Courses:     "+ Add Course",
  Colleges:    "+ Add College",
  Vendors:     "+ Add Vendor",
  Enrollments: "+ New Enrollment",
  Reports:     "+ Generate Report",
};

// ════════════════════════════════════════════════════════════════
//  THEME TOKENS (light / dark)
// ════════════════════════════════════════════════════════════════
function getTokens(isDark) {
  return {
    pageBg:     isDark ? "#0B0420" : "#F8FAFC",
    sidebarBg:  isDark ? "#16062B" : "#0F172A",
    sidebarBorder: isDark ? "rgba(255,255,255,0.08)" : "#1E293B",
    navActiveBg: isDark ? "rgba(98,62,152,0.4)" : "#1E40AF",
    navActiveBorder: isDark ? "#9B75C9" : "#60A5FA",
    navInactive: isDark ? "#A692C4" : "#94A3B8",
    cardBg:     isDark ? "rgba(50,14,94,0.4)" : "#fff",
    cardBorder: isDark ? "1px solid rgba(255,255,255,0.08)" : "none",
    textPrimary: isDark ? "#fff" : "#0F172A",
    textSecondary: isDark ? "#A692C4" : "#94A3B8",
    textBody:    isDark ? "#CBB6E6" : "#475569",
    topBarBg:   isDark ? "rgba(22,6,43,0.6)" : "#F8FAFC",
    topBarBorder: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E2E8F0",
    inputBg:    isDark ? "rgba(255,255,255,0.05)" : "#fff",
    inputBorder: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E2E8F0",
    chipBg:     isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
    rowBorder:  isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #F8FAFC",
    gridLine:   isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
    accent:     "#3B6CF4",
  };
}

// ════════════════════════════════════════════════════════════════
//  SHARED UI
// ════════════════════════════════════════════════════════════════
function StatCard({ icon, label, value, change, color, t }) {
  return (
    <div style={{ background: t.cardBg, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderTop: `3px solid ${color}`, border: t.cardBorder, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: t.textSecondary, textTransform: "uppercase" }}>{label}</span>
        <div style={{ background: color + "18", borderRadius: 8, width: 30, height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary, marginTop: 8, letterSpacing: -1 }}>{value}</div>
      {change && <div style={{ fontSize: 11, marginTop: 3, color: t.textSecondary, fontWeight: 500 }}>{change}</div>}
    </div>
  );
}

function MonitorCard({ item, t }) {
  const isPositive = item.change.startsWith("+");
  return (
    <div style={{ background: t.cardBg, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", borderLeft: `4px solid ${item.color}`, border: t.cardBorder, minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ background: item.bg, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: 0.8 }}>{item.label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.5, marginTop: 2 }}>{item.value}</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: isPositive ? "#22C55E" : "#EF4444", background: isPositive ? "#F0FDF4" : "#FEF2F2", padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}>{item.change}</div>
    </div>
  );
}

function SectionCard({ title, children, action, style, t }) {
  return (
    <div style={{ background: t.cardBg, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: t.cardBorder, minWidth: 0, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.textPrimary }}>{title}</h3>
        {action && <button style={{ fontSize: 12, color: t.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>{action}</button>}
      </div>
      {children}
    </div>
  );
}

function TD({ children, bold, color, t }) {
  return (
    <td style={{ padding: "10px 10px", color: bold ? t.textPrimary : (color || t.textBody), fontWeight: bold ? 600 : 400 }}>
      {children}
    </td>
  );
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: bg, color }}>{label}</span>;
}

function statusBadge(status) {
  const map = {
    Active:    { color: "#1D4ED8", bg: "#DBEAFE" },
    Completed: { color: "#15803D", bg: "#DCFCE7" },
    Completing:{ color: "#15803D", bg: "#DCFCE7" },
    Pending:   { color: "#B45309", bg: "#FEF3C7" },
    Inactive:  { color: "#64748B", bg: "#F1F5F9" },
    Dropped:   { color: "#B91C1C", bg: "#FEE2E2" },
  };
  const s = map[status] || { color: "#64748B", bg: "#F1F5F9" };
  return <Badge label={status} color={s.color} bg={s.bg} />;
}

function priorityBadge(priority) {
  const map = { High: { color: "#B91C1C", bg: "#FEE2E2" }, Medium: { color: "#B45309", bg: "#FEF3C7" }, Low: { color: "#15803D", bg: "#DCFCE7" } };
  const p = map[priority] || { color: "#64748B", bg: "#F1F5F9" };
  return <Badge label={priority} color={p.color} bg={p.bg} />;
}

function planBadge(plan) {
  const map = {
    Institutional: { color: "#1D4ED8", bg: "#DBEAFE" },
    Enterprise:    { color: "#15803D", bg: "#DCFCE7" },
    Business:      { color: "#7C3AED", bg: "#EDE9FE" },
    Premium:       { color: "#B45309", bg: "#FEF3C7" },
    Starter:       { color: "#64748B", bg: "#F1F5F9" },
  };
  const p = map[plan] || { color: "#64748B", bg: "#F1F5F9" };
  return <Badge label={plan} color={p.color} bg={p.bg} />;
}

function Table({ cols, rows, t }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: t.rowBorder }}>
            {cols.map(c => (
              <th key={c} style={{ padding: "6px 10px", textAlign: "left", color: t.textSecondary, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, background: t.inputBg, border: t.inputBorder, borderRadius: 8, padding: "7px 12px", width: 220 }}>
      <span style={{ color: "#94A3B8", fontSize: 13 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search..."} style={{ border: "none", outline: "none", fontSize: 12, color: t.textPrimary, background: "none", width: "100%" }} />
    </div>
  );
}

function SectionDivider({ label, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 4, height: 20, background: t.accent, borderRadius: 4 }} />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.textPrimary }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: t.gridLine }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SIDEBAR
// ════════════════════════════════════════════════════════════════
function Sidebar({ active, setActive, t }) {
  return (
    <aside style={{ width: 200, height: "100vh", background: t.sidebarBg, display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, borderRight: `1px solid ${t.sidebarBorder}` }}>
      <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${t.sidebarBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>E</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>EduPlatform</span>
        </div>
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "6px 10px" }}>
          <div style={{ color: "#94A3B8", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Logged in as</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginTop: 2 }}>Admin</div>
        </div>
      </div>
      <div style={{ padding: "10px 14px 4px" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", color: "#94A3B8", fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 6, letterSpacing: 0.5 }}>🏢 Platform</span>
      </div>
      <nav style={{ marginTop: 6, flex: 1, overflowY: "auto" }}>
        {navItems.map(({ icon, label }) => (
          <button key={label} onClick={() => setActive(label)} style={{
            display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 14px",
            background: active === label ? t.navActiveBg : "none",
            border: "none", cursor: "pointer",
            color: active === label ? "#fff" : t.navInactive,
            fontWeight: active === label ? 700 : 400,
            fontSize: 13, textAlign: "left",
            borderLeft: active === label ? `3px solid ${t.navActiveBorder}` : "3px solid transparent",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 14 }}>{icon}</span>{label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════════
//  TOP BAR  (now with Theme Toggle + Logout)
// ════════════════════════════════════════════════════════════════
function TopBar({ active, actionLabel, t, isDark, onToggleTheme, onLogout }) {
  const meta = pageMeta[active] || { title: active, subtitle: "" };
  return (
    <div style={{ background: t.topBarBg, borderBottom: t.topBarBorder, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", position: "sticky", top: 0, zIndex: 10, boxSizing: "border-box", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.textPrimary, letterSpacing: -0.5, lineHeight: 1.2 }}>{meta.title}</h1>
          <p style={{ margin: 0, color: t.textSecondary, fontSize: 12, marginTop: 2 }}>{meta.subtitle}</p>
        </div>
        {actionLabel && (
          <button style={{ background: t.accent, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{actionLabel}</button>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: t.inputBg, border: t.inputBorder, borderRadius: 8, padding: "6px 12px" }}>
          <span style={{ color: "#94A3B8", fontSize: 13 }}>🔍</span>
          <input placeholder="Search..." style={{ border: "none", outline: "none", fontSize: 12, color: t.textPrimary, width: 130, background: "none" }} />
        </div>

        {/* ── Theme Toggle ───────────────────────────────────── */}
        <button
          onClick={onToggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            width: 34, height: 34, borderRadius: "50%",
            background: t.inputBg, border: t.inputBorder,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16,
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        <div style={{ position: "relative" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.inputBg, border: t.inputBorder, display: "flex", alignItems: "center", justifyContent: "center", color: t.textPrimary, cursor: "pointer", fontSize: 16 }}>🔔</div>
          <span style={{ position: "absolute", top: 0, right: 0, background: "#EF4444", color: "#fff", borderRadius: "50%", fontSize: 8, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>5</span>
        </div>

        {/* ── Logout Button ──────────────────────────────────── */}
        <button
          onClick={onLogout}
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "#FEE2E2",
            border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #FCA5A5",
            borderRadius: 8, padding: "7px 14px",
            color: isDark ? "#CBB6E6" : "#B91C1C",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          Sign out
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#06B6D4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, lineHeight: 1.2 }}>Admin</div>
            <div style={{ fontSize: 10, color: t.textSecondary }}>admin@edu.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: DASHBOARD
// ════════════════════════════════════════════════════════════════
function DashboardPage({ t }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
        <StatCard t={t} icon="👥" label="Total Users"       value="12,480" change="+5.1% registered"  color="#3B6CF4" />
        <StatCard t={t} icon="📚" label="Active Courses"    value="348"    change="+2.3% published"   color="#8B5CF6" />
        <StatCard t={t} icon="📋" label="Total Enrollments" value="28,940" change="+11% all time"     color="#06B6D4" />
        <StatCard t={t} icon="📄" label="Pending Reports"   value="14"     change="need review"       color="#F59E0B" />
      </div>

      <SectionDivider t={t} label="Monitoring Overview" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
        {monitoringStats.map(item => <MonitorCard key={item.label} item={item} t={t} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 14 }}>
        <SectionCard t={t} title="Enrollment Graph — Last 6 Months" action="Download CSV">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={enrollmentData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="value" fill="#3B6CF4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard t={t} title="Course Status Breakdown">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={courseStatusData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                {courseStatusData.map((_, i) => <Cell key={i} fill={COURSE_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", marginTop: 4 }}>
            {courseStatusData.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COURSE_COLORS[i], flexShrink: 0 }} />
                <span style={{ color: t.textBody }}>{s.name} <strong>{s.value}%</strong></span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionCard t={t} title="Completion vs Pending vs Dropped — Trend">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={completionTrend} margin={{ top: 4, right: 16, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} dot={false} name="Completed" />
              <Line type="monotone" dataKey="pending"   stroke="#F59E0B" strokeWidth={2} dot={false} name="Pending" />
              <Line type="monotone" dataKey="dropped"   stroke="#EF4444" strokeWidth={2} dot={false} name="Dropped" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {[["Completed","#22C55E"],["Pending","#F59E0B"],["Dropped","#EF4444"]].map(([l,c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 16, height: 3, background: c, borderRadius: 2 }} />
                <span style={{ color: t.textBody, fontWeight: 500 }}>{l}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionCard t={t} title="Top Courses — Completion Monitoring" action="View All">
          <Table
            t={t}
            cols={["Course Name","Enrolled","Completed","Pending","Dropped","Completion Rate"]}
            rows={topCourses.map((c, i) => (
              <tr key={i} style={{ borderBottom: t.rowBorder }}>
                <TD t={t} bold>{c.name}</TD>
                <TD t={t} color="#3B6CF4">{c.enrolled.toLocaleString()}</TD>
                <TD t={t} color="#22C55E">{c.completed.toLocaleString()}</TD>
                <TD t={t} color="#F59E0B">{c.pending}</TD>
                <TD t={t} color="#EF4444">{c.dropped}</TD>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: t.gridLine, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${c.rate}%`, height: "100%", background: "#22C55E", borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.textPrimary, flexShrink: 0, minWidth: 28 }}>{c.rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          />
        </SectionCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingBottom: 20 }}>
        <SectionCard t={t} title="Recent Activities" action="View All">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: t.textSecondary, marginTop: 1 }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: 10, color: t.textSecondary, flexShrink: 0, marginTop: 2 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionCard t={t} title="Users Overview" action="Manage">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ label: "Students", value: "9,840", color: "#3B6CF4" }, { label: "Instructors", value: "892", color: "#22C55E" }, { label: "Staff", value: "1,748", color: "#8B5CF6" }].map(u => (
                <div key={u.label} style={{ background: t.chipBg, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: u.color }}>{u.value}</div>
                  <div style={{ fontSize: 10, color: t.textSecondary, marginTop: 3, fontWeight: 600 }}>{u.label}</div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard t={t} title="Pending Reports" action="View All">
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {pendingReports.filter(r => r.status === "Pending").slice(0, 4).map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                    <div style={{ fontSize: 10, color: t.textSecondary, marginTop: 1 }}>{r.by} · Due {r.due}</div>
                  </div>
                  {priorityBadge(r.priority)}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: USERS
// ════════════════════════════════════════════════════════════════
function UsersPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const roles = ["All", "Student", "Instructor", "Staff"];
  const filtered = users.filter(u =>
    (filter === "All" || u.role === filter) &&
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard t={t} icon="👥" label="Total Users"   value={users.length}                                           change="registered"    color="#3B6CF4" />
        <StatCard t={t} icon="🎓" label="Students"      value={users.filter(u=>u.role==="Student").length}             change="enrolled"      color="#22C55E" />
        <StatCard t={t} icon="👨‍🏫" label="Instructors" value={users.filter(u=>u.role==="Instructor").length}          change="teaching"      color="#8B5CF6" />
        <StatCard t={t} icon="🟢" label="Active"        value={users.filter(u=>u.status==="Active").length}            change="active now"    color="#06B6D4" />
      </div>
      <SectionCard t={t} title="All Users">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search by name..." />
          <div style={{ display: "flex", gap: 6 }}>
            {roles.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.chipBg, color: filter === opt ? "#fff" : t.textBody }}>{opt}</button>
            ))}
          </div>
        </div>
        <Table
          t={t}
          cols={["#","Name","Email","Role","College","Joined","Status"]}
          rows={filtered.map(u => (
            <tr key={u.id} style={{ borderBottom: t.rowBorder }}>
              <TD t={t}>{u.id}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B6CF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{u.name.charAt(0)}</div>
                  <span style={{ fontWeight: 600, color: t.textPrimary, fontSize: 12 }}>{u.name}</span>
                </div>
              </td>
              <TD t={t}>{u.email}</TD>
              <TD t={t} color="#8B5CF6">{u.role}</TD>
              <TD t={t}>{u.college}</TD>
              <TD t={t}>{u.joined}</TD>
              <td style={{ padding: "10px 10px" }}>{statusBadge(u.status)}</td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSecondary, fontSize: 13 }}>No users found.</div>}
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: COURSES
// ════════════════════════════════════════════════════════════════
function CoursesPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Active", "Completing"];
  const filtered = courses.filter(c =>
    (filter === "All" || c.status === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard t={t} icon="📚" label="Total Courses" value={courses.length}                                        change="all colleges"    color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"        value={courses.filter(c=>c.status==="Active").length}         change="in delivery"     color="#22C55E" />
        <StatCard t={t} icon="✅" label="Completing"    value={courses.filter(c=>c.status==="Completing").length}     change="wrapping up"     color="#06B6D4" />
        <StatCard t={t} icon="👥" label="Total Enrolled" value={courses.reduce((s,c)=>s+c.enrolled,0).toLocaleString()} change="across all"   color="#8B5CF6" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 14 }}>
        <SectionCard t={t} title="Completion Rate by Course">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={courses.map(c => ({ name: c.name.split(" ").slice(0,2).join(" "), rate: c.completion }))} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0,100]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="rate" name="Completion %" fill="#3B6CF4" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard t={t} title="Enrollment per Course">
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {courses.map((c, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: t.textPrimary, fontWeight: 600 }}>{c.name.split(" ").slice(0,2).join(" ")}</span>
                  <span style={{ color: "#3B6CF4", fontWeight: 700 }}>{c.enrolled.toLocaleString()}</span>
                </div>
                <div style={{ height: 5, background: t.gridLine, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${c.completion}%`, height: "100%", background: "#3B6CF4", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard t={t} title="All Courses" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search course..." />
          <div style={{ display: "flex", gap: 6 }}>
            {statuses.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.chipBg, color: filter === opt ? "#fff" : t.textBody }}>{opt}</button>
            ))}
          </div>
        </div>
        <Table
          t={t}
          cols={["Course Name","College","Instructor","Modules","Duration","Enrolled","Completion","Status"]}
          rows={filtered.map(c => (
            <tr key={c.id} style={{ borderBottom: t.rowBorder }}>
              <TD t={t} bold>{c.name}</TD>
              <TD t={t}>{c.college}</TD>
              <TD t={t}>{c.instructor}</TD>
              <TD t={t} color="#8B5CF6">{c.modules}</TD>
              <TD t={t}>{c.duration}</TD>
              <TD t={t} color="#3B6CF4">{c.enrolled.toLocaleString()}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 60, height: 5, background: t.gridLine, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${c.completion}%`, height: "100%", background: "#22C55E", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.textPrimary }}>{c.completion}%</span>
                </div>
              </td>
              <td style={{ padding: "10px 10px" }}>{statusBadge(c.status)}</td>
            </tr>
          ))}
        />
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: COLLEGES
// ════════════════════════════════════════════════════════════════
function CollegesPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const plans = ["All", "Institutional", "Premium"];
  const filtered = colleges.filter(c =>
    (filter === "All" || c.plan === filter) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard t={t} icon="🎓" label="Total Colleges"      value={colleges.length}                                            change="institutions"     color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"              value={colleges.filter(c=>c.status==="Active").length}             change="subscribed"       color="#22C55E" />
        <StatCard t={t} icon="📋" label="Institutional Plans" value={colleges.filter(c=>c.plan==="Institutional").length}        change="enterprise tier"  color="#8B5CF6" />
        <StatCard t={t} icon="👥" label="Total Students"      value={colleges.reduce((s,c)=>s+c.students,0).toLocaleString()}   change="across all"       color="#06B6D4" />
      </div>
      <SectionCard t={t} title="All Colleges" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search college..." />
          <div style={{ display: "flex", gap: 6 }}>
            {plans.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.chipBg, color: filter === opt ? "#fff" : t.textBody }}>{opt}</button>
            ))}
          </div>
        </div>
        <Table
          t={t}
          cols={["#","College Name","Plan","Courses","Students","Revenue","Status"]}
          rows={filtered.map(c => (
            <tr key={c.id} style={{ borderBottom: t.rowBorder }}>
              <TD t={t}>{c.id}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "#3B6CF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.name.charAt(0)}</div>
                  <span style={{ fontWeight: 600, color: t.textPrimary, fontSize: 12 }}>{c.name}</span>
                </div>
              </td>
              <td style={{ padding: "10px 10px" }}>{planBadge(c.plan)}</td>
              <TD t={t} color="#8B5CF6">{c.courses}</TD>
              <TD t={t} color="#3B6CF4">{c.students.toLocaleString()}</TD>
              <TD t={t} color="#22C55E">{c.revenue}</TD>
              <td style={{ padding: "10px 10px" }}>{statusBadge(c.status)}</td>
            </tr>
          ))}
        />
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: VENDORS
// ════════════════════════════════════════════════════════════════
function VendorsPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const plans = ["All", "Enterprise", "Business", "Starter"];
  const filtered = vendors.filter(v =>
    (filter === "All" || v.plan === filter) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard t={t} icon="🛒" label="Total Vendors"     value={vendors.length}                                         change="partners"         color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"            value={vendors.filter(v=>v.status==="Active").length}          change="active now"       color="#22C55E" />
        <StatCard t={t} icon="📦" label="Total Subs Sold"   value={vendors.reduce((s,v)=>s+v.sold,0).toLocaleString()}     change="all vendors"      color="#8B5CF6" />
        <StatCard t={t} icon="💰" label="Total Revenue"     value="₹59,800"                                               change="from vendors"     color="#06B6D4" />
      </div>
      <SectionCard t={t} title="All Vendors" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search vendor..." />
          <div style={{ display: "flex", gap: 6 }}>
            {plans.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.chipBg, color: filter === opt ? "#fff" : t.textBody }}>{opt}</button>
            ))}
          </div>
        </div>
        <Table
          t={t}
          cols={["#","Vendor Name","Plan","Subscriptions Sold","Revenue","Status"]}
          rows={filtered.map(v => (
            <tr key={v.id} style={{ borderBottom: t.rowBorder }}>
              <TD t={t}>{v.id}</TD>
              <TD t={t} bold>{v.name}</TD>
              <td style={{ padding: "10px 10px" }}>{planBadge(v.plan)}</td>
              <TD t={t} color="#3B6CF4">{v.sold.toLocaleString()}</TD>
              <TD t={t} color="#22C55E">{v.revenue}</TD>
              <td style={{ padding: "10px 10px" }}>{statusBadge(v.status)}</td>
            </tr>
          ))}
        />
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: ENROLLMENTS
// ════════════════════════════════════════════════════════════════
function EnrollmentsPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Active", "Completed", "Pending", "Dropped"];
  const filtered = enrollments.filter(e =>
    (filter === "All" || e.status === filter) &&
    e.student.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard t={t} icon="📋" label="Total Enrollments" value={enrollments.length}                                           change="all time"     color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"            value={enrollments.filter(e=>e.status==="Active").length}            change="in progress"  color="#22C55E" />
        <StatCard t={t} icon="✅" label="Completed"         value={enrollments.filter(e=>e.status==="Completed").length}         change="finished"     color="#06B6D4" />
        <StatCard t={t} icon="❌" label="Dropped"           value={enrollments.filter(e=>e.status==="Dropped").length}           change="discontinued" color="#EF4444" />
      </div>
      <SectionCard t={t} title="All Enrollments" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search student..." />
          <div style={{ display: "flex", gap: 6 }}>
            {statuses.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.chipBg, color: filter === opt ? "#fff" : t.textBody }}>{opt}</button>
            ))}
          </div>
        </div>
        <Table
          t={t}
          cols={["#","Student","Course","College","Enrolled On","Progress","Status"]}
          rows={filtered.map(e => (
            <tr key={e.id} style={{ borderBottom: t.rowBorder }}>
              <TD t={t}>{e.id}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#3B6CF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{e.student.charAt(0)}</div>
                  <span style={{ fontWeight: 600, color: t.textPrimary, fontSize: 12 }}>{e.student}</span>
                </div>
              </td>
              <TD t={t}>{e.course}</TD>
              <TD t={t}>{e.college}</TD>
              <TD t={t}>{e.date}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 70, height: 5, background: t.gridLine, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${e.progress}%`, height: "100%", background: e.progress === 100 ? "#22C55E" : e.progress > 50 ? "#3B6CF4" : "#F59E0B", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, color: t.textBody }}>{e.progress}%</span>
                </div>
              </td>
              <td style={{ padding: "10px 10px" }}>{statusBadge(e.status)}</td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSecondary, fontSize: 13 }}>No enrollments found.</div>}
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: REPORTS
// ════════════════════════════════════════════════════════════════
function ReportsPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Completed", "Pending"];
  const filtered = pendingReports.filter(r =>
    (filter === "All" || r.status === filter) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );
  const typeColors = { Enrollment:"#3B6CF4", Progress:"#22C55E", Analytics:"#8B5CF6", Certificate:"#F59E0B" };
  const monthlyReports = [
    { month:"Jan",completed:6,pending:2 },{ month:"Feb",completed:8,pending:3 },
    { month:"Mar",completed:5,pending:4 },{ month:"Apr",completed:9,pending:2 },
    { month:"May",completed:11,pending:1},{ month:"Jun",completed:4,pending:4 },
  ];
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        <StatCard t={t} icon="📊" label="Total Reports"  value={pendingReports.length}                                          change="all time"       color="#3B6CF4" />
        <StatCard t={t} icon="✅" label="Completed"      value={pendingReports.filter(r=>r.status==="Completed").length}        change="ready"          color="#22C55E" />
        <StatCard t={t} icon="⏳" label="Pending"        value={pendingReports.filter(r=>r.status==="Pending").length}          change="need attention" color="#F59E0B" />
        <StatCard t={t} icon="🔴" label="High Priority"  value={pendingReports.filter(r=>r.priority==="High").length}           change="urgent"         color="#EF4444" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 14 }}>
        <SectionCard t={t} title="Monthly Report Activity">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyReports} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[4,4,0,0]} />
              <Bar dataKey="pending"   name="Pending"   fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[["Completed","#22C55E"],["Pending","#F59E0B"]].map(([l,c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
                <span style={{ color: t.textBody }}>{l}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard t={t} title="Quick Report Cards">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { title: "Enrollment Report", icon: "📋", color: "#3B6CF4" },
              { title: "Attendance Report", icon: "📅", color: "#22C55E" },
              { title: "Progress Report",   icon: "📈", color: "#8B5CF6" },
              { title: "Analytics Export",  icon: "📊", color: "#06B6D4" },
            ].map((q, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: t.chipBg, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontSize: 18 }}>{q.icon}</span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: t.textPrimary }}>{q.title}</span>
                <button style={{ fontSize: 10, color: q.color, background: q.color + "18", border: "none", borderRadius: 6, padding: "3px 9px", cursor: "pointer", fontWeight: 600 }}>Generate</button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      <SectionCard t={t} title="All Reports" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search report..." />
          <div style={{ display: "flex", gap: 6 }}>
            {statuses.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.chipBg, color: filter === opt ? "#fff" : t.textBody }}>{opt}</button>
            ))}
          </div>
        </div>
        <Table
          t={t}
          cols={["#","Title","Type","By","Due","Priority","Status","Action"]}
          rows={filtered.map(r => (
            <tr key={r.id} style={{ borderBottom: t.rowBorder }}>
              <TD t={t}>{r.id}</TD>
              <TD t={t} bold>{r.title}</TD>
              <td style={{ padding: "10px 10px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: (typeColors[r.type]||"#3B6CF4") + "20", color: typeColors[r.type]||"#3B6CF4" }}>{r.type}</span>
              </td>
              <TD t={t}>{r.by}</TD>
              <TD t={t}>{r.due}</TD>
              <td style={{ padding: "10px 10px" }}>{priorityBadge(r.priority)}</td>
              <td style={{ padding: "10px 10px" }}>{statusBadge(r.status)}</td>
              <td style={{ padding: "10px 10px" }}>
                <button style={{ fontSize: 11, color: "#1D4ED8", background: "#DBEAFE", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>
                  {r.status === "Completed" ? "⬇ Download" : "👁 View"}
                </button>
              </td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSecondary, fontSize: 13 }}>No reports found.</div>}
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: MONITORING
// ════════════════════════════════════════════════════════════════
function MonitoringPage({ t }) {
  const systemHealth = [
    { name: "API Gateway",    uptime: "99.98%", status: "Operational" },
    { name: "Auth Service",   uptime: "99.95%", status: "Operational" },
    { name: "Video CDN",      uptime: "97.20%", status: "Degraded"    },
    { name: "DB Cluster",     uptime: "99.99%", status: "Operational" },
    { name: "Email Service",  uptime: "98.50%", status: "Operational" },
    { name: "Storage Service",uptime: "99.91%", status: "Operational" },
  ];
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
        {monitoringStats.map(item => <MonitorCard key={item.label} item={item} t={t} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
        <SectionCard t={t} title="System Health">
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {systemHealth.map(s => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "Operational" ? "#22C55E" : "#F59E0B", flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: t.textBody, fontWeight: 500 }}>{s.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>{s.uptime}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: s.status === "Operational" ? "#F0FDF4" : "#FFFBEB", color: s.status === "Operational" ? "#16A34A" : "#D97706" }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard t={t} title="Enrollment Trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#3B6CF4" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
      <SectionCard t={t} title="Completion vs Pending vs Dropped" style={{ paddingBottom: 20 }}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={completionTrend} margin={{ top: 4, right: 16, left: -22, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={t.gridLine} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} dot={false} name="Completed" />
            <Line type="monotone" dataKey="pending"   stroke="#F59E0B" strokeWidth={2} dot={false} name="Pending" />
            <Line type="monotone" dataKey="dropped"   stroke="#EF4444" strokeWidth={2} dot={false} name="Dropped" />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          {[["Completed","#22C55E"],["Pending","#F59E0B"],["Dropped","#EF4444"]].map(([l,c]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
              <div style={{ width: 16, height: 3, background: c, borderRadius: 2 }} />
              <span style={{ color: t.textBody, fontWeight: 500 }}>{l}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [isDark, setIsDark] = useState(false);
  const { logout } = useAuth();

  const t = getTokens(isDark);

  const pages = {
    Dashboard:   <DashboardPage t={t} />,
    Users:       <UsersPage t={t} />,
    Courses:     <CoursesPage t={t} />,
    Colleges:    <CollegesPage t={t} />,
    Vendors:     <VendorsPage t={t} />,
    Enrollments: <EnrollmentsPage t={t} />,
    Reports:     <ReportsPage t={t} />,
    Monitoring:  <MonitoringPage t={t} />,
  };

  return (
    <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: t.pageBg, height: "100vh", width: "100%", overflow: "hidden" }}>
      <Sidebar active={active} setActive={setActive} t={t} />
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden", height: "100vh", padding: "0 0", boxSizing: "border-box", minWidth: 0 }}>
        <TopBar
          active={active}
          actionLabel={pageActions[active]}
          t={t}
          isDark={isDark}
          onToggleTheme={() => setIsDark(prev => !prev)}
          onLogout={logout}
        />
        <div style={{ padding: "20px 22px", boxSizing: "border-box" }}>
          {pages[active] || <DashboardPage t={t} />}
        </div>
      </main>
    </div>
  );
}