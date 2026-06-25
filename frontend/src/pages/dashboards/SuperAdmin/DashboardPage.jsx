// ════════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ════════════════════════════════════════════════════════════════
import { useOutletContext } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { StatCard, GradientCard, SectionCard, SectionDivider, Table, TD } from "./SharedUI";
import { planBadge, statusBadge } from './SharedUI';
import { revenueData, enrollmentStatus, STATUS_COLORS, systemHealth, recentActivities } from "./constants";

export default function DashboardPage() {
  // Extracting active dynamic datasets cleanly from layout router engine context
  const { organizations = [], vendorsList = [] } = useOutletContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const totalVendorSubs = vendorsList.reduce((s, r) => s + (r.sold || 0), 0);
  const totalOrgSubs    = organizations.reduce((s, o) => s + (o.students || 0), 0);

  return (
    <>
      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 14 }}>
        <StatCard icon="🏢" label="Total Organizations" value={organizations.length} change="+12% institutions" color="#3B6CF4" />
        <StatCard icon="👥" label="Total Users"         value="48,291"              change="+8.4% across platform" color="#8B5CF6" />
        <StatCard icon="📚" label="Active Courses"      value="1,340"               change="+3.2% published"       color="#06B6D4" />
        <StatCard icon="💰" label="Monthly Revenue"     value="₹96,400"              change="+18% this month"       color="#22C55E" />
      </div>

      <SectionDivider label="Subscription Summary" />

      {/* Gradient Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 14 }}>
        <GradientCard gradient="linear-gradient(135deg,#623E98 0%,#320E5E 100%)" label="Vendor Subscriptions Sold" value={totalVendorSubs.toLocaleString()} sub={`Across ${vendorsList.length} active vendors`} footer="Top: EduTech Pro · 1,240 subs" />
        <GradientCard gradient="linear-gradient(135deg,#0891B2 0%,#059669 100%)" label="Organisation Students"     value={totalOrgSubs.toLocaleString()}    sub={`Across ${organizations.length} institutions`} footer="Top: Coursera Partners · 5,100 students" />
        <GradientCard gradient="linear-gradient(135deg,#9B75C9 0%,#623E98 100%)" label="Total Platform Revenue"   value="₹2,14,800" sub="Combined platform-wide" footer={`Vendors ${Math.round(totalVendorSubs / (totalVendorSubs + totalOrgSubs || 1) * 100)}% · Colleges ${Math.round(totalOrgSubs / (totalVendorSubs + totalOrgSubs || 1) * 100)}%`} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,2fr))", gap: 14, marginBottom: 14 }}>
        <SectionCard title="Enrollment & Revenue Trends" action="Export">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#16062B' : '#fff', borderRadius: 8, border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="vendor"  name="Vendor Revenue"  fill="#9B75C9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="college" name="College Revenue" fill="#22C55E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Enrollment Status">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={enrollmentStatus} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                {enrollmentStatus.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={{ backgroundColor: isDark ? '#16062B' : '#fff', border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 8px", marginTop: 4 }}>
            {enrollmentStatus.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[i], flexShrink: 0 }} />
                <span style={{ color: isDark ? '#CBB6E6' : '#475569' }}>{s.name} <strong>{s.value}%</strong></span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Top Organizations Table */}
      <div style={{ marginBottom: 14 }}>
        <SectionCard title="Top Organizations" action="View All">
          <Table
            cols={["Rank", "Organization", "Plan", "Courses", "Students", "Revenue", "Status"]}
            rows={organizations.slice(0, 4).map((org, i) => (
              <tr key={org.id} style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #F8FAFC" }}>
                <td style={{ padding: "10px 10px" }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: i === 0 ? "#FEF3C7" : i === 1 ? "#F1F5F9" : "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#D97706" : i === 1 ? "#64748B" : "#EA580C" }}>{i + 1}</div>
                </td>
                <TD bold>{org.name}</TD>
                <td style={{ padding: "10px 10px" }}>{planBadge(org.plan)}</td>
                <TD color="#9B75C9">{org.courses}</TD>
                <TD color="#3B6CF4">{(org.students || 0).toLocaleString()}</TD>
                <TD color="#22C55E">{org.revenue}</TD>
                <td style={{ padding: "10px 10px" }}>{statusBadge(org.status)}</td>
              </tr>
            ))}
          />
        </SectionCard>
      </div>

      {/* Activities & System Health */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, paddingBottom: 20 }}>
        <SectionCard title="Recent Activities" action="View All">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentActivities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: a.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#fff' : '#0F172A', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.title}</div>
                  <div style={{ fontSize: 10, color: isDark ? '#A692C4' : '#94A3B8', marginTop: 1 }}>{a.sub}</div>
                </div>
                <div style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0, marginTop: 2 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="System Health">
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {systemHealth.map(s => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "Operational" ? "#22C55E" : "#F59E0B", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: isDark ? '#CBB6E6' : '#334155', fontWeight: 500 }}>{s.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "#64748B" }}>{s.uptime}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 20, background: s.status === "Operational" ? "#F0FDF4" : "#FFFBEB", color: s.status === "Operational" ? "#16A34A" : "#D97706" }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </>
  );
}