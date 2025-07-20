"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { createProduct, removeCreated } from "@/redux/slices/productsSlice";
import { useEffect, useState } from "react";

const NewProductComp = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const role = useSelector((state) => state.user.role);
  const created = useSelector((state) => state.products.created);
  const [type, setType] = useState("phone");
  const [phoneFields, setPhoneFields] = useState({
    dimensions: "",
    weight: "",
    cpu: "",
    memory: "",
    ram: "",
    battery: "",
    camera: "",
    os: "",
    other_details: "",
  });
  const [accessoryFields, setAccessoryFields] = useState({
    dimensions: "",
    weight: "",
    other_details: "",
  });

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
      ...phoneFields,
      ...accessoryFields,
    };
    console.log(form)
    dispatch(createProduct(form));
    setPhoneFields({ dimensions: "", weight: "", cpu: "", memory: "", ram: "", battery: "", camera: "", os: "", other_details: "" });
    setAccessoryFields({ dimensions: "", weight: "", other_details: "" });
    e.target.reset();
  };
  useEffect(() => {
    if (created) {
      toast((t) => (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="font-semibold">Product created successfully!</span>
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => {
                toast.dismiss(t.id);
                router.push("/");
              }}
            >
              Go to Home
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition duration-200"
              onClick={() => {
                toast.dismiss(t.id);
                router.push("/seller/newproduct");
              }}
            >
              New Product
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
    }
    dispatch(removeCreated());
  }, [created, router, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Product</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select name="type" required className="w-full px-4 py-2 border border-gray-300 rounded-md" value={type} onChange={e => setType(e.target.value)}>
              <option value="phone">Phone</option>
            <option value="accessory">Accessory</option>
          </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input type="text" name="brand" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input type="file" name="image" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input type="text" name="price" required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          {/* Phone Fields */}
          {type === "phone" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Dimensions" value={phoneFields.dimensions} onChange={e => setPhoneFields(f => ({ ...f, dimensions: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Weight" value={phoneFields.weight} onChange={e => setPhoneFields(f => ({ ...f, weight: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="CPU" value={phoneFields.cpu} onChange={e => setPhoneFields(f => ({ ...f, cpu: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Memory" value={phoneFields.memory} onChange={e => setPhoneFields(f => ({ ...f, memory: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="RAM" value={phoneFields.ram} onChange={e => setPhoneFields(f => ({ ...f, ram: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Battery" value={phoneFields.battery} onChange={e => setPhoneFields(f => ({ ...f, battery: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Camera" value={phoneFields.camera} onChange={e => setPhoneFields(f => ({ ...f, camera: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="OS" value={phoneFields.os} onChange={e => setPhoneFields(f => ({ ...f, os: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Other Details" value={phoneFields.other_details} onChange={e => setPhoneFields(f => ({ ...f, other_details: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md md:col-span-2" />
            </div>
          )}
          {/* Accessory Fields */}
          {type === "accessory" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Dimensions" value={accessoryFields.dimensions} onChange={e => setAccessoryFields(f => ({ ...f, dimensions: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Weight" value={accessoryFields.weight} onChange={e => setAccessoryFields(f => ({ ...f, weight: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md" />
              <input type="text" placeholder="Other Details" value={accessoryFields.other_details} onChange={e => setAccessoryFields(f => ({ ...f, other_details: e.target.value }))} className="px-2 py-1 border border-gray-300 rounded-md md:col-span-2" />
            </div>
          )}
          {<Toaster />}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200">Create Product</button>
      </form>
      </div>
    </div>
  );
};

export default NewProductComp;
