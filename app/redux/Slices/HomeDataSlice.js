import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    name: "",
    role: "",
    loading: false,
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setRole: (state, action) => {
            state.role = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearUser: (state) => {
            state.user = {};
            state.name = "";
            state.role = "";
            state.loading = false;
        },
    },
});

export const {
    setUser,
    setName,
    setRole,
    setLoading,
    clearUser
} = homeSlice.actions;
export default homeSlice.reducer;