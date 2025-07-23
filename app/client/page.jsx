"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ProductsHome from "@/components/ProductsHome";
import withRole from "@/utils/withRole";

function ClientPage() {
  return (
    <Provider store={store}>
      <ProductsHome />
    </Provider>
  );
}

// Allow both CLIENT and ADMIN to access this page
export default withRole(ClientPage, ["CLIENT", "ADMIN"]);
