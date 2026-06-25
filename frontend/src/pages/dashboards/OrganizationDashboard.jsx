import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as XLSX from "xlsx";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

// ════════════════════════════════════════════════════════════════
//  SHARED DATA
// ════════════════════════════════════════════════════════════════
const batchProgress = [
  { month: "Jan", students: 1300 }, { month: "Feb", students: 1480 },
  { month: "Mar", students: 1260 }, { month: "Apr", students: 1620 },
  { month: "May", students: 2080 }, { month: "Jun", students: 2560 },
];
const completionTrend = [
  { month: "Jan", completed: 320, pending: 210, dropped: 80 },
  { month: "Feb", completed: 410, pending: 190, dropped: 60 },
  { month: "Mar", completed: 380, pending: 230, dropped: 90 },
  { month: "Apr", completed: 520, pending: 170, dropped: 55 },
  { month: "May", completed: 610, pending: 150, dropped: 40 },
  { month: "Jun", completed: 720, pending: 130, dropped: 35 },
];
const batchStatusData = [
  { name: "Active", value: 55 }, { name: "Completing", value: 25 },
  { name: "Pending", value: 12 }, { name: "Closed", value: 8 },
];
const BATCH_COLORS = ["#3B6CF4", "#22C55E", "#F59E0B", "#EF4444"];

const batches = [
  { id: 1, name: "Batch A — Web Dev",      status: "Active",     percent: 82, students: 62, instructor: "Prof. Sharma", start: "Jan 10, 2026", end: "Jul 10, 2026" },
  { id: 2, name: "Batch B — Data Science", status: "Active",     percent: 65, students: 48, instructor: "Dr. Mehta",   start: "Feb 01, 2026", end: "Aug 01, 2026" },
  { id: 3, name: "Batch C — UI/UX Design", status: "Completing", percent: 91, students: 38, instructor: "Ms. Iyer",    start: "Mar 05, 2026", end: "Jun 30, 2026" },
  { id: 4, name: "Batch D — DevOps",       status: "Active",     percent: 45, students: 30, instructor: "Mr. Nair",    start: "Apr 15, 2026", end: "Oct 15, 2026" },
  { id: 5, name: "Batch E — ML Basics",    status: "Pending",    percent: 12, students: 44, instructor: "Dr. Rao",     start: "Jun 20, 2026", end: "Dec 20, 2026" },
];

const students = [
  { id: 1,  name: "Aditi Sharma",  batch: "Batch C — UI/UX Design",  grade: "A+", status: "Completed", email: "aditi@edu.com",  attendance: 98, dept: "Design", year: "3rd Year", score: 96 },
  { id: 2,  name: "Rohan Mehta",   batch: "Batch A — Web Dev",        grade: "A",  status: "Active",    email: "rohan@edu.com",  attendance: 91, dept: "CSE",    year: "2nd Year", score: 89 },
  { id: 3,  name: "Sara Khan",     batch: "Batch B — Data Science",   grade: "A",  status: "Active",    email: "sara@edu.com",   attendance: 87, dept: "CSE",    year: "3rd Year", score: 91 },
  { id: 4,  name: "Vikram Iyer",   batch: "Batch C — UI/UX Design",   grade: "B+", status: "Completed", email: "vikram@edu.com", attendance: 82, dept: "Design", year: "2nd Year", score: 85 },
  { id: 5,  name: "Priya Nair",    batch: "Batch A — Web Dev",        grade: "A-", status: "Completed", email: "priya@edu.com",  attendance: 94, dept: "CSE",    year: "4th Year", score: 88 },
  { id: 6,  name: "Arjun Das",     batch: "Batch D — DevOps",         grade: "B",  status: "Active",    email: "arjun@edu.com",  attendance: 76, dept: "IT",     year: "3rd Year", score: 78 },
  { id: 7,  name: "Neha Patel",    batch: "Batch E — ML Basics",      grade: "—",  status: "Pending",   email: "neha@edu.com",   attendance: 0,  dept: "AI/ML",  year: "1st Year", score: 0  },
  { id: 8,  name: "Kiran Rao",     batch: "Batch B — Data Science",   grade: "C+", status: "Dropped",   email: "kiran@edu.com",  attendance: 42, dept: "CSE",    year: "2nd Year", score: 58 },
  { id: 9,  name: "Divya Singh",   batch: "Batch A — Web Dev",        grade: "B+", status: "Active",    email: "divya@edu.com",  attendance: 88, dept: "CSE",    year: "1st Year", score: 83 },
  { id: 10, name: "Rahul Kumar",   batch: "Batch D — DevOps",         grade: "B-", status: "Active",    email: "rahul@edu.com",  attendance: 79, dept: "IT",     year: "4th Year", score: 75 },
];

const courses = [
  { id: 1, name: "Web Development Fundamentals", batch: "Batch A", instructor: "Prof. Sharma", modules: 12, duration: "6 months", enrolled: 62, completion: 82, status: "Active"     },
  { id: 2, name: "Data Science Bootcamp",         batch: "Batch B", instructor: "Dr. Mehta",   modules: 16, duration: "6 months", enrolled: 48, completion: 65, status: "Active"     },
  { id: 3, name: "UI/UX Design Principles",       batch: "Batch C", instructor: "Ms. Iyer",    modules: 10, duration: "4 months", enrolled: 38, completion: 91, status: "Completing" },
  { id: 4, name: "DevOps & Cloud Essentials",     batch: "Batch D", instructor: "Mr. Nair",    modules: 14, duration: "6 months", enrolled: 30, completion: 45, status: "Active"     },
  { id: 5, name: "ML Basics & Applications",      batch: "Batch E", instructor: "Dr. Rao",     modules: 18, duration: "6 months", enrolled: 44, completion: 12, status: "Pending"    },
];

const assignments = [
  { id: 1,  title: "HTML & CSS Portfolio",     course: "Web Dev",      student: "Rohan Mehta",  due: "Jun 25, 2026", submitted: "Jun 23, 2026", grade: "A",  status: "Graded"  },
  { id: 2,  title: "Python Data Analysis",     course: "Data Science", student: "Sara Khan",    due: "Jun 24, 2026", submitted: "Jun 22, 2026", grade: "A",  status: "Graded"  },
  { id: 3,  title: "Figma Prototype",          course: "UI/UX",        student: "Aditi Sharma", due: "Jun 20, 2026", submitted: "Jun 19, 2026", grade: "A+", status: "Graded"  },
  { id: 4,  title: "Docker Containerization",  course: "DevOps",       student: "Arjun Das",    due: "Jun 28, 2026", submitted: "—",            grade: "—",  status: "Pending" },
  { id: 5,  title: "Neural Network Basics",    course: "ML Basics",    student: "Neha Patel",   due: "Jul 05, 2026", submitted: "—",            grade: "—",  status: "Pending" },
  { id: 6,  title: "React Component Library",  course: "Web Dev",      student: "Divya Singh",  due: "Jun 30, 2026", submitted: "Jun 29, 2026", grade: "B+", status: "Graded"  },
  { id: 7,  title: "ML Feature Engineering",   course: "Data Science", student: "Vikram Iyer",  due: "Jun 22, 2026", submitted: "—",            grade: "—",  status: "Overdue" },
  { id: 8,  title: "CI/CD Pipeline Setup",     course: "DevOps",       student: "Rahul Kumar",  due: "Jul 02, 2026", submitted: "—",            grade: "—",  status: "Pending" },
  { id: 9,  title: "User Research Report",     course: "UI/UX",        student: "Priya Nair",   due: "Jun 18, 2026", submitted: "Jun 17, 2026", grade: "A-", status: "Graded"  },
  { id: 10, title: "JavaScript Algorithms",    course: "Web Dev",      student: "Rohan Mehta",  due: "Jul 08, 2026", submitted: "—",            grade: "—",  status: "Pending" },
];

const reports = [
  { id: 1, title: "Q2 Enrollment Summary",       type: "Enrollment",  by: "Prof. Sharma", date: "Jun 20, 2026", status: "Completed", priority: "High"   },
  { id: 2, title: "Batch A Progress Report",     type: "Progress",    by: "Prof. Sharma", date: "Jun 18, 2026", status: "Completed", priority: "Medium" },
  { id: 3, title: "Student Attendance — May",    type: "Attendance",  by: "Admin",        date: "Jun 15, 2026", status: "Completed", priority: "Low"    },
  { id: 4, title: "Course Completion Analysis",  type: "Analytics",   by: "Dr. Mehta",    date: "Jun 25, 2026", status: "Pending",   priority: "High"   },
  { id: 5, title: "Batch D Review",              type: "Progress",    by: "Mr. Nair",     date: "Jun 27, 2026", status: "Pending",   priority: "Medium" },
  { id: 6, title: "Assignment Submission Stats", type: "Analytics",   by: "Ms. Iyer",     date: "Jun 28, 2026", status: "Pending",   priority: "Low"    },
  { id: 7, title: "Certificate Issuance Log",    type: "Certificate", by: "Admin",        date: "Jun 22, 2026", status: "Completed", priority: "Low"    },
  { id: 8, title: "Dropout Analysis Q2",         type: "Analytics",   by: "Dr. Rao",      date: "Jun 30, 2026", status: "Pending",   priority: "High"   },
];

const monitoringStats = [
  { label: "Certificates Issued",   value: "386",  change: "+22%",  icon: "🏅", color: "#06B6D4", bg: "#ECFEFF" },
  { label: "Assignments Pending",   value: "94",   change: "-11%",  icon: "📋", color: "#F59E0B", bg: "#FFFBEB" },
  { label: "Avg. Completion Rate",  value: "74%",  change: "+5%",   icon: "📈", color: "#8B5CF6", bg: "#F5F3FF" },
  { label: "Active Learners Today", value: "642",  change: "+8.3%", icon: "🟢", color: "#22C55E", bg: "#F0FDF4" },
  { label: "Dropped Enrollments",   value: "28",   change: "-6.5%", icon: "❌", color: "#EF4444", bg: "#FEF2F2" },
  { label: "Batches Running",       value: "8",    change: "+1",    icon: "🎓", color: "#3B6CF4", bg: "#EFF6FF" },
];

const recentActivities = [
  { icon: "🎓", title: "Certificate issued — Aditi Sharma",    sub: "Batch C — UI/UX Design", time: "2m ago",  color: "#22C55E" },
  { icon: "📋", title: "New enrollment — Rohan Mehta",         sub: "Batch A — Web Dev",      time: "18m ago", color: "#3B6CF4" },
  { icon: "✅", title: "Assignment submitted — Sara Khan",     sub: "Batch B — Data Science", time: "35m ago", color: "#22C55E" },
  { icon: "⚠️", title: "Report pending — Batch D review",     sub: "DevOps Progress",         time: "1h ago",  color: "#F59E0B" },
  { icon: "👤", title: "New student registered — Vikram Iyer", sub: "Batch C — UI/UX Design", time: "2h ago",  color: "#8B5CF6" },
  { icon: "📊", title: "Analytics exported — Prof. Nair",     sub: "Q2 Completion Report",    time: "3h ago",  color: "#06B6D4" },
];

const certificates = [
  { name: "Aditi Sharma", batch: "Batch C — UI/UX Design", date: "Jun 20, 2026", grade: "A+" },
  { name: "Rohan Mehta",  batch: "Batch A — Web Dev",      date: "Jun 18, 2026", grade: "A"  },
  { name: "Sara Khan",    batch: "Batch B — Data Science", date: "Jun 15, 2026", grade: "A"  },
  { name: "Vikram Iyer",  batch: "Batch C — UI/UX Design", date: "Jun 12, 2026", grade: "B+" },
  { name: "Priya Nair",   batch: "Batch A — Web Dev",      date: "Jun 10, 2026", grade: "A-" },
];

const mentors = [
  { id: 1,  name: "Prof. Arjun Sharma",   email: "arjun.sharma@edu.com",   batch: "Batch A — Web Dev",        specialization: "Full Stack Dev",  status: "Active",   lastLogin: "Jun 25, 2026",  students: 62, role: "Lead Mentor"    },
  { id: 2,  name: "Dr. Priya Mehta",      email: "priya.mehta@edu.com",    batch: "Batch B — Data Science",   specialization: "Data Science",    status: "Active",   lastLogin: "Jun 24, 2026",  students: 48, role: "Lead Mentor"    },
  { id: 3,  name: "Ms. Kavya Iyer",       email: "kavya.iyer@edu.com",     batch: "Batch C — UI/UX Design",   specialization: "UX Research",     status: "Active",   lastLogin: "Jun 23, 2026",  students: 38, role: "Co-Mentor"      },
  { id: 4,  name: "Mr. Suresh Nair",      email: "suresh.nair@edu.com",    batch: "Batch D — DevOps",         specialization: "Cloud & DevOps",  status: "Active",   lastLogin: "Jun 22, 2026",  students: 30, role: "Lead Mentor"    },
  { id: 5,  name: "Dr. Ramesh Rao",       email: "ramesh.rao@edu.com",     batch: "Batch E — ML Basics",      specialization: "Machine Learning",status: "Inactive", lastLogin: "Jun 10, 2026",  students: 44, role: "Lead Mentor"    },
  { id: 6,  name: "Ms. Nithya Krishnan",  email: "nithya.k@edu.com",       batch: "Batch A — Web Dev",        specialization: "Frontend Dev",    status: "Active",   lastLogin: "Jun 25, 2026",  students: 30, role: "Co-Mentor"      },
  { id: 7,  name: "Mr. Vikram Bose",      email: "vikram.bose@edu.com",     batch: "Batch B — Data Science",   specialization: "Python & ML",     status: "Suspended",lastLogin: "May 30, 2026",  students: 20, role: "Guest Mentor"   },
  { id: 8,  name: "Dr. Ananya Pillai",    email: "ananya.pillai@edu.com",  batch: "Batch C — UI/UX Design",   specialization: "Interaction Design",status:"Active",  lastLogin: "Jun 24, 2026",  students: 18, role: "Co-Mentor"      },
];

const navItems = [
  { icon: "⊞", label: "Dashboard"    },
  { icon: "👥", label: "Students"    },
  { icon: "📦", label: "Batches"     },
  { icon: "📚", label: "Courses"     },
  { icon: "📋", label: "Assignments" },
  { icon: "📊", label: "Reports"     },
  { icon: "🧑‍🏫", label: "Mentors"    },
];

const pageMeta = {
  Dashboard:   { title: "Dashboard",    subtitle: "Monday, June 22, 2026"         },
  Students:    { title: "Students",     subtitle: "Manage all enrolled students"   },
  Batches:     { title: "Batches",      subtitle: "Track all batch progress"       },
  Courses:     { title: "Courses",      subtitle: "All courses across batches"     },
  Assignments: { title: "Assignments",  subtitle: "Submissions and grading"        },
  Reports:     { title: "Reports",      subtitle: "Analytics and exports"          },
  Mentors:     { title: "Mentor Logins", subtitle: "Manage mentor accounts & access" },
};

// ════════════════════════════════════════════════════════════════
//  THEME TOKENS — light & dark
// ════════════════════════════════════════════════════════════════
const THEMES = {
  light: {
    bg:          "#F8FAFC",
    sidebar:     "#0F172A",
    sidebarBorder:"#1E293B",
    sidebarText: "#94A3B8",
    sidebarActive:"#1E40AF",
    sidebarActiveBorder:"#60A5FA",
    card:        "#fff",
    cardBorder:  "#E2E8F0",
    topbar:      "#F8FAFC",
    topbarBorder:"#E2E8F0",
    text:        "#0F172A",
    textSub:     "#94A3B8",
    inputBg:     "#F8FAFC",
    tableBorder: "#F1F5F9",
    accent:      "#3B6CF4",
    logoutBg:    "#FEE2E2",
    logoutColor: "#B91C1C",
    themeBtnBg:  "#F1F5F9",
    themeBtnColor:"#475569",
  },
  dark: {
    bg:          "#0B1120",
    sidebar:     "#060D1A",
    sidebarBorder:"#111827",
    sidebarText: "#64748B",
    sidebarActive:"#1E3A8A",
    sidebarActiveBorder:"#3B6CF4",
    card:        "#0F1E35",
    cardBorder:  "#1E2D45",
    topbar:      "#0A1628",
    topbarBorder:"#1E2D45",
    text:        "#F1F5F9",
    textSub:     "#64748B",
    inputBg:     "#0F1E35",
    tableBorder: "#1E2D45",
    accent:      "#3B6CF4",
    logoutBg:    "rgba(185,28,28,0.15)",
    logoutColor: "#FCA5A5",
    themeBtnBg:  "#1E2D45",
    themeBtnColor:"#94A3B8",
  },
};

// ════════════════════════════════════════════════════════════════
//  EXCEL EXPORT UTILITIES
// ════════════════════════════════════════════════════════════════
function applyHeaderStyle(ws, range, color = "2563EB") {
  for (let C = range.s.c; C <= range.e.c; C++) {
    const addr = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    if (!ws[addr]) continue;
    ws[addr].s = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11, name: "Arial" },
      fill: { fgColor: { rgb: color }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top:    { style: "thin", color: { rgb: "CCCCCC" } },
        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
        left:   { style: "thin", color: { rgb: "CCCCCC" } },
        right:  { style: "thin", color: { rgb: "CCCCCC" } },
      },
    };
  }
}

function applyRowStyle(ws, rowIdx, colCount, isEven) {
  for (let C = 0; C < colCount; C++) {
    const addr = XLSX.utils.encode_cell({ r: rowIdx, c: C });
    if (!ws[addr]) ws[addr] = { t: "s", v: "" };
    ws[addr].s = {
      font: { sz: 10, name: "Arial" },
      fill: { fgColor: { rgb: isEven ? "F0F4FF" : "FFFFFF" }, patternType: "solid" },
      alignment: { vertical: "center", wrapText: false },
      border: {
        top:    { style: "thin", color: { rgb: "E2E8F0" } },
        bottom: { style: "thin", color: { rgb: "E2E8F0" } },
        left:   { style: "thin", color: { rgb: "E2E8F0" } },
        right:  { style: "thin", color: { rgb: "E2E8F0" } },
      },
    };
  }
}

function buildStyledSheet(headers, rows) {
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  applyHeaderStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } });
  for (let R = 1; R <= rows.length; R++) applyRowStyle(ws, R, headers.length, R % 2 === 0);
  ws["!cols"] = headers.map((h, i) => {
    const maxLen = Math.max(h.length, ...rows.map(r => String(r[i] ?? "").length));
    return { wch: Math.min(Math.max(maxLen + 2, 10), 40) };
  });
  ws["!rows"] = [{ hpt: 22 }, ...rows.map(() => ({ hpt: 18 }))];
  return ws;
}

function addSummarySheet(wb, summaryRows) {
  const ws = XLSX.utils.aoa_to_sheet([["Metric", "Value"], ...summaryRows]);
  applyHeaderStyle(ws, { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, "1E40AF");
  ws["!cols"] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, ws, "Summary");
}

let _showSaveDialog = null;
function triggerSaveDialog(wb, filename) {
  if (_showSaveDialog) _showSaveDialog(wb, filename);
}

function wbToBlobUrl(wb) {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  return URL.createObjectURL(blob);
}

function SaveDialog() {
  const [pending, setPending] = useState(null);
  const [status, setStatus]   = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  _showSaveDialog = (wb, filename) => {
    setPending({ wb, filename });
    setStatus(null);
    setStatusMsg("");
  };

  if (!pending) return null;

  const handleSaveAs = () => {
    const url = wbToBlobUrl(pending.wb);
    const a = document.createElement("a");
    a.href = url; a.download = pending.filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    setStatus("done");
    setStatusMsg("File downloaded successfully.");
  };

  const close = () => { setPending(null); setStatus(null); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💾</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Save Report</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>Choose where to save your file</div>
            </div>
          </div>
          {!status && <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94A3B8" }}>✕</button>}
        </div>
        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", margin: "14px 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>📄</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pending.filename}</span>
        </div>
        {status === "done" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 13, color: "#15803D", fontWeight: 600, marginBottom: 14 }}>{statusMsg}</div>
            <button onClick={close} style={{ background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={handleSaveAs} style={{ display: "flex", alignItems: "center", gap: 14, background: "#F8FAFC", border: "2px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>📂</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Save As… (choose folder)</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Opens your browser's download dialog</div>
              </div>
            </button>
            <button onClick={close} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer", padding: "4px 0", fontWeight: 500 }}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  EXPORT BUILDERS
// ════════════════════════════════════════════════════════════════
function exportStudents(data, filename = "Students_Report.xlsx") {
  const wb = XLSX.utils.book_new();
  const headers = ["#", "Name", "Email", "Department", "Year", "Batch", "Attendance (%)", "Grade", "Score", "Status"];
  const rows = data.map(s => [s.id, s.name, s.email, s.dept, s.year, s.batch, s.attendance, s.grade, s.score, s.status]);
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(headers, rows), "Students");
  const avgScore = data.length ? Math.round(data.reduce((a, s) => a + s.score, 0) / data.length) : 0;
  const avgAtt   = data.length ? Math.round(data.reduce((a, s) => a + s.attendance, 0) / data.length) : 0;
  addSummarySheet(wb, [
    ["Total Students", data.length],
    ["Active",    data.filter(s => s.status === "Active").length],
    ["Completed", data.filter(s => s.status === "Completed").length],
    ["Dropped",   data.filter(s => s.status === "Dropped").length],
    ["Average Score", avgScore],
    ["Average Attendance (%)", avgAtt],
    ["Generated On", new Date().toLocaleString()],
  ]);
  triggerSaveDialog(wb, filename);
}

function exportBatches() {
  const wb = XLSX.utils.book_new();
  const headers = ["#", "Batch Name", "Instructor", "Students", "Start Date", "End Date", "Progress (%)", "Status"];
  const rows = batches.map(b => [b.id, b.name, b.instructor, b.students, b.start, b.end, b.percent, b.status]);
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(headers, rows), "Batches");
  addSummarySheet(wb, [
    ["Total Batches", batches.length],
    ["Active",        batches.filter(b => b.status === "Active").length],
    ["Completing",    batches.filter(b => b.status === "Completing").length],
    ["Pending",       batches.filter(b => b.status === "Pending").length],
    ["Avg Completion (%)", Math.round(batches.reduce((a, b) => a + b.percent, 0) / batches.length)],
    ["Generated On",  new Date().toLocaleString()],
  ]);
  triggerSaveDialog(wb, "Batches_Report.xlsx");
}

function exportCourses() {
  const wb = XLSX.utils.book_new();
  const headers = ["#", "Course Name", "Batch", "Instructor", "Modules", "Duration", "Enrolled", "Completion (%)", "Status"];
  const rows = courses.map(c => [c.id, c.name, c.batch, c.instructor, c.modules, c.duration, c.enrolled, c.completion, c.status]);
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(headers, rows), "Courses");
  addSummarySheet(wb, [
    ["Total Courses", courses.length],
    ["Active",        courses.filter(c => c.status === "Active").length],
    ["Avg Completion (%)", Math.round(courses.reduce((a, c) => a + c.completion, 0) / courses.length)],
    ["Total Enrolled", courses.reduce((a, c) => a + c.enrolled, 0)],
    ["Generated On",  new Date().toLocaleString()],
  ]);
  triggerSaveDialog(wb, "Courses_Report.xlsx");
}

function exportAssignments(data) {
  const wb = XLSX.utils.book_new();
  const headers = ["#", "Title", "Course", "Student", "Due Date", "Submitted Date", "Grade", "Status"];
  const rows = data.map(a => [a.id, a.title, a.course, a.student, a.due, a.submitted, a.grade, a.status]);
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(headers, rows), "Assignments");
  addSummarySheet(wb, [
    ["Total", data.length],
    ["Graded",  data.filter(a => a.status === "Graded").length],
    ["Pending", data.filter(a => a.status === "Pending").length],
    ["Overdue", data.filter(a => a.status === "Overdue").length],
    ["Generated On", new Date().toLocaleString()],
  ]);
  triggerSaveDialog(wb, "Assignments_Report.xlsx");
}

function exportReportsList(data) {
  const wb = XLSX.utils.book_new();
  const headers = ["#", "Title", "Type", "Generated By", "Date", "Priority", "Status"];
  const rows = data.map(r => [r.id, r.title, r.type, r.by, r.date, r.priority, r.status]);
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(headers, rows), "Reports");
  addSummarySheet(wb, [
    ["Total Reports", data.length],
    ["Completed", data.filter(r => r.status === "Completed").length],
    ["Pending",   data.filter(r => r.status === "Pending").length],
    ["High Priority", data.filter(r => r.priority === "High").length],
    ["Generated On", new Date().toLocaleString()],
  ]);
  triggerSaveDialog(wb, "Reports_List.xlsx");
}

function exportFullDashboard() {
  const wb = XLSX.utils.book_new();
  const sH = ["#", "Name", "Email", "Department", "Year", "Batch", "Attendance (%)", "Grade", "Score", "Status"];
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(sH, students.map(s => [s.id, s.name, s.email, s.dept, s.year, s.batch, s.attendance, s.grade, s.score, s.status])), "Students");
  const bH = ["#", "Batch Name", "Instructor", "Students", "Start Date", "End Date", "Progress (%)", "Status"];
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(bH, batches.map(b => [b.id, b.name, b.instructor, b.students, b.start, b.end, b.percent, b.status])), "Batches");
  const cH = ["#", "Course Name", "Batch", "Instructor", "Modules", "Duration", "Enrolled", "Completion (%)", "Status"];
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(cH, courses.map(c => [c.id, c.name, c.batch, c.instructor, c.modules, c.duration, c.enrolled, c.completion, c.status])), "Courses");
  const aH = ["#", "Title", "Course", "Student", "Due Date", "Submitted Date", "Grade", "Status"];
  XLSX.utils.book_append_sheet(wb, buildStyledSheet(aH, assignments.map(a => [a.id, a.title, a.course, a.student, a.due, a.submitted, a.grade, a.status])), "Assignments");
  addSummarySheet(wb, [
    ["Total Students",    students.length],
    ["Total Batches",     batches.length],
    ["Total Courses",     courses.length],
    ["Total Assignments", assignments.length],
    ["Active Students",   students.filter(s => s.status === "Active").length],
    ["Avg Student Score", Math.round(students.reduce((a, s) => a + s.score, 0) / students.length)],
    ["Avg Batch Progress (%)", Math.round(batches.reduce((a, b) => a + b.percent, 0) / batches.length)],
    ["Generated On", new Date().toLocaleString()],
  ]);
  triggerSaveDialog(wb, "EduPlatform_Full_Report.xlsx");
}

// ════════════════════════════════════════════════════════════════
//  CSS
// ════════════════════════════════════════════════════════════════
const makeCSS = (t) => `
  .edu-grid-4  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .edu-grid-3  { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .edu-grid-2  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .edu-grid-2-1{ display: grid; grid-template-columns: 2fr 1fr; gap: 12px; }
  .edu-grid-5  { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
  .edu-grid-4q { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

  @media (max-width: 1100px) {
    .edu-grid-4  { grid-template-columns: repeat(2, 1fr); }
    .edu-grid-3  { grid-template-columns: repeat(2, 1fr); }
    .edu-grid-2-1{ grid-template-columns: 1fr; }
    .edu-grid-5  { grid-template-columns: repeat(3, 1fr); }
    .edu-grid-4q { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 720px) {
    .edu-grid-4  { grid-template-columns: repeat(2, 1fr); }
    .edu-grid-3  { grid-template-columns: 1fr; }
    .edu-grid-2  { grid-template-columns: 1fr; }
    .edu-grid-2-1{ grid-template-columns: 1fr; }
    .edu-grid-5  { grid-template-columns: repeat(2, 1fr); }
    .edu-grid-4q { grid-template-columns: repeat(2, 1fr); }
    .edu-hide-mobile   { display: none !important; }
    .edu-topbar-search { display: none !important; }
  }
  @media (max-width: 480px) {
    .edu-grid-4  { grid-template-columns: 1fr 1fr; }
    .edu-grid-4q { grid-template-columns: 1fr 1fr; }
    .edu-grid-5  { grid-template-columns: 1fr 1fr; }
  }

  .edu-sidebar { transition: transform 0.25s ease; }
  .edu-filter-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .edu-btn-group  { display: flex; gap: 6px; flex-wrap: wrap; }

  .edu-export-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #16A34A; color: #fff; border: none;
    border-radius: 8px; padding: 7px 14px; font-size: 12px;
    font-weight: 600; cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
  }
  .edu-export-btn:hover { background: #15803D; }
  .edu-export-btn-sm {
    display: inline-flex; align-items: center; gap: 4px;
    background: #DCFCE7; color: #15803D; border: none;
    border-radius: 6px; padding: 4px 10px; font-size: 11px;
    font-weight: 600; cursor: pointer; white-space: nowrap;
  }
  .edu-export-btn-sm:hover { background: #BBF7D0; }

  .edu-main     { flex: 1; overflow-y: auto; overflow-x: hidden; height: 100vh; min-width: 0; box-sizing: border-box; background: ${t.bg}; }
  .edu-page-pad { padding: 20px 22px; box-sizing: border-box; }
  @media (max-width: 720px) { .edu-page-pad { padding: 14px 12px; } }

  .edu-hamburger {
    display: none; background: none; border: none; cursor: pointer;
    font-size: 20px; padding: 4px 8px; color: ${t.text};
  }
  @media (max-width: 900px) { .edu-hamburger { display: block; } }

  .edu-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 99; }
  .edu-overlay.visible { display: block; }

  .edu-logout-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${t.logoutBg}; color: ${t.logoutColor};
    border: none; border-radius: 8px; padding: 7px 14px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    white-space: nowrap; transition: opacity 0.15s;
  }
  .edu-logout-btn:hover { opacity: 0.85; }

  .edu-theme-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px;
    background: ${t.themeBtnBg}; color: ${t.themeBtnColor};
    border: 1px solid ${t.cardBorder}; border-radius: 8px;
    font-size: 16px; cursor: pointer; transition: background 0.2s;
    flex-shrink: 0;
  }
  .edu-theme-btn:hover { background: ${t.cardBorder}; }
`;

// ════════════════════════════════════════════════════════════════
//  SHARED UI — theme-aware
// ════════════════════════════════════════════════════════════════
function StatCard({ icon, label, value, change, color, t }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderTop: `3px solid ${color}`, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: t.textSub, textTransform: "uppercase" }}>{label}</span>
        <div style={{ background: color + "18", borderRadius: 8, width: 30, height: 30, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{icon}</div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: t.text, marginTop: 8, letterSpacing: -1 }}>{value}</div>
      {change && <div style={{ fontSize: 11, marginTop: 3, color: t.textSub, fontWeight: 500 }}>{change}</div>}
    </div>
  );
}

function MonitorCard({ item, t }) {
  const isPositive = item.change.startsWith("+");
  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", borderLeft: `4px solid ${item.color}`, minWidth: 0, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ background: item.bg, borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textSub, textTransform: "uppercase", letterSpacing: 0.8 }}>{item.label}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: t.text, letterSpacing: -0.5, marginTop: 2 }}>{item.value}</div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: isPositive ? "#22C55E" : "#EF4444", background: isPositive ? "#F0FDF4" : "#FEF2F2", padding: "3px 8px", borderRadius: 20, flexShrink: 0 }}>{item.change}</div>
    </div>
  );
}

function SectionCard({ title, children, action, onAction, style, t }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", minWidth: 0, ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text }}>{title}</h3>
        {action && <button onClick={onAction} style={{ fontSize: 12, color: t.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}>{action}</button>}
      </div>
      {children}
    </div>
  );
}

function TD({ children, bold, color, t }) {
  return <td style={{ padding: "10px 10px", color: bold ? t.text : (color || t.textSub), fontWeight: bold ? 600 : 400 }}>{children}</td>;
}

function Badge({ label, color, bg }) {
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: bg, color }}>{label}</span>;
}

function statusBadge(status) {
  const map = {
    Active:     { color: "#1D4ED8", bg: "#DBEAFE" },
    Completing: { color: "#15803D", bg: "#DCFCE7" },
    Completed:  { color: "#15803D", bg: "#DCFCE7" },
    Pending:    { color: "#B45309", bg: "#FEF3C7" },
    Overdue:    { color: "#B91C1C", bg: "#FEE2E2" },
    Dropped:    { color: "#B91C1C", bg: "#FEE2E2" },
    Closed:     { color: "#64748B", bg: "#F1F5F9" },
    Graded:     { color: "#15803D", bg: "#DCFCE7" },
  };
  const s = map[status] || { color: "#64748B", bg: "#F1F5F9" };
  return <Badge label={status} color={s.color} bg={s.bg} />;
}

function priorityBadge(p) {
  const map = { High: { color: "#B91C1C", bg: "#FEE2E2" }, Medium: { color: "#B45309", bg: "#FEF3C7" }, Low: { color: "#15803D", bg: "#DCFCE7" } };
  const s = map[p] || { color: "#64748B", bg: "#F1F5F9" };
  return <Badge label={p} color={s.color} bg={s.bg} />;
}

function Table({ cols, rows, t }) {
  return (
    <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 500 }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${t.tableBorder}` }}>
            {cols.map(c => (
              <th key={c} style={{ padding: "6px 10px", textAlign: "left", color: t.textSub, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{c}</th>
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
    <div style={{ display: "flex", alignItems: "center", gap: 7, background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: "7px 12px", minWidth: 160, flex: "1 1 160px", maxWidth: 240 }}>
      <span style={{ color: t.textSub, fontSize: 13 }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Search..."} style={{ border: "none", outline: "none", fontSize: 12, color: t.text, background: "none", width: "100%" }} />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, background: t.inputBg, border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: "6px 10px" }}>
      {label && <span style={{ fontSize: 10, fontWeight: 700, color: t.textSub, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>{label}</span>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ border: "none", outline: "none", fontSize: 12, color: t.text, background: "none", fontWeight: 600, cursor: "pointer" }}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function SectionDivider({ label, t }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 4, height: 20, background: t.accent, borderRadius: 4 }} />
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.text }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: t.cardBorder }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  SIDEBAR
// ════════════════════════════════════════════════════════════════
function Sidebar({ active, setActive, open, onClose, t }) {
  return (
    <>
      <div className={`edu-overlay${open ? " visible" : ""}`} onClick={onClose} />
      <aside className="edu-sidebar" style={{
        width: 200, height: "100vh", background: t.sidebar,
        display: "flex", flexDirection: "column", flexShrink: 0,
        position: "sticky", top: 0, zIndex: 100,
        ...(typeof window !== "undefined" && window.innerWidth <= 900 ? {
          position: "fixed", left: 0, top: 0,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        } : {}),
      }}>
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${t.sidebarBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>E</div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>EduPlatform</span>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: t.sidebarText, cursor: "pointer", fontSize: 16, padding: 2, display: window.innerWidth <= 900 ? "block" : "none" }}>✕</button>
          </div>
          <div style={{ marginTop: 10, background: t.sidebarBorder, borderRadius: 8, padding: "6px 10px" }}>
            <div style={{ color: t.sidebarText, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Logged in as</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginTop: 2 }}>College Admin</div>
          </div>
        </div>
        <div style={{ padding: "10px 14px 4px" }}>
          <span style={{ display: "inline-block", background: t.sidebarBorder, color: t.sidebarText, fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 6, letterSpacing: 0.5 }}>🎓 College</span>
        </div>
        <nav style={{ marginTop: 6, flex: 1, overflowY: "auto" }}>
          {navItems.map(({ icon, label }) => (
            <button key={label} onClick={() => { setActive(label); onClose(); }} style={{
              display: "flex", alignItems: "center", gap: 9,
              width: "100%", padding: "9px 14px",
              background: active === label ? t.sidebarActive : "none",
              border: "none", cursor: "pointer",
              color: active === label ? "#fff" : t.sidebarText,
              fontWeight: active === label ? 700 : 400,
              fontSize: 13, textAlign: "left",
              borderLeft: active === label ? `3px solid ${t.sidebarActiveBorder}` : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 14 }}>{icon}</span>{label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  TOP BAR — with Logout + Theme Toggle
// ════════════════════════════════════════════════════════════════
function TopBar({ active, actionLabel, onActionClick, onMenuClick, onLogout, onThemeToggle, isDark, t }) {
  const meta = pageMeta[active] || { title: active, subtitle: "" };
  return (
    <div style={{
      background: t.topbar, borderBottom: `1px solid ${t.topbarBorder}`,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 22px", position: "sticky", top: 0, zIndex: 10,
      boxSizing: "border-box", gap: 12,
    }}>
      {/* Left: hamburger + title + action */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
        <button className="edu-hamburger" onClick={onMenuClick}>☰</button>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text, letterSpacing: -0.5, lineHeight: 1.2, whiteSpace: "nowrap" }}>{meta.title}</h1>
          <p className="edu-hide-mobile" style={{ margin: 0, color: t.textSub, fontSize: 12, marginTop: 2 }}>{meta.subtitle}</p>
        </div>
        {actionLabel && (
          <button onClick={onActionClick} style={{ background: t.accent, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            {actionLabel}
          </button>
        )}
      </div>

      {/* Right: search + notifications + theme + avatar + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="edu-topbar-search" style={{ display: "flex", alignItems: "center", gap: 7, background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: "6px 12px" }}>
          <span style={{ color: t.textSub, fontSize: 13 }}>🔍</span>
          <input placeholder="Search..." style={{ border: "none", outline: "none", fontSize: 12, color: t.text, width: 120, background: "none" }} />
        </div>

        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.card, border: `1px solid ${t.cardBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>🔔</div>
          <span style={{ position: "absolute", top: 0, right: 0, background: "#EF4444", color: "#fff", borderRadius: "50%", fontSize: 8, width: 14, height: 14, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>4</span>
        </div>

        {/* ── Theme Toggle Button ── */}
        <button
          className="edu-theme-btn"
          onClick={onThemeToggle}
          title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Avatar */}
        <div className="edu-hide-mobile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>C</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>College Admin</div>
            <div style={{ fontSize: 10, color: t.textSub }}>college@edu.com</div>
          </div>
        </div>

        {/* ── Logout Button ── */}
        <button className="edu-logout-btn" onClick={onLogout}>
          <span>↩</span> Sign out
        </button>
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
      <div className="edu-grid-4" style={{ marginBottom: 14 }}>
        <StatCard t={t} icon="👥" label="Total Students"  value="1,240" change="+42 this batch"     color="#3B6CF4" />
        <StatCard t={t} icon="📦" label="Active Batches"  value="8"     change="currently running"  color="#22C55E" />
        <StatCard t={t} icon="📈" label="Avg. Completion" value="74%"   change="+5% across batches" color="#8B5CF6" />
        <StatCard t={t} icon="🏅" label="Certificates"    value="386"   change="+22% issued total"  color="#06B6D4" />
      </div>

      <SectionDivider t={t} label="Monitoring Overview" />
      <div className="edu-grid-3" style={{ marginBottom: 14 }}>
        {monitoringStats.map(item => <MonitorCard key={item.label} item={item} t={t} />)}
      </div>

      <div className="edu-grid-2-1" style={{ marginBottom: 14 }}>
        <SectionCard t={t} title="Student Progress — Last 6 Months" action="⬇ Export Excel" onAction={exportFullDashboard}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={batchProgress} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.tableBorder} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: t.card, borderRadius: 8, border: `1px solid ${t.cardBorder}`, fontSize: 12 }} />
              <Bar dataKey="students" fill={t.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard t={t} title="Batch Status Breakdown">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={batchStatusData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                {batchStatusData.map((_, i) => <Cell key={i} fill={BATCH_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={{ backgroundColor: t.card, borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", marginTop: 4 }}>
            {batchStatusData.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: BATCH_COLORS[i], flexShrink: 0 }} />
                <span style={{ color: t.textSub }}>{s.name} <strong>{s.value}%</strong></span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionCard t={t} title="Completion vs Pending vs Dropped — Trend">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={completionTrend} margin={{ top: 4, right: 16, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.tableBorder} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: t.card, borderRadius: 8, border: `1px solid ${t.cardBorder}`, fontSize: 12 }} />
              <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} dot={false} name="Completed" />
              <Line type="monotone" dataKey="pending"   stroke="#F59E0B" strokeWidth={2} dot={false} name="Pending"   />
              <Line type="monotone" dataKey="dropped"   stroke="#EF4444" strokeWidth={2} dot={false} name="Dropped"   />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
            {[["Completed","#22C55E"],["Pending","#F59E0B"],["Dropped","#EF4444"]].map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 16, height: 3, background: color, borderRadius: 2 }} />
                <span style={{ color: t.textSub, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div style={{ marginBottom: 14 }}>
        <SectionCard t={t} title="Batch Progress — Overview" action="⬇ Export Batches" onAction={exportBatches}>
          <Table t={t}
            cols={["Batch Name","Instructor","Students","Progress","Status"]}
            rows={batches.map(b => (
              <tr key={b.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
                <TD t={t} bold>{b.name}</TD>
                <TD t={t}>{b.instructor}</TD>
                <TD t={t} color="#3B6CF4">{b.students}</TD>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: t.tableBorder, borderRadius: 4, overflow: "hidden", minWidth: 40 }}>
                      <div style={{ width: `${b.percent}%`, height: "100%", background: t.accent, borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: t.text, flexShrink: 0, minWidth: 28 }}>{b.percent}%</span>
                  </div>
                </td>
                <td style={{ padding: "10px 10px" }}>{statusBadge(b.status)}</td>
              </tr>
            ))}
          />
        </SectionCard>
      </div>

      <div className="edu-grid-2" style={{ paddingBottom: 20 }}>
        <SectionCard t={t} title="Recent Activities">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: t.textSub, marginTop: 1 }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: 10, color: t.textSub, flexShrink: 0, marginTop: 2 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </SectionCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <SectionCard t={t} title="Users Overview">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              {[{ label: "Students", value: "1,240", color: "#3B6CF4" }, { label: "Instructors", value: "18", color: "#22C55E" }, { label: "Staff", value: "6", color: "#8B5CF6" }].map(u => (
                <div key={u.label} style={{ background: t.inputBg, borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: u.color }}>{u.value}</div>
                  <div style={{ fontSize: 10, color: t.textSub, marginTop: 3, fontWeight: 600 }}>{u.label}</div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard t={t} title="Recent Certificates" action="⬇ Download All" onAction={() => exportStudents(students.filter(s => s.status === "Completed"), "Certificates_Report.xlsx")}>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {certificates.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{c.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: t.textSub, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.batch}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8", background: "#DBEAFE", padding: "2px 7px", borderRadius: 12 }}>{c.grade}</div>
                    <div style={{ fontSize: 9, color: t.textSub, marginTop: 2 }}>{c.date}</div>
                  </div>
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
//  PAGE: STUDENTS
// ════════════════════════════════════════════════════════════════
function StudentsPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const statusOptions = ["All", "Active", "Completed", "Pending", "Dropped"];
  const deptOptions = ["All", ...Array.from(new Set(students.map(s => s.dept)))];
  const yearOptions = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  const filtered = students.filter(s =>
    (filter === "All" || s.status === filter) &&
    (deptFilter === "All" || s.dept === deptFilter) &&
    (yearFilter === "All" || s.year === yearFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const counts = {
    total: students.length,
    active: students.filter(s => s.status === "Active").length,
    completed: students.filter(s => s.status === "Completed").length,
    dropped: students.filter(s => s.status === "Dropped").length,
  };
  const deptColors = { CSE: "#3B6CF4", IT: "#22C55E", Design: "#8B5CF6", "AI/ML": "#06B6D4" };
  const deptBreakdown = Array.from(new Set(students.map(s => s.dept))).map(d => ({ name: d, students: students.filter(s => s.dept === d).length }));
  const yearBreakdown = yearOptions.filter(y => y !== "All").map(y => ({ name: y.replace(" Year", ""), students: students.filter(s => s.year === y).length }));

  return (
    <>
      <div className="edu-grid-4" style={{ marginBottom: 18 }}>
        <StatCard t={t} icon="👥" label="Total Students" value={counts.total}     change="enrolled"     color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"         value={counts.active}    change="in progress"  color="#22C55E" />
        <StatCard t={t} icon="🏅" label="Completed"      value={counts.completed} change="graduated"    color="#06B6D4" />
        <StatCard t={t} icon="❌" label="Dropped"        value={counts.dropped}   change="discontinued" color="#EF4444" />
      </div>
      <SectionCard t={t} title="All Students">
        <div className="edu-filter-bar" style={{ marginBottom: 14 }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search by name..." />
          <FilterSelect t={t} label="Dept" value={deptFilter} onChange={setDeptFilter} options={deptOptions} />
          <FilterSelect t={t} label="Year" value={yearFilter} onChange={setYearFilter} options={yearOptions} />
          <div className="edu-btn-group">
            {statusOptions.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.inputBg, color: filter === opt ? "#fff" : t.textSub }}>{opt}</button>
            ))}
          </div>
          <button className="edu-export-btn" onClick={() => exportStudents(filtered)}>⬇ Export Excel</button>
        </div>
        <Table t={t}
          cols={["#","Name","Email","Dept","Year","Batch","Attendance","Grade","Status"]}
          rows={filtered.map(s => (
            <tr key={s.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
              <TD t={t}>{s.id}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.name.charAt(0)}</div>
                  <span style={{ fontWeight: 600, color: t.text, fontSize: 12 }}>{s.name}</span>
                </div>
              </td>
              <TD t={t}>{s.email}</TD>
              <td style={{ padding: "10px 10px" }}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: (deptColors[s.dept]||t.accent) + "18", color: deptColors[s.dept]||t.accent }}>{s.dept}</span></td>
              <TD t={t}>{s.year}</TD>
              <TD t={t}>{s.batch}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 60, height: 5, background: t.tableBorder, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${s.attendance}%`, height: "100%", background: s.attendance > 80 ? "#22C55E" : s.attendance > 60 ? "#F59E0B" : "#EF4444", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, color: t.textSub }}>{s.attendance}%</span>
                </div>
              </td>
              <TD t={t} color="#3B6CF4">{s.grade}</TD>
              <td style={{ padding: "10px 10px" }}>{statusBadge(s.status)}</td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSub, fontSize: 13 }}>No students found.</div>}
      </SectionCard>
      <div className="edu-grid-2" style={{ marginTop: 14, paddingBottom: 20 }}>
        <SectionCard t={t} title="Students by Department">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={deptBreakdown} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.tableBorder} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: t.card, borderRadius: 8, border: `1px solid ${t.cardBorder}`, fontSize: 12 }} />
              <Bar dataKey="students" name="Students" radius={[4,4,0,0]}>
                {deptBreakdown.map((d, i) => <Cell key={i} fill={deptColors[d.name] || t.accent} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard t={t} title="Students by Year">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={yearBreakdown} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.tableBorder} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: t.card, borderRadius: 8, border: `1px solid ${t.cardBorder}`, fontSize: 12 }} />
              <Bar dataKey="students" name="Students" fill="#8B5CF6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: BATCHES
// ════════════════════════════════════════════════════════════════
function BatchesPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statusOptions = ["All", "Active", "Completing", "Pending"];
  const filtered = batches.filter(b => (filter === "All" || b.status === filter) && b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="edu-grid-4" style={{ marginBottom: 18 }}>
        <StatCard t={t} icon="📦" label="Total Batches" value={batches.length}                                    change="all time"      color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"        value={batches.filter(b=>b.status==="Active").length}     change="running now"   color="#22C55E" />
        <StatCard t={t} icon="✅" label="Completing"    value={batches.filter(b=>b.status==="Completing").length} change="near finish"   color="#06B6D4" />
        <StatCard t={t} icon="⏳" label="Pending"       value={batches.filter(b=>b.status==="Pending").length}    change="starting soon" color="#F59E0B" />
      </div>
      <SectionCard t={t} title="All Batches" style={{ marginBottom: 14 }}>
        <div className="edu-filter-bar" style={{ marginBottom: 14 }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search batch..." />
          <div className="edu-btn-group">
            {statusOptions.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.inputBg, color: filter === opt ? "#fff" : t.textSub }}>{opt}</button>
            ))}
          </div>
          <button className="edu-export-btn" onClick={exportBatches}>⬇ Export Excel</button>
        </div>
        <Table t={t}
          cols={["Batch Name","Instructor","Students","Start Date","End Date","Progress","Status"]}
          rows={filtered.map(b => (
            <tr key={b.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
              <TD t={t} bold>{b.name}</TD>
              <TD t={t}>{b.instructor}</TD>
              <TD t={t} color="#3B6CF4">{b.students}</TD>
              <TD t={t}>{b.start}</TD>
              <TD t={t}>{b.end}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: t.tableBorder, borderRadius: 4, overflow: "hidden", minWidth: 40 }}>
                    <div style={{ width: `${b.percent}%`, height: "100%", background: t.accent, borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.text, flexShrink: 0, minWidth: 28 }}>{b.percent}%</span>
                </div>
              </td>
              <td style={{ padding: "10px 10px" }}>{statusBadge(b.status)}</td>
            </tr>
          ))}
        />
      </SectionCard>
      <div style={{ paddingBottom: 20 }}>
        <SectionCard t={t} title="Completion Trend — All Batches">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={completionTrend} margin={{ top: 4, right: 16, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={t.tableBorder} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: t.textSub }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: t.card, borderRadius: 8, border: `1px solid ${t.cardBorder}`, fontSize: 12 }} />
              <Line type="monotone" dataKey="completed" stroke="#22C55E" strokeWidth={2} dot={false} name="Completed" />
              <Line type="monotone" dataKey="pending"   stroke="#F59E0B" strokeWidth={2} dot={false} name="Pending"   />
              <Line type="monotone" dataKey="dropped"   stroke="#EF4444" strokeWidth={2} dot={false} name="Dropped"   />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: COURSES
// ════════════════════════════════════════════════════════════════
function CoursesPage({ t }) {
  const [search, setSearch] = useState("");
  const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="edu-grid-4" style={{ marginBottom: 18 }}>
        <StatCard t={t} icon="📚" label="Total Courses" value={courses.length}                                    change="all batches"     color="#3B6CF4" />
        <StatCard t={t} icon="🟢" label="Active"        value={courses.filter(c=>c.status==="Active").length}     change="in delivery"     color="#22C55E" />
        <StatCard t={t} icon="✅" label="Completing"    value={courses.filter(c=>c.status==="Completing").length} change="wrapping up"     color="#06B6D4" />
        <StatCard t={t} icon="⏳" label="Pending"       value={courses.filter(c=>c.status==="Pending").length}    change="not yet started" color="#F59E0B" />
      </div>
      <SectionCard t={t} title="All Courses" style={{ marginBottom: 14 }}>
        <div className="edu-filter-bar" style={{ marginBottom: 14 }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search course..." />
          <button className="edu-export-btn" onClick={exportCourses}>⬇ Export Excel</button>
        </div>
        <Table t={t}
          cols={["Course Name","Batch","Instructor","Modules","Duration","Enrolled","Completion","Status"]}
          rows={filtered.map(c => (
            <tr key={c.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
              <TD t={t} bold>{c.name}</TD>
              <TD t={t}>{c.batch}</TD>
              <TD t={t}>{c.instructor}</TD>
              <TD t={t} color="#8B5CF6">{c.modules}</TD>
              <TD t={t}>{c.duration}</TD>
              <TD t={t} color="#3B6CF4">{c.enrolled}</TD>
              <td style={{ padding: "10px 10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 60, height: 5, background: t.tableBorder, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${c.completion}%`, height: "100%", background: "#22C55E", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{c.completion}%</span>
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
//  PAGE: ASSIGNMENTS
// ════════════════════════════════════════════════════════════════
function AssignmentsPage({ t }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statusOptions = ["All", "Graded", "Pending", "Overdue"];
  const filtered = assignments.filter(a =>
    (filter === "All" || a.status === filter) &&
    (a.title || "").toLowerCase().includes(search.toLowerCase())
  );
  const gradedCount  = assignments.filter(a => a.status === "Graded").length;
  const pendingCount = assignments.filter(a => a.status === "Pending").length;
  const overdueCount = assignments.filter(a => a.status === "Overdue").length;

  return (
    <>
      <div className="edu-grid-4" style={{ marginBottom: 18 }}>
        <StatCard t={t} icon="📋" label="Total"   value={assignments.length} change="all assignments"     color="#3B6CF4" />
        <StatCard t={t} icon="✅" label="Graded"  value={gradedCount}        change="reviewed"            color="#22C55E" />
        <StatCard t={t} icon="⏳" label="Pending" value={pendingCount}       change="awaiting submission" color="#F59E0B" />
        <StatCard t={t} icon="⚠️" label="Overdue" value={overdueCount}       change="past due date"       color="#EF4444" />
      </div>
      <SectionCard t={t} title="All Assignments">
        <div className="edu-filter-bar" style={{ marginBottom: 14 }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search assignment..." />
          <div className="edu-btn-group">
            {statusOptions.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.inputBg, color: filter === opt ? "#fff" : t.textSub }}>{opt}</button>
            ))}
          </div>
          <button className="edu-export-btn" onClick={() => exportAssignments(filtered)}>⬇ Export Excel</button>
        </div>
        <Table t={t}
          cols={["#","Title","Course","Student","Due Date","Submitted","Grade","Status"]}
          rows={filtered.map(a => (
            <tr key={a.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
              <TD t={t}>{a.id}</TD>
              <TD t={t} bold>{a.title}</TD>
              <TD t={t}>{a.course}</TD>
              <TD t={t}>{a.student}</TD>
              <td style={{ padding: "10px 10px", color: a.status === "Overdue" ? "#B91C1C" : t.textSub, fontWeight: a.status === "Overdue" ? 600 : 400 }}>{a.due}</td>
              <TD t={t}>{a.submitted}</TD>
              <TD t={t} color="#3B6CF4">{a.grade}</TD>
              <td style={{ padding: "10px 10px" }}>{statusBadge(a.status)}</td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSub, fontSize: 13 }}>No assignments found.</div>}
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
  const statusOptions = ["All", "Completed", "Pending"];
  const filtered = reports.filter(r =>
    (filter === "All" || r.status === filter) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );
  const typeColors = { Enrollment:"#3B6CF4", Progress:"#22C55E", Attendance:"#06B6D4", Analytics:"#8B5CF6", Certificate:"#F59E0B" };
  const reportDeptOptions = ["All", ...Array.from(new Set(students.map(s => s.dept)))];
  const reportYearOptions = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];
  const scoreRangeOptions = ["All", "0–40", "41–60", "61–80", "81–100"];
  const [reportDept, setReportDept] = useState("All");
  const [reportYear, setReportYear] = useState("All");
  const [reportScoreRange, setReportScoreRange] = useState("All");
  const [reportGenerated, setReportGenerated] = useState(false);

  const inScoreRange = (score, range) => {
    if (range === "All") return true;
    const [lo, hi] = range.split("–").map(Number);
    return score >= lo && score <= hi;
  };
  const reportResults = students.filter(s =>
    (reportDept === "All" || s.dept === reportDept) &&
    (reportYear === "All" || s.year === reportYear) &&
    inScoreRange(s.score, reportScoreRange)
  );
  const reportAvgScore = reportResults.length ? Math.round(reportResults.reduce((sum, s) => sum + s.score, 0) / reportResults.length) : 0;

  const handleGenerateAndExport = () => {
    setReportGenerated(true);
    exportStudents(reportResults, `Student_Report_${reportDept}_${reportYear}_${reportScoreRange}.xlsx`.replace(/\s+/g, "_").replace(/[–]/g, "-"));
  };

  return (
    <>
      <div className="edu-grid-4" style={{ marginBottom: 18 }}>
        <StatCard t={t} icon="📊" label="Total Reports"  value={reports.length}                                   change="all time"       color="#3B6CF4" />
        <StatCard t={t} icon="✅" label="Completed"      value={reports.filter(r=>r.status==="Completed").length} change="ready"          color="#22C55E" />
        <StatCard t={t} icon="⏳" label="Pending"        value={reports.filter(r=>r.status==="Pending").length}   change="need attention" color="#F59E0B" />
        <StatCard t={t} icon="🔴" label="High Priority"  value={reports.filter(r=>r.priority==="High").length}    change="urgent"         color="#EF4444" />
      </div>

      <SectionCard t={t} title="Generate Student Report" style={{ marginBottom: 14 }}>
        <p style={{ margin: "0 0 14px", fontSize: 12, color: t.textSub }}>Filter students then download as Excel.</p>
        <div className="edu-filter-bar" style={{ marginBottom: 16 }}>
          <FilterSelect t={t} label="Dept"        value={reportDept}       onChange={v => { setReportDept(v);       setReportGenerated(false); }} options={reportDeptOptions} />
          <FilterSelect t={t} label="Year"        value={reportYear}       onChange={v => { setReportYear(v);       setReportGenerated(false); }} options={reportYearOptions} />
          <FilterSelect t={t} label="Score Range" value={reportScoreRange} onChange={v => { setReportScoreRange(v); setReportGenerated(false); }} options={scoreRangeOptions} />
          <button onClick={handleGenerateAndExport} className="edu-export-btn">⬇ Generate &amp; Download</button>
          {reportResults.length > 0 && (
            <button onClick={() => setReportGenerated(v => !v)} style={{ background: t.inputBg, color: t.accent, border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              {reportGenerated ? "Hide Preview" : "Preview"}
            </button>
          )}
        </div>
        {reportGenerated && (
          <>
            <div className="edu-grid-3" style={{ marginBottom: 14 }}>
              <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "#3B6CF4", fontWeight: 700, textTransform: "uppercase" }}>Matched Students</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginTop: 2 }}>{reportResults.length}</div>
              </div>
              <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "#8B5CF6", fontWeight: 700, textTransform: "uppercase" }}>Average Score</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginTop: 2 }}>{reportAvgScore}</div>
              </div>
              <div style={{ background: "#ECFEFF", borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: "#06B6D4", fontWeight: 700, textTransform: "uppercase" }}>Filters</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginTop: 4 }}>{reportDept} · {reportYear} · {reportScoreRange}</div>
              </div>
            </div>
            <Table t={t}
              cols={["Name","Dept","Year","Batch","Score","Grade","Status"]}
              rows={reportResults.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
                  <TD t={t} bold>{s.name}</TD><TD t={t}>{s.dept}</TD><TD t={t}>{s.year}</TD><TD t={t}>{s.batch}</TD>
                  <TD t={t} color="#3B6CF4">{s.score}</TD><TD t={t}>{s.grade}</TD>
                  <td style={{ padding: "10px 10px" }}>{statusBadge(s.status)}</td>
                </tr>
              ))}
            />
          </>
        )}
      </SectionCard>

      <SectionCard t={t} title="All Reports" style={{ marginBottom: 14 }}>
        <div className="edu-filter-bar" style={{ marginBottom: 14 }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search report..." />
          <div className="edu-btn-group">
            {statusOptions.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: "pointer", border: "none", background: filter === opt ? t.accent : t.inputBg, color: filter === opt ? "#fff" : t.textSub }}>{opt}</button>
            ))}
          </div>
          <button className="edu-export-btn" onClick={() => exportReportsList(filtered)}>⬇ Export Excel</button>
        </div>
        <Table t={t}
          cols={["#","Title","Type","Generated By","Date","Priority","Status","Action"]}
          rows={filtered.map(r => (
            <tr key={r.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
              <TD t={t}>{r.id}</TD>
              <TD t={t} bold>{r.title}</TD>
              <td style={{ padding: "10px 10px" }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: (typeColors[r.type]||"#3B6CF4") + "20", color: typeColors[r.type]||"#3B6CF4" }}>{r.type}</span>
              </td>
              <TD t={t}>{r.by}</TD>
              <TD t={t}>{r.date}</TD>
              <td style={{ padding: "10px 10px" }}>{priorityBadge(r.priority)}</td>
              <td style={{ padding: "10px 10px" }}>{statusBadge(r.status)}</td>
              <td style={{ padding: "10px 10px" }}>
                <button className="edu-export-btn-sm" onClick={() => exportReportsList([r])}>
                  {r.status === "Completed" ? "⬇ Download" : "⬇ Export"}
                </button>
              </td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSub, fontSize: 13 }}>No reports found.</div>}
      </SectionCard>

      <div style={{ paddingBottom: 20 }}>
        <SectionCard t={t} title="Quick Report Downloads">
          <div className="edu-grid-4q">
            {[
              { title: "All Students",      desc: "Full student roster with grades",  icon: "👥", color: "#3B6CF4", fn: () => exportStudents(students) },
              { title: "Attendance Report", desc: "Student attendance statistics",    icon: "📅", color: "#22C55E", fn: () => exportStudents(students, "Attendance_Report.xlsx") },
              { title: "Batch Progress",    desc: "All batch completion data",        icon: "📈", color: "#8B5CF6", fn: exportBatches },
              { title: "Full Dashboard",    desc: "All data in one workbook",         icon: "🏅", color: "#06B6D4", fn: exportFullDashboard },
            ].map((q, i) => (
              <div key={i} style={{ background: t.inputBg, borderRadius: 12, padding: "16px 14px", cursor: "pointer", border: `1px solid ${t.cardBorder}` }} onClick={q.fn}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{q.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{q.title}</div>
                <div style={{ fontSize: 11, color: t.textSub, marginTop: 4 }}>{q.desc}</div>
                <button style={{ marginTop: 12, fontSize: 11, color: q.color, background: q.color + "18", border: "none", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>⬇ Download →</button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  PAGE: MENTOR LOGINS
// ════════════════════════════════════════════════════════════════
// ── Change this to your actual backend base URL ──────────────────────────────
const API_BASE = "http://localhost:5000/api";

function MentorsPage({ t }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMentor, setNewMentor] = useState({
    name: "", username: "", email: "", password: "", confirmPassword: "",
    mobile: "", batch: "", specialization: "", role: "Co-Mentor",
  });
  const [formError, setFormError]   = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const [mentorList, setMentorList] = useState(mentors);
  const [resetTarget, setResetTarget]     = useState(null);
  const [newPassword, setNewPassword]     = useState("");
  const [confirmNewPw, setConfirmNewPw]   = useState("");
  const [resetError, setResetError]       = useState("");
  const [successMsg, setSuccessMsg]       = useState("");
  const [errorMsg, setErrorMsg]           = useState("");

  const statusOptions     = ["All", "Active", "Inactive", "Suspended"];
  const roleOptions       = ["All", "Lead Mentor", "Co-Mentor", "Guest Mentor"];
  const batchOptions      = ["Batch A — Web Dev", "Batch B — Data Science", "Batch C — UI/UX Design", "Batch D — DevOps", "Batch E — ML Basics"];
  const roleCreateOptions = ["Lead Mentor", "Co-Mentor", "Guest Mentor"];

  const filtered = mentorList.filter(m =>
    (statusFilter === "All" || m.status === statusFilter) &&
    (roleFilter   === "All" || m.role   === roleFilter)   &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
  );

  const activeMentors = mentorList.filter(m => m.status === "Active").length;
  const totalStudents = mentorList.reduce((a, m) => a + m.students, 0);

  const statusColor = { Active: { color: "#15803D", bg: "#DCFCE7" }, Inactive: { color: "#B45309", bg: "#FEF3C7" }, Suspended: { color: "#B91C1C", bg: "#FEE2E2" } };
  const roleColor   = { "Lead Mentor": { color: "#1D4ED8", bg: "#DBEAFE" }, "Co-Mentor": { color: "#7C3AED", bg: "#EDE9FE" }, "Guest Mentor": { color: "#0E7490", bg: "#CFFAFE" } };

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3500); };
  const showError   = (msg) => { setErrorMsg(msg);   setTimeout(() => setErrorMsg(""),   4000); };

  // ── CREATE MENTOR — calls POST /api/mentors/create ──────────────────────────
  const handleAddMentor = async () => {
    setFormError("");
    const { name, username, email, password, confirmPassword, mobile, batch } = newMentor;
    if (!name || !username || !email || !password || !batch || !mobile) {
      setFormError("Please fill all required fields (*).");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/mentors/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
        credentials: "include",
       body: JSON.stringify({
    username:       newMentor.username,
    email:          newMentor.email,
    password:       newMentor.password,
    mentorName:     newMentor.name,
    mobile:         newMentor.mobile,
    specialization: newMentor.specialization,
    assigned_batch: newMentor.batch,
    role_label:     newMentor.role,
}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create mentor.");

      // Add to local list with the returned user_id
      setMentorList(prev => [...prev, {
        id:             data.user_id || prev.length + 1,
        name:           newMentor.name,
        email:          newMentor.email,
        batch:          newMentor.batch,
        specialization: newMentor.specialization,
        role:           newMentor.role,
        status:         "Active",
        lastLogin:      "Never",
        students:       0,
      }]);
      setNewMentor({ name: "", username: "", email: "", password: "", confirmPassword: "", mobile: "", batch: "", specialization: "", role: "Co-Mentor" });
      setShowAddForm(false);
      showSuccess("✅ Mentor account created and saved to database.");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── TOGGLE STATUS — calls PATCH /api/mentors/:id/status ─────────────────────
  const handleToggleStatus = async (mentor) => {
    const next = mentor.status === "Active" ? "DISABLED" : "ACTIVE";
    try {
      const res = await fetch(`${API_BASE}/mentors/${mentor.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
        credentials: "include",
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error("Status update failed.");
      setMentorList(prev => prev.map(m =>
        m.id === mentor.id ? { ...m, status: next === "ACTIVE" ? "Active" : "Inactive" } : m
      ));
      showSuccess("Mentor status updated.");
    } catch (err) {
      showError(err.message);
    }
  };

  // ── SUSPEND — calls PATCH /api/mentors/:id/status with LOCKED ───────────────
  const handleSuspend = async (mentor) => {
    try {
      const res = await fetch(`${API_BASE}/mentors/${mentor.id}/status`, {
        method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
        credentials: "include",
        body: JSON.stringify({ status: "LOCKED" }),
      });
      if (!res.ok) throw new Error("Suspend failed.");
      setMentorList(prev => prev.map(m => m.id === mentor.id ? { ...m, status: "Suspended" } : m));
      showSuccess("Mentor account suspended.");
    } catch (err) {
      showError(err.message);
    }
  };

  // ── RESET PASSWORD — calls PATCH /api/mentors/:id/reset-password ─────────────
  const handleConfirmReset = async () => {
    setResetError("");
    if (!newPassword || newPassword.length < 8) { setResetError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmNewPw)            { setResetError("Passwords do not match.");                  return; }
    try {
      const res = await fetch(`${API_BASE}/mentors/${resetTarget.id}/reset-password`, {
        method: "PATCH",
       headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem('token')}` },
        credentials: "include",
        body: JSON.stringify({ new_password: newPassword }),
      });
      if (!res.ok) throw new Error("Password reset failed.");
      setResetTarget(null);
      setNewPassword("");
      setConfirmNewPw("");
      showSuccess(`Password reset successfully for ${resetTarget.name}.`);
    } catch (err) {
      setResetError(err.message);
    }
  };

  const inputSx = {
    border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: "8px 12px",
    fontSize: 12, color: t.text, background: t.inputBg, outline: "none", width: "100%", boxSizing: "border-box",
  };

  return (
    <>
      {/* Success toast */}
      {successMsg && (
        <div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999, background: "#22C55E", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          {successMsg}
        </div>
      )}
      {/* Error toast */}
      {errorMsg && (
        <div style={{ position: "fixed", top: 20, right: 24, zIndex: 9999, background: "#EF4444", color: "#fff", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          ❌ {errorMsg}
        </div>
      )}

      {/* Stats */}
      <div className="edu-grid-4" style={{ marginBottom: 18 }}>
        <StatCard t={t} icon="🧑‍🏫" label="Total Mentors"      value={mentorList.length}              change="registered"     color="#3B6CF4" />
        <StatCard t={t} icon="🟢"   label="Active"             value={activeMentors}                  change="logged in"      color="#22C55E" />
        <StatCard t={t} icon="⏸️"   label="Inactive/Suspended" value={mentorList.length - activeMentors} change="not active"  color="#F59E0B" />
        <StatCard t={t} icon="👩‍🎓"  label="Students Covered"  value={totalStudents}                  change="across batches" color="#8B5CF6" />
      </div>

      {/* Add Mentor Form */}
      {showAddForm && (
        <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 14, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: t.text }}>➕ Create New Mentor Login</h3>
            <button onClick={() => { setShowAddForm(false); setFormError(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: t.textSub }}>✕</button>
          </div>

          <div className="edu-grid-3" style={{ gap: 12, marginBottom: 12 }}>
            {/* Full Name */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Full Name *</div>
              <input style={inputSx} placeholder="e.g. Dr. Anita Roy" value={newMentor.name} onChange={e => setNewMentor(p => ({ ...p, name: e.target.value }))} />
            </div>
            {/* Username */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Username *</div>
              <input style={inputSx} placeholder="e.g. anita_roy" value={newMentor.username} onChange={e => setNewMentor(p => ({ ...p, username: e.target.value }))} />
            </div>
            {/* Email */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Email Address *</div>
              <input style={inputSx} placeholder="mentor@edu.com" type="email" value={newMentor.email} onChange={e => setNewMentor(p => ({ ...p, email: e.target.value }))} />
            </div>
            {/* Password */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Password *</div>
              <input style={inputSx} placeholder="Min. 8 characters" type="password" value={newMentor.password} onChange={e => setNewMentor(p => ({ ...p, password: e.target.value }))} />
            </div>
            {/* Confirm Password */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Confirm Password *</div>
              <input style={{ ...inputSx, borderColor: newMentor.confirmPassword && newMentor.confirmPassword !== newMentor.password ? "#EF4444" : inputSx.border }} placeholder="Re-enter password" type="password" value={newMentor.confirmPassword} onChange={e => setNewMentor(p => ({ ...p, confirmPassword: e.target.value }))} />
            </div>
            {/* Mobile */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Mobile *</div>
              <input style={inputSx} placeholder="10-digit number" type="tel" maxLength={15} value={newMentor.mobile} onChange={e => setNewMentor(p => ({ ...p, mobile: e.target.value }))} />
            </div>
            {/* Batch */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Assign Batch *</div>
              <select style={{ ...inputSx, cursor: "pointer" }} value={newMentor.batch} onChange={e => setNewMentor(p => ({ ...p, batch: e.target.value }))}>
                <option value="">Select batch…</option>
                {batchOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {/* Specialization */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Specialization</div>
              <input style={inputSx} placeholder="e.g. React, Python, UX" value={newMentor.specialization} onChange={e => setNewMentor(p => ({ ...p, specialization: e.target.value }))} />
            </div>
            {/* Role */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: t.textSub, marginBottom: 5, textTransform: "uppercase" }}>Role</div>
              <select style={{ ...inputSx, cursor: "pointer" }} value={newMentor.role} onChange={e => setNewMentor(p => ({ ...p, role: e.target.value }))}>
                {roleCreateOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Form error */}
          {formError && (
            <div style={{ marginBottom: 12, padding: "8px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>
              ⚠️ {formError}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleAddMentor}
              disabled={isLoading}
              style={{ background: isLoading ? "#93C5FD" : "#3B6CF4", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading ? "⏳ Creating…" : "✓ Create Mentor Login"}
            </button>
            <button onClick={() => { setShowAddForm(false); setFormError(""); }} style={{ background: t.inputBg, color: t.textSub, border: `1px solid ${t.cardBorder}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Cancel
            </button>
          </div>
          <div style={{ marginTop: 12, padding: "9px 14px", background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 8, fontSize: 11, color: "#92400E", fontWeight: 600 }}>
            🔐 Password is securely hashed (bcrypt) before storing in the database. Mentor will use their email + password to log in.
          </div>
        </div>
      )}

      {/* Mentor Table */}
      <SectionCard t={t} title="Mentor Accounts">
        <div className="edu-filter-bar" style={{ marginBottom: 14 }}>
          <SearchBar t={t} value={search} onChange={setSearch} placeholder="Search name or email..." />
          <FilterSelect t={t} label="Status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
          <FilterSelect t={t} label="Role"   value={roleFilter}   onChange={setRoleFilter}   options={roleOptions}   />
          <div style={{ flex: 1 }} />
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} style={{ background: "#3B6CF4", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              ➕ Add Mentor
            </button>
          )}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${t.tableBorder}` }}>
                {["#", "Mentor", "Email", "Batch", "Specialization", "Role", "Status", "Last Login", "Students", "Actions"].map(c => (
                  <th key={c} style={{ padding: "6px 10px", textAlign: "left", color: t.textSub, fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8, whiteSpace: "nowrap" }}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => {
                const sc = statusColor[m.status] || { color: "#64748B", bg: "#F1F5F9" };
                const rc = roleColor[m.role]     || { color: "#64748B", bg: "#F1F5F9" };
                return (
                  <tr key={m.id} style={{ borderBottom: `1px solid ${t.tableBorder}` }}>
                    <td style={{ padding: "10px 10px", color: t.textSub }}>{m.id}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#3B6CF4", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{m.name.charAt(0)}</div>
                        <span style={{ fontWeight: 600, color: t.text }}>{m.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 10px", color: t.textSub }}>{m.email}</td>
                    <td style={{ padding: "10px 10px", color: t.textSub, whiteSpace: "nowrap" }}>{m.batch}</td>
                    <td style={{ padding: "10px 10px", color: t.textSub }}>{m.specialization}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: rc.bg, color: rc.color }}>{m.role}</span>
                    </td>
                    <td style={{ padding: "10px 10px" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: sc.bg, color: sc.color }}>{m.status}</span>
                    </td>
                    <td style={{ padding: "10px 10px", color: t.textSub, whiteSpace: "nowrap" }}>{m.lastLogin}</td>
                    <td style={{ padding: "10px 10px", color: "#3B6CF4", fontWeight: 700 }}>{m.students}</td>
                    <td style={{ padding: "10px 10px" }}>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <button onClick={() => handleToggleStatus(m)} style={{ background: m.status === "Active" ? "#FEF3C7" : "#DCFCE7", color: m.status === "Active" ? "#B45309" : "#15803D", border: "none", borderRadius: 6, padding: "4px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                          {m.status === "Active" ? "Deactivate" : "Activate"}
                        </button>
                        <button onClick={() => { setResetTarget(m); setNewPassword(""); setConfirmNewPw(""); setResetError(""); }} style={{ background: "#EFF6FF", color: "#1D4ED8", border: "none", borderRadius: 6, padding: "4px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                          🔑 Reset
                        </button>
                        {m.status !== "Suspended" && (
                          <button onClick={() => handleSuspend(m)} style={{ background: "#FEE2E2", color: "#B91C1C", border: "none", borderRadius: 6, padding: "4px 9px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
                            🚫 Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "30px 0", color: t.textSub, fontSize: 13 }}>No mentors found.</div>}
        </div>
      </SectionCard>

      {/* Reset Password Dialog */}
      {resetTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", fontFamily: "'Inter','Segoe UI',sans-serif" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔑</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>Reset Password</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 6 }}>
                Setting new password for <strong>{resetTarget.name}</strong>
                <br /><span style={{ color: "#3B6CF4", fontSize: 12 }}>{resetTarget.email}</span>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase" }}>New Password *</div>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 5, textTransform: "uppercase" }}>Confirm New Password *</div>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmNewPw}
                onChange={e => setConfirmNewPw(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${confirmNewPw && confirmNewPw !== newPassword ? "#EF4444" : "#CBD5E1"}`, fontSize: 13, outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {resetError && (
              <div style={{ marginBottom: 12, padding: "8px 12px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, fontSize: 12, color: "#B91C1C", fontWeight: 600 }}>
                ⚠️ {resetError}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleConfirmReset} style={{ flex: 1, background: "#3B6CF4", color: "#fff", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                ✓ Save New Password
              </button>
              <button onClick={() => { setResetTarget(null); setResetError(""); }} style={{ flex: 1, background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "#94A3B8", textAlign: "center" }}>
              🔐 Password is hashed by the backend before saving to the database.
            </div>
          </div>
        </div>
      )}

      {/* Role Summary */}
      <div className="edu-grid-3" style={{ marginTop: 14, paddingBottom: 20 }}>
        {["Lead Mentor", "Co-Mentor", "Guest Mentor"].map(role => {
          const rc = roleColor[role];
          const count = mentorList.filter(m => m.role === role).length;
          const active = mentorList.filter(m => m.role === role && m.status === "Active").length;
          return (
            <SectionCard key={role} t={t} title={role}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: rc.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🧑‍🏫</div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: t.text }}>{count}</div>
                  <div style={{ fontSize: 11, color: t.textSub, marginTop: 2 }}>{active} active · {count - active} inactive</div>
                </div>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════
//  ACTION LABELS
// ════════════════════════════════════════════════════════════════
const pageActions = {
  Students:    "+ Add Student",
  Batches:     "+ New Batch",
  Courses:     "+ Add Course",
  Assignments: "+ New Assignment",
  Reports:     "+ Generate Report",
  Mentors:     "+ Add Mentor",
};

// ════════════════════════════════════════════════════════════════
//  ROOT
// ════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  // ── Theme state — persisted in localStorage ──
  const [themeKey, setThemeKey] = useState(
    () => localStorage.getItem("adminTheme") || "light"
  );
  const t = THEMES[themeKey];
  const isDark = themeKey === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    localStorage.setItem("adminTheme", next);
    setThemeKey(next);
  };

  // ── Logout handler ──
  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const [active, setActive]       = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    Dashboard:   <DashboardPage   t={t} />,
    Students:    <StudentsPage    t={t} />,
    Batches:     <BatchesPage     t={t} />,
    Courses:     <CoursesPage     t={t} />,
    Assignments: <AssignmentsPage t={t} />,
    Reports:     <ReportsPage     t={t} />,
    Mentors:     <MentorsPage     t={t} />,
  };

  return (
    <>
      <style>{makeCSS(t)}</style>
      <SaveDialog />
      <div style={{ display: "flex", fontFamily: "'Inter','Segoe UI',sans-serif", background: t.bg, height: "100vh", width: "100%", overflow: "hidden" }}>
        <Sidebar
          t={t}
          active={active}
          setActive={setActive}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="edu-main">
          <TopBar
            t={t}
            active={active}
            actionLabel={pageActions[active]}
            onMenuClick={() => setSidebarOpen(true)}
            onLogout={handleLogout}
            onThemeToggle={toggleTheme}
            isDark={isDark}
          />
          <div className="edu-page-pad">
            {pages[active] || <DashboardPage t={t} />}
          </div>
        </main>
      </div>
    </>
  );
}