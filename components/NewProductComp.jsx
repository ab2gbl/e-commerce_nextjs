"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const NewProductComp = () => {
  const router = useRouter();
  const role = useSelector((state) => state.user.role);

  if (role != "ADMIN") {
    if (role == "CLIENT") {
      router.push("/");
    }
  }

  const [name, setName] = useState("");
  const [picture, setPicture] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePictureChange = (e) => {
    setPicture(e.target.files[0]);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary validation or data processing here
    // For example, you can send the data to an API or update a state in a parent component

    // Reset the form fields
    setName("");
    setPicture("");
    setBrand("");
    setPrice("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      <br />
      <label>
        Picture:
        <input type="file" value={picture} onChange={handlePictureChange} />
      </label>
      <br />
      <label>
        Brand:
        <input type="text" value={brand} onChange={handleBrandChange} />
      </label>
      <br />
      <label>
        Price:
        <input type="text" value={price} onChange={handlePriceChange} />
      </label>
      <br />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default NewProductComp;
