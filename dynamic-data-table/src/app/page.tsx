'use client';
import React, { useEffect } from 'react';
import DataTable from '@/components/DataTable';
import ManageColumnsModal from '@/components/ManageColumnsModal';
import { useDispatch } from 'react-redux';
import { setRows } from '@/store/slices/tableSlice';
import { v4 as uuidv4 } from 'uuid';
import CSVImport from '@/components/CSVImport';
import CSVExport from '@/components/CSVExport';
import { Box, Typography, FormControlLabel, Switch } from '@mui/material';
import { useThemeContext } from '@/theme/ThemeContext';

export default function HomePage() {
  const dispatch = useDispatch();
  const { mode, toggleMode } = useThemeContext();

  useEffect(() => {
    const sampleData = [
      { id: uuidv4(), name: 'Alice', email: 'alice@example.com', age: 28, role: 'Admin' },
      { id: uuidv4(), name: 'Bob', email: 'bob@example.com', age: 34, role: 'Editor' },
      { id: uuidv4(), name: 'Charlie', email: 'charlie@example.com', age: 22, role: 'Viewer' },
      { id: uuidv4(), name: 'David', email: 'david@example.com', age: 30, role: 'Editor' },
      { id: uuidv4(), name: 'Eva', email: 'eva@example.com', age: 26, role: 'Admin' },
      { id: uuidv4(), name: 'Frank', email: 'frank@example.com', age: 35, role: 'Viewer' },
      { id: uuidv4(), name: 'Grace', email: 'grace@example.com', age: 29, role: 'Editor' },
      { id: uuidv4(), name: 'Hannah', email: 'hannah@example.com', age: 24, role: 'Admin' },
      { id: uuidv4(), name: 'Ian', email: 'ian@example.com', age: 32, role: 'Viewer' },
      { id: uuidv4(), name: 'Jack', email: 'jack@example.com', age: 27, role: 'Editor' },
      { id: uuidv4(), name: 'Kate', email: 'kate@example.com', age: 31, role: 'Viewer' },
    ];
    dispatch(setRows(sampleData));
  }, [dispatch]);

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={2} ml={2}>
        <Typography variant="h5">Data Table</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <CSVImport />
          <CSVExport />
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleMode} />}
            label={mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          />
        </Box>
      </Box>

      <DataTable />
      <ManageColumnsModal />
    </>
  );
}
