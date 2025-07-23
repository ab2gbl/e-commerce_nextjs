"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import NewBillComp from "@/components/NewBillComp"
import withRole from "@/utils/withRole"

function NewBillPage() {
  return (
    <Provider store={store}>
      <NewBillComp />
    </Provider>
  )
}

export default withRole(NewBillPage, "ADMIN")
