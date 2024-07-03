"use client";
import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import NewProductComp from "@/components/NewProductComp";
export default function newProduct() {
  return (
    <Provider store={store}>
      <main>
        <NewProductComp />
      </main>
    </Provider>
  );
}
