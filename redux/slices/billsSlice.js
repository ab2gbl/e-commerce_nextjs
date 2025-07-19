import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";

export const getBills = createAsyncThunk("getBills", async () => {
  const response = await api.get("/product/bills/");
  return await response.data;
});

export const createBill = createAsyncThunk("createBill", async (param) => {
  const response = await api.post("/product/createbills/", param);
  return await response.data;
});

export const billsSlice = createSlice({
  name: "bills",
  initialState: {
    isProductsLoading: true,
    bills: [],
    error: false,
    bill: {},
    created: false,
    test: false,
  },
  reducers: {
    test: (state) => {
      state.test = true;
    },
  },
  extraReducers: (builder) => {
    // Get Bills
    builder.addCase(getBills.pending, (state, action) => {
      state.isProductsLoading = true;
    });
    builder.addCase(getBills.fulfilled, (state, action) => {
      state.isProductsLoading = false;
      state.bills = action.payload;
    });
    builder.addCase(getBills.rejected, (state, action) => {
      state.error = true;
    });
    // Create Bill
    builder.addCase(createBill.pending, (state, action) => {
      state.created = false;
      state.isProductLoading = true;
    });
    builder.addCase(createBill.fulfilled, (state, action) => {
      state.isProductLoading = false;
      state.created = true;
    });
    builder.addCase(createBill.rejected, (state, action) => {
      state.error = true;
    });
  },
});

export const { test } = billsSlice.actions;

export default billsSlice.reducer;
