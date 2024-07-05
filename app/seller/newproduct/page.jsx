"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import NewProductComp from "@/components/NewProductComp";
import withRole from "@/utils/withRole";
function newProduct() {
  return (
    <Provider store={store}>
      <main>
        <NewProductComp />
      </main>
    </Provider>
  );
}
export default withRole(newProduct, "ADMIN");
