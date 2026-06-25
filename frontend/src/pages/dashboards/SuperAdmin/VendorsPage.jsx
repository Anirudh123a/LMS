// ════════════════════════════════════════════════════════════════
//  VENDORS PAGE
// ════════════════════════════════════════════════════════════════
import { useState } from "react";
import { useTheme } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { StatCard, SectionCard, SearchBar, Table, TD } from "./SharedUI";
import { planBadge, statusBadge } from "./SharedUI";
import { vendorsList } from "./constants";

export default function VendorsPage() {
  const isDark = useTheme().palette.mode === 'dark';
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const plans = ["All", "Enterprise", "Business", "Starter"];

  const filtered = vendorsList.filter(v =>
    (filter === "All" || v.plan === filter) &&
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:18 }}>
        <StatCard icon="🛒" label="Total Vendors"   value={vendorsList.length}                                         change="registered"    color="#3B6CF4" />
        <StatCard icon="🟢" label="Active"          value={vendorsList.filter(v=>v.status==="Active").length}           change="active now"    color="#22C55E" />
        <StatCard icon="📦" label="Total Subs Sold" value={vendorsList.reduce((s,v)=>s+v.sold,0).toLocaleString()}    change="platform-wide" color="#8B5CF6" />
        <StatCard icon="💰" label="Vendor Revenue"  value="₹59,800"                                                   change="this period"   color="#06B6D4" />
      </div>

      <div style={{ marginBottom:14 }}>
        <SectionCard title="Subscription Breakdown by Vendor">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={vendorsList.map(v=>({ name:v.name, sold:v.sold }))} margin={{ top:4, right:8, left:-22, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?"rgba(255,255,255,0.05)":"#F1F5F9"} />
              <XAxis dataKey="name" tick={{ fontSize:10, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:"#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: isDark?'#16062B':'#fff', border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, fontSize:12 }} />
              <Bar dataKey="sold" name="Subscriptions" fill="#623E98" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title="All Vendors" style={{ marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search vendor..." />
          <div style={{ display:"flex", gap:6 }}>
            {plans.map(opt => (
              <button key={opt} onClick={() => setFilter(opt)} style={{ padding:"5px 13px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer", border:"none", background: filter===opt?"#623E98":"#F1F5F9", color: filter===opt?"#fff":"#475569" }}>{opt}</button>
            ))}
          </div>
        </div>

        <Table
          cols={["#","Vendor Name","Plan","Subscriptions Sold","Revenue","Users","Joined","Status"]}
          rows={filtered.map(v => (
            <tr key={v.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <TD>{v.id}</TD>
              <TD bold>{v.name}</TD>
              <td style={{ padding:"10px 10px" }}>{planBadge(v.plan)}</td>
              <TD color="#3B6CF4">{v.sold.toLocaleString()}</TD>
              <TD color="#22C55E">{v.revenue}</TD>
              <TD>{v.users.toLocaleString()}</TD>
              <TD>{v.joined}</TD>
              <td style={{ padding:"10px 10px" }}>{statusBadge(v.status)}</td>
            </tr>
          ))}
        />
        {filtered.length === 0 && <div style={{ textAlign:"center", padding:"30px 0", color:"#94A3B8", fontSize:13 }}>No vendors found.</div>}
      </SectionCard>
    </>
  );
}
