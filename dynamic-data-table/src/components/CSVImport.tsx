'use client';

import { Button, Typography, Box } from '@mui/material';
import Papa from 'papaparse';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addColumn, setRows } from '@/store/slices/tableSlice';
import { RootState } from '@/store';
import { v4 as uuidv4 } from 'uuid';

export default function CSVImport() {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { columns, rows } = useSelector((state: RootState) => state.table);
  const [error, setError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data as Record<string, string>[];

        if (parsed.length === 0) {
          setError('CSV file is empty or invalid.');
          return;
        }

        const newHeaders = Object.keys(parsed[0]);

        // Add any new columns to the table state
        newHeaders.forEach((header) => {
          if (!columns.includes(header)) {
            dispatch(addColumn(header));
          }
        });

        // Map parsed data to match table structure
        const newRows = parsed.map((row) => {
          const formatted: Record<string, any> = {
            id: uuidv4(),
          };
          newHeaders.forEach((key) => {
            const value = row[key];
            formatted[key] = key === 'age' ? Number(value) : value;
          });
          return formatted;
        });

        dispatch(setRows([...newRows, ...rows]));
        setError('');
      },
      error: (err) => {
        setError(`Parsing failed: ${err.message}`);
      },
    });

    // Reset file input
    e.target.value = '';
  };

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        hidden
        onChange={handleFileUpload}
      />
      <Button variant="outlined" onClick={() => inputRef.current?.click()}>
        Import CSV
      </Button>
      {error && (
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      )}
    </Box>
  );
}
