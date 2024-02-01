import { useEffect, useState } from "react";
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
import { API_SERVER, formatCurrency, formatDateTime } from "@/utils/constants";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";

export default function TBC() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const [add, setAdd] = useState(false);
  const [salesTotal, setSalesTotal] = useState("");
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(true);
  const [filters, setFilters] = useState(false);
  const [details, setDetails] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [showSupply, setShowSupply] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [refetch, setRefetch] = useState(false);
  const [date, setDate] = useState(["", ""]);
  const [status, setStatus] = useState({ code: "", id: "" });
  const theme = useMantineTheme();
  const showAlert = useSnackbar();
  const { data: session } = useSession();

  const arr = [
    {
      field: "sale_id",
      headerName: "Sale ID",
      flex: 0.45,
      renderCell: (param) => {
        return (
          <div
            className={`${poppins?.className} bg-purple-100 text-[12px]  text-zinc-900 px-2 rounded`}
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
      flex: 0.4,
      renderCell: (param) => {
        return param.row.product.name;
      },
      // editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0.3,
      renderCell: (param) => {
        return param.row.product.unit;
      },
    },
    session?.user?.role_code === "SA"
      ? {
          field: "cost_price",
          headerName: "Cost Price",
          width: 120,
          // role: "SA",
          // renderCell: (param) => {
          //   return param.row.sale?.branch?.name;
          // },
        }
      : undefined,
    {
      field: "unit_price",
      headerName: "Unit Price",
      flex: 0.3,
      renderCell: ({ row }) => formatCurrency(row?.unit_price),
    },

    {
      field: "quantity",
      headerName: "Quantity",
      // type: "number",
      width: 110,
      // editable: true,
    },
    {
      field: "p_amount",
      headerName: "Amount",
      width: 120,
      renderCell: (param) => {
        console.log(param.row.quantity * param.row.unit_price, "total");
        return formatCurrency(param.row.quantity * param.row.unit_price);
      },
      valueFormatter: ({ value }) => {
        return console.log({ value });
      },
    },
    session?.user?.role_code === "SA"
      ? {
          field: "branch_code",
          headerName: "Branch",
          width: 120,
          role: "SA",
          renderCell: (param) => {
            return param.row.sale?.branch?.name;
          },
        }
      : undefined,
    {
      field: "s",

      headerName: "Supplied?",
      width: 100,
      renderCell: (param) => {
        console.log({ param });
        return <Tag text={param?.row?.sale?.isCollected?.status} />;
      },
    },
    {
      field: "s_d",

      headerName: "Supplied date",
      width: 100,
      renderCell: (param) => {
        return param?.row?.sale?.isCollected?.date
          ? formatDateTime(param?.row?.sale?.isCollected?.date)
          : "";
        // return <Tag text={param?.row?.sale?.isCollected?.date ?? ""} />;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      getActions: ({ row }) => {
        console.log(formatDate(new Date()), formatDate(new Date()));
        return [
          <div
            onClick={(e) => {
              setDetails({ status: true, id: row.id });
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

          ,
        ];
      },
    },
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });
  const router = useRouter();
  console.log({ selectedRows });

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  function handleRowChange(value) {
    setSelectedRows(value);
  }

  // useEffect(() => {
  //   let isFirstMount = true;
  //   let noYes = false;
  //   for (let i = 0; i <= selectedRows?.length; i++) {
  //     if (rows[selectedRows[i]]?.sale?.isCollected?.status === "Yes") {
  //       showAlert("", "You have selected an already supplied goods");
  //       setShowSupply(false);
  //       noYes = false;
  //       return;
  //     } else {
  //       noYes = true;
  //     }
  //   }
  //   if (isFirstMount == false && noYes == true) {
  //     setShowSupply(true);
  //   }
  //   isFirstMount = false;
  // }, [selectedRows]);
  useEffect(() => {
    console.log("useLoad", session?.user?.branch_code);
    setLoading(true);
    axios.post("/api/sales/get-sales", { key: "tbc" }).then((response) => {
      console.log(response, "pp");
      setRefetch(!refetch);
      setLoading(false);
      setRows(response?.data?.sales);
      setStatus(response?.data?.status);
    });
  }, [checked]);

  console.log({ status });

  async function SupplyTBC() {
    for (let i = 0; i <= selectedRows?.length; i++) {
      if (
        formatDate(new Date()) ===
        rows[selectedRows[i]]?.sale?.created_at?.split("T")[0]
      ) {
        showAlert("", "Please edit sales to record same-day TBC supply");
        return;
      }

      if (rows[selectedRows[i]]?.sale?.isCollected?.status === "Yes") {
        showAlert("", "Some goods have already supplied");
        return;
      }
    }

    // return;
    setLoading(true);
    setShowDialog({ status: false });
    const tbcRows = [];
    for (let i = 0; i < selectedRows?.length; i++) {
      const a = rows[selectedRows[i]];
      tbcRows.push({
        sale_id: a?.sale_id,
        product_id: a?.product_id,
        branch_id: a?.sale?.branch_id,
        quantity: a?.quantity,
      });
    }
    setSelectedRows([]);
    console.log({ tbcRows, rows });
    // return;
    const response = await axios.post("/api/stocks/supply-tbc", {
      selectedRows: tbcRows,
    });
    setLoading(false);
    showAlert("success", response?.data?.message);
    setChecked((prev) => !prev);
    // setShowDialog({ status: false });
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
        filters: { dateRange: value, key: "tbc" },
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
  return (
    <div className="px-8  flex justify-center">
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
        size={"85%"}
      >
        {add?.type == "return" ? (
          <ReturnSale />
        ) : (
          <div></div>
          //   <NewSale
          //     setShowModal={setAdd}
          //     showModal={add}
          //     setChecked={setChecked}
          //   />
        )}
      </Modal>

      <Modal
        title={<div className="uppercase font-semibold">Sale Details</div>}
        opened={details?.status}
        onClose={() => {
          setDetails({ status: false });
        }}
        closeOnClickOutside={false}
        size={"40%"}
      >
        <SaleDetails
          id={details?.id}
          setShowDetails={setDetails}
          setShowSale={setAdd}
          type={"TBC"}
        />
      </Modal>
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          {filters && (
            <div className="p-3 h-[150px] border-2 rounded group ">
              <div className="flex justify-between h-5">
                <span>FILTERS</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  onClick={() => {
                    setFilters(false);
                    setDate([]);
                    setChecked(!checked);
                  }}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 border-2 border-black shadow rounded  hidden group-hover:block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div
                className="relative "
                // onBlur={() => {
                //   setShowDate(false);
                // }}
              >
                <div className="p-5 z-50  absolute ">
                  <label>Select Date Range</label>
                  <DatePickerInput
                    className="bg-white"
                    type="range"
                    allowSingleDateInRange
                    value={date}
                    onChange={handleDateChange}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div
            className={`my-2 flex ${
              selectedRows?.length > 0 ? "justify-between" : "justify-end"
            }`}
          >
            {selectedRows?.length > 0 && (
              <Button
                label={"Supply Goods"}
                onClick={() => {
                  for (let i = 0; i <= selectedRows?.length; i++) {
                    if (
                      formatDate(new Date()) ===
                      rows[selectedRows[i]]?.sale?.created_at?.split("T")[0]
                    ) {
                      showAlert(
                        "",
                        "Please edit sales to record same-day TBC supply"
                      );
                      return;
                    }

                    if (
                      rows[selectedRows[i]]?.sale?.isCollected?.status === "Yes"
                    ) {
                      showAlert(
                        "",
                        "You have selected an already supplied goods"
                      );
                      return;
                    }
                  }
                  setShowDialog({ status: true });
                  // setShowSale({ status: true, edit: { status: true, id: id } });
                }}
              />
            )}
            <Filter
              rows={rows}
              setRows={setRows}
              refetch={refetch}
              filterOptions={[
                "Product-product.name",
                "Branch-branch.name",
                "Sale ID-sale_id",
                "Supplied?-sale.isCollected.status",
              ]}
              onCloseDate={onCloseDate}
              dateFilter={{ value: date, onChange: handleDateChange }}
            />
          </div>
          <Datatable
            loading={loading}
            rows={rows}
            columns={columns}
            checkboxSelection={session?.user?.role_code == "SA" ? false : true}
            selectedRows={selectedRows}
            onRowSelection={handleRowChange}
          />
        </div>
      </div>

      <Dialog
        open={showDialog?.status}
        onClose={() => {
          setShowDialog({ status: false, content: "" });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="p-5 rounded ">
          Are you sure you want supply these goods?
          <div className="flex justify-end space-x-2 mt-3">
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
              onClick={SupplyTBC}
            >
              Yes
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
