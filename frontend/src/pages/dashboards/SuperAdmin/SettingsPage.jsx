
// ════════════════════════════════════════════════════════════════
//  SETTINGS PAGE
// ════════════════════════════════════════════════════════════════
import { useTheme } from '@mui/material/styles';
import { Typography, Button } from '@mui/material';
import { SectionCard } from "./SharedUI";
export default function SettingsPage({ onAddAdmin }) {
  const isDark = useTheme().palette.mode === 'dark';

  return (
    <SectionCard title="Platform Settings" style={{ marginBottom:20 }}>
      <Typography variant="body2" sx={{ color: isDark ? '#A692C4' : '#64748B', mb: 2 }}>
        Manage platform-wide configuration, integrations, and admin provisioning.
      </Typography>
      <Button
        onClick={onAddAdmin}
        variant="contained"
        sx={{ background:"linear-gradient(90deg,#623E98,#9B75C9)" }}
      >
        + Add Admin
      </Button>
    </SectionCard>
  );
}
