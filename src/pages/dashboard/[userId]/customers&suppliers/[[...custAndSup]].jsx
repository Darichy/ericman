// pages/[...slug].js
// import custAndSupIn from "@/components/custAndSup/custAndSup-in";
import Debtors from "@/components/sales/Debtors";
import NewSale from "@/components/sales/NewSales";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useRouter } from "next/router";
// import CustAndSup, { Supplier } from ".";
import Customers from "../customers";
import { SegmentedControl } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Supplier from "@/components/Suppliers";
// import FinancialTransactions from ".";

// const CatchAllPage = () => {
//   const router = useRouter();
//   const { custAndSup } = router.query;

//   console.log(router, "slug");
//   // Now you can use the 'slug' array to handle the dynamic segments
//   // and render content accordingly
//   if (custAndSup?.includes("customers")) {
//     return (
//       <Breadcrumb>
//         <Customers />
//       </Breadcrumb>
//     );
//   } else if (custAndSup?.includes("suppliers")) {
//     return (
//       <Breadcrumb>
//         <Supplier />
//       </Breadcrumb>
//     );
//   }
//   return <CustAndSup />;
// };

const CatchAllPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { custAndSup } = router.query;
  const [route, setRoute] = useState();
  // console.log(router, "slugg");
  useEffect(() => {
    setRoute(router.asPath);
  }, [router]);
  const routes = [
    {
      label: "Customers",
      value: `/dashboard/${session?.user?.username}/customers&suppliers/customers`,
    },
    {
      label: "Suppliers",
      value: `/dashboard/${session?.user?.username}/customers&suppliers/suppliers`,
    },
  ];

  return (
    <div>
      <div className="flex justify-center">
        <SegmentedControl
          // value={value}
          value={route}
          onChange={(value) => {
            setRoute(value);
            router.push(value);
          }}
          className="bg-zinc-300"
          data={routes}
        />
      </div>
      {custAndSup?.includes("suppliers") ? (
        // <Breadcrumb>
        <Supplier />
      ) : (
        // </Breadcrumb>
        <Customers />
      )}
    </div>
  );
};
export default CatchAllPage;
