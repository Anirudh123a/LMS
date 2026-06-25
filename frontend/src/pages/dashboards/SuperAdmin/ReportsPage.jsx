// ════════════════════════════════════════════════════════════════
//  REPORTS PAGE
// ════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard, SectionCard, SearchBar, Table, TD } from "./SharedUI";
import { statusBadge, priorityBadge } from "./SharedUI";
import { reports } from "./constants";

const TYPE_COLORS = {
  Platform: "#3B6CF4",
  Revenue:  "#22C55E",
  Orgs:     "#8B5CF6",
  System:   "#EF4444",
  Analytics:"#06B6D4",
};

const MONTHLY_REPORTS = [
  { month:"Jan", completed:8,  pending:2 },
  { month:"Feb", completed:10, pending:3 },
  { month:"Mar", completed:7,  pending:5 },
  { month:"Apr", completed:12, pending:2 },
  { month:"May", completed:14, pending:1 },
  { month:"Jun", completed:5,  pending:5 },
];

const QUICK_REPORTS = [
  { title:"Platform Summary", icon:"🌐", color:"#3B6CF4" },
  { title:"Revenue Report",   icon:"💰", color:"#22C55E" },
  { title:"Org Performance",  icon:"🏢", color:"#8B5CF6" },
  { title:"System Audit",     icon:"🖥", color:"#EF4444" },
];

export default function ReportsPage() {
  const isDark = useTheme().palette.mode === 'dark';
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const statuses = ["All", "Completed", "Pending"];

  const filtered = reports.filter(r =>
    (filter === "All" || r.status === filter) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:18 }}>
        <StatCard icon="📊" label="Total Reports" value={reports.length}                                    change="all time"       color="#3B6CF4" />
        <StatCard icon="✅" label="Completed"      value={reports.filter(r=>r.status==="Completed").length} change="ready"          color="#22C55E" />
        <StatCard icon="⏳" label="Pending"        value={reports.filter(r=>r.status==="Pending").length}   change="need attention" color="#F59E0B" />
        <StatCard icon="🔴" label="High Priority" value={reports.filter(r=>r.priority==="High").length}    change="urgent"         color="#EF4444" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,2fr))", gap:14, marginBottom:14 }}>
        <SectionCard title="Monthly Report Activity">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_REPORTS} margin={{ top:4, right:8, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?"rgba(255,255,255,0.05)":"#F1F5F9"} />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDark?'#16062B':'#fff', border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12 }} />
              <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[4,4,0,0]} />
              <Bar dataKey="pending"   name="Pending"   fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Quick Reports">
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {QUICK_REPORTS.map((q, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background: isDark?'rgba(255,255,255,0.03)':'#F8FAFC', borderRadius:8, padding:"8px 12px", border: isDark?'1px solid rgba(255,255,255,0.05)':'none' }}>
                <span style={{ fontSize:18 }}>{q.icon}</span>
                <span style={{ flex:1, fontSize:12, fontWeight:600, color: isDark?'#fff':'#0F172A' }}>{q.title}</span>
                <button style={{ fontSize:10, color:q.color, background:q.color+"18", border:"none", borderRadius:6, padding:"3px 9px", cursor:"pointer", fontWeight:600 }}>Generate</button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="All Reports" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search report..." />
          <div style={{ display:"flex", gap:6 }}>
            {statuses.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:"none", background: filter===opt?"#623E98":"#F1F5F9", color: filter===opt?"#fff":"#475569" }}>{opt}</button>
            ))}
          </div>
        </div>

        <Table
          cols={["#","Title","Type","By","Date","Priority","Status","Action"]}
          rows={filtered.map(r => (
            <tr key={r.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <TD>{r.id}</TD>
              <TD bold>{r.title}</TD>
              <td style={{ padding:"10px 10px" }}>
                <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, background:(TYPE_COLORS[r.type]||"#3B6CF4")+"20", color:TYPE_COLORS[r.type]||"#3B6CF4" }}>{r.type}</span>
              </td>
              <TD>{r.by}</TD>
              <TD>{r.date}</TD>
              <td style={{ padding:"10px 10px" }}>{priorityBadge(r.priority)}</td>
              <td style={{ padding:"10px 10px" }}>{statusBadge(r.status)}</td>
              <td style={{ padding:"10px 10px" }}>
                <button style={{ fontSize:11, color:"#1D4ED8", background:"#DBEAFE", border:"none", borderRadius:6, padding:"4px 10px", cursor:"pointer", fontWeight:600 }}>
                  {r.status === "Completed" ? "⬇ Download" : "👁 View"}
                </button>
              </td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign:"center", padding:"30px 0", color:"#94A3B8", fontSize:13 }}>No reports found.</div>}
      </SectionCard>
    </>
  );
}
