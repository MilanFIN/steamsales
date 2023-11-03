"use_server";

import "../app/globals.css";

import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const Home = () => {
  return (
    <div className="mt-8 w-full text-center grid">
      <h1 className="text-4xl justify-center text-gray-300">Steamsales listing page</h1>
      <p className="mt-8 text-gray-400 w-1/2 justify-self-center">
        This page makes it possible to quickly check the current sale status of various steam games.
        The Top100 page lists the 100 most played steam games. When complete, the featured page
        should contain a list of games that are displayed in various featured pages of the official steam page.
      </p>
      <p className="mt-8 text-gray-400 w-1/2 justify-self-center">
        The project is built on Next.js & Tailwind. All sources can be found in 
        <Link className="text-gray-100 ml-1" href="https://github.com/MilanFIN/steamsales">Github</Link>
      </p>

    </div>
  );
};

export default Home;
