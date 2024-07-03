"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import ProductsHome from "@/components/ProductsHome";

function seller() {
  return (
    <Provider store={store}>
      <main>
        <ProductsHome />
      </main>
    </Provider>
  );
}

export default seller;
