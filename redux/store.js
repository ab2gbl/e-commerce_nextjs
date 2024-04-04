import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "./slices/productsSlice";
import cartSlice from "./slices/cartSlice";

const store= configureStore({
    reducer: {
        products: productsSlice,
        cart: cartSlice,

    },
 })

export default store