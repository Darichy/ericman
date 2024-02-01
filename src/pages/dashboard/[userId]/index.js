"use-client";

import React, { useEffect, useState } from "react";

import Sidebar from "@/components/SideBar";
import AuthLayout from "@/layouts/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import Tiles from "@/components/Tiles";
import { useRouter } from "next/router";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/PieChart";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";
import { emitEvent } from "@/store/websocketSlice";
import AreaCharts from "@/components/charts/AreaCharts";
import PieCharts from "@/components/charts/PieCharts";
import Range from "@/components/charts/Range";
import { Menu } from "@mantine/core";
// import io from "socket.io-client";
export default function Dashboard() {
  const { data: session } = useSession();
  const [tileValues, setTileValues] = useState({
    revenue: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function getRevenue() {
    const response = await axios.post("/api/cash/get-transactions", {
      branch_code: session?.user?.branch_code,
      key: "get-total",
    });
    setTileValues((prev) => ({ ...prev, revenue: response.data }));
  }

  async function getSalesStat() {
    const response = await axios.post("/api/sales/get-sales", {
      // branch_code: session?.user?.branch_code,
      key: "get-stat",
    });
    setTileValues((prev) => ({
      ...prev,
      sales: response.data.todaySales,
      credit: response.data.creditSales,
      salesPerformance: response?.data?.salesPerformance,
    }));
  }

  async function getProfit() {
    const response = await axios.post("/api/sales/get-sales", {
      key: "get-profit",
    });
    setTileValues((prev) => ({ ...prev, profit: response.data }));
  }

  async function getChart() {
    const response = await axios.post("/api/sales/get-sales", {
      key: "get-chart",
    });
    setTileValues((prev) => ({
      ...prev,
      salesPerformance: response.data?.salesPerformance,
    }));
  }
  const [notifications, setNotifications] = useState([]);
  const socket = useSelector((state) => state.websocket.socket);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    Promise.all([getRevenue(), getSalesStat(), getProfit()]).then((res) => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getChart();
  }, []);
  return (
    <div className="overflow-y-auto h-[calc(100vh-55px)] rounded  overflow-x-hidden">
      <div className="md:flex">
        <div className="md:w-[70%]">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[6px]    md:gap-3  grid-cols-1 md:p-2 p-[2px] ">
            <Tiles
              loading={loading}
              title={"Today's sales"}
              value={tileValues?.sales}
              onClick={() => {
                router.push(`/dashboard/${session?.user?.username}/sales`);
                // dispatch(
                //   emitEvent({
                //     eventName: "sendNotification",
                //     eventData: { to: "65164125694cb53789449e06" },
                //   })
                // );
              }}
              icon={
                // <Image src="/exchange.png" alt="sales" width={50} height={50} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 fill-pink-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.54 15h6.42l.5 1.5H8.29l.5-1.5zm8.085-8.995a.75.75 0 10-.75-1.299 12.81 12.81 0 00-3.558 3.05L11.03 8.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 001.146-.102 11.312 11.312 0 013.612-3.321z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />
            <Tiles
              loading={loading}
              value={tileValues?.revenue ?? 0}
              title={"Total Cash"}
              onClick={() => {
                router.push(
                  `/dashboard/${session?.user?.username}/finances/transactions`
                );
              }}
              content={"Showing the remaining stock"}
              icon={
                // <Image src="/money.png" alt="sales" width={50} height={50} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 fill-[#1308b0]"
                >
                  <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
                </svg>
              }
            />
            <Tiles
              loading={loading}
              value={tileValues?.credit ?? 0}
              title={"Credit Sales"}
              onClick={() => {
                router.push(
                  `/dashboard/${session?.user?.username}/finances/debtors`
                );
              }}
              content={"Showing the remaining stock"}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 fill-orange-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            />

            {session?.user?.role_code === "SA" && (
              <Menu position="bottom-end">
                <Menu.Target>
                  <Tiles
                    loading={loading}
                    title={"Profit"}
                    value={tileValues?.profit}
                    icon={
                      <div className="p-1 bg-green-100 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 stroke-green-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                          />
                        </svg>
                      </div>
                    }
                  />
                </Menu.Target>
                <Menu.Dropdown>Cash Credit</Menu.Dropdown>
              </Menu>
            )}
          </div>
          <div className="">
            <div className="  bg-white px-3 pt-2 rounded m-2 shadow ">
              {/* <BarChart /> */}
              <div className="font-semibold my-3">Sales Performance</div>
              <AreaCharts data={tileValues?.salesPerformance} />
            </div>
          </div>
        </div>
        <div className="md:w-[30%]">
          {/* <div className="flex justify-end">
            <Button label={"Quick Sale"} />
          </div> */}
          <div className="md:col-span-2 h-[40vh] bg-white p-3 rounded m-2 shadow ">
            <PieCharts />
          </div>
          <div className="md:col-span-2 h-[40vh] bg-white p-3 rounded m-2 shadow ">
            <div className="font-semibold">Top 10 Selling Products</div>
            <div className="space-y-4 mt-6">
              <div className="flex space-x-2 ">
                <span>Cement</span>
                <Range width={100} />
              </div>
              <div className="flex space-x-2 ">
                <span>Cement</span>
                <Range width={80} />
              </div>
              <div className="flex space-x-2 ">
                <span>Cement</span>
                <Range width={50} />
              </div>
              <div className="flex space-x-2 ">
                <span>Cement</span>
                <Range width={35} />
              </div>
              <div className="flex space-x-2 ">
                <span>Anyinam </span>
                <Range width={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
