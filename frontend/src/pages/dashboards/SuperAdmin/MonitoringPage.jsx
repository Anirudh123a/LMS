// ════════════════════════════════════════════════════════════════
//  MONITORING PAGE
// ════════════════════════════════════════════════════════════════
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SectionCard } from "./SharedUI";
import { systemHealth, enrollmentData } from "./constants";
const MONITOR_STATS = [
  { label:"Platform Uptime",    value:"99.87%", change:"+0.02%", icon:"🟢", color:"#22C55E" },
  { label:"Active Users Now",   value:"3,842",  change:"+6.7%",  icon:"👥", color:"#3B6CF4" },
  { label:"API Requests / min", value:"14,200", change:"+12%",   icon:"⚡", color:"#8B5CF6" },
  { label:"Avg Response Time",  value:"42ms",   change:"-8ms",   icon:"⏱", color:"#06B6D4" },
  { label:"Error Rate",         value:"0.12%",  change:"-0.03%", icon:"⚠️", color:"#F59E0B" },
  { label:"Certificates Today", value:"184",    change:"+22%",   icon:"🏅", color:"#EF4444" },
];

export default function MonitoringPage() {
  const isDark = useTheme().palette.mode === 'dark';

  return (
    <>
      {/* Monitor Stat Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14, marginBottom:14 }}>
        {MONITOR_STATS.map(item => (
          <div key={item.label} style={{ background: isDark?"rgba(50,14,94,0.4)":"#fff", borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)", borderLeft:`4px solid ${item.color}`, display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ background:item.color+"18", borderRadius:10, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{item.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:0.8 }}>{item.label}</div>
              <div style={{ fontSize:22, fontWeight:800, color: isDark?'#fff':'#0F172A', letterSpacing:-0.5, marginTop:2 }}>{item.value}</div>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:"#22C55E", background:"#F0FDF4", padding:"3px 8px", borderRadius:20 }}>{item.change}</div>
          </div>
        ))}
      </div>

      {/* Service Health & Chart */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:14, marginBottom:14 }}>
        <SectionCard title="System Health — All Services">
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
            {systemHealth.map(s => (
              <div key={s.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background: s.status === "Operational" ? "#22C55E" : "#F59E0B", flexShrink:0 }} />
                  <span style={{ fontSize:13, color: isDark?'#CBB6E6':'#334155', fontWeight:500 }}>{s.name}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:11, color:"#64748B" }}>{s.latency}</span>
                  <span style={{ fontSize:11, color:"#64748B" }}>{s.uptime}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, background: s.status==="Operational"?"#F0FDF4":"#FFFBEB", color: s.status==="Operational"?"#16A34A":"#D97706" }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Enrollment Trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={enrollmentData} margin={{ top:4, right:8, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?"rgba(255,255,255,0.05)":"#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDark?'#16062B':'#fff', border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12 }} />
              <Line type="monotone" dataKey="value" stroke="#623E98" strokeWidth={2.5} dot={false} name="Enrollments" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </>
  );
}
