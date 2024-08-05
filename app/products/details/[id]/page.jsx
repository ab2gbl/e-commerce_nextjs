"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ProductDetails from "@/components/ProductDetails";

export default function Product({ params }) {
  return (
    <Provider store={store}>
      <main>
        <ProductDetails id={params} />
      </main>
    </Provider>
  );
}
