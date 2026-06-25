// ════════════════════════════════════════════════════════════════
//  ORGANIZATIONS PAGE
// ════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { StatCard, SectionCard, SearchBar, Table, TD } from "./SharedUI";
import { planBadge, statusBadge } from "./SharedUI";
import { organizations } from "./constants";

export default function OrganizationsPage() {
  const isDark = useTheme().palette.mode === 'dark';
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const plans = ["All", "Institutional", "Enterprise", "Premium"];

  const filtered = organizations.filter(o =>
    (filter === "All" || o.plan === filter) &&
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:18 }}>
        <StatCard icon="🏢" label="Total Orgs"     value={organizations.length}                                           change="registered" color="#3B6CF4" />
        <StatCard icon="🟢" label="Active"          value={organizations.filter(o=>o.status==="Active").length}           change="subscribed" color="#22C55E" />
        <StatCard icon="📚" label="Total Courses"  value={organizations.reduce((s,o)=>s+o.courses,0)}                  change="published"  color="#8B5CF6" />
        <StatCard icon="👥" label="Total Students" value={organizations.reduce((s,o)=>s+o.students,0).toLocaleString()} change="across all" color="#06B6D4" />
      </div>

      <SectionCard title="All Organizations" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search organization..." />
          <div style={{ display:"flex", gap:6 }}>
            {plans.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:"none", background: filter===opt?"#623E98":"#F1F5F9", color: filter===opt?"#fff":"#475569" }}>{opt}</button>
            ))}
          </div>
        </div>

        <Table
          cols={["#","Organization","Type","Plan","Admins","Courses","Students","Revenue","Joined","Status"]}
          rows={filtered.map(o => (
            <tr key={o.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <TD>{o.id}</TD>
              <td style={{ padding:"10px 10px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:"#623E98", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:11, fontWeight:700, flexShrink:0 }}>{o.name.charAt(0)}</div>
                  <span style={{ fontWeight:600, fontSize:12, color: isDark?"#fff":"#0F172A" }}>{o.name}</span>
                </div>
              </td>
              <TD>{o.type}</TD>
              <td style={{ padding:"10px 10px" }}>{planBadge(o.plan)}</td>
              <TD color="#9B75C9">{o.admins}</TD>
              <TD color="#3B6CF4">{o.courses}</TD>
              <TD>{o.students.toLocaleString()}</TD>
              <TD color="#22C55E">{o.revenue}</TD>
              <TD>{o.joined}</TD>
              <td style={{ padding:"10px 10px" }}>{statusBadge(o.status)}</td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign:"center", padding:"30px 0", color:"#94A3B8", fontSize:13 }}>No organizations found.</div>}
      </SectionCard>
    </>
  );
}
