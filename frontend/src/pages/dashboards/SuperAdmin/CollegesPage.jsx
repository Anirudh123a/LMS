import { useState, useEffect } from "react";
import axios from "axios";
import { StatCard, SectionCard, SearchBar, Table, TD, statusBadge } from "./SharedUI";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";

function CreateCollegeModal({ onClose, onCreated }) {
  const isDark = useTheme().palette.mode === "dark";
  const [form, setForm] = useState({ collegeName: "", collegeCode: "", email: "", phone: "", address: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.collegeName || !form.collegeCode || !form.email || !form.password) {
      toast.error("College name, code, email and password are required.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/superadmin/create-college`, form);
      toast.success("College created successfully!");
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create college.");
    } finally {
      setLoading(false);
    }
  };

  const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" };
  const box = { background: isDark ? "#1E0A3C" : "#fff", borderRadius: 14, padding: 28, width: "100%", maxWidth: 480, border: "1px solid rgba(155,117,201,0.3)" };
  const input = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(155,117,201,0.4)", background: isDark ? "rgba(255,255,255,0.06)" : "#F8F4FF", color: isDark ? "#fff" : "#1a1a1a", fontSize: 13, outline: "none", boxSizing: "border-box", marginTop: 4 };
  const label = { fontSize: 12, fontWeight: 600, color: isDark ? "#CBB6E6" : "#623E98" };

  return (
    <div style={overlay}>
      <div style={box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, color: isDark ? "#fff" : "#1a1a1a", fontSize: 17, fontWeight: 800 }}>🏫 Create College</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#9B75C9", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "College Name *", name: "collegeName", placeholder: "e.g. MIT College" },
            { label: "College Code *", name: "collegeCode", placeholder: "e.g. MIT001" },
            { label: "Email *", name: "email", placeholder: "college@email.com" },
            { label: "Phone", name: "phone", placeholder: "10-digit number" },
            { label: "Password *", name: "password", placeholder: "Login password", type: "password" },
            { label: "Address", name: "address", placeholder: "City, State" },
          ].map(f => (
            <div key={f.name} style={f.name === "collegeName" || f.name === "address" ? { gridColumn: "1 / -1" } : {}}>
              <label style={label}>{f.label}</label>
              <input name={f.name} type={f.type || "text"} placeholder={f.placeholder} value={form[f.name]} onChange={handle} style={input} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid rgba(155,117,201,0.4)", background: "none", color: "#9B75C9", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={submit} disabled={loading} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "linear-gradient(90deg,#623E98,#9B75C9)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
            {loading ? "Creating..." : "Create College"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/superadmin/colleges`);
      setColleges(res.data.colleges || []);
    } catch {
      toast.error("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchColleges(); }, []);

  const filtered = colleges.filter(c =>
    c.college_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.college_code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 18 }}>
        <StatCard icon="🏫" label="Total Colleges" value={colleges.length} change="registered" color="#623E98" />
        <StatCard icon="✅" label="Active Colleges" value={colleges.filter(c => c.status === "ACTIVE" || !c.status).length} change="active" color="#10B981" />
      </div>

      <SectionCard title="All Colleges">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or code..." />
          <button
            onClick={() => setShowModal(true)}
            style={{ background: "linear-gradient(90deg,#623E98,#9B75C9)", color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}
          >
            + Add College
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#9B75C9", textAlign: "center", padding: 20 }}>Loading colleges...</p>
        ) : (
          <Table
            cols={["#", "College Name", "Code", "Email", "Phone", "Created"]}
            rows={filtered.length === 0
              ? [<tr key="empty"><td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#94A3B8" }}>No colleges found</td></tr>]
              : filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <TD>{i + 1}</TD>
                  <TD bold>{c.college_name}</TD>
                  <TD color="#9B75C9">{c.college_code}</TD>
                  <TD>{c.company_email || c.email || "—"}</TD>
                  <TD>{c.phone || "—"}</TD>
                  <TD>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</TD>
                </tr>
              ))
            }
          />
        )}
      </SectionCard>

      {showModal && <CreateCollegeModal onClose={() => setShowModal(false)} onCreated={fetchColleges} />}
    </>
  );
}