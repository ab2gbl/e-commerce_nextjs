"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import NewProductComp from "@/components/NewProductComp"
import withRole from "@/utils/withRole"

function NewProductPage() {
  return (
    <Provider store={store}>
      <NewProductComp />
    </Provider>
  )
}

export default withRole(NewProductPage, "ADMIN")
