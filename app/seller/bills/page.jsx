"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import { BillsComp } from "@/components/BillsComp"
import withRole from "@/utils/withRole"

function BillsPage() {
  return (
    <Provider store={store}>
      <BillsComp />
    </Provider>
  )
}

export default withRole(BillsPage, "ADMIN")
