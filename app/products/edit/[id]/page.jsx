"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import ProductEditComp from "@/components/ProductEditComp"
import withRole from "@/utils/withRole"

function ProductEditPage({ params }) {
  return (
    <Provider store={store}>
      <ProductEditComp id={params} />
    </Provider>
  )
}

export default withRole(ProductEditPage, "ADMIN")
