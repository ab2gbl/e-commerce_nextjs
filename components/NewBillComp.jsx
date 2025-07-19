"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getProducts } from "@/redux/slices/productsSlice";
import { createBill } from "@/redux/slices/billsSlice";
import { useEffect } from "react";

const NewBillComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const created = useSelector((state) => state.bills.created);
  const products = useSelector((state) => state.products.products);
  const [billProducts, setBillProducts] = React.useState([]);
  useEffect(() => {
    if (products.length === 0) {
      console.log("Fetching products...");
      dispatch(getProducts());
    } else {
      dispatch(getProducts());
      console.log("Products already loaded:", products);
    }
  }, [products.length, dispatch]);
  /*
  {
        "id": 2,
        "type": "buy",
        "date": "2024-06-09",
        "price": "1000.00",
        "products_details": [
            {
                "product": {
                    "id": 18,
                    "brand": "Apple",
                    "name": "Iphone 14"
                },
                "quantity": 1
            }
        ]
    },
  */
  if (role !== "ADMIN") {
    router.push("/");
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Deduplicate products based on product ID
    let valid = true;
    const prods = billProducts.reduce((uniqueProds, currentProduct) => {
      const existingProduct = uniqueProds.find(
        (prod) => prod.product === currentProduct.product
      );
      if (currentProduct.quantity < 0) {
        alert("Quantity must be positive");
        valid = false;
        return uniqueProds;
      } else if (currentProduct.quantity > 0) {
        if (existingProduct) {
          // If the product already exists, update the quantity
          existingProduct.quantity += parseInt(currentProduct.quantity, 10);
        } else {
          // If the product doesn't exist, add it to uniqueProds
          uniqueProds.push({
            ...currentProduct,
            quantity: parseInt(currentProduct.quantity, 10),
          });
        }
      }

      return uniqueProds;
    }, []);
    if (prods.length === 0) {
      alert("You must add at least one product");
      valid = false;
    }

    // Now `prods` contains only unique products
    const form = {
      type: formData.get("type"),
      date: formData.get("date"),
      price: formData.get("price"),
      products: prods,
    };
    if (valid) {
      dispatch(createBill(form));
    }

    //e.target.reset();
    // Clear form after submission
  };

  const notify = () => toast("Here is your toast.");

  const addProduct = () => {
    const product = {
      index: billProducts.length + 1,

      product: products[0].id,
      quantity: 0,
    };
    setBillProducts([...billProducts, product]);
    console.log(billProducts);
  };

  const handleProductChange = (index, event) => {
    const updatedProducts = [...billProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      product: event.target.value,
    };
    setBillProducts(updatedProducts);
  };

  const handleQuantityChange = (index, event) => {
    const updatedProducts = [...billProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      quantity: event.target.value,
    };
    setBillProducts(updatedProducts);
  };

  useEffect(() => {
    if (created) {
      toast.success("bill created successfully");
    }
  }, [created]);
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select name="type" required>
            <option value="buy" default>
              Buy
            </option>
            <option value="sell">Sell</option>
          </select>
        </label>
        <br />
        <label>
          date:
          <input type="date" name="date" required />
        </label>
        <br />
        <label>
          Price:
          <input type="text" name="price" required />
        </label>
        <br />
        {billProducts.map((product, index) => (
          <div key={index}>
            <label>
              Product:
              <select
                name="product"
                required
                value={product.product || ""}
                onChange={(e) => handleProductChange(index, e)}
              >
                {products.map(
                  (prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.brand} {prod.name}
                    </option>
                  ) // Return null if the product is already in billProducts
                )}
              </select>
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                required
                onChange={(e) => handleQuantityChange(index, e)}
              />
            </label>
          </div>
        ))}

        <br />
        <button type="button" onClick={addProduct}>
          Add product
        </button>
        <br />

        <br />
        <button type="submit">Add Bill</button>
        <br />
      </form>
      <button onClick={notify}>toast</button>
      <Toaster />
    </>
  );
};

export default NewBillComp;
