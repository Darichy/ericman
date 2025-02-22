import { useEffect, useState } from "react";
import NotificationTile from "./NotificationTile";
import axios from "axios";
import { Skeleton, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setSelectedNotification } from "@/store/notificationSlice";
import Image from "next/image";
import { poppins } from "@/layouts/AuthLayout";

export default function NotificationPane({ setShowNotifications, setNview }) {
  const [Nlist, setNlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
    try {
      axios.post("/api/notifications/get-notifications").then((response) => {
        setLoading(false);
        setNlist(response.data);
        axios.post("/api/notifications/update-notifications");
      });
    } catch (error) {}
  }, []);
  return (
    <div
      className={`${poppins?.className} md:w-[300px]  w-[250px] py-3 h-full space-y-2 px-2`}
    >
      <div className="font-semibold flex items-center space-x-3 ">
        <span>My Notifications</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M16.881 4.346A23.112 23.112 0 018.25 6H7.5a5.25 5.25 0 00-.88 10.427 21.593 21.593 0 001.378 3.94c.464 1.004 1.674 1.32 2.582.796l.657-.379c.88-.508 1.165-1.592.772-2.468a17.116 17.116 0 01-.628-1.607c1.918.258 3.76.75 5.5 1.446A21.727 21.727 0 0018 11.25c0-2.413-.393-4.735-1.119-6.904zM18.26 3.74a23.22 23.22 0 011.24 7.51 23.22 23.22 0 01-1.24 7.51c-.055.161-.111.322-.17.482a.75.75 0 101.409.516 24.555 24.555 0 001.415-6.43 2.992 2.992 0 00.836-2.078c0-.806-.319-1.54-.836-2.078a24.65 24.65 0 00-1.415-6.43.75.75 0 10-1.409.516c.059.16.116.321.17.483z" />
        </svg>
      </div>

      {!loading ? (
        Nlist?.length > 0 ? (
          Nlist.map((i) => (
            <NotificationTile
              type={i?.type}
              item={i}
              onView={async () => {
                if (
                  i?.type === "Distribution" ||
                  i?.type === "RejDist" ||
                  i?.type === "ConDist" ||
                  i?.type === "UpdDist"
                ) {
                  dispatch(
                    setSelectedNotification({ id: i?.type_id, type: i?.type })
                  );
                  router.push(
                    `/dashboard/${session?.user?.username}/stocks/supplies`
                  );
                } else if (i?.type === "Transfer") {
                  dispatch(setSelectedNotification({ id: i?.type_id }));
                  router.push(
                    `/dashboard/${session?.user?.username}/stocks/transfers`
                  );
                }
                setShowNotifications(false);

                dispatch(
                  setSelectedNotification({ id: i?.type_id, type: i?.type })
                );
                // setNview({ status: true });
              }}
            />
          ))
        ) : (
          <div className="mt-12 w-full flex items-center justify-center">
            <div className="text-center">
              <Image src="/no_notification.svg" height={250} width={250} />
              <span className="text-sm animate-pulse font-semibold text-gray-500">
                No new notification
              </span>
            </div>
          </div>
        )
      ) : (
        [1, 2, 3, 4, 5].map(() => (
          <Stack className="pt-4" spacing={0.4}>
            <Skeleton
              animation="wave"
              variant="text"
              sx={{ fontSize: "1rem", bgcolor: "grey.300" }}
              // height={60}
            />
            <Skeleton animation="wave" variant="rounded" height={60} />

            {/* For other variants, adjust the size with `width` and `height` */}
            {/* <Skeleton variant="circular" width={40} height={40} /> */}
            {/* <Skeleton variant="rectangular" width={210} height={60} /> */}
          </Stack>
        ))
      )}
    </div>
  );
}
