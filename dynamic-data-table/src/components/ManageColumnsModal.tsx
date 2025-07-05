'use client';

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  addColumn,
  toggleColumnVisibility,
  deleteColumn,
} from '@/store/slices/tableSlice';
import { toggleManageColumnsModal } from '@/store/slices/uiSlice';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ManageColumnsModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.isManageColumnsModalOpen);
  const { columns, visibleColumns } = useSelector((state: RootState) => state.table);

  const [newColumn, setNewColumn] = useState('');

  const handleClose = () => {
    dispatch(toggleManageColumnsModal());
    setNewColumn('');
  };

  const handleToggle = (col: string) => {
    dispatch(toggleColumnVisibility(col));
  };

  const handleAddColumn = () => {
    const trimmed = newColumn.trim().toLowerCase().replace(/\s+/g, '_');
    if (trimmed && !columns.includes(trimmed)) {
      dispatch(addColumn(trimmed));
      setNewColumn('');
    }
  };

  const handleDeleteColumn = (col: string) => {
    dispatch(deleteColumn(col));
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Show/Hide Columns:
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {columns.map((col) => (
            <Box key={col} display="flex" alignItems="center" justifyContent="space-between">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleColumns.includes(col)}
                    onChange={() => handleToggle(col)}
                  />
                }
                label={col.toUpperCase()}
              />
              <IconButton size="small" onClick={() => handleDeleteColumn(col)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Add New Column:
          </Typography>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              placeholder="e.g. Department"
              value={newColumn}
              onChange={(e) => setNewColumn(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddColumn}>
              Add
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
