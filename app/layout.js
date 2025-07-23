import { Inter } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ClientProvider from "@/components/ClientProvider";
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phone Store",
  description: "The best place to buy your favorite phones",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <NavbarWrapper />
          <main className="min-h-screen pb-8">{children}</main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
