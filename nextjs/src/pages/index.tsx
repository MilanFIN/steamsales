"use_server";

import "../app/globals.css";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { ReactElement } from "react";

const Home = () => {
  return (
    <div className="">
      <a href="/top100"> homepage </a>
    </div>
  );
};

export default Home;
