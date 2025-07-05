import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Row {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

interface TableState {
  rows: Row[];
  columns: string[];
  visibleColumns: string[];
  searchQuery: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  currentPage: number;
}

const initialState: TableState = {
  rows: [],
  columns: ["name", "email", "age", "role"],
  visibleColumns: ["name", "email", "age", "role"],
  searchQuery: "",
  sortBy: "",
  sortDirection: "asc",
  currentPage: 1,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<Row[]>) {
      state.rows = action.payload;
    },
    addColumn(state, action: PayloadAction<string>) {
      if (!state.columns.includes(action.payload)) {
        state.columns.push(action.payload);
        state.visibleColumns.push(action.payload);
      }
    },
    toggleColumnVisibility(state, action: PayloadAction<string>) {
      const column = action.payload;
      if (state.visibleColumns.includes(column)) {
        state.visibleColumns = state.visibleColumns.filter((col) => col !== column);
      } else {
        state.visibleColumns.push(column);
      }
    },
    deleteColumn(state, action: PayloadAction<string>) {
      const col = action.payload;
      state.columns = state.columns.filter(c => c !== col);
      state.visibleColumns = state.visibleColumns.filter(c => c !== col);
      state.rows = state.rows.map(row => {
        const newRow = { ...row };
        delete newRow[col];
        return newRow;
      });
    },
    setSort(state, action: PayloadAction<{ column: string; direction: "asc" | "desc" }>) {
      state.sortBy = action.payload.column;
      state.sortDirection = action.payload.direction;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setRows,
  addColumn,
  toggleColumnVisibility,
  deleteColumn,
  setSort,
  setSearchQuery,
  setCurrentPage,
} = tableSlice.actions;

export default tableSlice.reducer;
