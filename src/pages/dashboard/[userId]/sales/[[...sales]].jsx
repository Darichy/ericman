import NewSale from "@/components/sales/NewSales";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
const CatchAllPage = () => {
  const router = useRouter();
  const { sales } = router.query;
  const { data: session } = useSession();
  const [route, setRoute] = useState(
    `/dashboard/${session?.user?.username}/sales`
  );
  return (
    <div>
      {/* <div className="flex justify-center">
        <SegmentedControl
          value={route}
          onChange={(value) => {
            setRoute(value);
            router.push(value);
          }}
          className="bg-zinc-300"
          data={[
            {
              label: "Sales",
              value: `/dashboard/${session?.user?.username}/sales`,
            },
            {
              label: "Debtors",
              value: `/dashboard/${session?.user?.username}/sales/debtors`,
            },
            // {
            //   label: "Transfers",
            //   value: `/dashboard/${session?.user?.username}/stocks/transfers`,
            // },
          ]}
        />
      </div> */}
      {sales?.includes("sales") ? (
        // <Breadcrumb>

        <NewSale />
      ) : // </Breadcrumb>
      sales?.includes("debtors") ? (
        // <Breadcrumb>
        <Debtors />
      ) : (
        <Sales />
      )}
    </div>
  );
};

export default CatchAllPage;

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import {
  Menu,
  Modal,
  SegmentedControl,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import NewUser from "@/components/users/NewUser";
// import { prisma } from "../../../../../prisma/constant";
import { Dialog, Snackbar } from "@mui/material";
import { API_SERVER, formatCurrency } from "@/utils/constants";
import Popover from "@mui/material/Popover";
import { useDemoData } from "@mui/x-data-grid-generator";
import axios from "axios";
import Newcustomer from "@/components/NewCustomer";
import Datatable from "@/components/Datatable";
// import { useSession } from "next-auth/react";
import useSnackbar from "@/hooks/useSnackbar";
import Image from "next/image";
import SaleDetails from "@/components/sales/SaleDetails";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import ReturnSale from "@/components/sales/ReturnSales";
import Debtors from "@/components/sales/Debtors";
import Filter from "@/components/Filter";
import { poppins } from "@/layouts/AuthLayout";
import Print from "@/components/Print";
import { useSelector } from "react-redux";

function Sales() {
  const [size, setSize] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const [add, setAdd] = useState(false);
  const [salesTotal, setSalesTotal] = useState("");
  const [returnS, setReturnS] = useState({ status: false });
  const [checked, setChecked] = useState(true);
  const [filters, setFilters] = useState(false);
  const [details, setDetails] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [date, setDate] = useState([]);
  const [status, setStatus] = useState({ code: "", id: "" });
  const theme = useMantineTheme();
  const showAlert = useSnackbar();
  const { data: session } = useSession();

  const { screenWidth } = useSelector((state) => state.general);
  const arr = [
    {
      field: "sale_id",
      headerName: "Sale ID",
      width: 110,
      renderCell: (param) => {
        return (
          <div
            className={`${poppins?.className} bg-purple-100 text-[12px] font-semibold  text-zinc-900 px-2 rounded`}
          >
            {param.row.sale_id}
          </div>
        );
      },
      // editable: true,
    },
    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
      renderCell: (param) => {
        return param.row.product.name;
      },
      // editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,
      renderCell: (param) => {
        return param.row.product.unit;
      },
    },
    session?.user?.role_code === "SA"
      ? {
          field: "cost_price",
          headerName: "Cost Price",
          flex: 1,
          // role: "SA",
          // renderCell: (param) => {
          //   return param.row.sale?.branch?.name;
          // },
        }
      : undefined,
    {
      field: "unit_price",
      headerName: "Unit Price",
      flex: 1,
      renderCell: ({ row }) => formatCurrency(row?.unit_price),
    },

    {
      field: "quantity",
      headerName: "Quantity",
      // type: "number",
      flex: 1,
      // editable: true,
    },
    {
      field: "p_amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (param) => {
        // console.log(param.row.quantity * param.row.unit_price);
        return param.row.sale.status == "RETURNED"
          ? -formatCurrency(param.row.quantity * param.row.unit_price)
          : formatCurrency(param.row.quantity * param.row.unit_price);
      },
    },
    // {
    //   field: "Amount Paid",
    //   headerName: "Amount Paid",
    //   flex: 1,
    //   renderCell: (param) => {
    //     console.log(param.row, "total");
    //     return param.row.sale.status === "RETURNED"
    //       ? formatCurrency(param?.row?.sale?.total_amount)
    //       : formatCurrency(param?.row?.sale?.amount_paid);
    //   },
    //   valueFormatter: ({ value }) => {
    //     return console.log({ value });
    //   },
    // },
    session?.user?.role_code === "SA"
      ? {
          field: "branch_code",
          headerName: "Branch",
          flex: 1,
          role: "SA",
          renderCell: (param) => {
            return param.row.sale?.branch?.name;
          },
        }
      : undefined,
    {
      field: "status",

      headerName: "Status",
      flex: 1,
      renderCell: (param) => {
        return <Tag text={param.row.sale.status} />;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      renderCell: ({ row }) => {
        // console.log(formatDate(new Date()), formatDate(new Date()));
        return (
          <div className=" flex space-x-2 justify-center">
            <div
              onClick={(e) => {
                setDetails({ status: true, id: row.id });
              }}
              className={`
              text-zinc-700 bg-gray-200  cursor-pointer
             h-8  rounded-full group hover:ring-1 ring-sky-400 flex justify-center items-center   my-3`}
            >
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 group-hover:scale-[1.18]  transition-all group-hover:text-zinc-900"
                  >
                    <path d="M4.25 2A2.25 2.25 0 002 4.25v2a.75.75 0 001.5 0v-2a.75.75 0 01.75-.75h2a.75.75 0 000-1.5h-2zM13.75 2a.75.75 0 000 1.5h2a.75.75 0 01.75.75v2a.75.75 0 001.5 0v-2A2.25 2.25 0 0015.75 2h-2zM3.5 13.75a.75.75 0 00-1.5 0v2A2.25 2.25 0 004.25 18h2a.75.75 0 000-1.5h-2a.75.75 0 01-.75-.75v-2zM18 13.75a.75.75 0 00-1.5 0v2a.75.75 0 01-.75.75h-2a.75.75 0 000 1.5h2A2.25 2.25 0 0018 15.75v-2zM7 10a3 3 0 116 0 3 3 0 01-6 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });
  const router = useRouter();
  console.log({ rows, date });

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    setSize(window.innerWidth);
  }, []);

  useEffect(() => {
    console.log("useLoad", session?.user?.branch_code);
    setLoading(true);
    axios.post("/api/sales/get-sales").then((response) => {
      console.log(response, "pp");
      setRefetch(!refetch);
      setLoading(false);
      // return console.log({ response });
      setRows(response?.data?.sales);
      setStatus(response?.data?.status);
    });
  }, [checked]);

  console.log({ status });

  async function closeSales() {
    await axios.post("/api/cash/add-revenue", {
      description: "CLOSED SALES",
      amount: salesTotal,
      branch_code: session?.user?.branch_code,
      category: "SALES",
    });
    showAlert("", "Sales closed successfully");
    setChecked((prev) => !prev);
    setShowDialog({ status: false });
  }

  async function openSales() {
    await axios.post("/api/cash/deduct-from-revenue", {
      key: "open-sales",
      id: status?.id,
    });
    showAlert("", "Sales opened successfully");
    setChecked((prev) => !prev);
  }

  async function handleDateChange(value) {
    setDate(value);
    if (!value.includes(null)) {
      setLoading(true);
      const response = await axios.post("/api/sales/get-sales", {
        filters: { dateRange: value },
      });
      setRefetch(!refetch);
      setLoading(false);
      setRows(response.data.sales);
    }
  }

  function onCloseDate() {
    setFilters(false);
    setDate([]);
    setChecked(!checked);
  }
  function formatDate1(dateString) {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  }
  return (
    <div className="md:px-8 px-3  overflow-x-hidden  flex justify-center ">
      <Modal
        className="bg-gray-400"
        title={
          <div className="uppercase font-semibold p-3 shadow w-full">
            {add?.type == "return" ? "Return sales" : "Add New Sales"}
          </div>
        }
        padding={0}
        opened={add?.status}
        onClose={() => {
          setAdd({ status: false });
        }}
        closeOnClickOutside={false}
        fullScreen={size < 768 ? true : false}
        size={"85%"}
      >
        <NewSale
          setShowModal={setAdd}
          showModal={add}
          setChecked={setChecked}
          checked={checked}
        />
      </Modal>

      <Modal
        title={<div className="uppercase font-semibold ">Return Sales</div>}
        opened={returnS?.status}
        onClose={() => {
          setReturnS({ status: false });
        }}
        fullScreen={size < 768 ? true : false}
        closeOnClickOutside={false}
        size={"85%"}
      >
        <ReturnSale setChecked1={setChecked} setShowModal={returnS} />
      </Modal>

      <Modal
        title={<div className="uppercase font-semibold">Sale Details</div>}
        opened={details?.status}
        onClose={() => {
          setDetails({ status: false });
        }}
        closeOnClickOutside={false}
        size={size < 768 ? "100%" : "40%"}
      >
        <SaleDetails
          id={details?.id}
          setShowDetails={setDetails}
          setShowSale={setAdd}
        />
      </Modal>
      <div className="w-full flex justify-center">
        {/* <Print /> */}
        <div className="md:w-[90%] w-full">
          {session?.user?.role_code !== "SA" && (
            <div className="flex space-x-3 border-b-2 justify-end p-2">
              <>
                <Button
                  onClick={() => {
                    setReturnS({ status: true });
                  }}
                  icon={
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
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  }
                  label={"Return Sale"}
                  width={100}
                />
                <Button
                  onClick={() => {
                    {
                      status?.code === "closed"
                        ? openSales()
                        : setAdd({ status: true });
                      // : router.push(
                      //     `/dashboard/${session?.user?.username}/sales/get-sales`
                      //   );
                    }
                  }}
                  icon={
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
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  }
                  label={
                    status?.code === "closed" ? "Open Sales" : "Add new sale"
                  }
                  width={100}
                />
              </>
            </div>
          )}

          <div className="md:my-2 my-1 flex space-y-3 md:space-y-0  flex-col-reverse md:flex-row justify-start md:justify-between md:items-center">
            <div className="md:text-lg mt-4 md:mt-0  font-semibold text-gray-500">
              Showing results for{" "}
              <span className="text-indigo-700">
                {" "}
                {`${
                  date?.length > 0
                    ? `${formatDate1(date[0])} - ${formatDate1(date[1])} `
                    : "Today's"
                }`}
              </span>{" "}
              Sales
            </div>
            <Filter
              rows={rows}
              setRows={setRows}
              refetch={refetch}
              filterOptions={[
                "Product-product.name",
                "Branch-sale.branch.name",
                "Sale ID-sale_id",
                "Status-sale.status",
              ]}
              onCloseDate={onCloseDate}
              dateFilter={{ value: date, onChange: handleDateChange }}
            />
          </div>
          <div className="overflow-x-scroll ">
            <Datatable loading={loading} rows={rows} columns={columns} />
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
            Are you sure you want to delete customer?.. <br />
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
                  handleDeleteUser(showDialog.content);
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
        <div className="p-5 rounded ">
          Are you sure you want to close today's sales? <br /> Make sure cash in
          hand amounts to a total of : <br />
          <span className="text-cyan-700  font-bold text-lg">
            GHc {salesTotal}
          </span>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className="bg-gray-200 p-1 px-4 text-black rounded"
              onClick={() => {
                setShowDialog({ status: false, content: "" });
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 p-1 px-4 text-white rounded"
              onClick={closeSales}
            >
              Yes
            </button>
          </div>
        </div>
            </Dialog>*/}
    </div>
  );
}

export function Tag({ text }) {
  return (
    <div className={`py-2 ${poppins?.className}`}>
      <div className="  flex space-x-1 px-2 items-center rounded p-1">
        <span
          className={`${
            text?.includes("COMPLETED") ||
            text?.includes("Paid") ||
            text?.includes("CONFIRMED") ||
            text?.includes("Yes") ||
            text?.includes("Active")
              ? "bg-green-200"
              : text?.includes("CREDIT") || text?.includes("BadDebt")
              ? "bg-orange-200"
              : text?.includes("TBC")
              ? "bg-sky-200"
              : text?.includes("RETURNED") ||
                text?.includes("No") ||
                text?.includes("REJECTED") ||
                text?.includes("Blocked")
              ? "bg-red-200"
              : text?.includes("Owing") || text?.includes("NONE")
              ? "bg-slate-200"
              : ""
          } p-[1px] h-3 w-3  relative rounded-full `}
        >
          <span
            className={`${
              text?.includes("COMPLETED") ||
              text?.includes("Paid") ||
              text?.includes("CONFIRMED") ||
              text?.includes("Yes") ||
              text?.includes("Active")
                ? "bg-green-600"
                : text?.includes("CREDIT") || text?.includes("BadDebt")
                ? "bg-orange-400"
                : text?.includes("TBC")
                ? "bg-sky-600"
                : text?.includes("RETURNED") ||
                  text?.includes("No") ||
                  text?.includes("REJECTED") ||
                  text?.includes("Blocked")
                ? "bg-red-600"
                : text?.includes("Owing") || text?.includes("NONE")
                ? "bg-slate-600"
                : ""
            } h-2 w-2 absolute top-[2.5px] bottom-[2.5px] left-[1.8px] right-[1.8px] rounded-full `}
          >
            &nbsp;
          </span>
        </span>
        <span className="text-[10px] font-semibold text-gray-600 ">{text}</span>
      </div>
    </div>
  );
}
