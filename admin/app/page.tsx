"use client";
import React, { FC, useEffect, useState } from "react";
import Heading from "./utils/Heading";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/SignUp";
import Verification from "./components/Auth/Verification";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import Header from "./components/Header";

interface Props {}

const Page: FC<Props> = (props) => {
  const [route, setRoute] = useState("Login");
  const { user } = useSelector((state: any) => state.auth);

  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);

  // useEffect(() => {
  //   if (user) {
  //     redirect("/admin");
  //   }
  // }, [user]);

  return (
    <div>
      <Heading
        title="Concept Leader - Admin"
        description="Concept Leader is a platform for students to learn and get help from teachers"
        keywords="Prograaming,MERN,Redux,Machine Learning"
      />
      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <div className="w-[90%] md:w-[420px] m-auto h-screen flex items-center justify-center">
        {route === "Login" && <Login setRoute={setRoute} />}
        {route === "Sign-up" && <Signup setRoute={setRoute} />}
        {route === "Verification" && <Verification setRoute={setRoute} />}
      </div>
    </div>
  );
};

export default Page;
