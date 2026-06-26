// ════════════════════════════════════════════════════════════════
//  CREATE ADMIN MODAL
// ════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from '@mui/material/styles';
import { ROLE_CONFIG } from './constants';
// ── Password Strength Helper ───────────────────────────────────
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const levels = [
    { label:"",       color:"transparent", pct:0   },
    { label:"Weak",   color:"#EF4444",     pct:25  },
    { label:"Fair",   color:"#F59E0B",     pct:50  },
    { label:"Good",   color:"#3B6CF4",     pct:75  },
    { label:"Strong", color:"#22C55E",     pct:100 },
  ];
  return levels[score];
}

// ── Modal Component ────────────────────────────────────────────
export default function CreateAdminModal({ onClose, onCreated, onNavigate, initialRole }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [role, setRole]               = useState(initialRole || "Restricted Super Admin");
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [pwd, setPwd]                 = useState("");
  const [pwd2, setPwd2]               = useState("");
  const [showPwd, setShowPwd]         = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [perms, setPerms]             = useState({});
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");
  const [submitting, setSubmitting]   = useState(false);

  const strength = getPasswordStrength(pwd);

  const handleRoleChange = (r) => {
    setRole(r);
    setSelectedOrg(null);
  };

  useEffect(() => {
    const defaultPerms = {};
    if (ROLE_CONFIG[role]) {
      ROLE_CONFIG[role].perms.forEach((p) => { defaultPerms[p] = true; });
    }
    setPerms(defaultPerms);
  }, [role]);

  const togglePerm = (p) => setPerms(prev => ({ ...prev, [p]: !prev[p] }));

  const handleCreate = async () => {
    setError('');
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !pwd) {
      setError('Please fill in all required fields.'); return;
    }
    if (pwd !== pwd2) {
      setError('Passwords do not match.'); return;
    }
    if (!selectedOrg) {
      setError('Please select an organization.'); return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/superadmin/create-admin`,
        { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password: pwd, role, org: selectedOrg, permissions: perms }
      );

      const data = res.data;
      onCreated && onCreated({
        id: data.user?.id || Date.now(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        org: selectedOrg,
        role,
        status: 'Active',
        lastLogin: 'Just now',
      });

      setSuccess('Admin created successfully. Redirecting...');

      setTimeout(() => {
        onClose();
        if (!onNavigate) return;
        if (role === "Restricted Super Admin") onNavigate("/dashboard/admin");
        else if (role === "Org Admin")         onNavigate("/dashboard/organization");
        else if (role === "Vendor Admin")      onNavigate("/dashboard/vendor");
      }, 900);

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create admin.');
    } finally {
      setSubmitting(false);
    }
  };

  const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 };
  const modal   = { background: isDark ? "#1a0836" : "#fff", border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E2E8F0", borderRadius:14, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" };
  const inp     = { width:"100%", background: isDark ? "rgba(255,255,255,0.05)" : "#F8FAFC", border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E2E8F0", borderRadius:8, padding:"9px 12px", color: isDark ? "#fff" : "#0F172A", fontSize:13, outline:"none", boxSizing:"border-box" };
  const lbl     = { fontSize:11, fontWeight:700, color: isDark ? "#9B75C9" : "#623E98", textTransform:"uppercase", letterSpacing:0.7, display:"block", marginBottom:5 };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ background: isDark ? "#16062B" : "#F8FAFC", padding:"16px 20px", borderBottom: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #E2E8F0", display:"flex", alignItems:"center", justifyContent:"space-between", borderRadius:"14px 14px 0 0" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"linear-gradient(135deg,#623E98,#9B75C9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>👤</div>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color: isDark ? "#fff" : "#0F172A" }}>Create Admin User</div>
              <div style={{ fontSize:11, color: isDark ? "#A692C4" : "#94A3B8" }}>Set credentials and assign role</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:7, width:28, height:28, cursor:"pointer", fontSize:14, color: isDark ? "#CBB6E6" : "#475569", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ padding:"18px 20px" }}>
          {success && <div style={{ background:"rgba(34,197,94,0.12)", border:"1px solid rgba(34,197,94,0.3)", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#22C55E" }}>✅ {success}</div>}
          {error   && <div style={{ background:"rgba(239,68,68,0.1)",  border:"1px solid rgba(239,68,68,0.3)",  borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#EF4444" }}>⚠️ {error}</div>}

          {/* Role Selector */}
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>Admin Role</label>
            <div style={{ display:"flex", gap:6, background: isDark ? "rgba(255,255,255,0.04)" : "#F1F5F9", borderRadius:9, padding:4 }}>
              {Object.keys(ROLE_CONFIG).map(r => (
                <button key={r} onClick={() => handleRoleChange(r)} style={{ flex:1, padding:"7px 0", border:"none", borderRadius:7, fontSize:11, fontWeight:600, cursor:"pointer", transition:"all 0.15s", background: role === r ? "#623E98" : "transparent", color: role === r ? "#fff" : (isDark ? "#A692C4" : "#64748B") }}>
                  {r === "Restricted Super Admin" ? "🎓" : r === "Org Admin" ? "🏢" : "🛒"} {r}
                </button>
              ))}
            </div>
          </div>

          {/* Name Fields */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>First Name *</label>
              <input style={inp} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Rajesh" />
            </div>
            <div>
              <label style={lbl}>Last Name *</label>
              <input style={inp} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Kumar" />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Email / Username *</label>
            <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@institution.edu" />
          </div>

          {/* Password */}
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Password *</label>
            <div style={{ position:"relative" }}>
              <input style={{ ...inp, paddingRight:38 }} type={showPwd ? "text" : "password"} value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Set a strong password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#94A3B8" }}>
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
            {pwd && (
              <>
                <div style={{ height:3, background:"rgba(0,0,0,0.08)", borderRadius:2, marginTop:6, overflow:"hidden" }}>
                  <div style={{ width:`${strength.pct}%`, height:"100%", background:strength.color, borderRadius:2, transition:"width 0.3s,background 0.3s" }} />
                </div>
                <div style={{ fontSize:10, color:strength.color, marginTop:3, fontWeight:600 }}>{strength.label}</div>
              </>
            )}
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>Confirm Password *</label>
            <input style={{ ...inp, borderColor: pwd2 && pwd !== pwd2 ? "#EF4444" : undefined }} type="password" value={pwd2} onChange={e => setPwd2(e.target.value)} placeholder="Re-enter password" />
            {pwd2 && pwd !== pwd2 && <div style={{ fontSize:10, color:"#EF4444", marginTop:3 }}>Passwords do not match</div>}
          </div>

          {/* Org Selector */}
          <div style={{ marginBottom:18 }}>
            <label style={lbl}>{role === "Vendor Admin" ? "Assign to Vendor *" : "Assign to Organization *"}</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {ROLE_CONFIG[role]?.orgs.map(org => (
                <button key={org} onClick={() => setSelectedOrg(org)} style={{ padding:"8px 10px", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer", textAlign:"left", transition:"all 0.15s", border: selectedOrg === org ? "1.5px solid #623E98" : isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #E2E8F0", background: selectedOrg === org ? "rgba(98,62,152,0.15)" : isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", color: selectedOrg === org ? (isDark ? "#CBB6E6" : "#623E98") : (isDark ? "#A692C4" : "#64748B") }}>
                  {selectedOrg === org ? "✓ " : ""}{org}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label style={lbl}>Permissions</label>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {ROLE_CONFIG[role]?.perms.map(p => (
                <div key={p} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background: isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", borderRadius:8, border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #F1F5F9" }}>
                  <span style={{ fontSize:12, color: isDark ? "#CBB6E6" : "#334155", fontWeight:500 }}>{p}</span>
                  <button type="button" onClick={() => togglePerm(p)} style={{ width:36, height:20, borderRadius:10, border:"none", cursor:"pointer", background: perms[p] ? "#623E98" : (isDark ? "rgba(255,255,255,0.12)" : "#CBD5E1"), position:"relative", transition:"background 0.2s", flexShrink:0 }}>
                    <span style={{ position:"absolute", top:2, left: perms[p] ? 18 : 2, width:16, height:16, borderRadius:"50%", background:"#fff", transition:"left 0.2s", display:"block" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding:"14px 20px", borderTop: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid #F1F5F9", display:"flex", gap:8, justifyContent:"flex-end" }}>
          <button type="button" onClick={onClose} style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", border:"none", borderRadius:8, padding:"9px 18px", fontSize:12, fontWeight:600, color: isDark ? "#A692C4" : "#64748B", cursor:"pointer" }}>Cancel</button>
          <button type="button" onClick={handleCreate} disabled={submitting} style={{ background:"linear-gradient(90deg,#623E98,#9B75C9)", border:"none", borderRadius:8, padding:"9px 20px", fontSize:12, fontWeight:700, color:"#fff", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, display:"flex", alignItems:"center", gap:6 }}>
            {submitting ? "Creating..." : "👤 Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
