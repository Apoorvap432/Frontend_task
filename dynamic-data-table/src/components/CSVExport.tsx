'use client';

import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export default function CSVExport() {
  const { rows, visibleColumns } = useSelector((state: RootState) => state.table);

  const handleExport = () => {
    const filteredData = rows.map((row) =>
      visibleColumns.reduce((acc, col) => {
        acc[col] = row[col];
        return acc;
      }, {} as Record<string, string | number>)
    );

    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'table_export.csv');
  };

  return (
    <Button variant="outlined" onClick={handleExport}>
      Export CSV
    </Button>
  );
}
