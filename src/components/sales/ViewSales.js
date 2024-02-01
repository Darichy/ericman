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
// import { prisma } from "../../../../../prisma/constant";
import { Dialog, Snackbar } from "@mui/material";
import { API_SERVER } from "@/utils/constants";

import { useDemoData } from "@mui/x-data-grid-generator";
import axios from "axios";
import Newcustomer from "@/components/NewCustomer";
// import { getSession } from "next-auth/react";

// import { useDemoData } from "@mui/x-data-grid-generator";

export default function Customers() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();

  // console.log({ users });

  const [add, setAdd] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(true);
  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "full_name",
      headerName: "Full Name",
      flex: 0.3,

      // editable: true,
    },
    {
      field: "username",
      headerName: "Username",
      flex: 0.3,
      // editable: true,
    },
    {
      field: "email",
      headerName: "Email",
      // type: "number",
      flex: 0.3,

      // editable: true,
    },
    // {
    //   field: "password",
    //   headerName: "Password",
    //   // type: "number",
    //   width: 110,
    //   // editable: true,
    // },
    {
      field: "role_code",
      headerName: "Role",
      // type: "number",
      width: 150,
      // editable: true,
    },
    {
      field: "branch_code",
      headerName: "Branch",
      // type: "number",
      width: 150,
      // editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <div
            onClick={() => {
              console.log({ id });
            }}
            className="h-8 flex justify-center items-center cursor-pointer bg-cyan-200 hover:bg-cyan-300 rounded my-3"
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

          ,
          <div
            onClick={() => {
              setShowDialog({
                status: true,
                content: id,
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
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    // },
  ];

  async function getUsers() {
    const response = await axios.get("/api/get-users");
    console.log(response, "ghana");
    setRows(response.data);
  }

  async function handleDeleteUser(id) {
    const users = await axios.post("/api/delete-user", {
      username: id,
    });

    getUsers();
  }
  console.log({ snackbar }, "kkjk");
  useEffect(() => {
    // if (checked === true) {
    // console.log("running");
    getUsers();
    // setChecked(false);
    // }
  }, [checked]);

  // console.log({ users });
  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  return (
    <div className="px-24  flex justify-center">
      <Modal
        title={<div className="uppercase font-semibold">Add New Customer</div>}
        opened={add}
        onClose={() => {
          setAdd(false);
        }}
        closeOnClickOutside={false}
        size={"40%"}
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Newcustomer setShowModal={setAdd} setChecked={setChecked} />
      </Modal>
      <div className="w-full flex justify-center">
        <div className="w-[80%]">
          <div className="flex justify-end p-2">
            <div className="w-[25%]">
              <Button
                onClick={() => {
                  setAdd(true);
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
                label={"Add new Customer"}
                width={100}
              />
            </div>
          </div>
          <div className="bg-white rounded-sm shadow  h-auto">
            <DataGrid
              getRowId={(row) => row.username}
              rows={rows}
              columns={columns}
              rowHeight={38}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "bg-zinc-100" : ""
              }
              pageSizeOptions={[5]}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </div>
        </div>
      </div>
      <Snackbar
        open={snackbar.state}
        autoHideDuration={3000}
        // className="bg-green-700"
        TransitionComponent={TransitionLeft}
        onClose={() => {
          setSnackbar(false);
        }}
        message={<div className="text-white">{snackbar?.message}</div>}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
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
