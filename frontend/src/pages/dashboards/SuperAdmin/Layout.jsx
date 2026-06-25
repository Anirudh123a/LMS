// ════════════════════════════════════════════════════════════════
//  MAIN ROUTER SHELL LAYOUT — Super Admin Panel
// ════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext'; 
import { navItems, pageMeta, initialAdmins, initialOrganizations, initialVendorsList } from "./constants";
import CreateAdminModal from './CreateAdminModal';

export default function Layout() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [modalRole, setModalRole] = useState("Restricted Super Admin");
  const [admins, setAdmins] = useState(initialAdmins);
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [vendorsList, setVendorsList] = useState(initialVendorsList);

  const currentPathEnd = location.pathname.split('/').pop();
  const activeKey = currentPathEnd === 'super-admin' ? 'Dashboard' : currentPathEnd;
  const activeLabel = Object.keys(pageMeta).find(key => key.toLowerCase() === activeKey.toLowerCase()) || "Dashboard";

  const openModalWithRole = (selectedRole) => {
    setModalRole(selectedRole || "Restricted Super Admin");
    setShowModal(true);
  };

  const handleCreated = (newAdmin) => {
    const nextId = admins.length + 1;
    setAdmins(prev => [...prev, { id: nextId, name: newAdmin.name, email: newAdmin.email, org: newAdmin.org, role: newAdmin.role, status: "Active", lastLogin: "Just now" }]);

    if (newAdmin.role === "Org Admin") {
      setOrganizations(prev => {
        if (prev.some(o => o.name === newAdmin.org)) {
          return prev.map(o => o.name === newAdmin.org ? { ...o, admins: o.admins + 1 } : o);
        }
        return [...prev, { id: prev.length + 1, name: newAdmin.org, type: "Platform", plan: "Enterprise", admins: 1, courses: 0, students: 0, revenue: "₹0", status: "Active", joined: "Jun 2026" }];
      });
    }

    if (newAdmin.role === "Vendor Admin") {
      setVendorsList(prev => {
        if (prev.some(v => v.name === newAdmin.org)) return prev;
        return [...prev, { id: prev.length + 1, name: newAdmin.org, plan: "Business", sold: 0, revenue: "₹0", users: 0, status: "Active", joined: "Jun 2026" }];
      });
    }
  };

  const handleLogout = async () => {
    try {
      if (logout) await logout();
      navigate('/auth/login');
    } catch (err) {
      console.error("Session termination failure:", err);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", background: isDark ? "#16062B" : "#F8FAFC" }}>
      <Sidebar activeLabel={activeLabel} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar 
          activeLabel={activeLabel} 
          onLogout={handleLogout} 
        />
        
        <main style={{ flex: 1, padding: "24px", overflowY: "auto", boxSizing: "border-box" }}>
          <Outlet context={{ admins, setAdmins, organizations, vendorsList, openModalWithRole }} />
        </main>
      </div>

      {showModal && <CreateAdminModal onClose={() => setShowModal(false)} onCreated={handleCreated} initialRole={modalRole} onNavigate={navigate} />}
    </div>
  );
}

export function Sidebar({ activeLabel }) {
  return (
    <aside style={{ width: 200, height: "100vh", background: "#16062B", display: "flex", flexDirection: "column", flexShrink: 0, position: "sticky", top: 0, borderRight: "1px solid rgba(255,255,255,0.05)", zIndex: 1100 }}>
      <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#623E98,#9B75C9)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>E</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>EduPlatform</span>
        </div>
        <div style={{ marginTop: 10, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: "6px 10px" }}>
          <div style={{ color: "#9B75C9", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Logged in as</div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 12, marginTop: 2 }}>Super Admin</div>
        </div>
      </div>
      <nav style={{ marginTop: 6, flex: 1, overflowY: "auto" }}>
        {navItems.map(({ icon, label }) => {
          const targetPath = label === "Dashboard" ? "/dashboard/super-admin" : `/dashboard/super-admin/${label.toLowerCase()}`;
          const isActive = activeLabel === label;

          return (
            <NavLink
              key={label}
              to={targetPath}
              end={label === "Dashboard"}
              style={{
                display: "flex", alignItems: "center", gap: 9, width: "100%",
                padding: "9px 14px",
                background: isActive ? "rgba(98,62,152,0.4)" : "none",
                border: "none", cursor: "pointer",
                color: isActive ? "#fff" : "#CBB6E6",
                fontWeight: isActive ? 700 : 400,
                fontSize: 13, textAlign: "left",
                borderLeft: isActive ? "3px solid #9B75C9" : "3px solid transparent",
                textDecoration: "none",
                boxSizing: "border-box",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>{label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export function TopBar({ activeLabel, onLogout }) {
  const isDark = useTheme().palette.mode === 'dark';
  const meta = pageMeta[activeLabel] || { title: activeLabel, subtitle: "" };

  return (
    <div style={{ background: isDark ? "rgba(22,6,43,0.6)" : "#F8FAFC", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", position: "sticky", top: 0, zIndex: 10, backdropFilter: 'blur(10px)', boxSizing: "border-box", width: "100%" }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: isDark ? "#fff" : "#0F172A", letterSpacing: -0.5, lineHeight: 1.2 }}>{meta.title}</h1>
        <p style={{ margin: 0, color: isDark ? "#A692C4" : "#94A3B8", fontSize: 12, marginTop: 2 }}>{meta.subtitle}</p>
      </div>
      <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '7px 14px', color: '#CBB6E6', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
        Sign out
      </button>
    </div>
  );
}