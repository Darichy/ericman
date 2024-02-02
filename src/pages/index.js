import Image from "next/image";
// import { Inter } from "next/font/google";
import InputField from "@/components/InputField";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Burger, Loader } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "@/store/authSlice";
import { API_SERVER, API_URL } from "@/utils/constants";
import axios from "axios";
import { Poppins, Quicksand } from "@next/font/google";
import { Backdrop, CircularProgress, Dialog } from "@mui/material";
import { signIn, useSession } from "next-auth/react";
import useSnackbar from "@/hooks/useSnackbar";
import { Drawer, Menu, MenuItem, Slide, Snackbar } from "@mui/material";
import { setShowSnackbar } from "@/store/snackbarSlice";

const poppins = Poppins({ subsets: ["latin"], weight: ["400"] });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["400"] });
function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}
function Home() {
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });
  const [isFocus, setIsFocus] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sn, setsn] = useState({ status: false });
  const router = useRouter();
  const dispatch = useDispatch();
  const showAlert = useSnackbar();

  const snackbar = useSelector((state) => state.snackbar.showSnackbar);
  function handleloginCredChange(e) {
    setLoginCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handlelogin() {
    try {
      if (
        loginCredentials?.username === "" ||
        loginCredentials?.password === ""
      ) {
        setsn({ status: true, type: "empty" });
        return;
      }
      setLoading(true);
      const response = { data: "" };
      const result = await signIn("credentials", {
        ...loginCredentials,
        redirect: false,
      });

      console.log("Login response = ", result);
      if (result.error === "CredentialsSignin") {
        // Invalid password
        setLoading(false);

        setsn({ status: true });
      } else if (result.ok) {
        router.push(`/dashboard/${loginCredentials.username}`);
      }
      // const response = await axios.post("/api/login", {
      //   ...loginCredentials,
      // });
      // if (response.data?.isloggedIn) {
      //   // dispatch(authenticate);
      //   console.log(response.data, response.data.user.username, "c");
      //   const username = response.data.user.username;
      //   localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      //   router.push(`/dashboard/${username}`);
      //   dispatch(authenticate(response.data?.isloggedIn));
      //   setLoading(false);
      // } else {
      //   console.log(response.data, "c");
      //   setLoading(false);
      //   setError({ state: true, message: response.data?.message });
      //   dispatch(authenticate(response.data?.isloggedIn));
      // }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sn?.status) {
      setTimeout(() => {
        setsn({ status: false });
      }, 3000);
    }
  }, [sn]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        document.getElementById("login").click();
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          document.getElementById("login").click();
        }
      });
    };
  }, []);
  return (
    <div
      className={`h-screen w-screen bg-cover ${poppins.className}`}
      style={{
        backgroundImage: `url('back.jpg')`,
      }}
    >
      <div
        // style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 0% 100%)" }}
        className="w-full   relative h-screen md:p-7 px-[14px] flex items-center loginGradient  "
      >
        <div className="fixed top-0 flex p-3">
          <div className="flex text-white space-x-4 items-center">
            <div className="rounded-full w-6 h-6 bg-blue-400"></div>
            <div className="flex flex-col">
              <span>Ericamp Block Manufacturing Ent.</span>
              <span className="text-blue-200 font-extralight text-xs md:hidden ">
                Your builder's friend
              </span>
            </div>
            <div
              className={`text-blue-200 font-extralight hidden md:block  text-sm uppercase`}
            >
              --- Your builder's friend
            </div>
          </div>
        </div>
        <div className="lg:w-[40%] w-[100%]">
          <div className="text-white md:text-6xl text-4xl px-3 ">
            Welcome back!
          </div>
          <div className="flex items-end space-x-5">
            {/* <div className="flex space-x-2">
              <div className="rounded-full w-[5px] h-[5px] bg-blue-400"></div>
              <div className="rounded-full w-[5px] h-[5px] bg-blue-400"></div>
            </div> */}
          </div>
          <div
            className={`h-[300px] md:w-[90%] w-[100%] text-base font-thin   px-3 py-5 `}
          >
            <div className="space-y-2">
              <label className={`text-[#c5ccd5] ${poppins.className} `}>
                Username
              </label>
              <div className="relative md:w-[80%] w-[100%]  ">
                <input
                  placeholder="Enter username"
                  value={loginCredentials.username}
                  label="Username"
                  name="username"
                  onChange={(e) => {
                    handleloginCredChange(e);
                  }}
                  type="text"
                  className="w-full relative bg-[#323644] text-white rounded-md py-[10px] pr-12 pl-4 focus:outline-none   focus:ring-[3.5px] focus:ring-blue-400 transition-all  "
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 absolute top-[8.5px] right-3 text-[#95a0b0]"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2 mt-6 ">
              <label className="text-[#c5ccd5] ">Password</label>
              <div className="relative md:w-[80%] w-[100%] ">
                <input
                  placeholder="Enter password "
                  value={loginCredentials.password}
                  name="password"
                  onChange={(e) => {
                    handleloginCredChange(e);
                  }}
                  type={isFocus ? "text" : "password"}
                  className="w-full  relative bg-[#323644] text-white rounded-md py-[10px] px-3 focus:outline-none   focus:ring-[3.5px] focus:ring-blue-400 transition-all  "
                />
                {isFocus ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 absolute top-[8.5px] right-3 text-[#95a0b0]"
                    onClick={() => {
                      setIsFocus(false);
                    }}
                  >
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path
                      fillRule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 absolute top-[8.5px] right-3 text-[#95a0b0]"
                    onClick={() => {
                      setIsFocus(true);
                    }}
                  >
                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                  </svg>
                )}
              </div>
            </div>

            <div className="pt-4  space-x-4 mt-9 md:w-[80%] w-[100%] shadow  justify-between">
              {/* <button
                onClick={() => {
                  handlelogin();
                  // console.log(loginCredentials);

                  // router.push("/dashboard/admin");
                }}
                className="bg-[#555b69]  text-white rounded-full w-[190px] px-4 py-[9px] "
              >
                Forgot password ?
              </button> */}
              <button
                id="login"
                onClick={() => {
                  handlelogin();
                  // console.log(loginCredentials);

                  // router.push("/dashboard/admin");
                }}
                className="bg-[#1d90f5] w-full flex justify-center active:bg-blue-600 hover:bg-blue-400 transition-all text-white rounded-md  px-4 py-[10px] "
              >
                {loading ? (
                  <Loader color="white" size={25} />
                ) : (
                  <span>Sign in</span>
                )}
              </button>
              {/* <Button
                width={100}
                label={"Submit"}
                onClick={() => {
                  handlelogin();
                  // console.log(loginCredentials);

                  // router.push("/dashboard/admin");
                }}
              /> */}
              <Dialog
                open={error?.state}
                onClose={() => {
                  setError(false);
                }}
              >
                <div>
                  <div
                    onClick={() => {
                      setError(false);
                    }}
                  >
                    close
                  </div>
                  <div>{error?.message}</div>
                </div>
              </Dialog>

              {/* <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
                // onClick={()=>{setLoading(false)}}
              >
                <CircularProgress color="inherit" />
              </Backdrop> */}
            </div>
          </div>
        </div>
        <Snackbar
          open={sn?.status}
          // className="bg-green-700"
          TransitionComponent={TransitionLeft}
          // onClose={() => {
          //   dispatch(setShowSnackbar({ status: false, type: "", message: "" }));
          // }}
          message={
            <div className={`${poppins?.className} flex  justify-center`}>
              <div className="flex space-x-3 items-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-7 h-7 fill-red-600 stroke-black "
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {sn?.type == "empty" ? (
                  <div className="text-gray-200">Kindly fill all fields</div>
                ) : (
                  <div className="text-white w-[250px]">
                    Invalid Username or Password
                    <span className="text-gray-400 block text-xs italic">
                      if you are sure of your credentials please contact
                      administrator
                    </span>
                  </div>
                )}
              </div>
            </div>
          }
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        />
      </div>
    </div>
  );
}
export default Home;
