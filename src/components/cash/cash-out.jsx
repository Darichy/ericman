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
import { formatDateTime } from "@/utils/constants";

export default function CashIn() {
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();

  // console.log({ users });

  const [showModal, setShowModal] = useState({ status: false, type: "" });
  const [loading, setLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [checked, setChecked] = useState(true);
  const showAlert = useSnackbar();
  const { data: session } = useSession();
  const columns = [
    {
      field: "type",
      headerName: "Type of income",
      flex: 0.5,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 0.5,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.3,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 0.3,
    },
    {
      field: "date",
      headerName: "Date",
      width: 150,
      // renderCell: ({ row }) => formatDateTime(row.date),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      cellClassName: "actions",

      getActions: ({ row, id }) => {
        return [
          <div
            onClick={() => {
              setShowModal({ status: true, type: "edit" });
              setCustomerData(rows[id]);
            }}
            className="h-8 flex justify-center items-center  cursor-pointer   rounded my-3"
          >
            <div className="p-2 ">
              <div className="">
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </div>
            </div>
          </div>,

          <div
            onClick={() => {
              setShowDialog({
                status: true,
                content: rows[id]?.id,
              });

              console.log({ id });
            }}
            className="h-8 flex justify-center items-center cursor-pointer bg-red-300 hover:bg-red-400 rounded my-3"
          >
            <div className="p-2 ">
              <div className="">
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
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
            </div>
          </div>,

          // label="Delete"
          // onClick={() => {}}
          // color="inherit"
        ];
      },
    },
  ];

  async function getRevenue() {
    setLoading(true);
    const response = await axios.post("/api/cash/get-revenue", {
      branch_code: session?.user?.branch_code,
    });

    setLoading(false);
    setRows(response.data);
  }

  async function handleDeleteUser(id) {
    const response = await axios.post("/api/cash/delete-customer", {
      id,
    });
    setShowDialog({
      status: false,
      content: "",
    });
    showAlert("", response.data.message);
    getRevenue();
  }

  useEffect(() => {
    getRevenue();
  }, [checked]);

  // console.log({ users });
  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  return (
    <div className="px-24  flex justify-center">
      <Modal
        title={
          <div className="uppercase font-semibold">
            {showModal.type !== "edit" ? "Add Income" : "Edit Income"}
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
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          <div className="flex justify-end p-2">
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
              label={"Add Cash Out"}
              width={100}
            />
          </div>
          <div className="bg-white rounded-sm shadow   h-auto">
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
        <div className="p-5 py-6 rounded ">
          Are you sure you want to delete customer?.. <br />
          <span className="font-bold text-gray-700">NB:</span> This action
          cannot be reversed
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
                handleDeleteUser(showDialog.content);
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
