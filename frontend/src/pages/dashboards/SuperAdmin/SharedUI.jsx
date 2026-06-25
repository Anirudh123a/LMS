// ════════════════════════════════════════════════════════════════
//  SHARED UI COMPONENTS
// ════════════════════════════════════════════════════════════════
import { useTheme } from '@mui/material/styles';

// ── Stat Card ─────────────────────────────────────────────────
export function StatCard({ icon, label, value, change, color }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <div style={{ background: isDark ? "rgba(50,14,94,0.4)" : "#fff", borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)", borderTop:`3px solid ${color}`, backdropFilter:'blur(10px)', minWidth:0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:0.8, color: isDark ? "#CBB6E6":"#94A3B8", textTransform:"uppercase" }}>{label}</span>
        <div style={{ background:color+"18", borderRadius:8, width:30, height:30, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{icon}</div>
      </div>
      <div style={{ fontSize:24, fontWeight:800, color: isDark ? "#fff":"#0F172A", marginTop:8, letterSpacing:-1 }}>{value}</div>
      {change && <div style={{ fontSize:11, marginTop:3, color: isDark ? "#A692C4":"#94A3B8", fontWeight:500 }}>{change}</div>}
    </div>
  );
}

// ── Gradient Card ─────────────────────────────────────────────
export function GradientCard({ gradient, label, value, sub, footer }) {
  const theme = useTheme();
  return (
    <div style={{ background:gradient, borderRadius:12, padding:"18px 20px", color:"#fff", boxShadow:theme.customGradients?.glow||"0 4px 16px rgba(0,0,0,0.15)" }}>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, opacity:0.8, textTransform:"uppercase" }}>{label}</div>
      <div style={{ fontSize:32, fontWeight:800, marginTop:8, letterSpacing:-1 }}>{value}</div>
      <div style={{ fontSize:12, opacity:0.75, marginTop:3 }}>{sub}</div>
      {footer && <div style={{ marginTop:12, borderTop:"1px solid rgba(255,255,255,0.2)", paddingTop:10, fontSize:12, opacity:0.85 }}>{footer}</div>}
    </div>
  );
}

// ── Section Card ──────────────────────────────────────────────
export function SectionCard({ title, children, action, style }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <div style={{ background: isDark ? "rgba(50,14,94,0.3)":"#fff", borderRadius:12, padding:18, boxShadow:"0 2px 12px rgba(0,0,0,0.05)", border: isDark ? "1px solid rgba(255,255,255,0.08)":"1px solid rgba(0,0,0,0.02)", backdropFilter:'blur(10px)', minWidth:0, ...style }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <h3 style={{ margin:0, fontSize:14, fontWeight:700, color: isDark ? "#fff":"#0F172A" }}>{title}</h3>
        {action && <button style={{ fontSize:12, color: isDark ? "#CBB6E6":"#3B6CF4", background:"none", border:"none", cursor:"pointer", fontWeight:600 }}>{action}</button>}
      </div>
      {children}
    </div>
  );
}

// ── Table Cell ────────────────────────────────────────────────
export function TD({ children, bold, color }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <td style={{ padding:"10px 10px", color: bold ? (isDark?"#fff":"#0F172A") : (color||(isDark?"#CBB6E6":"#475569")), fontWeight: bold?600:400 }}>
      {children}
    </td>
  );
}

// ── Badge ─────────────────────────────────────────────────────
export function Badge({ label, color, bg }) {
  return <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, background:bg, color }}>{label}</span>;
}

export function statusBadge(status) {
  const map = {
    Active:    { color:"#1D4ED8", bg:"#DBEAFE" },
    Inactive:  { color:"#64748B", bg:"#F1F5F9" },
    Suspended: { color:"#B91C1C", bg:"#FEE2E2" },
    Completed: { color:"#15803D", bg:"#DCFCE7" },
    Pending:   { color:"#B45309", bg:"#FEF3C7" },
  };
  const s = map[status] || { color:"#64748B", bg:"#F1F5F9" };
  return <Badge label={status} color={s.color} bg={s.bg} />;
}

export function priorityBadge(p) {
  const map = {
    High:   { color:"#B91C1C", bg:"#FEE2E2" },
    Medium: { color:"#B45309", bg:"#FEF3C7" },
    Low:    { color:"#15803D", bg:"#DCFCE7" },
  };
  const s = map[p] || { color:"#64748B", bg:"#F1F5F9" };
  return <Badge label={p} color={s.color} bg={s.bg} />;
}

export function planBadge(plan) {
  const map = {
    Institutional: { color:"#1D4ED8", bg:"#DBEAFE" },
    Enterprise:    { color:"#15803D", bg:"#DCFCE7" },
    Business:      { color:"#7C3AED", bg:"#EDE9FE" },
    Premium:       { color:"#B45309", bg:"#FEF3C7" },
    Starter:       { color:"#64748B", bg:"#F1F5F9" },
  };
  const s = map[plan] || { color:"#64748B", bg:"#F1F5F9" };
  return <Badge label={plan} color={s.color} bg={s.bg} />;
}

// ── Table ─────────────────────────────────────────────────────
export function Table({ cols, rows }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
        <thead>
          <tr style={{ borderBottom: isDark?"2px solid rgba(255,255,255,0.1)":"2px solid #F1F5F9" }}>
            {cols.map(c => (
              <th key={c} style={{ padding:"6px 10px", textAlign:"left", color: isDark?"#A692C4":"#94A3B8", fontWeight:700, fontSize:10, textTransform:"uppercase", letterSpacing:0.8, whiteSpace:"nowrap" }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

// ── Search Bar ────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <div style={{ display:"flex", alignItems:"center", gap:7, background: isDark?"rgba(255,255,255,0.05)":"#F8FAFC", border: isDark?"1px solid rgba(255,255,255,0.1)":"1px solid #E2E8F0", borderRadius:8, padding:"7px 12px", width:220 }}>
      <span style={{ color:"#94A3B8", fontSize:13 }}>🔍</span>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||"Search..."} style={{ border:"none", outline:"none", fontSize:12, color: isDark?"#fff":"#0F172A", background:"none", width:"100%" }} />
    </div>
  );
}

// ── Section Divider ───────────────────────────────────────────
export function SectionDivider({ label }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10, marginTop:10 }}>
      <div style={{ width:4, height:20, background:"#623E98", borderRadius:4 }} />
      <h2 style={{ margin:0, fontSize:15, fontWeight:800, color: isDark?"#fff":"#0F172A" }}>{label}</h2>
      <div style={{ flex:1, height:1, background: isDark?"rgba(255,255,255,0.1)":"#E2E8F0" }} />
    </div>
  );
}
