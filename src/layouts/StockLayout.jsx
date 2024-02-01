import { Breadcrumbs } from "@mui/material";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function StockLayout({ children }) {
  //   const [routesState, setRoutesState] = useState([]);
  const router = useRouter();
  const routes = [
    <Link
      className="hover:underline hover:underline-offset-2"
      color="inherit"
      href="/dashboard/admin/stocks"
    >
      Stock Management
    </Link>,
  ];

  if (router.pathname === "/dashboard/[userId]/stocks/new-product") {
    // console.log("ghana");
    routes.push(
      <Link
        className="hover:underline hover:underline-offset-2"
        color="inherit"
        href="/dashboard/admin/stocks"
      >
        New Product
      </Link>
    );
    //   setRoutesState(routes);
  }

  //   console.log({ i: router.pathname });
  return (
    <div className>
      <div className="px-2 py-2">
        <Breadcrumbs aria-label="breadcrumb">
          {routes.map((i) => i)}
          {/* <Typography color="text.primary">Breadcrumbs</Typography> */}
        </Breadcrumbs>
      </div>
      {children}
    </div>
  );
}

export default StockLayout;
