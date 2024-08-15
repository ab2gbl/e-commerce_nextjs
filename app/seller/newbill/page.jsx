"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import NewBillComp from "@/components/NewBillComp";
import withRole from "@/utils/withRole";
function newBill() {
  return (
    <Provider store={store}>
      <main>
        <NewBillComp />
      </main>
    </Provider>
  );
}
export default withRole(newBill, "ADMIN");
