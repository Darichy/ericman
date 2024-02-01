import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import store from "@/store";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
// import { SessionProvider } from "next-auth/react";
import SProvider from "../layouts/SessionProvider";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // const isAuthenticated = useSelector((state) => state.isAuthenticated);
  // const isAuthenticated = false;
  const router = useRouter();

  if (router.pathname === "/") {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }
  return (
    <SProvider>
      <Provider store={store}>
        <AuthLayout>
          <Component {...pageProps} />
        </AuthLayout>
      </Provider>
    </SProvider>
  );
}
