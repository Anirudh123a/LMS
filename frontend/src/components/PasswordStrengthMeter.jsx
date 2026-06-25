import { Box, LinearProgress, Typography } from '@mui/material';

export default function PasswordStrengthMeter({ password = '' }) {
    const getStrength = (pwd) => {
        let score = 0;
        if (pwd.length >= 8) score += 25;
        if (/[A-Z]/.test(pwd)) score += 25;
        if (/[a-z]/.test(pwd)) score += 25;
        if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) score += 25;
        return score;
    };

    const strength = getStrength(password);
    const getColor = (s) => s <= 25 ? 'error' : s <= 75 ? 'warning' : 'success';

    return (
        <Box sx={{ mt: 1, mb: 1 }}>
            <LinearProgress variant="determinate" value={strength} color={getColor(strength)} sx={{ height: 6, borderRadius: 3 }} />
            <Typography variant="caption" color="text.secondary">Complexity Integrity Metric Evaluation Index Score: {strength}%</Typography>
        </Box>
    );
}