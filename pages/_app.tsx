import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

import { UserContext } from "@/libs/context";
import { useUserData } from "@/libs/useUserData";

export default function App({ Component, pageProps }: AppProps) {
  const { user, username } = useUserData();

  return (
    <>
      <UserContext.Provider value={{ user, username }}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  );
}
