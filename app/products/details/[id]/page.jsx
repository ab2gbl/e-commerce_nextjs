"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import ProductDetails from "@/components/ProductDetails"
import withRole from "@/utils/withRole"

function ProductDetailsPage({ params }) {
  return (
    <Provider store={store}>
      <ProductDetails id={params} />
    </Provider>
  )
}

export default withRole(ProductDetailsPage, ["ADMIN", "CLIENT"])
