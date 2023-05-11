import { CartItem } from '@/root/types/CartItem.type';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
  
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/root/redux/store';

interface CartState {
  items: CartItem[];
}

export const initialState: CartState = {
  items: [],
};

type CartAction = {
  type: string
  cart?: CartState
}
export type DispatchType = (args: CartAction) => CartAction

export const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;

      const existingItem = state.items.find((i) => i.gif.id === item.gif.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.gif.id !== action.payload);
    } 
  },
   
});

export const { addItem, removeItem } = cartSlice.actions;
 
export const cartReducer = cartSlice.reducer;
