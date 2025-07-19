"use client";
import { useDispatch, useSelector } from "react-redux";

import { getBills } from "@/redux/slices/billsSlice";

import { useEffect } from "react";
export default function BillsComp() {
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.bills);
  useEffect(() => {
    if (bills.length === 0) {
      console.log("Fetching bills...");
      dispatch(getBills());
    } else {
      dispatch(getBills());
      console.log("bills already loaded:", bills);
    }
  }, [bills.length, dispatch]);

  return <div></div>;
}
