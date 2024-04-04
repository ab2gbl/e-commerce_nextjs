import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
  },
  reducers: {
    addProduct: (state, action) => {
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
  },
});

export const { addProduct, updateCount, removeProduct} = cartSlice.actions;

export default cartSlice.reducer;
