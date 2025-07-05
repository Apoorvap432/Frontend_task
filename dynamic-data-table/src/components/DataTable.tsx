'use client';

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  TablePagination,
  IconButton,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  setSort,
  setSearchQuery,
  setCurrentPage,
  setRows,
} from '@/store/slices/tableSlice';
import { useMemo, useState } from 'react';
import { toggleManageColumnsModal } from '@/store/slices/uiSlice';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

const ROWS_PER_PAGE = 10;

export default function DataTable() {
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
const [newRow, setNewRow] = useState<Record<string, any>>({});


  const {
    rows,
    sortBy,
    sortDirection,
    searchQuery,
    visibleColumns,
    currentPage,
  } = useSelector((state: RootState) => state.table);

  const [editingRows, setEditingRows] = useState<Record<string, any>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    if (deleteId) {
      dispatch(setRows(rows.filter((r) => r.id !== deleteId)));
      setDeleteId(null);
    }
  };
  

  const filteredRows = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(q)
      )
    );
  }, [rows, searchQuery]);

  const sortedRows = useMemo(() => {
    if (!sortBy) return filteredRows;

    const sorted = [...filteredRows].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return sorted;
  }, [filteredRows, sortBy, sortDirection]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return sortedRows.slice(start, start + ROWS_PER_PAGE);
  }, [sortedRows, currentPage]);

  const handleSort = (column: string) => {
    const isAsc = sortBy === column && sortDirection === 'asc';
    dispatch(setSort({ column, direction: isAsc ? 'desc' : 'asc' }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage + 1));
  };

  const handleDoubleClick = (id: string) => {
    setIsEditing(true);
    setEditingRows((prev) => ({
      ...prev,
      [id]: { ...rows.find((r) => r.id === id) },
    }));
  };

  const handleEditChange = (id: string, key: string, value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: key === 'age' ? Number(value) : value },
    }));
  };

  const handleSaveAll = () => {
    const updated = rows.map((row) =>
      editingRows[row.id] ? editingRows[row.id] : row
    );
    dispatch(setRows(updated));
    setEditingRows({});
    setIsEditing(false);
  };

  const handleCancelAll = () => {
    setEditingRows({});
    setIsEditing(false);
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
  <Typography variant="h5">Dynamic Data Table</Typography>
  <Box display="flex" gap={1}>
    <Button variant="outlined" onClick={() => setAddDialogOpen(true)}>
      ➕ Add Row
    </Button>
    <IconButton onClick={() => dispatch(toggleManageColumnsModal())}>
      <SettingsIcon />
    </IconButton>
  </Box>
</Box>


      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumns.map((col) => (
                <TableCell key={col}>
                  <TableSortLabel
                    active={sortBy === col}
                    direction={sortBy === col ? sortDirection : 'asc'}
                    onClick={() => handleSort(col)}
                    hideSortIcon={false}
                  >
                    {col.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>ACTIONS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((row) => (
              <TableRow key={row.id} onDoubleClick={() => handleDoubleClick(row.id)}>
                {visibleColumns.map((col) => (
                  <TableCell key={col}>
                    {editingRows[row.id] ? (
                      <TextField
                        value={editingRows[row.id][col] || ''}
                        onChange={(e) => handleEditChange(row.id, col, e.target.value)}
                        type={col === 'age' ? 'number' : 'text'}
                        size="small"
                      />
                    ) : (
                      row[col]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => setDeleteId(row.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {paginatedRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1}>No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredRows.length}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        rowsPerPage={ROWS_PER_PAGE}
        rowsPerPageOptions={[ROWS_PER_PAGE]}
      />

      {isEditing && (
        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button variant="contained" color="success" onClick={handleSaveAll}>
            Save All
          </Button>
          <Button variant="outlined" color="error" onClick={handleCancelAll}>
            Cancel All
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this row?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
  <DialogTitle>Add New Row</DialogTitle>
  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
    {visibleColumns.map((col) => (
      <TextField
        key={col}
        label={col.toUpperCase()}
        type={col === 'age' ? 'number' : 'text'}
        value={newRow[col] || ''}
        onChange={(e) =>
          setNewRow((prev) => ({
            ...prev,
            [col]: col === 'age' ? Number(e.target.value) : e.target.value,
          }))
        }
      />
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
    <Button
      variant="contained"
      onClick={() => {
        dispatch(setRows([...rows, { ...newRow, id: crypto.randomUUID() }]));
        setNewRow({});
        setAddDialogOpen(false);
      }}
    >
      Add
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}
