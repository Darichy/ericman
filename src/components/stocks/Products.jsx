import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import { Menu, Modal, useMantineTheme } from "@mantine/core";
import { Dialog, Snackbar } from "@mui/material";
import axios from "axios";
import Newcustomer from "@/components/NewCustomer";
import { useRouter } from "next/router";
import Datatable from "@/components/Datatable";
import NewProduct from "./NewProduct";
// import { useSession } from "next-auth/react";
import useSnackbar from "@/hooks/useSnackbar";
import Transfers from "@/components/stocks/Transfers";
// import socket from "@/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { emitEvent } from "@/store/websocketSlice";
import { useSession } from "next-auth/react";
import { poppins } from "@/layouts/AuthLayout";
export default function Products() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();
  const [add, setAdd] = useState(false);
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  const socket = useSelector((state) => state.websocket.socket);
  const dispatch = useDispatch();

  const arr = [
    {
      field: "name",
      headerName: "Item Name",
      flex: 1,

      // editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 1,

      // editable: true,
    },

    session?.user?.role_code === "SA"
      ? {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 100,
          renderCell: ({ row, id }) => (
            <div className=" flex space-x-2 justify-center">
              <div
                onClick={() => {
                  setShowModal({ status: true, value: id });
                }}
                className={`
                  text-zinc-700 bg-gray-200  cursor-pointer
                 h-8  rounded-full group hover:ring-1 ring-sky-400 flex justify-center items-center   my-3`}
              >
                <div className="p-2 ">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 group-hover:scale-[1.18]  transition-all group-hover:text-zinc-900"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div
                onClick={() => {
                  setShowDialog({
                    status: true,
                    content: rows[id].id,
                  });
                }}
                className={`text-zinc-700 bg-gray-200 cursor-pointer h-8 flex justify-center items-center group hover:ring-1 ring-red-500   rounded-full my-3`}
              >
                <div className="p-2 ">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 group-hover:scale-[1.18]  transition-all "
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
            </div>
          ),
          // renderCell: ({ row, id }) => (
          //   <div className="flex">
          //     <div
          //       onClick={() => {
          //         setShowModal({ status: true, value: id });
          //       }}
          //       className="h-8 flex justify-center items-center cursor-pointer bg-cyan-200 hover:bg-cyan-300 rounded my-3"
          //     >
          //       <div className="p-2 ">
          //         <div className="">
          //           <svg
          //             xmlns="http://www.w3.org/2000/svg"
          //             fill="none"
          //             viewBox="0 0 24 24"
          //             strokeWidth={1.5}
          //             stroke="currentColor"
          //             className="w-6 h-6"
          //           >
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          //             />
          //           </svg>
          //         </div>
          //       </div>
          //     </div>
          //     <div
          //       onClick={() => {
          //         setShowDialog({
          //           status: true,
          //           content: rows[id].id,
          //         });
          //       }}
          //       className="h-8 flex justify-center items-center cursor-pointer bg-red-300 hover:bg-red-400 rounded my-3"
          //     >
          //       <div className="p-2 ">
          //         <div className="">
          //           <svg
          //             xmlns="http://www.w3.org/2000/svg"
          //             fill="none"
          //             viewBox="0 0 24 24"
          //             strokeWidth={1.5}
          //             stroke="currentColor"
          //             className="w-6 h-6"
          //           >
          //             <path
          //               strokeLinecap="round"
          //               strokeLinejoin="round"
          //               d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          //             />
          //           </svg>
          //         </div>
          //       </div>
          //     </div>
          //     ,
          //   </div>
          // ),
        }
      : undefined,
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });

  const router = useRouter();
  async function getProducts() {
    setLoading(true);
    const response = await axios.post("/api/stocks/get-products", {
      key: "All",
    });
    console.log(response, "ghana");
    setLoading(false);
    setRows(response.data);
  }

  async function handleDeleteProduct(id) {
    setShowDialog({
      status: false,
    });
    setLoading(true);
    const response = await axios.post("/api/stocks/delete-product", {
      id,
    });

    if (response?.status === 201) {
      showAlert("", response.data?.message);
      setLoading(false);
      return;
    }
    showAlert("success", response.data.message);
    getProducts();
  }

  useEffect(() => {
    getProducts();
  }, [checked]);

  return (
    <div className="px-8  flex justify-center">
      <Modal
        title={
          <div className="uppercase font-semibold">
            {showModal?.value ? "Edit Product" : "Add New Product"}
          </div>
        }
        opened={showModal?.status}
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
        <NewProduct
          setShowModal={setShowModal}
          setChecked={setChecked}
          edit={rows[showModal?.value]}
        />
      </Modal>
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          <div className="flex justify-end p-2">
            <div
              className={`${
                session?.user?.role_code == "SA" ||
                session?.user?.role_code == "A"
                  ? " flex space-x-4"
                  : "flex justify-end"
              }"w-[30%] "`}
            >
              {(session?.user?.role_code == "SA" ||
                session?.user?.role_code == "A") && (
                <Button
                  onClick={() => {
                    // socket.emit("sendNotification", { type: "new-product" });
                    // return;r
                    setShowModal({ status: true });
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
                  label={"Add New Product"}
                  width={100}
                />
              )}
            </div>
          </div>

          <div className="bg-white   h-auto">
            {/* <DataGrid
                  getRowId={(row) => counter()}
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
                    params.indexRelativeToCurrentPage % 2 === 0
                      ? "bg-zinc-100"
                      : ""
                  }
                  pageSizeOptions={[5]}
                  // checkboxSelection
                  disableRowSelectionOnClick
                /> */}

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
            Are you sure you want to delete product?.. <br />
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
                  handleDeleteProduct(showDialog.content);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
