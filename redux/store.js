import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "./slices/productsSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import billsSlice from "./slices/billsSlice";
const store = configureStore({
  reducer: {
    products: productsSlice,
    cart: cartSlice,
    user: userSlice,
    bills: billsSlice,
  },
});

export default store;
