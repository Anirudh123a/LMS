// ════════════════════════════════════════════════════════════════
//  SUPER ADMIN CONSTANTS & DATA REPOSITORIES
// ════════════════════════════════════════════════════════════════

export const navItems = [
  { icon: "⊞", label: "Dashboard" },
  { icon: "🏢", label: "Organizations" },
  { icon: "🛒", label: "Vendors" },
  { icon: "👤", label: "Admins" },
  { icon: "🏫", label: "Colleges" },
  { icon: "📊", label: "Analytics" },
  { icon: "📋", label: "Reports" },
  { icon: "🖥", label: "Monitoring" },
  { icon: "⚙️", label: "Settings" },
];

export const pageMeta = {
  Dashboard:     { title: "Dashboard",     subtitle: "Platform Overview" },
  Organizations: { title: "Organizations",  subtitle: "All platform institutions" },
  Vendors:       { title: "Vendors",        subtitle: "Vendor accounts & subscriptions" },
  Admins:        { title: "Admins",         subtitle: "Platform & organization admins" },
 Colleges: { title: "Colleges", subtitle: "Manage all college accounts on the platform" },
  Analytics:     { title: "Analytics",      subtitle: "Platform-wide analytics" },
  Reports:       { title: "Reports",        subtitle: "Platform reports & exports" },
  Monitoring:    { title: "Monitoring",     subtitle: "Live system health & metrics" },
  Settings:      { title: "Settings",       subtitle: "Platform configuration" },
};

export const ROLE_CONFIG = {
  "Vendor Admin": {
    orgs: ["EduTech Pro", "SkillBridge", "LearnQuest", "AcademiX", "TutorHub"],
    perms: ["Manage subscriptions", "Manage users", "View revenue", "Access analytics"]
  },
  "Org Admin": {
    orgs: ["Coursera Partners", "edX Partnership"],
    perms: ["Manage organization", "Manage members", "Billing access", "Access analytics", "Generate reports"]
  },
  "Restricted Super Admin": {
    orgs: ["Global System Control Node"],
    perms: ["Access entire console panel", "Manage system configurations", "Provision system operators", "BLOCK: Financial & Transactional Data"]
  }
};

export const initialAdmins = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@mit.edu",      org: "MIT OpenCourseWare",  role: "Restricted Super Admin", status: "Active",    lastLogin: "2h ago" },
  { id: 2, name: "Priya Sharma", email: "priya@stanford.edu",  org: "Stanford Extension",  role: "Restricted Super Admin", status: "Active",    lastLogin: "30m ago" },
  { id: 4, name: "Sneha Iyer",   email: "sneha@coursera.com",  org: "Coursera Partners",   role: "Org Admin",              status: "Active",    lastLogin: "4h ago" },
  { id: 6, name: "Nisha Patel",  email: "nisha@edutech.com",   org: "EduTech Pro",         role: "Vendor Admin",           status: "Active",    lastLogin: "1h ago" },
];

export const initialOrganizations = [
  { id: 1, name: "MIT OpenCourseWare", type: "University", plan: "Institutional", admins: 12, courses: 89,  students: 4200, revenue: "₹84,000",  status: "Active",   joined: "Jan 2024" },
  { id: 2, name: "Stanford Extension", type: "University", plan: "Institutional", admins: 8,  courses: 74,  students: 3800, revenue: "₹76,000",  status: "Active",   joined: "Mar 2024" },
  { id: 4, name: "Coursera Partners",  type: "Platform",   plan: "Institutional", admins: 20, courses: 120, students: 5100, revenue: "₹102,000", status: "Active",   joined: "Feb 2024" },
];

export const initialVendorsList = [
  { id: 1, name: "EduTech Pro", plan: "Enterprise", sold: 1240, revenue: "₹24,800", users: 3200, status: "Active",   joined: "Jan 2024" },
  { id: 2, name: "SkillBridge", plan: "Business",   sold: 870,  revenue: "₹13,050", users: 2100, status: "Active",   joined: "Feb 2024" },
];

export const revenueData = [
  { month: "Jan", vendor: 18000, college: 32000 },
  { month: "Feb", vendor: 21000, college: 38000 },
  { month: "Mar", vendor: 19000, college: 35000 },
  { month: "Apr", vendor: 24000, college: 42000 },
  { month: "May", vendor: 28000, college: 48000 },
  { month: "Jun", vendor: 32000, college: 54000 },
];

export const enrollmentStatus = [
  { name: "Active", value: 62 }, { name: "Completed", value: 24 },
  { name: "Dropped", value: 8 }, { name: "Pending", value: 6 },
];

export const STATUS_COLORS = ["#3B6CF4", "#22C55E", "#F59E0B", "#94A3B8"];

export const systemHealth = [
  { name: "API Gateway",   uptime: "99.98%", status: "Operational", latency: "12ms" },
  { name: "Auth Service",   uptime: "99.95%", status: "Operational", latency: "8ms" },
  { name: "Video CDN",      uptime: "97.20%", status: "Degraded",    latency: "210ms" },
  { name: "DB Cluster",     uptime: "99.99%", status: "Operational", latency: "3ms" },
];

export const recentActivities = [
  { icon: "🏢", title: "New console profile synchronized", sub: "Tier validation completed", time: "Just now", color: "#3B6CF4" },
];

// ── Aliases / extra data required by individual page components ──
export const analyticsData = [
  { month: "Jan", users: 1280 }, { month: "Feb", users: 1450 },
  { month: "Mar", users: 1320 }, { month: "Apr", users: 1890 },
  { month: "May", users: 2100 }, { month: "Jun", users: 2480 },
];

export const enrollmentData = [
  { month: "Jan", value: 1280 }, { month: "Feb", value: 1450 },
  { month: "Mar", value: 1320 }, { month: "Apr", value: 1890 },
  { month: "May", value: 2100 }, { month: "Jun", value: 2480 },
];

export const organizations = initialOrganizations;
export const vendorsList = initialVendorsList;

export const reports = [
  { id:1, title: "Q2 Enrollment Summary",      type: "Enrollment", by: "Prof. Arjun Mehta", date: "Jun 20, 2026", priority: "High",   status: "Pending"   },
  { id:2, title: "Course Completion Analysis", type: "Analytics",  by: "Dr. Sneha Iyer",    date: "Jun 21, 2026", priority: "Medium", status: "Pending"   },
  { id:3, title: "Vendor Performance Report",  type: "Progress",   by: "Admin",             date: "Jun 22, 2026", priority: "High",   status: "Pending"   },
  { id:4, title: "Student Feedback Review",    type: "Analytics",  by: "Ravi Kumar",        date: "Jun 23, 2026", priority: "Low",    status: "Pending"   },
  { id:5, title: "Certificate Issuance Log",   type: "Certificate",by: "Admin",             date: "Jun 18, 2026", priority: "Low",    status: "Completed" },
  { id:6, title: "Dropout Analysis Q2",        type: "Analytics",  by: "Dr. Rao",           date: "Jun 24, 2026", priority: "High",   status: "Pending"   },
];