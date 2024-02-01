import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import { LoadingOverlay, Menu, Modal, useMantineTheme } from "@mantine/core";
import { Dialog, Snackbar } from "@mui/material";
import axios from "axios";
import Newcustomer from "@/components/NewCustomer";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useRouter } from "next/router";
import Datatable from "@/components/Datatable";
import { useSession } from "next-auth/react";
import useSnackbar from "@/hooks/useSnackbar";
import ViewDistribution from "../stocks/ViewDistribution";
import NewTransfer from "../stocks/NewTransfer";
import SaleDetails from "./SaleDetails";
import { DatePickerInput } from "@mantine/dates";
import InputField from "../InputField";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/constants";
import { poppins } from "@/layouts/AuthLayout";
import Filter from "../Filter";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";

export default function Debtors() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();
  const [saleDetails, setSaleDetails] = useState({ status: false });
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(false);
  const [date, setDate] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[date.getMonth()]?.toUpperCase();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    return `${day}-${month}-${year}, ${formattedHours}:${minutes}${amPm}`;
  }

  const arr = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "buyer_name",
      headerName: "Debtor",
      flex: 0.3,
      renderCell: ({ row }) => row?.sale?.buyer_name,
      // editable: true,
    },
    {
      field: "buyer_phone",
      headerName: "Phone",
      flex: 0.3,
      renderCell: ({ row }) => row?.sale?.buyer_phone,
      // editable: true,
    },
    {
      field: "Debt",
      headerName: "Debt",
      flex: 0.3,
      renderCell: ({ row }) =>
        formatCurrency(`${row?.sale?.amount_paid - row?.sale?.total_amount}`),
      // editable: true,
    },

    {
      field: "created_at",
      headerName: "Sale Date",
      // type: "number",
      // align: "right",
      flex: 0.3,
      renderCell: ({ row }) => formatDateTime(row?.created_at),
      // editable: true,
    },
    session?.user?.role_code === "SA"
      ? {
          field: "branch",
          headerName: "Branch",

          flex: 0.2,

          renderCell: ({ row }) => row?.sale?.branch?.name,
        }
      : undefined,
    {
      field: "Ds",
      headerName: "Debt Status",
      flex: 0.3,
      renderCell: ({ row }) => {
        return <Tag text={row?.status} />;
      },
      // editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      getActions: ({ row, id }) => {
        return [
          <div
            onClick={() => {
              setSaleDetails({ status: true, value: row?.id });
              console.log({ id });
            }}
            className="h-8 flex justify-center group hover:ring-[2px] ring-cyan-400 transition-all items-center cursor-pointer bg-gray-200 text-zinc-800 rounded-full my-3"
          >
            <div className="p-2 ">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 group-hover:scale-[1.18]  transition-all "
                >
                  <path d="M6 3a3 3 0 00-3 3v1.5a.75.75 0 001.5 0V6A1.5 1.5 0 016 4.5h1.5a.75.75 0 000-1.5H6zM16.5 3a.75.75 0 000 1.5H18A1.5 1.5 0 0119.5 6v1.5a.75.75 0 001.5 0V6a3 3 0 00-3-3h-1.5zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5zM4.5 16.5a.75.75 0 00-1.5 0V18a3 3 0 003 3h1.5a.75.75 0 000-1.5H6A1.5 1.5 0 014.5 18v-1.5zM21 16.5a.75.75 0 00-1.5 0V18a1.5 1.5 0 01-1.5 1.5h-1.5a.75.75 0 000 1.5H18a3 3 0 003-3v-1.5z" />
                </svg>
              </div>
            </div>
          </div>,
          // <div

          //   className="h-8 flex justify-center items-center cursor-pointer hover:scale-[1.1] transition-all rounded my-3"
          // >
          //   <div className="p-2 ">
          //     <div className="">
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
          //     </div>
          //   </div>
          // </div>,
        ];
      },
    },
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });

  const router = useRouter();
  async function getDebtors() {
    setLoading(true);
    const response = await axios.post("/api/cash/get-debtors");
    console.log(response, "ghana");
    setRefetch(!refetch);
    setLoading(false);
    setRows(response.data);
  }

  async function handleDeleteProduct(id) {
    const response = await axios.post("/api/stocks/delete-product", {
      id,
    });
    setShowDialog({
      status: false,
    });
    showAlert("", response.data.message);
    getTransfers();
  }

  async function handleDateChange(value) {
    setDate(value);
    if (!value.includes(null)) {
      setLoading(true);
      const response = await axios.post("/api/cash/get-debtors", {
        dateRange: value,
      });
      setRefetch(!refetch);
      setLoading(false);
      setRows(response.data.sales);
    }
  }

  useEffect(() => {
    getDebtors();
  }, [checked]);

  return (
    <div className="px-8  flex justify-center">
      <Modal
        title={<div className="uppercase p-2 font-semibold">DEBT DETAILS</div>}
        opened={saleDetails?.status}
        onClose={() => {
          setSaleDetails({ status: false });
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
        <DebtDetails id={saleDetails?.value} setChecked={setChecked} />
      </Modal>

      <div className="w-full mt-9  flex justify-center">
        <div className={`w-[90%]`}>
          <div className="my-2 flex justify-end ">
            <Filter
              rows={rows}
              setRows={setRows}
              refetch={refetch}
              filterOptions={["Debtor-sale.buyer_name", "Branch-branch.name"]}
              // onCloseDate={onCloseDate}
              dateFilter={{ value: date, onChange: handleDateChange }}
            />
          </div>

          <div className="bg-white   h-auto">
            <Datatable loading={loading} rows={rows} columns={columns} />
          </div>
        </div>
      </div>

      {/* <Dialog
        open={showDialog?.status}
        onClose={() => {
          setShowDialog({ status: false, content: "" });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="p-5 rounded ">
          Are you sure you want to delete user?.. <br /> This action cannot be
          reversed
          <div className="flex justify-end">
            <button
              onClick={() => {
                handleDeleteProduct(showDialog.content);
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

export function DebtDetails({ id, setChecked }) {
  const [details, setDetails] = useState();
  const [showPay, setShowPay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [sum, setSum] = useState(false);
  const [tBody, setTBody] = useState("");
  const showAlert = useSnackbar();
  const { data: session } = useSession();
  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "Item",
      headerName: "Item",
      flex: 0.3,
      renderCell: ({ row }) => row?.product?.name,
      // editable: true,
    },
    {
      field: "Unit",
      headerName: "Unit",
      flex: 0.3,
      renderCell: ({ row }) => row?.product?.unit,
      // editable: true,
    },
    {
      field: "Unit Price",
      headerName: "Unit Price",
      flex: 0.3,
      renderCell: ({ row }) => formatCurrency(`${row?.unit_price}`),
      // editable: true,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 0.3,
      renderCell: ({ row }) => row?.quantity,
      // editable: true,
    },
    {
      headerName: "Amount",
      flex: 0.3,
      renderCell: ({ row }) =>
        formatCurrency(`${row?.quantity * row?.unit_price}`),
      // editable: true,
    },
  ];
  async function getDebtDetails() {
    let init = 0;
    setLoading(true);
    const response = await axios.post("/api/cash/get-debtors", {
      key: "details",
      id,
    });
    console.log(response.data, id);
    setLoading(false);
    setDetails(response.data);
    const repayDOM = response?.data?.repayments?.map((i) => {
      init += i?.amount;
      return (
        <tr className="border-b h-6 text-xs">
          <td className="text-center">{formatDateTime(i?.date)}</td>
          <td className="text-center">{formatCurrency(i?.amount)}</td>
          <td className="flex space-x-2 justify-center">
            {/* <div
              onClick={() => {
                if (i?.date?.split("T")[0] !== formatDate(new Date())) {
                  return;
                }
                setShowPay({
                  status: true,
                });
                // console.log({ id });
              }}
              className={`${
                i?.date?.split("T")[0] !== formatDate(new Date())
                  ? "cursor-not-allowed "
                  : "cursor-pointer  hover:ring-[2px]"
              } flex justify-center group  ring-cyan-400 transition-all items-center  bg-gray-300 text-zinc-800 rounded-full`}
            >
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-4 h-4 ${
                      i?.date?.split("T")[0] !== formatDate(new Date())
                        ? "fill-gray-400"
                        : "group-hover:scale-[1.1] transition-all"
                    }  group-hover:scale-[1.18]  transition-all `}
                  >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                  </svg>
                </div>
              </div>
            </div> */}
            <div
              onClick={() => {
                if (
                  i?.date?.split("T")[0] !== formatDate(new Date()) ||
                  session?.user?.role_code === "SA"
                ) {
                  return;
                }
                setShowDialog({
                  status: true,
                  value: i,
                  type: "delRepayment",
                });
              }}
              className={`text-zinc-700 bg-gray-300 ${
                i?.date?.split("T")[0] !== formatDate(new Date()) ||
                session?.user?.role_code === "SA"
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
                      i?.date?.split("T")[0] !== formatDate(new Date())
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
            {/* <div
              onClick={() => {
                setShowDialog({
                  status: true,
                  type: "delRepayment",
                });
                // console.log({ id });
              }}
              className=" flex justify-center group hover:ring-[2px] ring-cyan-400 transition-all items-center cursor-pointer bg-gray-300 text-zinc-800 rounded-full my-3"
            >
              <div className="p-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 group-hover:scale-[1.18]  transition-all "
                >
                  <path d="M2 3a1 1 0 00-1 1v1a1 1 0 001 1h16a1 1 0 001-1V4a1 1 0 00-1-1H2z" />
                  <path
                    fillRule="evenodd"
                    d="M2 7.5h16l-.811 7.71a2 2 0 01-1.99 1.79H4.802a2 2 0 01-1.99-1.79L2 7.5zm5.22 1.72a.75.75 0 011.06 0L10 10.94l1.72-1.72a.75.75 0 111.06 1.06L11.06 12l1.72 1.72a.75.75 0 11-1.06 1.06L10 13.06l-1.72 1.72a.75.75 0 01-1.06-1.06L8.94 12l-1.72-1.72a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div> */}
          </td>
        </tr>
      );
    });

    setTBody(repayDOM);
    setSum(init);
  }
  useEffect(() => {
    getDebtDetails();
  }, []);

  async function handleRepayment() {
    try {
      if (
        parseFloat(showPay?.amount) >
        details?.sale?.total_amount - details?.sale?.amount_paid
      ) {
        showAlert("", "Amount is more than debt");
        return;
      }

      if (
        details?.repayments?.some(
          (i) => i?.date?.split("T")[0] == formatDate(new Date())
        )
      ) {
        showAlert("", "Modify previous amount paid to add same-day repayment");
        return;
      }

      // return;
      // alert(details?.sale?.total_amount);
      // return;
      setLoading(true);
      setShowPay({ status: false });
      const response = await axios.post("/api/cash/update-debt", {
        key: "pay-debt",
        id,
        amount: parseFloat(showPay?.amount),
      });
      showAlert("success", response?.data?.message);
      setChecked((prev) => !prev);
      getDebtDetails();
    } catch (error) {}
  }
  const [key, setKey] = useState();
  async function handleBadDebt(id) {
    try {
      setShowDialog({ status: false });

      setLoading(true);
      // setShowPay({ status: false });
      // return;
      const response = await axios.post("/api/cash/update-debt", {
        key,
        id,
        // amount: parseFloat(showPay?.amount),
      });
      showAlert("success", response?.data?.message);
      setChecked((prev) => !prev);
      getDebtDetails();
    } catch (error) {}
  }

  async function handleDelRepayment(repayment) {
    try {
      setShowDialog({ status: false });
      setLoading(true);

      const response = await axios.post("/api/cash/update-debt", {
        key: "delRepayment",
        id,
        repayment,
        // amount: parseFloat(showPay?.amount),
      });
      showAlert("success", response?.data?.message);
      getDebtDetails();
      setChecked((prev) => !prev);
    } catch (error) {}
  }

  return (
    <div className={`${poppins?.className} text-sm`}>
      <Modal
        // title={<div className="uppercase p-2 font-semibold">DEBT DETAILS</div>}
        opened={showPay?.status}
        onClose={() => {
          setShowPay({ status: false });
        }}
        centered
        // mt={"md"}
        closeOnClickOutside={false}
        size={"30%"}
        // overlayProps={{
        //   color:
        //     theme.colorScheme === "dark"
        //       ? theme.colors.dark[9]
        //       : theme.colors.gray[2],
        //   opacity: 0.55,
        //   blur: 3,
        // }}
      >
        <InputField
          label={"Enter amount "}
          onChange={(e) => {
            setShowPay((prev) => ({ ...prev, amount: e.target.value }));
          }}
        />
        <div className="my-2 flex justify-end">
          <Button onClick={handleRepayment} label={"Done"} />
        </div>
      </Modal>
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <div className="flex justify-between">
        <span>Sales summary ID : {details?.sale?.sale_id}</span>
        <Tag text={details?.status} />
      </div>
      <div className="flex justify-between space-x-6 text-gray-700 border text-xs rounded p-4">
        <div className="w-[45%]">
          <div className="flex  ">
            <span className="w-[40%] font-medium text-[#2d2d8e]">
              Customer Name:
            </span>
            <span className="w-[60%] text-end">
              {details?.sale?.buyer_name ?? "***"}
            </span>
          </div>
          <div className="flex  ">
            <span className="w-[50%] font-medium text-[#2d2d8e]">
              Initial Debit Balance:
            </span>
            <span className="w-[60%] text-end">
              {formatCurrency(
                `${
                  details?.sale?.amount_paid - details?.sale?.total_amount - sum
                }`
              )}
            </span>
          </div>

          <div className="flex  ">
            <span className="w-[40%] font-medium text-[#2d2d8e]">
              Discount:{" "}
            </span>
            <span className="w-[60%] text-end">
              {formatCurrency(`${details?.sale?.discount}`)}
            </span>
          </div>
        </div>
        <div className="w-[45%]">
          <div className="flex  ">
            <span className="w-[60%] font-medium text-[#2d2d8e]">
              Amount Paid:{" "}
            </span>
            <span className="w-[40%] text-green-500 text-end">
              {formatCurrency(`${details?.sale?.amount_paid}`)}
            </span>
          </div>
          <div className="flex  ">
            <span className="w-[60%] font-medium text-[#2d2d8e]">
              Current Debit Balance:
            </span>
            <span className="w-[40%] text-red-500 text-end">
              {formatCurrency(
                `${details?.sale?.amount_paid - details?.sale?.total_amount}`
              )}
            </span>
          </div>
          <div className="flex  ">
            <span className="w-[50%] font-medium text-[#2d2d8e]">
              Total Amount:
            </span>
            <span className="w-[60%] text-end font-semibold">
              {formatCurrency(`${details?.sale?.total_amount}`)}
            </span>
          </div>
        </div>
      </div>
      <div className="scale-[0.85] -my-2 -mx-14">
        <Datatable
          rows={details?.sale?.products ?? []}
          rowsPerPage={5}
          columns={columns}
        />
      </div>
      <hr className="mt-2 mb-1" />
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold ">Repayments :</span>{" "}
        <span className="font-medium text-blue-600 px-3 py-1 rounded bg-gray-200">
          {formatCurrency(sum)}
        </span>
      </div>
      <div className="h-40  p-2 my-1 max-h-[300px]  overflow-y-auto bg-gray-200 w-full rounded ">
        <div className="flex justify-center items-center ">
          {details?.repayments && details?.repayments?.length > 0 ? (
            details?.repayments?.length > 0 && (
              <table className="w-full text-xs">
                <tr>
                  <th>Date Paid</th>
                  <th>Amount Paid</th>
                  <th className="w-[90px]">Action</th>
                </tr>
                <tbody>{tBody}</tbody>
              </table>
            )
          ) : (
            <div className="animate-pulse text-gray-500">
              No repayments has been made yet
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-2 justify-end mt-2">
        {session?.user?.role_code === "SA" && details?.status !== "Paid" && (
          <Button
            label={
              details?.status == "BadDebt"
                ? "Revert Bad Debt"
                : "Mark as bad Debt"
            }
            onClick={() => {
              details?.status == "BadDebt"
                ? setKey("revert")
                : setKey("bad-debt");
              // console.log({ details });

              setShowDialog({ status: true });
            }}
          />
        )}
        {session?.user?.role_code !== "SA" && details?.status !== "BadDebt" && (
          <Button
            label={"Pay Debt"}
            onClick={() => {
              if (
                formatDate(new Date()) === details?.created_at?.split("T")[0]
              ) {
                showAlert(
                  "",
                  "Please edit sales to record same-day repayments"
                );
              } else {
                setShowPay({ status: true });
              }
            }}
          />
        )}
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
          <div className="p-5  py-3 rounded">
            {showDialog?.type === "delRepayment" ? (
              <span>
                Are you sure you want to delete repayment?.. <br />
                <span className="font-bold text-gray-700">NB:</span> This action
                cannot be reversed
              </span>
            ) : key == "revert" ? (
              <span>Are you sure you want to revert bad debt?</span>
            ) : (
              <span>Are you sure you want to mark this debt as bad debt?</span>
            )}
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
                  if (showDialog?.type !== "delRepayment") {
                    handleBadDebt(id);
                  } else {
                    handleDelRepayment(showDialog?.value);
                  }
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
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className={`${poppins?.className} text-sm p-5 rounded `}>
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
