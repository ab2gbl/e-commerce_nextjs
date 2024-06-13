import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
  },
  reducers: {
    addProduct: (state, action) => {

      const productId = action.payload.product.id;
      state.products = state.products.filter(item => item.product.id !== productId);
      state.products.push(action.payload);
    },
    updateCount: (state, action) => {
      const { productId, newQuantity } = action.payload;
      const productIndex = state.products.findIndex(item => item.product.id === productId);
      console.log(productIndex)
      if (productIndex !== -1 && newQuantity>0) {
        state.products[productIndex].count = newQuantity;
      }
    },
    removeProduct: (state, action) => {
        const productId = action.payload;
        state.products = state.products.filter(item => item.product.id !== productId);
    },
    removeAll: (state) => {
      state.products = [];
    },
  },
});

export const { addProduct, updateCount, removeProduct , removeAll} = cartSlice.actions;

export default cartSlice.reducer;
