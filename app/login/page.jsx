"use client";
import LoginComp from "@/components/LoginComp";
import { Provider } from "react-redux";
import store from "@/redux/store";
import withRole from "@/utils/withRole";

function login() {
  return (
    <Provider store={store}>
      <LoginComp />
    </Provider>
  );
}
export default withRole(login, "null");
