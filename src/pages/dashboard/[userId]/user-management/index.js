import Tiles from "@/components/Tiles";
import CreateNewUser from "@/components/users/CreateNewUser";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useRouter } from "next/router";
import React from "react";

function Sales() {
  const router = useRouter();

  return <CreateNewUser />;
}

export default Sales;
