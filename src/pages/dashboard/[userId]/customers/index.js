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
import { useSession } from "next-auth/react";
import { poppins } from "@/layouts/AuthLayout";

export default function Customers() {
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
  const arr = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Customer Name",
      flex: 0.3,

      // editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 0.3,
      // editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      // type: "number",
      flex: 0.3,

      // editable: true,
    },

    session?.user?.role_code === "SA"
      ? {
          field: "created_at",
          headerName: "Created At",
          width: 150,
          renderCell: ({ row, id }) => row?.createdBy?.branch?.name,
        }
      : undefined,
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
              // console.log({ uu: params });
              // setShowModal({ status: true, id: id, type: "edit" });
              setShowModal({ status: true, type: "edit" });
              setCustomerData(rows[id]);
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
                content: rows[id]?.id,
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
      // getActions: ({ id }) => {
      //   return [
      //     <div
      //       onClick={() => {
      //         setShowModal({ status: true, type: "edit" });
      //         setCustomerData(rows[id]);
      //       }}
      //       className="h-8 flex justify-center items-center cursor-pointer bg-cyan-400 hover:bg-cyan-500 rounded my-3"
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
      //               d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      //             />
      //           </svg>
      //         </div>
      //       </div>
      //     </div>,

      //     ,
      //     <div
      //       onClick={() => {
      //         setShowDialog({
      //           status: true,
      //           content: rows[id]?.id,
      //         });

      //         console.log({ id });
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
      //     </div>,

      //     // label="Delete"
      //     // onClick={() => {}}
      //     // color="inherit"
      //   ];
      // },
    },
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });

  async function getCustomers() {
    setLoading(true);
    const response = await axios.post("/api/customers/get-customers", {
      branch_id: session?.user?.branch_id,
    });
    console.log(response.data, "w");
    setLoading(false);
    setRows(response.data);
  }

  async function handleDeleteUser(id) {
    setShowDialog({
      status: false,
      content: "",
    });
    try {
      setLoading(true);
      const response = await axios.post("/api/customers/delete-customer", {
        id,
      });

      showAlert("success", response.data.message);
      getCustomers();
    } catch (error) {
      setLoading(false);
      showAlert("", "Something went wrong :(");
    }
  }

  useEffect(() => {
    getCustomers();
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
            {showModal.type !== "edit"
              ? "Add New Customer"
              : "Edit Customer Info"}
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
        <Newcustomer
          customer={customerData}
          showModal={showModal}
          setShowModal={setShowModal}
          setChecked={setChecked}
        />
      </Modal>
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          {session?.user?.role_code !== "SA" && (
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
                label={"Add new Customer"}
                width={100}
              />
            </div>
          )}
          <div
            className={`${
              session?.user?.role_code === "SA" ? "mt-7" : ""
            } bg-white rounded-sm shadow   h-auto`}
          >
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
    </div>
  );
}
