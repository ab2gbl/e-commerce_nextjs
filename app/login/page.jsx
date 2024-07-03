"use client";
import LoginComp from "@/components/LoginComp";
import { Provider } from "react-redux";
import store from "@/redux/store";

export default function login() {
  return (
    <Provider store={store}>
      <LoginComp />
    </Provider>
  );
}
