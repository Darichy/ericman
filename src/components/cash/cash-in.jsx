import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import { Modal, useMantineTheme } from "@mantine/core";
import NewUser from "@/components/users/NewUser";

import { Dialog, Snackbar } from "@mui/material";
import axios from "axios";
import Newcustomer from "@/components/NewCustomer";
import Datatable from "@/components/Datatable";
import useSnackbar from "@/hooks/useSnackbar";
import CashInForm from "./CashInForm";
import { useSession } from "next-auth/react";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/constants";
import Filter from "../Filter";
import { DebtDetails } from "../sales/Debtors";
import { poppins } from "@/layouts/AuthLayout";
// import { formatDate1 } from "@/pages/dashboard/[userId]/sales";

export default function CashIn() {
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();
  const [showModal, setShowModal] = useState({ status: false, type: "" });
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [showtype, setShowtype] = useState(false);
  const [customerData, setCustomerData] = useState({});
  const [checked, setChecked] = useState(true);
  const [date, setDate] = useState([]);
  const showAlert = useSnackbar();
  const { data: session } = useSession();
  const arr = [
    {
      field: "type",
      headerName: "Type of income",
      flex: 0.5,
      renderCell: ({ row, id }) => {
        if (row?.type === "BF") {
          return "B/F";
        } else {
          if (row?.type?.includes("PaidD")) {
            return "Paid Debt";
          }
        }
      },
    },
    {
      field: "io",
      headerName: "Income/Expense",
      flex: 0.5,
      renderCell: ({ row, id }) => {
        if (row?.io === "I") {
          return (
            <div className="flex justify-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-green-600 bg-green-200 p-[2px] rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                />
              </svg>
            </div>
          );
        } else {
          return (
            <div className="flex justify-center w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 stroke-red-600 bg-red-200 p-[2px] rounded-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
                />
              </svg>
            </div>
          );
        }
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
      renderCell: ({ row, id }) =>
        row?.description ? (
          row?.description
        ) : (
          <div className="text-lg font-semibold">*****</div>
        ),
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.3,
      renderCell: ({ row, id }) => formatCurrency(row.amount),
    },
    session?.user?.role_code === "SA"
      ? {
          field: "branch",
          headerName: "Branch",
          flex: 0.3,
        }
      : undefined,
    {
      field: "date",
      headerName: "Date",
      width: 150,
      renderCell: ({ row }) => row?.date && formatDateTime(row?.date),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",

      renderCell: ({ row, id }) => {
        // console.log({ row, d: formatDate(new Date()) });
        // if (row?.date?.split("T")[0] !== formatDate(new Date())) {
        return (
          <div className="flex space-x-1">
            <div
              onClick={() => {
                if (
                  row?.date?.split("T")[0] !== formatDate(new Date()) ||
                  row?.type?.includes("SALES") ||
                  row?.type?.includes("PaidD") ||
                  row?.type?.includes("BF") ||
                  session?.user?.role_code == "SA"
                ) {
                  return;
                }
                setShowModal({ status: true, type: "edit" });
                setCustomerData(rows[id]);
              }}
              className={`text-zinc-700 bg-gray-300 ${
                row?.date?.split("T")[0] !== formatDate(new Date()) ||
                row?.type?.includes("SALES") ||
                row?.type?.includes("PaidD") ||
                row?.type?.includes("BF") ||
                session?.user?.role_code == "SA"
                  ? "cursor-not-allowed "
                  : "cursor-pointer  hover:ring-[2px]"
              }   h-8 flex justify-center items-center group ring-cyan-500   rounded-full `}
            >
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 group-hover:scale-[1.18]  transition-all ${
                      row?.date?.split("T")[0] !== formatDate(new Date()) ||
                      row?.type?.includes("SALES") ||
                      row?.type?.includes("PaidD") ||
                      row?.type?.includes("BF") ||
                      session?.user?.role_code == "SA"
                        ? "stroke-gray-400"
                        : "group-hover:scale-[1.1] transition-all"
                    } `}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                if (
                  row?.date?.split("T")[0] !== formatDate(new Date()) ||
                  row?.type?.includes("SALES") ||
                  row?.type?.includes("PaidD") ||
                  row?.type?.includes("BF") ||
                  session?.user?.role_code == "SA"
                ) {
                  return;
                }
                setShowDialog({
                  status: true,
                  content: rows[id]?.id,
                });
              }}
              className={`text-zinc-700 bg-gray-300 ${
                row?.date?.split("T")[0] !== formatDate(new Date()) ||
                row?.type?.includes("SALES") ||
                row?.type?.includes("PaidD") ||
                row?.type?.includes("BF") ||
                session?.user?.role_code == "SA"
                  ? "cursor-not-allowed "
                  : "cursor-pointer  hover:ring-[2px]"
              }   h-8 flex justify-center items-center group ring-red-500   rounded-full `}
            >
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-4 h-4 group-hover:scale-[1.18]  transition-all ${
                      row?.date?.split("T")[0] !== formatDate(new Date()) ||
                      row?.type?.includes("SALES") ||
                      row?.type?.includes("PaidD") ||
                      row?.type?.includes("BF") ||
                      session?.user?.role_code == "SA"
                        ? "fill-gray-400"
                        : "group-hover:scale-[1.1] transition-all"
                    } `}
                  >
                    <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                    <path
                      fillRule="evenodd"
                      d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.133 2.845a.75.75 0 011.06 0l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06L12 15.685l-1.72 1.72a.75.75 0 11-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                if (
                  row?.date?.split("T")[0] !== formatDate(new Date()) ||
                  row?.type?.includes("SALES") ||
                  row?.type?.includes("BF") ||
                  session?.user?.role_code == "SA"
                ) {
                  return;
                }
                // setShowDialog({
                //   status: true,
                //   content: rows[id]?.id,
                // });
              }}
              className={`text-zinc-700 bg-gray-300 ${
                row?.date?.split("T")[0] !== formatDate(new Date()) ||
                row?.type?.includes("BF")
                  ? "cursor-not-allowed "
                  : "cursor-pointer  hover:ring-[2px]"
              }   h-8 flex justify-center items-center group ring-green-500   rounded-full `}
            >
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`w-4 h-4 group-hover:scale-[1.18]  transition-all ${
                      row?.date?.split("T")[0] !== formatDate(new Date()) ||
                      row?.type?.includes("BF")
                        ? "stroke-gray-400"
                        : "group-hover:scale-[1.1] transition-all"
                    } `}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

        // label="Delete"
        // onClick={() => {}}
        // color="inherit"

        // else if (row?.type?.includes("PaidD")) {
        //   return [
        //     <div
        //       onClick={() => {
        //         // if (row.type !== "SALES") {
        //         setShowtype({ status: true, type: "PaidD", id: row?.type_id });
        //       }}
        //       className={`${
        //         row.type === "SALES"
        //           ? "cursor-not-allowed text-gray-400 hover:bg-gray-400"
        //           : "cursor-pointer "
        //       }"h-8 flex justify-center items-center  rounded my-3"`}
        //     >
        //       <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         fill="none"
        //         viewBox="0 0 24 24"
        //         strokeWidth={1.5}
        //         stroke="currentColor"
        //         className="w-6 h-6"
        //       >
        //         <path
        //           strokeLinecap="round"
        //           strokeLinejoin="round"
        //           d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        //         />
        //       </svg>
        //     </div>,
        //   ];
        // }
        //  else {
        //   return [
        //     <div
        //       onClick={() => {
        //         if (row.type !== "SALES") {
        //           setShowModal({ status: true, type: "edit" });
        //           setCustomerData(rows[id]);
        //         }
        //       }}
        //       className={`${
        //         row.type === "SALES"
        //           ? "cursor-not-allowed text-gray-400 hover:bg-gray-400"
        //           : "cursor-pointer "
        //       }"h-8 flex justify-center items-center  rounded my-3"`}
        //     >
        //       <svg
        //         xmlns="http://www.w3.org/2000/svg"
        //         fill="none"
        //         viewBox="0 0 24 24"
        //         strokeWidth={1.5}
        //         stroke="currentColor"
        //         className="w-6 h-6"
        //       >
        //         <path
        //           strokeLinecap="round"
        //           strokeLinejoin="round"
        //           d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        //         />
        //       </svg>
        //     </div>,
        //     <div
        //       onClick={() => {
        //         if (row.type !== "SALES") {
        //           setShowDialog({
        //             status: true,
        //             content: rows[id]?.id,
        //           });
        //         }
        //       }}
        //       className={`${
        //         row.type === "SALES"
        //           ? "cursor-not-allowed "
        //           : "cursor-pointer bg-red-300 hover:bg-red-400"
        //       }"h-8 flex justify-center items-center  rounded my-3"`}
        //     >
        //       <div className="p-2 ">
        //         <div className="">
        //           <svg
        //             xmlns="http://www.w3.org/2000/svg"
        //             fill="none"
        //             viewBox="0 0 24 24"
        //             strokeWidth={1.5}
        //             stroke="currentColor"
        //             className={`${
        //               row.type === "SALES" ? "stroke-gray-400" : ""
        //             } w-6 h-6 stroke-gray-200"`}
        //           >
        //             <path
        //               strokeLinecap="round"
        //               strokeLinejoin="round"
        //               d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
        //             />
        //           </svg>
        //         </div>
        //       </div>
        //     </div>,

        //     // label="Delete"
        //     // onClick={() => {}}
        //     // color="inherit"
        //   ];
        // }
      },
    },
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });

  function formatDate1(dateString) {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  async function getTransactions() {
    setLoading(true);
    const response = await axios.post("/api/cash/get-transactions", {
      branch_code: session?.user?.branch_code,
    });
    setRefetch(!refetch);
    setLoading(false);
    setRows(response.data);
  }

  async function handleDeleteTrans(id) {
    if (id) {
      setShowDialog({
        status: false,
        content: "",
      });
      setLoading(true);
      const response = await axios.post("/api/cash/delete-transaction", {
        id,
      });

      showAlert("success", response.data.message);
      getTransactions();
    }
  }

  useEffect(() => {
    getTransactions();
  }, [checked]);

  // console.log({ users });
  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  async function handleDateChange(value) {
    setDate(value);
    if (!value.includes(null)) {
      setLoading(true);
      const response = await axios.post("/api/cash/get-transactions", {
        dateRange: value,
      });
      setRefetch(!refetch);
      setLoading(false);
      setRows(response.data);
    }
  }

  console.log(
    [{ type: "BF" }]?.some((i) => i?.type == "BF"),
    "iii"
  );
  function onCloseDate() {
    // setFilters(false);
    setDate([]);
    setChecked(!checked);
  }

  return (
    <div className="md:px-24 px-3  flex justify-center">
      <Modal
        title={
          <div className="uppercase font-semibold">
            {showModal.type !== "edit" ? "Add Transaction" : "Edit Transaction"}
          </div>
        }
        opened={showModal.status}
        onClose={() => {
          setShowModal({ status: false, type: "" });
        }}
        closeOnClickOutside={false}
        size={"40%"}
        // overlayProps={{
        //   color:
        //     theme.colorScheme === "dark"
        //       ? theme.colors.dark[9]
        //       : theme.colors.gray[2],
        //   opacity: 0.55,
        //   blur: 3,
        // }}
      >
        <CashInForm
          cash={customerData}
          showModal={showModal}
          setShowModal={setShowModal}
          setChecked={setChecked}
        />
      </Modal>
      <Modal
        title={
          <div className="uppercase font-semibold">
            {showtype.type === "PaidD" ? "Debt Details" : ""}
            {/* {showModal.io == "I" && showModal.type !== "edit"
              ? "Add Income"
              : showModal.io == "I" && showModal.type == "edit"
              ? "Edit Income"
              : showModal.io == "O" && showModal.type !== "edit"
              ? "Add Cash Out"
              : showModal.io == "O" && showModal.type == "edit"
              ? "Edit Cash Out"
              : ""} */}
          </div>
        }
        opened={showtype.status}
        onClose={() => {
          setShowtype({ status: false, type: "" });
        }}
        closeOnClickOutside={false}
        size={"50%"}
        // overlayProps={{
        //   color:
        //     theme.colorScheme === "dark"
        //       ? theme.colors.dark[9]
        //       : theme.colors.gray[2],
        //   opacity: 0.55,
        //   blur: 3,
        // }}
      >
        <DebtDetails id={showtype?.id} />
      </Modal>
      <div className="w-full flex justify-center relative">
        <div className="flex absolute top-3   left-3/5  items-center justify-center space-x-1">
          <span className="font-semibold text-gray-500 uppercase">
            Total Cash :{" "}
          </span>
          <div className="border-2 rounded px-3 py-1 border-green-600 bg-green-50">
            {" "}
            GH&#8373;{" "}
            {formatCurrency(rows?.reduce((ac, i) => (ac += i?.amount), 0))}
          </div>
        </div>
        <div className="w-[100%]">
          {session?.user?.role_code !== "SA" && (
            <div className={` flex justify-between border-b-2 p-2`}>
              {date?.length <= 0 ? (
                rows?.some((i) => i?.type == "BF") ? (
                  <div className="mr-[180px]">&nbsp;</div>
                ) : (
                  <div className="flex  items-center justify-between ">
                    <div className="bg-yellow-50 border border-yellow-400 space-x-3 text-xs  flex items-center justify-center p-[4.5px] rounded text-gray-500 ">
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
                      <span className="hidden md:block">
                        You have not recorded Brought Forward for Today
                      </span>
                    </div>
                    {/* {status === "NONE" &&
                      session?.user?.branch_id !== t_branch && (
                        <div className="flex space-x-2 my-2 justify-end">
                          <Button label={"Reject"} />
                          <Button label={"Confirm"} onClick={confirmTransfer} />
                        </div>
                      )} */}
                  </div>
                )
              ) : (
                <div className="mr-40">&nbsp;</div>
              )}

              <Button
                onClick={() => {
                  setShowModal({ status: true, type: "" });
                }}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                }
                label={"Add Transaction"}
                width={100}
              />
            </div>
          )}
          <div
            className={` ${
              session?.user?.role_code === "SA" ? "mt-[55px]" : ""
            } my-2 flex  md:flex-row md:items-center flex-col-reverse justify-between `}
          >
            <div className="md:text-lg font-semibold text-gray-500">
              Showing results for{" "}
              <span className="text-indigo-700">
                {" "}
                {`${
                  date?.length > 0
                    ? `${formatDate1(date[0])} - ${formatDate1(date[1])} `
                    : "Today's"
                }`}
              </span>{" "}
              Transactions
            </div>
            <Filter
              rows={rows}
              setRows={setRows}
              refetch={refetch}
              filterOptions={
                session?.user?.role_code === "SA"
                  ? [
                      "Transaction type-type",
                      "Description-description",
                      "Branch-branch",
                    ]
                  : ["Transaction type-type", "Description-description"]
              }
              onCloseDate={onCloseDate}
              dateFilter={{ value: date, onChange: handleDateChange }}
            />
          </div>
          <div className={` bg-white rounded-sm shadow   h-auto`}>
            <Datatable rows={rows} columns={columns} loading={loading} />
          </div>
        </div>
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
              <path
                fillRule="evenodd"
                d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="p-5  py-3 rounded ">
            Are you sure you want to delete transaction?.. <br />
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
                  handleDeleteTrans(showDialog.content);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* <Dialog
        open={showDialog?.status}
        onClose={() => {
          setShowDialog({ status: false, content: "" });
        }}
      >
        <div className="p-5 py-6 rounded ">
         
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className="bg-gray-400 p-1 px-4 text-white rounded"
              onClick={() => {
                setShowDialog({ status: false, content: "" });
              }}
            >
              No
            </button>
            <button
              className="bg-red-500 p-1 px-4 text-white rounded"
              onClick={() => {
                handleDeleteTrans(showDialog.content);
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Dialog> */}
    </div>
  );
}
