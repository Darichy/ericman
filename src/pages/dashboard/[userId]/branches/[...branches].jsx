// pages/[...slug].js
import CreateNewBranch from "@/components/branches/CreateNewBranch";
import NewSale from "@/components/sales/NewSales";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useRouter } from "next/router";

const CatchAllPage = () => {
  const router = useRouter();
  const { branches } = router.query;

  console.log(branches, "slug");
  // Now you can use the 'slug' array to handle the dynamic segments
  // and render content accordingly
  if (branches?.includes("new-branch")) {
    return (
      <Breadcrumb>
        <CreateNewBranch />
      </Breadcrumb>
    );
  }
  return (
    <div>
      <h1>Catch-All Page</h1>
      <p>Slug: {JSON.stringify(branches)}</p>
    </div>
  );
};

export default CatchAllPage;
