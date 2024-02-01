import { poppins } from "@/layouts/AuthLayout";
import { Menu } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { Checkbox, Switch } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function Filter({
  setRows,
  rows,
  filterOptions,
  refetch,
  dateFilter,
  onCloseDate,
}) {
  const [selectedFilter, setSelectedFilter] = useState();
  const [date, setDate] = useState();
  const [originalRows, setOriginalRows] = useState([]);
  useEffect(() => {
    setOriginalRows(rows);

    setSelectedFilter(filterOptions[0]?.split("-")[1]);
  }, [refetch]);

  function handleSearch(pattern) {
    if (pattern) {
      function getNestedValue(obj, keys) {
        return keys.reduce(
          (acc, k) => (acc && acc[k] ? acc[k] : undefined),
          obj
        );
      }

      return originalRows.filter((row) => {
        const keys = selectedFilter.split(".");
        const value = getNestedValue(row, keys);
        return (
          value !== undefined &&
          new RegExp(pattern.toLowerCase()).test(value.toLowerCase())
        );
      });
    } else {
      return originalRows;
    }
  }

  return (
    <div className="flex md:flex-row flex-col justify-between space-x-2">
      {date?.show && (
        <DatePickerInput
          placeholder="Pick a date or date range"
          className={`bg-white text-lg border rounded ${poppins?.className}`}
          type="range"
          // style={{ height: "20px" }}

          allowSingleDateInRange
          value={dateFilter?.value}
          onChange={dateFilter?.onChange}
          size="xs"
        />
      )}
      <div className="flex space-x-1 mt-1 md:mt-0">
        <div className="relative  ">
          <input
            onChange={(e) => {
              const filtered = handleSearch(e.target.value);
              setRows(filtered);
              console.log({ filtered, originalRows });
            }}
            type="text"
            placeholder="Search.."
            className=" border-[1.5px] focus:ring-1 focus:ring-blue-500 transition-all bg-white w-full font-thin focus:outline-none border-gray-300 rounded py-[5px] pl-8"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 absolute left-2 top-[6px] stroke-gray-400 text-gray-700 z-10 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <Menu position="bottom-end">
          <Menu.Target>
            <button className="rounded border-2 text-gray-500 bg-white px-2 flex items-center space-x-2">
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
                  d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                />
              </svg>
              <span>Filter</span>
            </button>
          </Menu.Target>
          <Menu.Dropdown className={`${poppins?.className} z-50`}>
            {filterOptions?.map((i, key) => (
              // <Menu.Item className="divide-y-2">
              <div
                className={`${poppins?.className} flex px-2 py-1 ${
                  key !== filterOptions?.length - 1 ? "border-b" : ""
                } justify-between space-x-2 `}
              >
                <span>{i?.split("-")[0]?.trim()}</span>
                <Switch
                  size="small"
                  //   disabled={formData?.type !== "OTHER"}
                  checked={selectedFilter == i?.split("-")[1]?.trim()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFilter(i?.split("-")[1]?.trim());
                    }
                  }}
                  // inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
              // </Menu.Item>
            ))}
            {dateFilter && (
              <div
                className={`${poppins?.className} flex px-2 py-1 items-center border-t  justify-between space-x-2 `}
              >
                Filter by date
                <Checkbox
                  checked={date?.show}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setDate((prev) => ({ ...prev, show: true }));
                    } else {
                      setDate((prev) => ({ ...prev, show: false }));
                      if (onCloseDate) {
                        onCloseDate();
                      }
                    }
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </div>
            )}
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
}
