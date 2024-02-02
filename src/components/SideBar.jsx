"use-client";
import React, { useState, useContext, useEffect } from "react";

import { useRouter } from "next/router";
import { Burger, SegmentedControl } from "@mantine/core";
import Tooltip from "@mui/material/Tooltip";
import { primaryColor } from "@/utils/constants";
import { useSession } from "next-auth/react";
import Image from "next/image";
import CustomSegmentedControl from "./CustomSegControl";

const Sidebar = ({ setTitle, setToggle, setShowDrawer }) => {
  // const screenSize = window.innerWidth;
  const [screenSize, setScreenSize] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");
  const [roleMenu, setRoleMenu] = useState([]);
  const router = useRouter();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setToggle(!isOpen);
  };
  const { data: session } = useSession();
  const user = session?.user?.username;
  let selectedV = "Dashboard";
  if (router.pathname.includes("/dashboard/[userId]/stocks")) {
    selectedV = "Inventory Management";
  } else if (router.pathname.includes("/dashboard/[userId]/user-management")) {
    selectedV = "Manage Users";
  } else if (router.pathname === "/dashboard/[userId]/customers") {
    selectedV = "Customers";
  } else if (router.pathname.includes("/dashboard/[userId]/sales")) {
    selectedV = "Sales";
  } else if (router.pathname === "/dashboard/[userId]/branches") {
    selectedV = "Branches";
  } else if (
    router.pathname.includes("/dashboard/[userId]/customers&suppliers")
  ) {
    selectedV = "Customers & Suppliers";
  } else if (router.pathname.includes("/dashboard/[userId]/finances")) {
    selectedV = "Finances";
  } else {
    selectedV = "Dashboard";
  }

  const menuModules = [
    {
      name: "Dashboard",
      title: "Dashboard",
      url: `/dashboard/${user}`,
      role: "SA-A-S",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M1.5 7.125c0-1.036.84-1.875 1.875-1.875h6c1.036 0 1.875.84 1.875 1.875v3.75c0 1.036-.84 1.875-1.875 1.875h-6A1.875 1.875 0 011.5 10.875v-3.75zm12 1.5c0-1.036.84-1.875 1.875-1.875h5.25c1.035 0 1.875.84 1.875 1.875v8.25c0 1.035-.84 1.875-1.875 1.875h-5.25a1.875 1.875 0 01-1.875-1.875v-8.25zM3 16.125c0-1.036.84-1.875 1.875-1.875h5.25c1.036 0 1.875.84 1.875 1.875v2.25c0 1.035-.84 1.875-1.875 1.875h-5.25A1.875 1.875 0 013 18.375v-2.25z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Sales",
      title: "Sales Management",
      url: `/dashboard/${user}/sales`,
      role: "SA-A-S",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Inventory Management",
      title: "Inventory Management",
      url: `/dashboard/${user}/stocks`,
      role: "SA-A-S",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
        </svg>
      ),
    },

    {
      name: "Customers",
      title: "Customer Management",
      url: `/dashboard/${user}/customers`,
      role: "S",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
        </svg>
      ),
    },
    {
      name: "Customers & Suppliers",
      title: "Customers & Suppliers Management",
      url: `/dashboard/${user}/customers&suppliers`,
      role: "SA-A",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z" />
        </svg>
      ),
    },
    {
      name: "Manage Users",
      title: "User Management",
      url: `/dashboard/${user}/user-management`,
      role: "SA",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
          />
        </svg>
      ),
    },
    {
      name: "Branches",
      title: "Branches",
      url: `/dashboard/${user}/branches`,
      role: "SA",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
          />
        </svg>
      ),
    },
    {
      name: "Finances",
      title: "Finances",
      url: `/dashboard/${user}/finances`,
      role: "SA-A-S",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M10 2c-1.716 0-3.408.106-5.07.31C3.806 2.45 3 3.414 3 4.517V17.25a.75.75 0 001.075.676L10 15.082l5.925 2.844A.75.75 0 0017 17.25V4.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0010 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const arr = menuModules.filter((i) =>
    i.role.split("-").includes(session?.user?.role_code)
  );
  console.log({ arr, i: "runn" });
  // setRoleMenu(arr);
  const menu = arr;
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setIsOpen(true);
        setToggle(false);
      } else {
        setIsOpen(true);
        setToggle(true);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      style={{ background: "white" }}
      className={`h-screen  relative text-white border-r-2 shadow-sm ${
        isOpen ? "w-64" : "w-16"
      } transition-all duration-300  ${setShowDrawer ? "" : "hidden"} md:block`}
    >
      <div
        onClick={toggleSidebar}
        // style={{ background: primaryColor }}
        className={`${
          // isOpen ? "top-0 right-1" : "top-0 left-1"
          ""
        } "absolute hidden md:block transition-all absolute -right-[18px]  p-[5px] border-4 border-indigo-100 flex justify-center items-center  top-8 z-20  bg-indigo-800  rounded-full duration-300"`}
      >
        {!isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 font-bold"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        )}
      </div>
      <div className="flex flex-col justify-between">
        <div className="px-3 py-[2px] text-gray-500 flex items-center space-x-3">
          <img src={"/logo.png"} className="h-20 " height={100} width={70} />
          {isOpen && <div className="">Ericamp Enterprise</div>}
        </div>
        <hr />
        <div className="flex justify-end">
          <svg
            onClick={() => setShowDrawer(false)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 "
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* <div className="w-full  flex flex-col justify-end"> */}
        <div className="mt-8 px-2 space-y-2">
          {menu.map((i, key) => (
            <Tile
              key={key}
              isOpen={isOpen}
              onClick={() => {
                if (setShowDrawer) {
                  setShowDrawer(false);
                }
                // setSelected("Stock");
                setTitle(i.title);
                router.push(i.url);
              }}
              icon={i.icon}
              label={i.name}
              selected={selectedV}
            />
          ))}
        </div>
        {/* </div> */}
        {/* <div className=" absolute bottom-10 p-4 w-full">
          <CustomSegmentedControl />
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
function Tile({ icon, label, isOpen, onClick, selected }) {
  return !isOpen ? (
    <Tooltip
      title={
        <div className="bg-gradient-to-b  from-zinc-700 to-zinc-900 font-light -mx-2 -my-4 py-[5px] shadow-sm text-sm   px-2 rounded">
          {" "}
          {label}
        </div>
      }
      placement="right"
    >
      <div
        onClick={onClick}
        className={`${
          selected === label
            ? " text-black   font-semibold  bg-indigo-50"
            : "text-[#918d9d]"
        }  px-2 cursor-pointer rounded items-center py-2 relative  hover:bg-indigo-50  flex space-x-3 `}
      >
        <div className={`${selected === label ? "text-indigo-800 " : ""}`}>
          {icon}
        </div>
        <div
          className={`overflow-hidden ${
            isOpen ? "block" : "hidden"
          } transition-all duration-1000 flex justify-between `}
        >
          <span>{label}</span>
        </div>
        {selected === label && (
          <div className="w-[5px] absolute h-full rounded-full bg-gradient-to-b right-0  from-indigo-800 to-pink-400">
            &nbsp;
          </div>
        )}
      </div>
    </Tooltip>
  ) : (
    <div
      onClick={onClick}
      className={`${
        selected === label
          ? " text-black   font-semibold  bg-indigo-50"
          : "text-[#918d9d]"
      }  px-2 cursor-pointer rounded items-center py-2 relative  hover:bg-indigo-50  flex space-x-3 `}
    >
      <div className={`${selected === label ? "text-indigo-800 " : ""}`}>
        {icon}
      </div>
      <div
        className={`overflow-hidden ${
          isOpen ? "block" : "hidden"
        } transition-all duration-1000 flex justify-between `}
      >
        <span>{label}</span>
      </div>
      {selected === label && (
        <div className="w-[5px] absolute h-full rounded-full bg-gradient-to-b right-0  from-indigo-800 to-pink-400">
          &nbsp;
        </div>
      )}
    </div>
  );
}
