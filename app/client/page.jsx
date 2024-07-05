"use client";
import ProductsHome from "@/components/ProductsHome";
import { Provider } from "react-redux";
import store from "@/redux/store";

function client() {
  return (
    <Provider store={store}>
      <main>
        <ProductsHome />
      </main>
    </Provider>
  );
}

export default client;
