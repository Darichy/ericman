import React from "react";
import CountUp from "react-countup";
import { Poppins } from "@next/font/google";
import { Skeleton, Stack } from "@mui/material";

const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});
function Tiles({ icon, title, content, onClick, color, value, loading }) {
  const textColor = `${color}`;
  return (
    <div
      onClick={onClick}
      className={`${poppins?.className} shadow-sm flex-1  items-center cursor-pointer border border-[#ebebeb] bg-white rounded-[0.6rem] p-2  hover:shadow-lg transition-all h-[90px]`}
    >
      <div className="flex h-full justify-between space-x-5">
        <div className="w-full flex flex-col h-full justify-between">
          <div className="flex justify-between items-start ">
            <div
              className={`uppercase font-[600]  text-[0.7rem] text-[#afadb8] `}
            >
              {title}
            </div>
            <div className="uppercase  text-[0.7rem] ">{icon}</div>
          </div>
          <div className="text-[1.5rem] font-bold text-black space-y-1">
            {value ? (
              <div className={`flex space-x-2 items-center `}>
                <span className=" text-sm  text-gray-500">GH&#8373;</span>{" "}
                <CountUp prefix="" end={value} decimals={2} />
              </div>
            ) : loading ? (
              <div className="  w-[70%]">
                <Stack className="pt-4" spacing={0.4}>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: "1rem", bgcolor: "grey.300" }}
                    height={5}
                    // height={60}
                  />
                  <Skeleton
                    sx={{ fontSize: "1rem", bgcolor: "grey.300" }}
                    animation="wave"
                    variant="rounded"
                    height={20}
                  />

                  {/* For other variants, adjust the size with `width` and `height` */}
                  {/* <Skeleton variant="circular" width={40} height={40} /> */}
                  {/* <Skeleton variant="rectangular" width={210} height={60} /> */}
                </Stack>
              </div>
            ) : (
              <div className={`flex space-x-2 items-center `}>
                <span className="text-sm text-gray-500">GH&#8373;</span>{" "}
                <CountUp prefix="" end={0} decimals={2} />
              </div>
            )}
            {/* <div className="text-xs font-[500] flex items-center text-gray-900 ">
              View report
              {"   "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </div> */}
          </div>
        </div>
        {/* <div>{icon}</div> */}
      </div>
    </div>
  );
}

export default Tiles;
