import React, { useEffect, useState } from "react";
import Datatable from "../Datatable";
import axios from "axios";
import { useSession } from "next-auth/react";
import Button from "../Button";
import useSnackbar from "@/hooks/useSnackbar";
import { Dialog, Skeleton } from "@mui/material";
import { poppins } from "@/layouts/AuthLayout";
import { LoadingOverlay } from "@mantine/core";
import { useDispatch } from "react-redux";
import { emitEvent } from "@/store/websocketSlice";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";

export default function ViewDistribution({
  supply_id,
  toggleModals,
  distro_by,
  viewAs,
}) {
  const [rows, setRows] = useState([]);
  const [prodSum, setProdSum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sender, setSender] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false });
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  const dispatch = useDispatch();
  const arr = [
    {
      field: "name",
      headerName: "Item",
      flex: 1,
      renderCell: ({ row }) => row?.product?.name,
    },
    {
      field: "unit",
      headerName: "Units",
      flex: 1,
      renderCell: ({ row }) => row?.product?.unit,
    },
    {
      field: "selling_price",
      headerName: "Selling price",
      flex: 1,
    },
    // {
    //   field: "calc_cost_price",
    //   headerName: "Calculated Unit Cost",
    //   flex: 1,
    // },
    {
      field: "quantity",
      headerName: "Quantity Supplied",
      flex: 1,
    },
    session?.user?.role_code === "SA" || session?.user?.role_code === "A"
      ? {
          field: "branch_code",
          headerName: "Branch",
          width: 150,
          // role: "SA",
          filterable: true,
          renderCell: (param) => {
            return param.row.branch?.name;
          },
        }
      : undefined,

    {
      field: "Status",
      headerName: "Status",
      flex: 1,

      renderCell: ({ row, id }) => {
        return <Tag text={row?.status} />;
        // if (row.status === "NONE") {
        //   return (
        //     <div className="bg-zinc-300 rounded p-[1.5px] text-xs">
        //       Unconfirmed
        //     </div>
        //   );
        // } else if (row.status === "CONFIRMED") {
        //   return (
        //     <div className="bg-green-300 rounded p-[1.5px] text-xs">
        //       Confirmed
        //     </div>
        //   );
        // }
      },
    },
    // session?.user?.role_code === "S"
    //   ? {
    //       field: "Action",
    //       headerName: "Action",
    //       flex: 1,

    //       renderCell: ({ row, id }) => {
    //         if (row?.status === "NONE") {
    //           return (
    //             <div className="flex space-x-3">
    //               <div
    //                 onClick={() => {
    //                   confirmDistro(row?.id);
    //                 }}
    //                 className="bg-green-500 rounded p-[1.5px] text-sm"
    //               >
    //                 Confirm
    //               </div>
    //               <div className="bg-red-300 rounded p-[1.5px] text-sm">
    //                 Reject
    //               </div>
    //             </div>
    //           );
    //         }
    //       },
    //     }
    //   : undefined,
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });

  async function confirmDistro() {
    setShowDialog({ status: false });
    try {
      setLoading(true);
      const response = await axios.post("/api/stocks/add-supply", {
        key: "confirm",
        distributions: rows,
        sender: sender,
      });

      showAlert("success", response?.data?.message);
      dispatch(
        emitEvent({
          eventName: "sendNotification",
          eventData: {
            sender: session?.user?.username,
            to: sender,
          },
        })
      );
      setLoading(false);
      getDetails();
    } catch (error) {
      // console.log({ error }, "oo");
      showAlert("", "Something went wrong");
    }
  }

  async function rejectDistro() {
    setShowDialog({ status: false });
    try {
      setLoading(true);
      const response = await axios.post("/api/stocks/add-supply", {
        key: "reject",
        distributions: rows,
        sender: sender,
      });

      showAlert("success", response?.data?.message);
      dispatch(
        emitEvent({
          eventName: "sendNotification",
          eventData: {
            sender: session?.user?.username,
            to: sender,
          },
        })
      );
      setLoading(false);
      getDetails();
    } catch (error) {
      // console.log({ error }, "oo");
      showAlert("", "Something went wrong");
    }
  }
  function getDetails() {
    setLoading(true);
    axios
      .post("/api/stocks/get-supplies", {
        supply_id,
        branch_id: session?.user?.branch_id,
        viewAs,
      })
      .then((response) => {
        console.log(response, "pp");
        setLoading(false);
        setSender(response.data?.sender);
        setProdSum(response.data?.products);
        setRows(response.data?.distributions);
        // setStatus(response.data.status);
      });
  }
  useEffect(() => {
    getDetails();
  }, []);

  return (
    <>
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />

      <div className={`${poppins?.className}  text-gray-600 text-[0.85rem]`}>
        {(session?.user?.role_code === "SA" ||
          (session?.user?.role_code === "A" && viewAs === "admin")) && (
          <div className="px-4 mb-7">
            <div className="font-semibold ">TOTAL GOODS SUPPLIED</div>
            <div className=" border  p-2  rounded max-h-[200px] ">
              <table className="w-full">
                <tr className="font-medium text-[#2d2d8e]">
                  <th>Product</th>
                  <th>Unit</th>
                  <th>Unit Cost</th>
                  <th>Quantity</th>
                </tr>
                {prodSum?.map((i) => (
                  <tr className="text-center">
                    <td>{i.product}</td>
                    <td>{i.unit}</td>
                    <td>{i.unit_cost}</td>
                    <td>{i.quantity}</td>
                  </tr>
                ))}
              </table>
            </div>
          </div>
        )}
        <div className="px-4">
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold">
              {session?.user?.role_code === "S" ? "" : "SUPPLY BREAKDOWN"}
            </span>
            {/* {selectedRows?.length > 0 && ( */}

            {session?.user?.role_code !== "SA" &&
              viewAs !== "admin" &&
              rows?.every((i) => i.status === "NONE") && (
                <div className="flex space-x-2 my-2 justify-end">
                  <Button
                    label={"Reject"}
                    onClick={() => {
                      setShowDialog({ status: true, type: "R" });
                    }}
                  />
                  <Button
                    label={"Confirm"}
                    onClick={() => {
                      setShowDialog({ status: true, type: "C" });
                    }}
                  />
                </div>
              )}
            {session?.user?.id === distro_by &&
              rows?.some((i) => i?.status === "REJECTED") && (
                <div className="my-2">
                  <Button label={"Edit Supplies"} onClick={toggleModals} />
                </div>
              )}
          </div>
          <Datatable
            rows={rows}
            columns={columns}
            // checkboxSelection={session?.user?.role_code !== "S" ? true : false}
            // onRowSelection={(v) => {
            //   // console.log({ v });
            //   setSelectedRows(v);
            // }}
            // selectedRows={selectedRows}
          />
        </div>
        <Dialog
          open={showDialog?.status}
          onClose={() => {
            setShowDialog({ status: false, content: "" });
          }}
        >
          <div className={`${poppins?.className} text-sm `}>
            <div className="flex  justify-center mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-14 h-14 bg-gray-300 group-hover:scale-[1.1] transition-all rounded-full p-3"
              >
                <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
              </svg>
            </div>
            <div className="p-5  py-3 rounded ">
              Are you sure you want to{" "}
              {showDialog?.type == "R" ? (
                <span className="text-red-600">reject</span>
              ) : (
                <span className="text-green-600">confirm</span>
              )}{" "}
              supply?.. <br />
              <span className="font-bold text-gray-700">NB:</span> This action
              cannot be reversed
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="bg-gray-200 p-1 px-4 text-black hover:scale-[1.02] hover:ring-1 ring-zinc-400 transition-all rounded"
                  onClick={() => {
                    setShowDialog({ status: false, content: "" });
                  }}
                >
                  No
                </button>
                <button
                  className="bg-red-500 p-1 px-4 hover:scale-[1.02] hover:ring-1 ring-red-400 transition-all text-white rounded"
                  onClick={() => {
                    showDialog?.type == "R" ? rejectDistro() : confirmDistro();
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
}
