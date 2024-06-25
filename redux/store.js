import { configureStore } from "@reduxjs/toolkit";
import productsSlice from "./slices/productsSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice"

const store= configureStore({
    reducer: {
        products: productsSlice,
        cart: cartSlice,
        user: userSlice,

    },
 })

export default store