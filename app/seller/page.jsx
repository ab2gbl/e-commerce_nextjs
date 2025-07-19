"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import ProductsHome from "@/components/ProductsHome";
import withRole from "@/utils/withRole";
import ButtonNewProduct from "@/components/ButtonNewProduct";
import Link from "next/link";

function seller() {
  return (
    <Provider store={store}>
      <main>
        <ProductsHome />
        <ButtonNewProduct url="/seller/newproduct" />
        <Link href={"/seller/newbill"}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            New bill
          </button>
        </Link>
      </main>
    </Provider>
  );
}

export default withRole(seller, "ADMIN");
