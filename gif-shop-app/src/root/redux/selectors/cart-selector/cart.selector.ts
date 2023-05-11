import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/root/redux/store';

export const selectCartItems = (state: RootState) => state.cartStore.items;

export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.price * item.quantity, 0)
);