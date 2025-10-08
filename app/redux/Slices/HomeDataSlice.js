import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {},
    name: "",
    role: "",
    loading: false,
    cart: [], // Cart items array
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
        // Cart actions (Firebase persistence handled in components)
        addToCart: (state, action) => {
            const existingItem = state.cart.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push(action.payload);
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        },
        updateCartItem: (state, action) => {
            const { id, updates } = action.payload;
            const itemIndex = state.cart.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                state.cart[itemIndex] = { ...state.cart[itemIndex], ...updates };
            }
        },
        clearCart: (state) => {
            state.cart = [];
        },
        // Load cart from Firebase on app initialization
        initializeCart: (state, action) => {
            state.cart = action.payload;
        },
    },
});

export const {
    setUser,
    setName,
    setRole,
    setLoading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    initializeCart
} = homeSlice.actions;
export default homeSlice.reducer;