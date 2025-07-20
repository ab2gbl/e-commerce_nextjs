"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getProducts } from "@/redux/slices/productsSlice";
import { createBill, removeCreated } from "@/redux/slices/billsSlice";
import { useEffect } from "react";

const NewBillComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const created = useSelector((state) => state.bills.created);
  const products = useSelector((state) => state.products.products);
  const [billProducts, setBillProducts] = React.useState([]);
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  useEffect(() => {
    if (products.length === 0) {
      console.log("Fetching products...");
      dispatch(getProducts());
    } else {
      dispatch(getProducts());
      console.log("Products already loaded:", products);
    }
  }, [products.length, dispatch,products]);

  const resetForm = () => {
    setBillProducts([]);
    setHasSubmitted(false);
    // Reset the form fields
    const form = document.querySelector('form');
    if (form) {
      form.reset();
    }
  };

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
    setHasSubmitted(true);
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

  const deleteProduct = (index) => {
    setBillProducts(billProducts.filter((_, i) => i !== index));
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
    if (created && hasSubmitted) {
      toast((t) => (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zm0-4h6v-2H4v2zm0-4h6v-2H4v2zm0-4h6V7H4v2zm0-4h6V3H4v2z" />
            </svg>
            <span className="font-semibold">Bill created successfully!</span>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => {
                toast.dismiss(t.id);
                router.push("/seller/bills");
              }}
            >
              Go to Bills
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => {
                toast.dismiss(t.id);
                resetForm();
                // Reset the created state to prevent showing notification again
                dispatch(removeCreated());
                router.push("/seller/newbill");
              }}
            >
              New Bill
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => toast.dismiss(t.id)}
            >
              Stay
            </button>
          </div>
        </div>
      ), { 
        duration: 6000,
        style: {
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          minWidth: '280px'
        }
      });
      // Reset the created state after showing notification
      dispatch(removeCreated());
    }
  }, [created, router, hasSubmitted, dispatch]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 py-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create New Bill</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bill Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select name="type" required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                type="date" 
                name="date" 
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
              <input 
                type="number" 
                name="price" 
                required 
                placeholder="0.00"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Products</h3>
              <button 
                type="button" 
                onClick={addProduct}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Product
              </button>
            </div>

            {billProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>Don&apos;t forget to check &quot;New Bill&quot;</p>
              </div>
            ) : (
              <div className="space-y-4">
        {billProducts.map((product, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                name="product"
                required
                value={product.product || ""}
                onChange={(e) => handleProductChange(index, e)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                          <option value="">Select a product</option>
                          {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.brand} {prod.name}
                    </option>
                          ))}
              </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={product.quantity}
                required
                          min="1"
                onChange={(e) => handleQuantityChange(index, e)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => deleteProduct(index)}
                          className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200 flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Create Bill
        </button>
          </div>
        </form>

      <Toaster />
      </div>
    </div>
  );
};

export default NewBillComp;
