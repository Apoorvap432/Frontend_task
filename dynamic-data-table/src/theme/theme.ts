// src/theme/theme.ts
import { createTheme } from '@mui/material';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
    },
    shape: {
      borderRadius: 10,
    },
  });
