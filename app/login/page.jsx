"use client"
import LoginComp from "@/components/LoginComp"
import { Provider } from "react-redux"
import store from "@/redux/store"
import withRole from "@/utils/withRole"

function LoginPage() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LoginComp />
      </div>
    </Provider>
  )
}

export default withRole(LoginPage, "null")
