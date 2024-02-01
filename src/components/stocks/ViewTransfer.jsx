import React, { useEffect, useState } from "react";
import Datatable from "../Datatable";
import axios from "axios";
import { useSession } from "next-auth/react";
import Button from "../Button";
import useSnackbar from "@/hooks/useSnackbar";
import { Skeleton } from "@mui/material";
import { poppins } from "@/layouts/AuthLayout";
import { LoadingOverlay } from "@mantine/core";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";

export default function ViewTransfer({
  transfer_id,
  setShowModal,
  setChecked,
  t_branch,
  status,
}) {
  const [rows, setRows] = useState([]);
  const [transDetails, setTransDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [checked, setChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const { data: session } = useSession();
  const showAlert = useSnackbar();
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
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    // session?.user?.role_code === "SA" || session?.user?.role_code === "A"
    //   ? {
    //       field: "branch_code",
    //       headerName: "Branch",
    //       width: 150,
    //       // role: "SA",
    //       filterable: true,
    //       renderCell: (param) => {
    //         return param.row.branch?.name;
    //       },
    //     }
    //   : undefined,

    // session?.user?.role_code === "S"
    //   ? {
    //       field: "Action",
    //       headerName: "Action",
    //       flex: 1,

    //       renderCell: ({ row, id }) => {
    //         if (row?.transDetails === "NONE") {
    //           return (
    //             <div className="flex space-x-3">
    //               <div
    //                 onClick={() => {
    //                   confirmTransfer(row?.id);
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

  async function rejectTransfer() {
    try {
      setLoading(true);
      const response = await axios.post("/api/stocks/reject-transfer", {
        // key: "reject",
        // products: rows,
        id: transfer_id,
        // trans_branch: transDetails?.createdBy?.branch_id,
        receiving_branch: transDetails?.createdBy?.branch_id,
      });
      setLoading(true);

      showAlert("success", response?.data?.message);
      setChecked((prev) => !prev);
      setShowModal(false);
    } catch (error) {
      showAlert("", "Something went wrong");
    }
  }

  async function confirmTransfer() {
    try {
      setLoading(true);
      const response = await axios.post("/api/stocks/create-transfer", {
        key: "confirm",
        products: rows,
        id: transfer_id,
        trans_branch: transDetails?.createdBy?.branch_id,
        receiving_branch: transDetails?.receiving_branch,
      });
      setLoading(true);

      showAlert("success", response?.data?.message);
      setChecked((prev) => !prev);
      setShowModal(false);
    } catch (error) {
      showAlert("", "Something went wrong");
    }
  }
  useEffect(() => {
    setLoading(true);
    axios
      .post("/api/stocks/get-transfers", {
        id: transfer_id,
      })
      .then((response) => {
        console.log(response, "pp");
        setLoading(false);
        setTransDetails(response?.data);
        setRows(response.data?.products);
        // setTransDetails(response.data.status);
      });
  }, []);
  return (
    <>
      <div className={`${poppins?.className} text-sm`}>
        <LoadingOverlay
          loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
          visible={loading}
          overlayBlur={2}
        />
        <div className="flex justify-end px-4">
          <Tag text={status} />
        </div>
        <div className="px-4">
          {status === "NONE" &&
            session?.user?.branch_id !== t_branch &&
            session?.user?.role_code !== "SA" && (
              <div className="flex space-x-2 items-center my-2 justify-between">
                <div className="flex items-center justify-between ">
                  <div className="bg-yellow-50 border border-yellow-400 space-x-3 text-xs  flex items-center justify-center p-[6px] rounded text-gray-500 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 fill-yellow-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Correctly verify the quantities transferred before
                      confirming
                    </span>
                  </div>
                </div>
                <div className="space-x-4">
                  <Button label={"Reject"} onClick={rejectTransfer} />
                  <Button label={"Confirm"} onClick={confirmTransfer} />
                </div>
              </div>
            )}
          <div className="scale-[0.95] -mx-5">
            <Datatable
              rows={rows}
              columns={columns}
              // checkboxSelection={session?.user?.role_code === "S" ? true : false}
              // onRowSelection={(v) => {
              //   // console.log({ v });
              //   setSelectedRows(v);
              // }}
              // selectedRows={selectedRows}
            />
          </div>
        </div>
      </div>
    </>
  );
}
