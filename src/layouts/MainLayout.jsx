import React, { Suspense, use, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import { useSelector } from "react-redux";
import { API_SERVER } from "@/utils/constants";
import useAuth from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { authenticate } from "@/store/authSlice";
import { Roboto } from "@next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["700", "500"],
  // variable: ["700", "500"],
});
function MainLayout({ children }) {
  const dispatch = useDispatch();
  // console.log(useAuth(), "pp");
  // const isLoggedIn = useAuth();
  // dispatch(authenticate(false));

  // console.log(isLoggedIn, "ll");
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );

  if (isAuthenticated) {
    return <AuthLayout>{children}</AuthLayout>;
  } else {
    return <div className={`${roboto.className}`}>{children}</div>;
  }
}

export default MainLayout;
