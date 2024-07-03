"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import HomeComp from "@/components/HomeComp";
export default function Home() {
  return (
    <Provider store={store}>
      <main>
        <HomeComp />
      </main>
    </Provider>
  );
}
