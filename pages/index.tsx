import { Inter } from "next/font/google";
import Link from "next/link";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <div>
      <main>Home page</main>
      <Link href="admin">Admin</Link>
    </div>
  );
}
