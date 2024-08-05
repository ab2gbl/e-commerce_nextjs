"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ProductEditComp from "@/components/ProductEditComp";
import withRole from "@/utils/withRole";
function ProductEdit({ params }) {
  return (
    <Provider store={store}>
      <main>
        <ProductEditComp id={params} />
      </main>
    </Provider>
  );
}
export default withRole(ProductEdit, "ADMIN");
