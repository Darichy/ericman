// pages/[...slug].js
import CashIn from "@/components/cash/cash-in";
import Debtors from "@/components/sales/Debtors";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { SegmentedControl } from "@mantine/core";
import { useEffect, useState } from "react";

const CatchAllPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { cash } = router.query;
  const [route, setRoute] = useState();

  useEffect(() => {
    setRoute(router.asPath);
  }, [router]);

  const routes = [
    {
      label: "Transactions",
      value: `/dashboard/${session?.user?.username}/finances/transactions`,
    },
    {
      label: "Debtors",
      value: `/dashboard/${session?.user?.username}/finances/debtors`,
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
      {cash?.includes("debtors") ? (
        <Debtors />
      ) : (
        // </Breadcrumb>
        <CashIn />
      )}
    </div>
  );
};
export default CatchAllPage;
