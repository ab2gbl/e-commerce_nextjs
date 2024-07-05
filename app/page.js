"use client";
import { Provider } from "react-redux";
import store from "@/redux/store";
import HomeComp from "@/components/HomeComp";
import HomeComp1 from "@/components/HomeComp1";

export default function Home() {
  return (
    <Provider store={store}>
      <main>
        <HomeComp1 />
      </main>
    </Provider>
  );
}
