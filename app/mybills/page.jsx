"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { MyPurchasesComp } from "@/components/BillsComp";
import withRole from "@/utils/withRole";

function MyBillsPage() {
  return (
    <Provider store={store}>
      <MyPurchasesComp />
    </Provider>
  );
}

export default withRole(MyBillsPage, ["CLIENT", "ADMIN"]);
