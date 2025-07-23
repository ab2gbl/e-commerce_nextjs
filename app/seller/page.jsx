"use client"
import { Provider } from "react-redux"
import store from "@/redux/store"
import AdminDashboard from "@/components/AdminDashboard"
import withRole from "@/utils/withRole"

function SellerPage() {
  return (
    <Provider store={store}>
      <AdminDashboard />
    </Provider>
  )
}

export default withRole(SellerPage, "ADMIN")
