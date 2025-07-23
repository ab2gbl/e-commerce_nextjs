"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import Cart from "@/components/Cart"
import withRole from "@/utils/withRole"

function CartPage() {
  return (
    <Provider store={store}>
      <Cart />
    </Provider>
  )
}

export default withRole(CartPage, ["ADMIN", "CLIENT"])
