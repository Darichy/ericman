// "use-client";
import Sidebar from "@/components/SideBar";
import { API_SERVER, colors } from "@/utils/constants";
import {
  Burger,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Select,
} from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/router";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Poppins } from "@next/font/google";
import {
  Dialog,
  Drawer,
  MenuItem,
  Slide,
  Snackbar,
  TextField,
} from "@mui/material";
import { Menu } from "@mantine/core";
import DateRange from "@/components/DateRange";
import { signOut, useSession } from "next-auth/react";
import io from "socket.io-client";
// import socket from "@/utils/socket";
import useSnackbar from "@/hooks/useSnackbar";
import { setSocket } from "@/store/websocketSlice";
import NotificationTile from "@/components/notifications/NotificationTile";
import NotificationPane from "@/components/notifications/NotificationPane";
import NotificationDetails from "@/components/notifications/NotificationDetails";
import { setScreenWidthx, setUser } from "@/store/generalSlice";
import Image from "next/image";
import Button from "@/components/Button";
import Profile from "@/components/Profile";

export const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});

function AuthLayout({ children }) {
  const [title, setTitle] = useState("Dashboard");
  const [toggle, setToggle] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [nview, setNview] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [count, setCount] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const snackbar = useSelector((state) => state.snackbar.showSnackbar);
  const [s, setS] = useState(snackbar);
  const [branch, setBranch] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const [screenWidth, setScreenWidth] = useState("");
  const [notiChange, setNotiChange] = useState(false);

  const { data: session } = useSession();
  const { selectedNotification } = useSelector((state) => state?.notification);
  const audioRef = useRef(null);
  const showAlert = useSnackbar();
  const { theme } = useSelector((state) => state?.theme);
  const [isOnline, setIsOnline] = useState(true);
  const playSound = async () => {
    try {
      const audio = new Audio("/notify.wav");
      await audio.play();
    } catch (error) {
      console.warn("Error playing sound:", error.toString());
      // alert("Error playing sound:", error.toString());
    }
  };
  let socket;
  const router = useRouter();
  const dispatch = useDispatch();
  async function handleLogout() {
    localStorage?.removeItem("ntf");
    signOut();
  }
  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
  }
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    let isFirstMount = true;

    if (session) {
      socket = io("https://yekoben-socket.onrender.com");
      try {
        dispatch(setSocket(socket));
        socket.emit("joinBranchRoom", session?.user?.branch_id);
        axios
          .post("/api/notifications/get-notifications", {
            key: "count",
          })
          .then((res) => {
            setCount(res?.data);

            if (
              res?.data > (JSON.parse(localStorage.getItem("ntf"))?.count ?? 0)
            ) {
              // alert("here");
              showAlert("ntf", "New notification");
              playSound();

              localStorage?.setItem(
                "ntf",
                JSON.stringify({ count: res?.data })
              );
            }
          });
        socket.on("notification", () => {
          showAlert("ntf", "New notification");
          playSound();
          setNotiChange(!notiChange);
          console.log("Connected to Socket.io server");
        });
      } catch (error) {
        console.log(error);
      }
    }
    isFirstMount = false;
    return () => {
      socket?.disconnect();
    };
  }, [session]);

  useEffect(() => {
    if (session?.user?.role_code !== "SA") {
      axios.get("/api/branches/get-branch-desc").then((res) => {
        console.log();
        setBranch(res.data);
        dispatch(setUser({ branch: res?.data }));
      });
    }
  }, [session]);

  useEffect(() => {
    dispatch(setScreenWidthx(window.innerWidth));
    function handleResize() {
      setScreenWidth(window.innerWidth);
      dispatch(setScreenWidthx(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log({ screenWidth });
  let isLoading;

  useEffect(() => {
    try {
      // if (showNotifications === false) {
      axios
        .post("/api/notifications/get-notifications", {
          key: "count",
        })
        .then((res) => {
          setCount(res?.data);
        });
      // }
    } catch (error) {
      console.log(error);
    }
  }, [showNotifications, notiChange]);

  const [size, setSize] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  useEffect(() => {
    setSize(window.innerWidth);
  }, []);

  return (
    <div
      style={{ background: theme === "light" ? colors.background : "#292e39" }}
      className={`flex ${poppins.className} text-sm w-full transition-all h-[100vh] text-[0.9rem]  `}
    >
      <audio ref={audioRef} style={{ display: "none" }}>
        <source src="/notify.wav" type="audio/wav" />
        {/* Replace with your sound file path */}
        Your browser does not support the audio element.
      </audio>
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={isLoading}
        overlayBlur={2}
      />
      {/* <Chat /> */}

      <Sidebar setTitle={setTitle} setToggle={setToggle} />
      <div className="flex-grow backdrop-filter backdrop-blur-md ">
        <div
          className={`${
            toggle
              ? "w-[calc(100%-16px)] transition-all"
              : "w-[calc(100%-8px)] transition-all"
          } transition  ease-in-out duration-300 h-[60px]  flex justify-between  space-x-6  fixed top-0  md:px-6 px-2 font-semibold items-center`}
        >
          <Burger
            opened={showDrawer}
            className="md:hidden"
            onClick={() => setShowDrawer(true)}
          />
          <div className="relative hidden md:block md:w-[25%]">
            <input
              type="text"
              placeholder="Search.."
              className="bg-[#e9eaee]  border-[1.5px] w-full font-thin focus:outline-none border-gray-300 rounded-full py-[5px] pl-8"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 absolute left-2 top-[6px] stroke-gray-400 text-gray-700 z-10 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          <div className="md:w-[75%]   space-x-2  ">
            <div className="flex justify-end ">
              <div
                onClick={() => {
                  setShowNotifications(true);
                }}
                className=" hidden md:block relative p-2 rounded-full  border-[1.5px] border-gray-400 flex justify-center items-center"
              >
                <div className="absolute -top-0.5 -right-1 rounded-full px-[6px] py-[1px]  bg-red-500 text-white  flex justify-center items-center text-xs font-thin">
                  {count}
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  // style={{ color: colors.stroke }}
                  className={`w-6 h-6 text-zinc-800`}
                >
                  <path d="M4.214 3.227a.75.75 0 00-1.156-.956 8.97 8.97 0 00-1.856 3.826.75.75 0 001.466.316 7.47 7.47 0 011.546-3.186zM16.942 2.271a.75.75 0 00-1.157.956 7.47 7.47 0 011.547 3.186.75.75 0 001.466-.316 8.971 8.971 0 00-1.856-3.826z" />
                  <path
                    fillRule="evenodd"
                    d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.94 32.94 0 003.256.508 3.5 3.5 0 006.972 0 32.933 32.933 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zm0 14.5a2 2 0 01-1.95-1.557 33.54 33.54 0 003.9 0A2 2 0 0110 16.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="hidden md:flex mx-5 px-3 py-1 justify-center">
                <div className="w-[1.5px] bg-gray-400"></div>
              </div>
              <Menu style={{ zIndex: "99999" }} className="font-thin z-50">
                <Menu.Target>
                  <div className="flex items-center cursor-pointer space-x-2">
                    <div
                      // onClick={(event) => {
                      //   setShowMenu(true);
                      //   setAnchorEl(event.currentTarget);
                      // }}
                      id="basic-menu"
                      className="relative p-[6px] rounded-full border-[1.5px] border-gray-400 flex justify-center items-center"
                    >
                      <div className="absolute -top-[8px] -right-1 rounded-full md:hidden w-5 h-5 bg-red-500 text-white  flex justify-center items-center text-xs font-thin">
                        {count}
                      </div>
                      {session?.user?.role_code == "SA" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 fill-yellow-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : session?.user?.role_code == "A" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6 fill-cyan-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="true"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5  "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="text-[#1b1b27] font-semibold">
                        {session?.user?.username}
                      </div>
                      {session?.user?.role_code !== "SA" && (
                        <div className="text-[#c1c0ca] whitespace-nowrap text-ellipsis  text-xs">
                          {branch} branch
                        </div>
                      )}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Menu.Target>
                <div className="z-50 shadow-lg border">
                  <Menu.Dropdown className={`${poppins?.className} z-50`}>
                    {/* <div className="font-thin"></div> */}
                    <Menu.Item onClick>
                      <div className={`${poppins?.className}`}>
                        {session?.user?.role_code == "SA" ? (
                          <div className="flex space-x-2 justify-center text-sm text-gray-500 ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 fill-yellow-500"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Super Admin</span>
                          </div>
                        ) : session?.user?.role_code == "A" ? (
                          <div className="flex space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 fill-cyan-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Administrator</span>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="true"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4  "
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                              />
                            </svg>
                            <span>Staff</span>
                          </div>
                        )}
                      </div>
                    </Menu.Item>
                    {session?.user?.role_code == "SA" && (
                      <Menu.Item
                        onClick={() => {
                          setOpenProfile(true);
                        }}
                      >
                        {" "}
                        <div className={`${poppins?.className} flex space-x-2`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M6 12a.75.75 0 01-.75-.75v-7.5a.75.75 0 111.5 0v7.5A.75.75 0 016 12zM18 12a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5A.75.75 0 0118 12zM6.75 20.25v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0zM18.75 18.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 011.5 0zM12.75 5.25v-1.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0zM12 21a.75.75 0 01-.75-.75v-7.5a.75.75 0 011.5 0v7.5A.75.75 0 0112 21zM3.75 15a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0zM12 11.25a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5zM15.75 15a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" />
                          </svg>

                          <span> Manage Profile</span>
                        </div>{" "}
                      </Menu.Item>
                    )}
                    <Menu.Item
                      className="block md:hidden"
                      onClick={() => {
                        setShowNotifications(true);
                      }}
                    >
                      <div className={`${poppins?.className} flex space-x-2`}>
                        <div className=" rounded-full py-[1px] px-2 bg-red-500 text-white  flex justify-center items-center text-xs font-thin">
                          {count}
                        </div>
                        <span>Notification</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item onClick={handleLogout}>
                      <div className="flex space-x-2">
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
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                          />
                        </svg>

                        <div className={`${poppins?.className}`}>Logout</div>
                      </div>
                    </Menu.Item>
                  </Menu.Dropdown>
                </div>
              </Menu>
            </div>
          </div>
        </div>
        <Modal
          style={{ background: "transparent" }}
          className="bg-[transparent] rounded-full"
          opened={openProfile}
          onClose={() => {
            setOpenProfile(false);
          }}
          transitionProps={{ transition: "rotate-left" }}
        >
          <Profile username={session?.user?.username} />
        </Modal>
        <div className=" w-[100%] overflow-hidden  h-[calc(100vh-55px)] mt-[55px] py-2 md:px-3 px-1     ">
          {children}
        </div>
        <Modal
          opened={nview?.status}
          onClose={() => {
            setShowNotifications(true);
            setNview({ status: false });
          }}
          transitionProps={{ transition: "rotate-left" }}
        >
          Notification Details
          <NotificationDetails
            type={{ id: nview?.type_id, name: nview?.type }}
          />
        </Modal>
        <Drawer
          anchor={"right"}
          open={showNotifications}
          onClose={() => {
            setShowNotifications(false);
          }}
        >
          <NotificationPane
            setShowNotifications={setShowNotifications}
            setNview={setNview}
          />
        </Drawer>
        <Drawer
          anchor={"left"}
          open={showDrawer}
          onClose={() => {
            setShowDrawer(false);
          }}
        >
          <div className="">
            <Sidebar
              setTitle={setTitle}
              setToggle={setToggle}
              setShowDrawer={setShowDrawer}
            />
          </div>
        </Drawer>
      </div>
      <Snackbar
        open={snackbar?.status}
        // className="bg-green-700"
        TransitionComponent={
          snackbar?.type === "ntf" ? TransitionLeft : TransitionDown
        }
        // onClose={() => {
        //   dispatch(setShowSnackbar({ status: false, type: "", message: "" }));
        // }}

        anchorOrigin={
          snackbar?.type === "ntf"
            ? { vertical: "top", horizontal: "right" }
            : { vertical: "top", horizontal: "center" }
        }
      >
        <div
          onClick={() => {
            if (snackbar?.type === "ntf") {
              setShowNotifications(true);
            }
          }}
          className="text-white cursor-pointer z-50 flex items-center space-x-3 bg-slate-700 min-h-[40px] min-w-[100px] rounded p-2"
        >
          {snackbar?.type === "success" ? (
            <video
              autoPlay
              src="/success.mp4"
              className="h-8 rounded-full w-8"
            />
          ) : snackbar?.type === "ntf" ? (
            <video autoPlay src="/bell.mp4" className="h-8 rounded-full w-8" />
          ) : (
            <video
              autoPlay
              src="/warning.mp4"
              className="h-8 rounded-full w-8"
            />
          )}
          <span>{snackbar?.message}</span>
        </div>
      </Snackbar>
      <Dialog
        open={isOnline === false}
        onClose={() => {
          // setShowDialog({ status: false, content: "" });
        }}
      >
        <div className={`${poppins?.className} text-sm w-[400px]`}>
          <div className="flex  justify-center mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-14 h-14 bg-gray-300 group-hover:scale-[1.1] transition-all rounded-full p-3"
            >
              <path d="M20.798 11.012l-3.188 3.416L9.462 6.28l4.24-4.542a.75.75 0 011.272.71L12.982 9.75h7.268a.75.75 0 01.548 1.262zM3.202 12.988L6.39 9.572l8.148 8.148-4.24 4.542a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262zM3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18z" />
            </svg>
          </div>
          <div className="p-5  py-3 rounded ">
            Unable to establish an internet connection. Please check your
            network connection and try again
            {/* <div className="flex justify-end space-x-2 mt-2">
              <button
                className="bg-gray-200 p-1 px-4 text-black hover:scale-[1.02] hover:ring-1 ring-zinc-400 transition-all rounded"
                onClick={() => {
                  setShowDialog({ status: false, content: "" });
                }}
              >
                No
              </button>
              <button
                className="bg-red-500 p-1 px-4 hover:scale-[1.02] hover:ring-1 ring-red-400 transition-all text-white rounded"
                onClick={() => {
                  handleDeleteUser(showDialog.content);
                }}
              >
                Yes
              </button>
            </div> */}
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default AuthLayout;
