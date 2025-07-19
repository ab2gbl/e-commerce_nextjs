"use client";
import BillsComp from "@/components/BillsComp";

import { Provider } from "react-redux";
import store from "@/redux/store";
export default function Bills() {
  return (
    <Provider store={store}>
      <div>
        <BillsComp />
      </div>
    </Provider>
  );
}
