import React from "react";

export default function LineGraph({ data }) {
  return (
    <div className="bg-gray-300 flex w-full rounded-full  h-2 overflow-hidden">
      <div
        className="bg-green-500 border-r border-white "
        style={{ width: `${data.C}%` }}
      >
        &nbsp;
      </div>
      <div className="bg-red-500  " style={{ width: `${data.R}%` }}>
        &nbsp;
      </div>
    </div>
  );
}
