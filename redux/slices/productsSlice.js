import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

export const getProducts = createAsyncThunk("getProducts", async () => {
  const response = await api.get("/product/products/");
  return await response.data;
});
export const getProduct = createAsyncThunk("getProduct", async (param) => {
  console.log(param);
  const response = await api.get("/product/product/" + param.id);
  return await response.data;
});
export const createProduct = createAsyncThunk(
  "createProduct",
  async (param) => {
    const response = await api.post("/product/create/", param, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return await response.data;
  }
);

export const editProduct = createAsyncThunk("editProduct", async (param) => {
  console.log(param);
  const response = await api.put("/product/editproduct/" + param.id, param, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return await response.data;
});
export const removeProduct = createAsyncThunk(
  "removeProduct",
  async (param) => {
    const response = await api.delete("/product/editproduct/" + param);
    return await param;
  }
);
export const productsSlice = createSlice({
  name: "products",
  initialState: {
    isProductsLoading: true,
    products: [],
    erro: false,
    product: {},
    isProductLoading: true,
    created: false,
  },
  reducers: {
    removeCreated: (state) => {
      state.created = false;
    },
  },
  extraReducers: (builder) => {
    // Products
    builder.addCase(getProducts.pending, (state, action) => {
      state.isProductsLoading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.isProductsLoading = false;
      state.products = action.payload;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.error = true;
    });
    // Product
    builder.addCase(getProduct.pending, (state, action) => {
      state.isProductLoading = true;
    });
    builder.addCase(getProduct.fulfilled, (state, action) => {
      state.isProductLoading = false;
      state.product = action.payload;
    });
    builder.addCase(getProduct.rejected, (state, action) => {
      state.error = true;
    });
    builder.addCase(createProduct.pending, (state, action) => {
      state.created = false;
      state.isProductLoading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.isProductLoading = false;
      state.created = true;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.error = true;
    });

    builder.addCase(editProduct.pending, (state, action) => {
      state.isProductLoading = true;
    });
    builder.addCase(editProduct.fulfilled, (state, action) => {
      state.isProductLoading = false;
      state.product = action.payload;
    });
    builder.addCase(removeProduct.pending, (state, action) => {
      state.isProductLoading = true;
    });
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      state.isProductLoading = false;
      console.log(action.payload);
      state.products = state.products.filter(
        (product) => product.id !== action.payload // Assuming action.payload.id contains the id of the removed product
      );
    });
  },
});

export const { increment, removeCreated } = productsSlice.actions;

export default productsSlice.reducer;
