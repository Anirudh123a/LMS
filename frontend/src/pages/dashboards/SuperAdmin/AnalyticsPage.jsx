// ════════════════════════════════════════════════════════════════
//  ANALYTICS PAGE
// ════════════════════════════════════════════════════════════════
import { useTheme } from '@mui/material/styles';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";
import { StatCard, SectionCard } from "./SharedUI";
import { enrollmentStatus, STATUS_COLORS, revenueData, analyticsData } from "./constants";

export default function AnalyticsPage() {
  const isDark = useTheme().palette.mode === 'dark';

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:18 }}>
        <StatCard icon="👥" label="Total Users"    value="48,291"  change="+8.4% vs last month" color="#3B6CF4" />
        <StatCard icon="📚" label="Total Courses"  value="1,340"   change="+3.2% published"     color="#8B5CF6" />
        <StatCard icon="💰" label="Total Revenue"  value="₹96,400" change="+18% this month"     color="#22C55E" />
        <StatCard icon="📈" label="Avg Completion" value="69.2%"   change="+2.1% improvement"   color="#06B6D4" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:14, marginBottom:14 }}>
        <SectionCard title="User Growth — Last 6 Months">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analyticsData} margin={{ top:4, right:8, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?"rgba(255,255,255,0.05)":"#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDark?'#16062B':'#fff', border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12 }} />
              <Line type="monotone" dataKey="users" stroke="#9B75C9" strokeWidth={2.5} dot={false} name="Users" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Revenue — Last 6 Months">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top:4, right:8, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?"rgba(255,255,255,0.05)":"#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDark?'#16062B':'#fff', border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12 }} />
              <Bar dataKey="vendor"  name="Vendor"  fill="#623E98" radius={[4,4,0,0]} />
              <Bar dataKey="college" name="College" fill="#22C55E" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="Enrollment Status Distribution" style={{ marginBottom:20 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14, alignItems:"center" }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={enrollmentStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {enrollmentStatus.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={v=>`${v}%`} contentStyle={{ backgroundColor: isDark?'#16062B':'#fff', border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {enrollmentStatus.map((s, i) => (
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:9, height:9, borderRadius:"50%", background:STATUS_COLORS[i] }} />
                    <span style={{ color: isDark?'#CBB6E6':'#475569', fontWeight:500 }}>{s.name}</span>
                  </div>
                  <span style={{ fontWeight:700, color: isDark?'#fff':'#0F172A' }}>{s.value}%</span>
                </div>
                <div style={{ height:5, background: isDark?'rgba(255,255,255,0.05)':'#F1F5F9', borderRadius:4, overflow:"hidden" }}>
                  <div style={{ width:`${s.value}%`, height:"100%", background:STATUS_COLORS[i], borderRadius:4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </>
  );
}
