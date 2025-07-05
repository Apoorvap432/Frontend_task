import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isManageColumnsModalOpen: boolean;
  themeMode: "light" | "dark";
}

const initialState: UIState = {
  isManageColumnsModalOpen: false,
  themeMode: "light",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleManageColumnsModal(state) {
      state.isManageColumnsModalOpen = !state.isManageColumnsModalOpen;
    },
    toggleTheme(state) {
      state.themeMode = state.themeMode === "light" ? "dark" : "light";
    },
  },
});

export const { toggleManageColumnsModal, toggleTheme } = uiSlice.actions;
export default uiSlice.reducer;
