import React, { FC, useState } from "react";
import Heading from "../utils/Heading";
import Link from "next/link";
import NavItems from "../utils/NavItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
};

const Header: FC<Props> = ({ activeItem, setOpen }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [active, setActive] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        setActive(true);
      } else {
        setActive(false);
      }
    });
  }

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffffic] "
            : "w-full border-b dark:border-[#ffffffic] h-[88px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[90%] 800px:w-[92%] m-auto py-2 h-full">
          <div className="w-full h-[80%] flex items-center justify-between p-3">
            <div>
              <Link
                href="/"
                className="text-[25px] font-Poppins font-500 text-black dark:text-white"
              >
                Concept Leader
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer dark:text-white text-black"
                onClick={() => setOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
