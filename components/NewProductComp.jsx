"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { createProduct, removeCreated } from "@/redux/slices/productsSlice";
import { useEffect } from "react";

const NewProductComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const created = useSelector((state) => state.products.created);

  if (role !== "ADMIN") {
    router.push("/");
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const form = {
      type: formData.get("type"),
      brand: formData.get("brand"),
      name: formData.get("name"),
      image: formData.get("image"),
      price: formData.get("price"),
    };
    dispatch(createProduct(form));

    e.target.reset();
    // Clear form after submission
  };
  useEffect(() => {
    if (created) {
      toast.success("Product created successfully");
    }
    dispatch(removeCreated());
  }, [created]);

  const notify = () => toast("Here is your toast.");

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select name="type" required>
            <option value="phone" default>
              Phone
            </option>
            <option value="Accessory">Accessory</option>
          </select>
        </label>
        <br />
        <label>
          Brand:
          <input type="text" name="brand" required />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <br />
        <label>
          Image:
          <input type="file" name="image" required />
        </label>
        <br />
        <label>
          Price:
          <input type="text" name="price" required />
        </label>
        <br />
        <button type="submit">Create Product</button>
        <br />
      </form>
      <button onClick={notify}>toast</button>
      <Toaster />
    </>
  );
};

export default NewProductComp;
