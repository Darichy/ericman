// pages/[...slug].js

import CreateNewUser from "@/components/users/CreateNewUser";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useRouter } from "next/router";

const CatchAllPage = () => {
  const router = useRouter();
  const { user } = router.query;

  console.log(user, "slug");
  // Now you can use the 'slug' array to handle the dynamic segments
  // and render content accordingly
  if (user?.includes("new-user")) {
    return (
      <Breadcrumb>
        <CreateNewUser />
      </Breadcrumb>
    );
  }
  return (
    <div>
      <h1>Catch-All Page</h1>
      <p>Slug: {JSON.stringify(user)}</p>
    </div>
  );
};

export default CatchAllPage;
