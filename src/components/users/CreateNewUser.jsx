import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import { LoadingOverlay, Modal, useMantineTheme } from "@mantine/core";

// import { prisma } from "../../../../../prisma/constant";
import { Backdrop, CircularProgress, Dialog, Snackbar } from "@mui/material";
import { API_SERVER } from "@/utils/constants";

import { useDemoData } from "@mui/x-data-grid-generator";
import axios from "axios";
import NewUser from "./NewUser";
import { useDispatch } from "react-redux";
import { setShowSnackbar } from "@/store/snackbarSlice";
import Datatable from "../Datatable";
import useSnackbar from "@/hooks/useSnackbar";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";
import { poppins } from "@/layouts/AuthLayout";

export default function CreateNewUser() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const [showModal, setShowModal] = useState({
    status: false,
    id: "",
    type: "",
  });
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useMantineTheme();
  const showAlert = useSnackbar();
  const columns = [
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

    {
      field: "role_code",
      headerName: "Role",
      // type: "number",
      width: 150,
      renderCell: ({ row }) => row.role.description,
      // editable: true,
    },

    {
      field: "branch_code",
      headerName: "Branch",
      // type: "number",
      width: 150,
      renderCell: ({ row }) => row.branch?.name,
      // editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      // type: "number",
      width: 150,
      renderCell: ({ row }) =>
        row?.active ? <Tag text={"Active"} /> : <Tag text={"Blocked"} />,
      // editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      renderCell: ({ row, id }) => (
        <div className=" flex space-x-2 justify-center">
          <div
            onClick={() => {
              if (!row?.active) {
                return;
              }
              setShowModal({
                status: true,
                id: rows[id]?.username,
                type: "edit",
              });
            }}
            className={`${
              !row?.active
                ? "text-zinc-400 cursor-not-allowed"
                : "text-zinc-700 cursor-pointer"
            }
               bg-gray-200  
             h-8  rounded-full group hover:ring-1 ring-sky-400 flex justify-center items-center   my-3`}
          >
            <div className="p-2 ">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 group-hover:scale-[1.18]  transition-all "
                >
                  <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              console.log({ row });
              setShowDialog({
                status: true,
                content: rows[id]?.username,
                active: row?.active,
                branch: row?.branch?.id,
              });
            }}
            className={`text-zinc-700 bg-gray-200 cursor-pointer h-8 flex justify-center items-center group hover:ring-1 ring-red-500   rounded-full my-3`}
          >
            <div className="p-2 ">
              <div className="">
                {row?.active ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      getActions: ({ row, id }) => {
        return [
          <div
            onClick={() => {
              setShowModal({
                status: true,
                id: rows[id]?.username,
                type: "edit",
              });
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
                content: rows[id]?.username,
                active: row?.active,
              });
            }}
            className="h-8 flex justify-center hover:scale-[1.1]  transition-all  items-center cursor-pointer rounded my-3"
          >
            {row?.active ? (
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="p-2 ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M18 1.5c2.9 0 5.25 2.35 5.25 5.25v3.75a.75.75 0 01-1.5 0V6.75a3.75 3.75 0 10-7.5 0v3a3 3 0 013 3v6.75a3 3 0 01-3 3H3.75a3 3 0 01-3-3v-6.75a3 3 0 013-3h9v-3c0-2.9 2.35-5.25 5.25-5.25z" />
                  </svg>
                </div>
              </div>
            )}
          </div>,
        ];
      },
    },
  ];

  async function getUsers() {
    setLoading(true);
    const response = await axios.get("/api/users/get-users");
    console.log(response, "ghana");
    setLoading(false);
    setRows(response.data);
  }

  async function handleBlockUser(username, isActive, branch) {
    setLoading(true);
    setShowDialog({
      status: false,
      content: "",
    });

    const response = await axios.post("/api/users/block-and-unblock-user", {
      username,
      isActive,
      branch_id: branch,
    });
    setLoading(false);

    showAlert(response.status === 200 ? "success" : "", response.data.message);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, [checked]);
  return (
    <div className="px-24  flex justify-center">
      <Modal
        title={
          <div className="uppercase font-semibold">
            {showModal.type === "edit" ? "Edit User Details" : "Add New User"}
          </div>
        }
        opened={showModal.status}
        onClose={() => {
          setShowModal({ status: false });
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
        <NewUser
          id={showModal.id}
          type={showModal.type}
          setShowModal={setShowModal}
          setChecked={setChecked}
        />
      </Modal>
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          <div className="flex justify-end p-2">
            <Button
              onClick={() => {
                setShowModal({ status: true });
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
              label={"Add new user"}
              width={100}
            />
          </div>
          <Datatable loading={loading} rows={rows} columns={columns} />
          {/* <div className="bg-white rounded-sm shadow  ">
            
            <DataGrid
              autoHeight={true}
              loading={loading}
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
          </div> */}
        </div>
      </div>

      <Dialog
        open={showDialog?.status}
        onClose={() => {
          setShowDialog({ status: false, content: "" });
        }}
      >
        <div
          className={`${poppins.className} py-3 px-4 text-sm flex justify-center`}
        >
          <div>
            <div className="flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-20 h-20 stroke-gray-800"
              >
                <path
                  fillRule="evenodd"
                  d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="mt-2  rounded ">
              Are you sure you want to{" "}
              {showDialog?.active === true
                ? "block"
                : showDialog?.active === false
                ? "unblock"
                : "     "}{" "}
              user? <br />
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
                    handleBlockUser(
                      showDialog.content,
                      showDialog?.active,
                      showDialog?.branch
                    );
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
