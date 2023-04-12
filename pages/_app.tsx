import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

import { UserContext } from "@/libs/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserContext.Provider value={{ user: {}, username: "Lauphy" }}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  );
}
