import { createSlice } from "@reduxjs/toolkit";

/**
 * Notes:
 * - use null for unknown values (so checks like `if (!role)` behave consistently)
 * - role values are normalized to exactly: "Seller", "Customer", or "pending"
 * - setUser will also set role if the user object contains one (keeps Redux in sync)
 */

const normalizeRole = (r) => {
  if (!r && r !== "") return null;
  const s = String(r).trim().toLowerCase();
  if (s === "seller") return "Seller";
  if (s === "customer") return "Customer";
  if (s === "pending") return "pending";
  // fallback: return original trimmed with capitalized first letter
  if (s.length === 0) return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const initialState = {
  user: null,           // full user object or null
  name: "",             // optional display name state
  role: null,           // app role used for routing ("Seller"|"Customer"|"pending"|null)
  selectedRole: null,   // role selected in the role-selection screen ("Seller"|"Customer"|null)
  loading: false,
  cart: [],             // cart items
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setUser: (state, action) => {
      // store full user object
      state.user = action.payload || null;

      // if user object contains a role/status, sync to state.role immediately
      if (action.payload && (action.payload.role || action.payload.status)) {
        // compute normalized role: seller with pending status => "pending"
        const incomingRole = action.payload.role;
        const incomingStatus = action.payload.status;
        let computedRole = normalizeRole(incomingRole);

        if (incomingRole && incomingRole.toString().toLowerCase() === 'seller') {
          // if seller and status is pending -> set 'pending', otherwise 'Seller'
          if (incomingStatus && incomingStatus.toString().toLowerCase() === 'pending') {
            computedRole = 'pending';
          } else {
            computedRole = 'Seller';
          }
        }

        state.role = computedRole;
      }
    },

    setName: (state, action) => {
      state.name = action.payload;
    },

    setRole: (state, action) => {
      // normalize and store
      const normalized = normalizeRole(action.payload);
      state.role = normalized;
    },

    setSelectedRole: (state, action) => {
      // normalize and store selectedRole (used on Home role pick screen)
      const normalized = normalizeRole(action.payload);
      state.selectedRole = normalized;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Cart actions
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + (action.payload.quantity || 1);
      } else {
        state.cart.push({ ...action.payload, quantity: action.payload.quantity || 1 });
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

    initializeCart: (state, action) => {
      state.cart = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

// optional debug helper: enable in your store file to log changes
export const enableHomeDebugLogger = (store) => {
  let prev = store.getState().home;
  store.subscribe(() => {
    const next = store.getState().home;
    if (prev.role !== next.role || prev.user !== next.user) {
      console.log('[HOME SLICE DEBUG] role changed:', { prevRole: prev.role, nextRole: next.role });
      console.log('[HOME SLICE DEBUG] user changed:', { prevUser: prev.user?.uid, nextUser: next.user?.uid });
    }
    prev = next;
  });
};

export const {
  setUser,
  setName,
  setRole,
  setSelectedRole,
  setLoading,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  initializeCart
} = homeSlice.actions;

export default homeSlice.reducer;
