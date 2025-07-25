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

export const getUserBills = createAsyncThunk("getUserBills", async () => {
  const response = await api.get("/product/mybills/");

  return await response.data;
});

export const billsSlice = createSlice({
  name: "bills",
  initialState: {
    isProductsLoading: true,
    bills: [],
    userBills: [],
    error: false,
    bill: {},
    created: false,
    test: false,
  },
  reducers: {
    test: (state) => {
      state.test = true;
    },
    removeCreated: (state) => {
      state.created = false;
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
    // Get User Bills
    builder.addCase(getUserBills.pending, (state, action) => {
      state.isUserBillsLoading = true;
      state.error = null;
    });
    builder.addCase(getUserBills.fulfilled, (state, action) => {
      state.isUserBillsLoading = false;
      state.userBills = action.payload;
    });
    builder.addCase(getUserBills.rejected, (state, action) => {
      state.isUserBillsLoading = false;
      state.error = action.payload;
    });
  },
});

export const { test, removeCreated } = billsSlice.actions;

export default billsSlice.reducer;
