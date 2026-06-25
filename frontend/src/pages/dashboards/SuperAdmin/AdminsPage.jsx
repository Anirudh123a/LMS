import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { StatCard, SectionCard, SearchBar, Table, TD, statusBadge } from "./SharedUI";

export default function AdminsPage() {
  const { admins, setAdmins, openModalWithRole } = useOutletContext();
  const [search, setSearch] = useState("");

  const filtered = admins.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 18 }}>
        <StatCard icon="👤" label="Total Admins" value={admins.length} change="registered" color="#3B6CF4" />
      </div>
      <SectionCard title="All Platform Admins">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search admin node..." />
          <button onClick={() => openModalWithRole("Restricted Super Admin")} style={{ background: "purple", color: "#fff", border: "none", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>+ Add Admin</button>
        </div>
        <Table
          cols={["#", "Name", "Email", "Organization", "Role", "Status"]}
          rows={filtered.map(a => (
            <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <TD>{a.id}</TD>
              <TD bold>{a.name}</TD>
              <TD>{a.email}</TD>
              <TD>{a.org}</TD>
              <TD color="#9B75C9">{a.role}</TD>
              <td>{statusBadge(a.status)}</td>
            </tr>
          ))}
        />
      </SectionCard>
    </>
  );
}