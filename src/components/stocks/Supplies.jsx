import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import { MantineProvider, Menu, Modal, useMantineTheme } from "@mantine/core";
import {
  Dialog,
  Skeleton,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import axios from "axios";
import Newcustomer from "@/components/NewCustomer";
import Breadcrumb from "@/layouts/Breadcrumb";
import { useRouter } from "next/router";
import Datatable from "@/components/Datatable";
import { useSession } from "next-auth/react";
import useSnackbar from "@/hooks/useSnackbar";
import NewSupplies from "./NewSupplies";
import ViewDistribution from "./ViewDistribution";
import { useDispatch, useSelector } from "react-redux";
import { emitEvent } from "@/store/websocketSlice";
import { poppins } from "@/layouts/AuthLayout";
import { setSelectedNotification } from "@/store/notificationSlice";
import Filter from "../Filter";
import LineGraph from "../LineGraph";
// import { getSession } from "next-auth/react";

// import { useDemoData } from "@mui/x-data-grid-generator";

export default function Supplies() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();
  const [showDistro, setShowDistro] = useState({ status: false });
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [viewAs, setViewAs] = useState("staff");
  const [edit, setEdit] = useState("");
  const [date, setDate] = useState([]);
  const { data: session } = useSession();
  const dispatch = useDispatch();
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
      field: "initiated_by",
      headerName: "Distributed By",
      flex: 0.3,
      renderCell: ({ row }) => row.createdBy.username,
      // editable: true,
    },
    {
      field: "Supplier",
      headerName: "Supplier",
      flex: 0.3,
      renderCell: ({ row }) => row.supplier_name,
      // editable: true,
    },
    {
      field: "supply_date",
      headerName: "Date Supplied",
      // type: "number",
      // align: "right",
      flex: 0.3,
      renderCell: (param) => formatDateTime(param.row.supply_date),

      // editable: true,
    },
    session?.user?.role_code === "SA" || viewAs === "admin"
      ? {
          field: "Confirmations",
          headerName: "Confirmations",
          flex: 0.18,
          renderCell: ({ row }) => <LineGraph data={row.confirmations} />,
        }
      : undefined,
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
              setShowDistro({
                status: true,
                value: row?.id,
                sender: row?.createdBy?.id,
              });
              setEdit(row?.id);
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
        ];
      },
    },
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });
  const { selectedNotification } = useSelector((state) => state.notification);
  const router = useRouter();
  async function getSupplies() {
    setLoading(true);
    const response = await axios.post("/api/stocks/get-supplies", { viewAs });
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
    getSupplies();
  }

  useEffect(() => {
    if (
      selectedNotification?.id &&
      selectedNotification?.type === "Distribution"
    ) {
      setShowDistro({ value: selectedNotification?.id, status: true });
    }
    return () => {
      dispatch(setSelectedNotification(""));
    };
  }, [selectedNotification]);
  useEffect(() => {
    getSupplies();
  }, [checked]);

  async function handleDateChange(value) {
    setDate(value);
    if (!value.includes(null)) {
      setLoading(true);
      const response = await axios.post("/api/stocks/get-supplies", {
        dateRange: value,
      });
      setRefetch(!refetch);
      setLoading(false);
      setRows(response.data);
    }
  }

  function onCloseDate() {
    // setFilters(false);
    setDate([]);
    setChecked(!checked);
  }

  const handleViewAs = (value) => {
    setViewAs(value);
  };
  return (
    <>
      <div className={`${poppins?.className} px-8  flex justify-center`}>
        <Modal
          closeOnClickOutside={false}
          title={
            <div className="uppercase p-2 font-semibold">Details of Supply</div>
          }
          opened={showDistro?.status}
          onClose={() => {
            setShowDistro({ status: false });
          }}
          size={"60%"}
          // overlayProps={{
          //   color:
          //     theme.colorScheme === "dark"
          //       ? theme.colors.dark[9]
          //       : theme.colors.gray[2],
          //   opacity: 0.55,
          //   blur: 3,
          // }}
        >
          <ViewDistribution
            supply_id={showDistro?.value}
            distro_by={showDistro?.sender}
            viewAs={viewAs}
            toggleModals={() => {
              setShowDistro({ status: false });
              setShowNew(true);
            }}
          />
        </Modal>

        <Modal
          title={<div className="uppercase  font-semibold">Add Supply</div>}
          onClose={() => {
            setShowNew(false);
            dispatch(setSelectedNotification(""));
            setEdit("");
          }}
          size={"75%"}
          opened={showNew}
        >
          <NewSupplies
            supply_id={edit}
            setShowModal={setShowNew}
            setChecked={setChecked}
          />
        </Modal>

        <div className="w-full flex justify-center">
          <div
            className={`w-[90%] ${
              session?.user?.role_code === "SA" ||
              session?.user?.role_code === "A"
                ? "mt-0"
                : "mt-10"
            }`}
          >
            {(session?.user?.role_code === "SA" ||
              session?.user?.role_code === "A") && (
              <div
                className={`flex ${
                  session?.user?.role_code === "A"
                    ? "justify-between"
                    : "justify-end"
                }   p-2"`}
              >
                {session?.user?.role_code === "A" && (
                  <div className="cursor-pointer flex border rounded-lg bg-white ring   ">
                    <div
                      className={`${
                        viewAs === "staff" ? "bg-blue-500 text-white" : ""
                      } flex items-center px-3 rounded-lg`}
                      onClick={() => {
                        setViewAs("staff");
                        setChecked(!checked);
                      }}
                    >
                      View as Staff
                    </div>
                    <div
                      className={`${
                        viewAs === "admin" ? "bg-blue-500 text-white" : ""
                      } flex items-center px-3 rounded-lg`}
                      onClick={() => {
                        setViewAs("admin");
                        setChecked(!checked);
                      }}
                    >
                      View as Admin
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => {
                    // dispatch(
                    //   emitEvent({
                    //     eventName: "sendNotification",
                    //     eventData: { data: "Hello from child!" },
                    //   })
                    // );
                    setShowNew(true);
                    // router.push("/dashboard/admin/stocks/new-product");
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
                  label={"Add New Supplies"}
                  width={100}
                />
              </div>
            )}
            <div className="flex justify-end my-2">
              <Filter
                rows={rows}
                setRows={setRows}
                refetch={refetch}
                filterOptions={[
                  "Distributed By-createdBy.username",
                  "Supplier-supplier_name",
                ]}
                onCloseDate={onCloseDate}
                dateFilter={{ value: date, onChange: handleDateChange }}
              />
            </div>
            <div className="bg-white   h-auto">
              <Datatable loading={loading} rows={rows} columns={columns} />
            </div>
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
        </Dialog>
      </div>
    </>
  );
}
