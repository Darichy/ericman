import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import React, { useEffect, useState } from "react";
import { DataGrid, GridAddIcon } from "@mui/x-data-grid";
import { Checkbox, Slide } from "@mui/material";
import Fab from "@mui/material/Fab";
import axios from "axios";
import { API_SERVER, formatCurrency } from "@/utils/constants";

import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";
import Datatable from "../Datatable";
import { useRouter } from "next/router";
import { LoadingOverlay, Modal } from "@mantine/core";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import NewProduct from "./NewProduct";
import { useDispatch } from "react-redux";
import { emitEvent } from "@/store/websocketSlice";
import { poppins } from "@/layouts/AuthLayout";
import CustomBackdrop from "../Backdrop";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";
export default function NewSupplies({ setShowModal, setChecked, supply_id }) {
  const [formData, setFormData] = useState({
    name: "",
    t_quantity: "",
    unit_cost: "",
  });
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [edit, setEdit] = useState([]);
  const [rows, setRows] = useState([]);

  const [item, setItem] = useState("");
  const [customer, setCustomer] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [saleID, setSaleID] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [discount, setDiscount] = useState("");
  const [balance, setBalance] = useState("");
  const [distribution, setDistribution] = useState([]);
  const [openDist, setOpenDist] = useState({ status: false });
  const [loading, setLoading] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [pLoading, setPLoading] = useState(false);
  const [oldData, setOldData] = useState("");

  const showAlert = useSnackbar();
  const { data: session } = useSession();
  const router = useRouter();

  const columns = [
    {
      field: "name",
      headerName: "Product Name",
      flex: 1,
    },
    {
      field: "unit",
      headerName: "Units",
      flex: 1,
    },
    {
      field: "unit_cost",
      headerName: "Unit Cost Price",
      flex: 1,
      renderCell: ({ row, id }) => formatCurrency(`${row?.unit_cost}`),
    },

    {
      field: "t_quantity",
      headerName: "Total Quantity",
      flex: 1,
    },

    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row, id }) => (
        <div className=" flex space-x-2 justify-center">
          <div
            onClick={async () => {
              // console.log({ uu: params });
              // setShowModal({ status: true, id: id, type: "edit" });
              if (!edit?.status) {
                setEdit({ status: true, id });
                setFormData((prev) => ({ ...prev, ...row }));
                setSelectedProduct({
                  id: row?.product_id,
                  unit: row?.unit,
                  name: row?.name,
                });

                // return console.log({ row });
                if (supply_id) {
                  setLoading(true);
                  const response = await axios.post(`/api/stocks/get-stocks`, {
                    key: "supply",
                    subKey: row?.name,
                    // product_id: row?.product_id,
                  });
                  console.log({ response });
                  setFormData((prev) => ({
                    ...prev,
                    s_quantity: response?.data?.quantity ?? 0,
                  }));
                  setLoading(false);
                }
              }
            }}
            className={`${
              edit?.status && edit?.id == id
                ? " cursor-not-allowed text-zinc-400 "
                : "text-zinc-700 hover:ring-1 ring-sky-400  cursor-pointer"
            } h-8  rounded-full group bg-gray-200   flex justify-center items-center   my-3`}
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
              if (!edit?.status && edit?.id !== id) {
                setRows(rows.filter((i, key) => key !== id));
                setDistribution(
                  distribution.filter((i, key) => i?.name !== row?.name)
                );
              }
            }}
            className={`${
              edit?.status && edit?.id == id
                ? "cursor-not-allowed text-zinc-400 bg-gray-200"
                : "text-zinc-700 bg-gray-200 cursor-pointer hover:ring-1"
            } h-8 flex justify-center items-center group  ring-red-500   rounded-full my-3`}
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
      //   <div className=" flex space-x-2 justify-center">
      //     <div
      //       onClick={() => {
      //         // console.log({ uu: params });
      //         // setShowModal({ status: true, id: id, type: "edit" });
      //         setEdit({ status: true, id });
      //         setFormData((prev) => ({ ...prev, ...row }));
      //         setSelectedProduct({
      //           id: row?.product_id,
      //           unit: row?.unit,
      //           name: row?.name,
      //         });
      //       }}
      //       className={`${
      //         edit?.status && edit?.id === id
      //           ? " bg-cyan-50 hover:bg-cyan-100"
      //           : "cursor-pointer bg-cyan-200 hover:bg-cyan-300"
      //       } h-8 cursor-pointer flex justify-center items-center  rounded my-3`}
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
      //         if (!edit?.status) {
      //           setRows(rows.filter((i, key) => key !== id));
      //           setDistribution(
      //             distribution.filter((i, key) => i?.name !== row?.name)
      //           );
      //         }
      //       }}
      //       className={`${
      //         edit?.status && edit?.id === id
      //           ? "cursor-not-allowed bg-slate-200 hover:bg-slate-300"
      //           : "bg-red-500 hover:bg-red-400"
      //       } h-8 flex justify-center items-center  rounded my-3`}
      //     >
      //       <div className="p-2 ">
      //         <div className="">
      //           <svg
      //             xmlns="http://www.w3.org/2000/svg"
      //             fill="none"
      //             viewBox="0 0 24 24"
      //             strokeWidth={1.5}
      //             stroke="currentColor"
      //             className="w-6 h-6 text-white"
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
      //   </div>
      // ),
    },
  ];

  const columns1 = [
    {
      field: "branch_name",
      headerName: "Branch",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Item",
      flex: 1,
    },
    {
      field: "unit",
      headerName: "Units",
      flex: 1,
    },
    {
      field: "selling_price",
      headerName: "Selling price",
      flex: 1,
      renderCell: ({ row, id }) => formatCurrency(`${row?.selling_price}`),
    },
    {
      field: "calc_cost_price",
      headerName: "Calculated Unit Cost",
      flex: 1,
      renderCell: ({ row, id }) => formatCurrency(`${row?.calc_cost_price}`),
    },
    {
      field: "bs_quantity",
      headerName: "Dist. Quantity",
      flex: 1,
    },
    supply_id && {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row, id }) => {
        return <Tag text={row?.status} />;
      },
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row, id }) => (
        <div className=" flex space-x-2 justify-center">
          <div
            onClick={() => {
              if (supply_id && row?.status === "CONFIRMED") {
                return;
              } else {
                setOpenDist({ status: true, id: row, index: id });
              }
            }}
            className={`${
              edit?.status && edit?.id == id
                ? " cursor-not-allowed text-zinc-400 "
                : "text-zinc-700 hover:ring-1 ring-sky-400  cursor-pointer"
            } h-8  rounded-full group bg-gray-200   flex justify-center items-center   my-3`}
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
              if (supply_id && row?.status === "CONFIRMED") {
                return;
              } else {
                setDistribution(distribution.filter((i, key) => key !== id));
              }
            }}
            className={`${
              edit?.status && edit?.id == id
                ? "cursor-not-allowed text-zinc-400 bg-gray-200"
                : "text-zinc-700 bg-gray-200 cursor-pointer hover:ring-1"
            } h-8 flex justify-center items-center group  ring-red-500   rounded-full my-3`}
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
      //   <div className=" flex space-x-2 justify-center">
      //     <div
      //       onClick={() => {
      //         if (supply_id && row?.status === "CONFIRMED") {
      //           return;
      //         } else {
      //           setOpenDist({ status: true, id: row, index: id });
      //         }
      //       }}
      //       className={`h-8 flex justify-center items-center  ${
      //         supply_id && row?.status === "CONFIRMED"
      //           ? "bg-cyan-100 text-gray-500 hover:bg-cyan-200 cursor-not-allowed "
      //           : "bg-cyan-200 hover:bg-cyan-300 cursor-pointer"
      //       }  rounded my-3`}
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
      //         if (supply_id && row?.status === "CONFIRMED") {
      //           return;
      //         } else {
      //           setDistribution(distribution.filter((i, key) => key !== id));
      //         }
      //       }}
      //       className={`h-8 flex justify-center items-center ${
      //         supply_id && row?.status === "CONFIRMED"
      //           ? "bg-red-100 hover:bg-red-200 cursor-not-allowed"
      //           : "bg-red-400 hover:bg-red-500 cursor-pointer"
      //       }  rounded my-3`}
      //     >
      //       <div className="p-2 ">
      //         <div className="">
      //           <svg
      //             xmlns="http://www.w3.org/2000/svg"
      //             fill="none"
      //             viewBox="0 0 24 24"
      //             strokeWidth={1.5}
      //             stroke="currentColor"
      //             className="w-6 h-6 text-white"
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
      //   </div>
      // ),
    },
  ];
  const dispatch = useDispatch();
  async function handleSubmit() {
    // return setShowFinal(true);
    try {
      if (selectedSupplier?.name === "") {
        showAlert("", "Kindly fill all required fields");
        return;
      }
      // return;
      if (rows.length > 0) {
        setShowFinal(false);
        setLoading(true);

        const products = rows.map((i) => ({
          product: i?.name,
          quantity: parseFloat(i?.t_quantity),
          unit_cost: parseFloat(i?.unit_cost),
          unit: i?.unit,
        }));
        const distributions = [];
        if (supply_id) {
          distribution?.forEach((i) => {
            if (i?.status === "REJECTED") {
              distributions?.push({
                id: i?.id,
                product_id: i?.product_id,
                branch_id: i?.branch_id,
                quantity: i?.bs_quantity,
                selling_price: i?.selling_price,
                calc_unit_cost: i?.calc_cost_price,
              });
            }
          });
        } else {
          distribution?.forEach((i) => {
            distributions?.push({
              product_id: i?.product_id,
              branch_id: i?.branch_id,
              quantity: i?.bs_quantity,
              selling_price: i?.selling_price,
              calc_unit_cost: i?.calc_cost_price,
            });
          });
        }

        const payload = {
          id: supply_id,
          products,
          initiated_by: session?.user?.id,
          supplier_name: selectedSupplier?.name,
          supplier_email: selectedSupplier?.email,
          supplier_phone: selectedSupplier?.phone,
          supplier_address: selectedSupplier?.address,
          distributions,
        };
        // return console.log(payload);
        // return console.log({ distributions, distribution, payload });
        const url = supply_id
          ? "/api/stocks/update-supply"
          : "/api/stocks/add-supply";
        const response = await axios.post(url, {
          ...payload,
        });
        setLoading(false);
        const arr = [];
        distributions.forEach((i) => {
          if (!arr.includes(i.branch_id)) {
            arr.push(i.branch_id);
            if (i.branch_id !== session?.user?.branch_id) {
              dispatch(
                emitEvent({
                  eventName: "sendNotification",
                  eventData: {
                    sender: session?.user?.username,
                    to: i.branch_id,
                  },
                })
              );
            }
          }
        });

        if (session?.user?.role_code !== "SA") {
          dispatch(
            emitEvent({
              eventName: "sendNotification",
              eventData: {
                sender: session?.user?.username,
                to: "admin",
              },
            })
          );
        }

        showAlert("success", response.data?.message);
        setChecked((prev) => !prev);
        setShowModal(false);
      } else {
        showAlert("", "You have recorded no supplies");
      }
      // router.push("/dashboard/admin/sales");
    } catch (error) {
      console.log(error);
    }
  }

  // console.log({ formData, distribution });

  function handleChange(e, name) {
    if (name === "unit_cost") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value && parseFloat(e.target.value),
      }));
    }
  }

  useEffect(() => {
    if (selected) {
      setFormData((prev) => ({ ...prev, name: selected.name }));
      const arr = [];
      selected?.in_stock?.map((i) => {
        const { unit, ...rest } = i;
        arr.push({ label: unit, ...rest });
      });
      setUnits(arr);
    }
  }, [selected]);

  function formatCurrency(amount) {
    return parseFloat(amount)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // console.log({ formData, rows });
  function addToSupplies() {
    if (formData.t_quantity == "0") {
      showAlert("", `The quantity of ${formData.name} cannot be zero`);
      return;
    }

    if (
      rows?.some((i) => i?.name === formData?.name) &&
      edit?.status === false
    ) {
      showAlert("", `Cannot add the same product twice`);
      return;
    }
    if (
      formData.name == "" ||
      formData.t_quantity == "" ||
      formData.unit_cost == ""
    ) {
      showAlert("", "Kindly fill all required fields");
      return;
    }
    if (edit?.status) {
      if (supply_id) {
        if (
          oldData.distribution.find((i) => i.status === "CONFIRMED") &&
          oldData.totalGoods.find((i) => i.unit_cost !== formData?.unit_cost)
        ) {
          return showAlert(
            "",
            "You cannot modify unit cost as some \n branches have accepted their supplies"
          );
        }
      }
      const arr = [...rows];
      arr[edit?.id] = { ...formData };
      setEdit({ status: false });
      setRows(arr);
    } else {
      const { ...rest } = formData;
      setRows((prev) => [...prev, { ...rest }]);
    }
    setFormData({
      name: "",
      unit_cost: "",
      unit: "",
      s_quantity: "",
      t_quantity: "",
    });
    setSelectedProduct("");
  }

  async function getBranches() {
    try {
      const response = await axios.get("/api/get-branches");
      if (response.status === 200) {
        // dispatch(authenticate);
        setBranches(response.data);
        console.log(response.data, "branches");
      } else {
        console.log(response.data, "c");
      }
    } catch (e) {
      console.log(e, "c");
    }
  }

  async function getSupplyDetails() {
    setLoading(true);
    try {
      const response = await axios.post("/api/stocks/get-supplies", {
        supply_id,
        // branch_id: session?.user?.branch_id,
      });
      const supply = response?.data;
      setLoading(false);
      const totalGoods = supply.products?.map((i) => ({
        name: i?.product,
        t_quantity: i?.quantity,
        unit: i?.unit,
        unit_cost: i?.unit_cost,
      }));
      const distribution = supply.distributions?.map((i) => ({
        id: i?.id,
        branch_id: i?.branch?.id,
        name: i?.product?.name,
        unit: i?.product?.unit,
        product_id: i?.product?.id,
        branch_name: i?.branch?.name,
        selling_price: i?.selling_price,
        calc_cost_price: i?.calc_unit_cost,
        bs_quantity: i?.quantity,
        status: i?.status,
        p_cost: totalGoods?.find((a) => a?.name === i?.product?.name)
          ?.unit_cost,
      }));
      setSelectedSupplier({
        name: supply?.supplier_name,
        address: supply?.supplier_address,
        phone: supply?.supplier_phone,
        email: supply?.supplier_email,
      });
      setOldData({ totalGoods, distribution });
      setRows(totalGoods);
      setDistribution(distribution);
      console.log({ response, totalGoods, distribution });
    } catch (e) {
      console.log(e, "c");
    }
  }
  useEffect(() => {
    if (supply_id) {
      Promise.all([getBranches(), getSupplyDetails()]);
    } else {
      Promise.all([getBranches()]);
    }
    // handleCustomerCreation();
  }, []);

  async function getSupplier(value) {
    try {
      const response = await axios.post("/api/suppliers/get-suppliers", {
        query: value,
      });

      setSuppliers(response.data);
    } catch (error) {}
  }
  return (
    <div className={`${poppins?.className} text-sm   scale-95 -mx-7 -my-5`}>
      <Modal
        size={"40%"}
        centered
        title={openDist?.type !== "P" ? "NEW DISTRIBUTION" : "ADD PRODUCT"}
        opened={openDist?.status}
        onClose={() => setOpenDist({ status: false })}
      >
        {openDist?.type !== "P" ? (
          <Distribution
            distribution={distribution}
            setDistribution={setDistribution}
            setOpenModal={setOpenDist}
            totalGoods={rows}
            edit={openDist?.id}
            index={openDist?.index}
            supply_id={supply_id}
          />
        ) : (
          <NewProduct setShowModal={setOpenDist} />
        )}
      </Modal>
      <div className="bg-gray-200 pt-2">
        <div className="flex justify-between items-center px-3">
          <div className="flex space-x-2 items-center">
            <span className="font-semibold px-2 ">Supply Summary </span>
            <div className="flex items-center justify-between mt-2 ">
              <div className="bg-sky-50 border-[2px] border-sky-400 space-x-3 text-xs  flex items-center justify-center py-[6px] pl-1 pr-3 rounded  text-gray-500 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 bg-gray-400 text-white  p-1 rounded-full"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.622 1.602a.75.75 0 01.756 0l2.25 1.313a.75.75 0 01-.756 1.295L12 3.118 10.128 4.21a.75.75 0 11-.756-1.295l2.25-1.313zM5.898 5.81a.75.75 0 01-.27 1.025l-1.14.665 1.14.665a.75.75 0 11-.756 1.295L3.75 8.806v.944a.75.75 0 01-1.5 0V7.5a.75.75 0 01.372-.648l2.25-1.312a.75.75 0 011.026.27zm12.204 0a.75.75 0 011.026-.27l2.25 1.312a.75.75 0 01.372.648v2.25a.75.75 0 01-1.5 0v-.944l-1.122.654a.75.75 0 11-.756-1.295l1.14-.665-1.14-.665a.75.75 0 01-.27-1.025zm-9 5.25a.75.75 0 011.026-.27L12 11.882l1.872-1.092a.75.75 0 11.756 1.295l-1.878 1.096V15a.75.75 0 01-1.5 0v-1.82l-1.878-1.095a.75.75 0 01-.27-1.025zM3 13.5a.75.75 0 01.75.75v1.82l1.878 1.095a.75.75 0 11-.756 1.295l-2.25-1.312a.75.75 0 01-.372-.648v-2.25A.75.75 0 013 13.5zm18 0a.75.75 0 01.75.75v2.25a.75.75 0 01-.372.648l-2.25 1.312a.75.75 0 11-.756-1.295l1.878-1.096V14.25a.75.75 0 01.75-.75zm-9 5.25a.75.75 0 01.75.75v.944l1.122-.654a.75.75 0 11.756 1.295l-2.25 1.313a.75.75 0 01-.756 0l-2.25-1.313a.75.75 0 11.756-1.295l1.122.654V19.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>

                <span>Correctly record total supply before distribution</span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => {
              // console.log({
              //   sum: rows.map((i) => {
              //     return distribution.reduce((ac, a) => {
              //       if (a?.name === i?.name) {
              //         ac += a.bs_quantity;
              //       }
              //       return ac;
              //     }, 0);
              //   }),
              //   rows,
              //   distribution,
              // });
              if (rows.length > 0) {
                if (distribution?.length <= 0) {
                  showAlert("", "Kindly add distribution");

                  return;
                }
                if (
                  rows?.some(
                    (i) =>
                      i.t_quantity !=
                      distribution.reduce((ac, a) => {
                        if (a?.name === i?.name) {
                          ac += a.bs_quantity;
                        }
                        return ac;
                      }, 0)
                  )
                ) {
                  showAlert(
                    "",
                    "Some items distribution quantities don't match total goods .. Please check"
                  );
                  setLoading(false);
                  return;
                }
                setShowFinal(true);
              } else {
                showAlert("", "You have recorded no supplies");
              }
            }}
            icon
            label={"Done"}
            width={20}
          />
        </div>
        <div className="flex space-x-2 p-2 border-2   overflow-y-auto">
          <div className="w-[35%] relative space-y-2   border-gray-500">
            <div className="bg-white shadow shadow-zinc-400 border-2 rounded p-3 space-y-2">
              <div>
                <label className="text-sm font-medium text-[#2d2d8e]">
                  Product Name
                </label>
                <Autocomplete
                  id="combo-box-demo"
                  options={products}
                  size="small"
                  value={selectedProduct}
                  onChange={async (e, v) => {
                    if (v !== null) {
                      setSelectedProduct(v);
                      setLoading(true);
                      const response = await axios.post(
                        `/api/stocks/get-stocks`,
                        {
                          key: "supply",
                          product_id: v?.id,
                        }
                      );
                      setLoading(false);
                      console.log(v, "vvv", response.data);
                      const in_stock = response.data;
                      setFormData((prev) => ({
                        ...prev,
                        name: v?.name,
                        product_id: v?.id,

                        s_quantity: in_stock?.quantity ?? 0,
                        quantity: 1,
                        unit: in_stock?.unit,
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        name: "",
                        product_id: "",

                        s_quantity: "",
                        quantity: "",
                        unit: "",
                        unit_cost: "",
                        t_quantity: "",
                      }));
                    }
                  }}
                  loading={pLoading}
                  loadingText={
                    <div
                      className={`${poppins?.className} text-xs animate-bounce "`}
                    >
                      Searching...
                    </div>
                  }
                  getOptionLabel={(i) => i?.name ?? ""}
                  noOptionsText={
                    <div className={`${poppins?.className} text-xs `}>
                      No product match
                    </div>
                  }
                  renderInput={(params) => {
                    // console.log({ params });
                    const { InputLabelProps, ...rest } = params;
                    return (
                      <TextField
                        {...rest}
                        InputLabelProps={{ shrink: true }}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setPLoading(true);
                            axios
                              .post(`/api/stocks/get-products`, {
                                key: "supply",
                                query: e.target.value,
                              })
                              .then((response) => {
                                setProducts(response.data);
                                setPLoading(false);
                              });
                          }
                          // setSelectedProduct(e);
                        }}
                        // label="Product Name"
                      />
                    );
                  }}
                />
              </div>
              <div className="flex justify-end">
                <div
                  onClick={() => {
                    setOpenDist({ status: true, type: "P" });
                  }}
                  className="text-emerald-600 font-semibold cursor-pointer hover:bg-emerald-50 rounded "
                >
                  Add new product
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-[50%]">
                  <InputField
                    disabled={true}
                    label={"Unit"}
                    width={100}
                    value={formData?.unit}
                  />
                </div>
                <div className="w-[50%]">
                  <InputField
                    required={false}
                    label={"Unit Cost"}
                    width={100}
                    // disabled={true}
                    value={formData.unit_cost}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        unit_cost: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <div className="w-[50%]">
                  <InputField
                    required={false}
                    label={"Current Total Stock"}
                    width={100}
                    disabled={true}
                    value={formData.s_quantity}
                  />
                </div>
                <div className="w-[50%]">
                  <InputField
                    label={"Total Supply Quantity"}
                    width={100}
                    value={formData.t_quantity}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        t_quantity: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="flex space-x-2 justify-end items-end">
                <Button
                  onClick={addToSupplies}
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  }
                  label={edit?.status ? "Edit goods" : "Add to supplies"}
                  width={50}
                />
              </div>
            </div>

            <Modal
              opened={showFinal}
              // withCloseButton={false}
              centered
              title={
                <span className="uppercase font-semibold ">Supplier Info</span>
              }
              onClose={() => setShowFinal(false)}
              closeOnClickOutside={false}
            >
              <div className={`${poppins?.className} text-sm space-y-2 mt-2 `}>
                <div className=" flex flex-col">
                  <hr />
                </div>
                <div className="">
                  <div className="flex space-x-[2px]">
                    <label className="text-sm font-medium text-[#2d2d8e]">
                      Name / Supply Description
                    </label>
                    <span className="text-red-500">*</span>
                  </div>

                  <Autocomplete
                    id="combo-box-demo"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    options={suppliers}
                    value={selectedSupplier}
                    onChange={(e, v) => {
                      console.log(v, "vvv");
                      setSelectedSupplier(v);
                      if (!v) {
                        setSelectedSupplier((prev) => ({
                          name: "",
                          phone: "",
                          address: "",
                          email: "",
                        }));
                      }
                    }}
                    freeSolo={true}
                    getOptionLabel={(i) => i?.name ?? ""}
                    // noOptionsText={<div>No Sup match</div>}
                    renderInput={(params) => {
                      // console.log({ params });
                      const { InputLabelProps, ...rest } = params;
                      return (
                        <TextField
                          {...rest}
                          size="small"
                          value={selectedSupplier?.name}
                          InputLabelProps={{ shrink: true }}
                          onChange={(e) => {
                            setSelectedSupplier((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }));
                            getSupplier(e.target.value);
                          }}
                          // label="Customer Name"
                        />
                      );
                    }}
                  />
                </div>
                <InputField
                  value={selectedSupplier?.phone}
                  type={"text"}
                  label={"Phone"}
                  required={false}
                  disabled={!!selectedSupplier?.id}
                  onChange={(e) => {
                    setSelectedSupplier((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }));
                  }}
                  width={100}
                />
                <InputField
                  value={selectedSupplier?.address}
                  type={"text"}
                  label={"Address"}
                  required={false}
                  disabled={!!selectedSupplier?.id}
                  onChange={(e) => {
                    setSelectedSupplier((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                  }}
                  width={100}
                />

                <InputField
                  value={selectedSupplier?.email}
                  type={"text"}
                  label={"Email"}
                  required={false}
                  disabled={!!selectedSupplier?.id}
                  onChange={(e) => {
                    setSelectedSupplier((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                  width={100}
                />
              </div>
              <hr className="my-4" />
              <div className="flex justify-end mt-3">
                <Button
                  label={supply_id ? "Update Supply" : "Add Supply"}
                  onClick={() => {
                    handleSubmit();
                  }}
                />
              </div>
            </Modal>
          </div>

          <div className="w-[65%] ">
            <Datatable rows={rows} columns={columns} />
          </div>
        </div>
      </div>

      <div className="flex space-x-2 border-2 mt-2 bg-gray-200 px-2   overflow-y-auto">
        <div className="w-full">
          <div className="flex justify-between items-center my-1">
            <div className="flex space-x-2 items-center">
              <span className="font-semibold px-2 ">Supply Distribution </span>
              <div className="flex items-center justify-between ">
                <div className="bg-yellow-50 border-2 border-yellow-400 space-x-3 text-xs  flex items-center justify-center p-[6px] rounded text-gray-500 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span>Correctly record distribution to all branches </span>
                </div>
              </div>
            </div>
            <Button
              label={"Add distribution"}
              onClick={() => {
                if (!rows || rows?.length <= 0) {
                  showAlert("", "There are no goods to distribute");
                  return;
                }
                setOpenDist({ status: true });
              }}
              width={15}
            />
          </div>
          <Datatable rows={distribution} columns={columns1} />
        </div>
      </div>
      <CustomBackdrop isLoading={loading} />
    </div>
  );
}

function Distribution({
  totalGoods,
  setDistribution,
  distribution,
  setOpenModal,
  edit,
  index,
  supply_id,
}) {
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [totalRem, setTotalRem] = useState(0);

  const showAlert = useSnackbar();
  let totalSupplyQ;

  const totalDistroQ = distribution?.reduce((ac, i) => {
    if (edit) {
      if (supply_id) {
        if (i.product_id === edit?.product_id && i?.status === "CONFIRMED") {
          ac += i.bs_quantity;
        }
      } else {
        if (i.product_id === edit?.product_id) {
          ac += i.bs_quantity;
        }
      }
    } else {
      if (i.product_id === formData?.product_id) {
        ac += i.bs_quantity;
      }
    }

    return ac;
  }, 0);

  useEffect(() => {
    async function getBranches() {
      try {
        const response = await axios.get("/api/get-branches");
        if (response.status === 200) {
          // dispatch(authenticate);
          setBranches(response.data);
          console.log(response.data, "branches");
        } else {
          console.log(response.data, "c");
        }
      } catch (e) {
        console.log(e, "c");
      }
    }
    if (edit) {
      totalSupplyQ = parseFloat(
        totalGoods?.find((i) => i.product_id === edit?.product_id)?.t_quantity
      );

      // if (supply_id) {
      //   setLoading(true);
      //   axios
      //     .post(`/api/stocks/get-stocks`, {
      //       key: "distro",
      //       product_id: edit?.product_id,
      //       branch_id: edit?.branch_id,
      //     })
      //     .then((response) => {
      //       // console.log(response, "hh");
      //       setLoading(false);
      //       totalSupplyQ = parseFloat(
      //         totalGoods?.find((i) => i.product_id === edit?.product_id)
      //           ?.t_quantity
      //       );
      //       console.log({ totalDistroQ, totalSupplyQ });
      //       const totalRem = totalSupplyQ - totalDistroQ;
      //       setTotalRem(totalRem);
      //       if (response?.data === null) {
      //         setFormData((prev) => ({
      //           ...prev,
      //           b_quantity: 0,
      //           selling_price: 0,
      //           cur_cost_price: 0,
      //           calc_cost_price: 0,
      //           totalRem,
      //         }));
      //         return;
      //       }

      //       const item = response.data;
      //       setFormData((prev) => ({
      //         ...prev,
      //         b_quantity: item?.quantity,
      //         // selling_price: item?.selling_price,
      //         cur_cost_price: item?.cost_price,
      //         // calc_cost_price: 0,
      //         totalRem,
      //       }));
      //     });
      // }
      const totalRem = totalSupplyQ - totalDistroQ;
      setTotalRem(totalRem);
      setFormData({
        name: edit?.name,
        b_quantity: edit?.b_quantity,
        selling_price: edit?.selling_price,
        cur_cost_price: edit?.cur_cost_price,
        calc_cost_price: edit?.calc_cost_price,
        bs_quantity: edit?.bs_quantity,
        unit_cost: supply_id ? edit?.p_cost : edit?.unit_cost,
        unit: edit?.unit,

        totalRem: totalRem,
      });
      setSelectedProduct({ id: edit?.product_id, name: edit?.name });
      setSelectedBranch({ id: edit?.branch_id, name: edit?.branch_name });
    }
    Promise.all([getBranches()]);
  }, []);

  useEffect(() => {
    axios
      .post(`/api/stocks/get-products`, {
        query: selectedProduct,
      })
      .then((response) => {
        setProducts(response.data ?? []);
      });
  }, [selectedProduct]);

  useEffect(() => {
    if (formData?.product_id && selectedBranch) {
      setLoading(true);
      if (
        distribution?.some(
          (i) =>
            i.branch_id === selectedBranch?.id &&
            i.product_id === formData?.product_id
        ) ||
        list?.some((i) => i.name === formData?.name)
      ) {
        showAlert("", "Already distibuted same products to this branch");
        setLoading(false);
        return;
      }
      axios
        .post(`/api/stocks/get-stocks`, {
          key: "distro",
          product_id: formData?.product_id,
          branch_id: selectedBranch?.id,
        })
        .then((response) => {
          // console.log(response, "hh");
          setLoading(false);
          totalSupplyQ = parseFloat(
            totalGoods?.find((i) => i.product_id === formData?.product_id)
              ?.t_quantity
          );
          const totalRem = totalSupplyQ - totalDistroQ;
          setTotalRem(totalRem);
          if (response?.data === null) {
            setFormData((prev) => ({
              ...prev,
              b_quantity: 0,
              selling_price: 0,
              cur_cost_price: 0,
              calc_cost_price: 0,
              totalRem,
            }));
            return;
          }

          const item = response.data;
          setFormData((prev) => ({
            ...prev,
            b_quantity: item?.quantity,
            selling_price: item?.selling_price,
            cur_cost_price: item?.cost_price,
            calc_cost_price: 0,
            totalRem,
          }));
        });
    }
  }, [formData?.product_id, selectedBranch]);

  function addToList() {
    if (formData?.selling_price == 0) {
      showAlert("", `Selling price cannot be 0`);
      return;
    }

    if (
      formData?.selling_price == "" ||
      formData?.bs_quantity == "" ||
      formData?.branch_id == "" ||
      selectedProduct == ""
    ) {
      showAlert("", `Kindly fill all required fields`);
      return;
    }
    if (list?.some((i) => i.name === formData?.name)) {
      showAlert("", "You have already distributed item to branch");
      return;
    }

    if (totalRem < formData?.bs_quantity) {
      showAlert("", `You do not that much goods to distribute`);
      return;
    }
    if (formData?.selling_price < formData?.unit_cost) {
      showAlert("", `Selling Price cannot be less than purchase cost price`);
      return;
    }
    setList((prev) => [
      ...prev,
      {
        ...formData,
        unit: totalGoods[totalGoods?.findIndex((i) => i.name == formData?.name)]
          ?.unit,
        branch_id: selectedBranch?.id,
        branch_name: selectedBranch?.name,
      },
    ]);
    setFormData({
      name: "",
      b_quantity: "",
      selling_price: "",
      cur_cost_price: "",
      calc_cost_price: "",
      bs_quantity: "",
      totalRem: "",
      unit_cost: "",
      unit: "",
    });

    setSelectedProduct("");
  }

  function addToDistro() {
    if (
      distribution?.some(
        (i) =>
          i.branch_id === selectedBranch?.id &&
          list?.findIndex((a) => a.product_id === i.product_id) !== -1
      )
    ) {
      showAlert("", "Already distibuted same products to this branch");
      return;
    }
    setDistribution((prev) => [...prev, ...list]);
    setOpenModal({ status: false });
  }
  console.log(formData, edit, totalGoods, "poii");

  return (
    <>
      <div
        className={`${poppins?.className} text-sm relative space-y-2   border-gray-500`}
      >
        <LoadingOverlay
          loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
          visible={loading}
          overlayBlur={2}
        />
        <div className="bg-white shadow rounded p-3 space-y-2">
          <div className="">
            <SelectField
              label={"Select Branch"}
              data={branches}
              value={selectedBranch}
              getOptionLabel={(row) => row?.name ?? ""}
              onChange={(value) => {
                setList([]);
                setSelectedBranch(value);
                setFormData((prev) => ({
                  ...prev,
                  branch_name: value?.name,
                  branch_id: value?.id,
                }));
              }}
            />
          </div>
          <hr />
          <div className="">
            <label className="text-sm font-medium text-[#2d2d8e]">
              Product Name
            </label>

            <Autocomplete
              // disablePortal
              id="combo-box-demo"
              options={totalGoods}
              size="small"
              value={selectedProduct}
              onChange={(e, v) => {
                // console.log(v, "vvv");
                setSelectedProduct(v);
                setFormData((prev) => ({
                  ...prev,
                  name: v?.name,
                  product_id: v?.product_id,
                  unit: v?.unit,
                  unit_cost: v?.unit_cost,
                }));
              }}
              getOptionLabel={(i) => i?.name ?? ""}
              noOptionsText={<div>No product match</div>}
              renderInput={(params) => {
                const { InputLabelProps, ...rest } = params;
                return (
                  <TextField
                    {...rest}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      setSelectedProduct(e);
                    }}
                  />
                );
              }}
            />
          </div>
          <div className="border-2 my-3 py-3 px-1 rounded ">
            <div className="flex space-x-2">
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Current stock"}
                  width={100}
                  disabled={true}
                  value={formData?.b_quantity}
                />
              </div>
              <div className="w-[50%]">
                <InputField
                  label={"Remaining Supply "}
                  width={100}
                  disabled={true}
                  value={formData?.totalRem}
                  // onChange={(e) => handleChange(e, "quantity")}
                />
              </div>
              <div className="w-[50%]">
                <InputField
                  label={"Unit"}
                  width={100}
                  disabled={true}
                  value={formData?.unit}
                  // onChange={(e) => handleChange(e, "quantity")}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Current Cost Price"}
                  width={100}
                  value={
                    formData?.cur_cost_price &&
                    formatCurrency(`${formData?.cur_cost_price}`)
                  }
                  disabled={true}
                />
              </div>
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Purchase Cost Price"}
                  width={100}
                  value={
                    formData?.unit_cost &&
                    formatCurrency(`${formData?.unit_cost}`)
                  }
                  disabled={true}
                />
              </div>
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"New Cost Price"}
                  width={100}
                  disabled={true}
                  value={
                    formData?.calc_cost_price &&
                    formatCurrency(`${formData?.calc_cost_price}`)
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-[50%]">
              <InputField
                label={"Current Selling Price"}
                width={100}
                value={formData?.selling_price}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    selling_price: e.target.value && parseFloat(e.target.value),
                  }));
                }}
              />
            </div>
            <div className="w-[50%]">
              <InputField
                label={"Branch Supply Quantity"}
                width={100}
                value={formData.bs_quantity}
                onChange={(e) => {
                  const value = e.target.value ?? "0";
                  const currentCost =
                    formData?.b_quantity * formData?.cur_cost_price;
                  const newCost =
                    parseFloat(value) *
                    totalGoods[
                      totalGoods?.findIndex((i) => i.name === formData?.name)
                    ]?.unit_cost;
                  const currentQ = formData?.b_quantity;

                  // console.log({ currentCost, newCost, value, currentQ });
                  const calculated =
                    (formData?.b_quantity * formData?.cur_cost_price +
                      parseFloat(value) *
                        totalGoods[
                          totalGoods?.findIndex(
                            (i) => i.name === formData?.name
                          )
                        ]?.unit_cost) /
                    (currentQ + parseFloat(value));
                  // console.log({ value, totalSupplyQ }, "valuess");
                  setFormData((prev) => ({
                    ...prev,
                    calc_cost_price: e.target.value && parseFloat(calculated),
                    bs_quantity: e.target.value && parseFloat(e.target.value),
                    totalRem:
                      totalRem -
                      (e.target.value ? parseFloat(e.target.value) : 0),
                  }));
                }}
              />
            </div>
          </div>

          {edit ? (
            <div className="flex  justify-end">
              <Button
                onClick={() => {
                  const arr = [...distribution];
                  arr[index] = {
                    ...arr[index],
                    ...formData,
                    ...{ branch_id: selectedBranch?.id },
                    ...{ product_id: selectedProduct?.id },
                  };
                  setDistribution(arr);
                  setOpenModal({ status: false });
                }}
                label={"Save Changes"}
                width={60}
              />
            </div>
          ) : (
            <div className="flex space-x-2 justify-end items-end">
              <Button
                onClick={addToList}
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                }
                label={"Add to list"}
                width={40}
              />
              {list?.length > 0 && (
                <Button
                  onClick={addToDistro}
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  }
                  label={"Done"}
                  width={20}
                />
              )}
            </div>
          )}
          <div className="max-h-[100px] cursor-pointer mt-2 space-x-2 bg-gray-100 rounded p-2 justify-start flex flex-wrap overflow-y-auto space-y-1">
            {list.map((i) => (
              <div className="bg-black text-white py-[5.5px] text-sm space-x-1 flex justify-between px-2 items-center rounded-full ">
                <span
                  onClick={() => {
                    setFormData({
                      ...i,
                    });
                    setSelectedProduct({ name: i.name });
                    const arr = list?.filter((a) => a.name !== i.name);

                    setList(arr);
                  }}
                  className="flex-grow"
                >
                  {i.name} - {i.bs_quantity}{" "}
                  {
                    totalGoods[totalGoods?.findIndex((a) => a.name === i?.name)]
                      ?.unit
                  }
                </span>
                <svg
                  onClick={() => {
                    const arr = list?.filter((a) => a.name !== i.name);

                    setList(arr);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6  fill-zinc-500 hover:fill-zinc-400 transition-all"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
