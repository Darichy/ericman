import { poppins } from "@/layouts/AuthLayout";
import React from "react";

export default function NotificationDetails({ type, onView }) {
  return (
    <div
      className={`${poppins.className}  p-2 text-sm border-2 rounded shadow max-h-[120px] min-h-[100px]`}
    >
      <div className="flex min-h-[80px]">
        <div className="w-[20%]">
          {type === "Distribution" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
          ) : (
            "Image"
          )}
        </div>
        <div className="flex-grow">
          {type === "Distribution"
            ? "New goods are being supplied to you"
            : "ghana"}
        </div>
      </div>
      <div className="flex space-x-2 justify-end">
        <button
          onClick={onView}
          className="bg-zinc-800 text-white  py-[3px] px-[10px] rounded"
        >
          view
        </button>
        {/* <button className="bg-emerald-600 text-white  py-[3px] px-[6px] rounded">
          Confirm
        </button>
        <button className="bg-red-600 text-white  py-[3px] px-[6px] rounded">
          Reject
        </button> */}
      </div>
    </div>
  );
}
