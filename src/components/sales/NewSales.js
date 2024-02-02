import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import React, { useEffect, useRef, useState } from "react";
import { DataGrid, GridAddIcon } from "@mui/x-data-grid";
import { Backdrop, CircularProgress, Slide } from "@mui/material";
import Fab from "@mui/material/Fab";
import axios from "axios";
import { API_SERVER, formatCurrency, formatDateTime } from "@/utils/constants";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";
import Datatable from "../Datatable";
import { useRouter } from "next/router";
import { Checkbox, LoadingOverlay, Menu, Modal, Overlay } from "@mantine/core";
import { poppins } from "@/layouts/AuthLayout";
import Image from "next/image";
import CustomBackdrop from "../Backdrop";
import SaleDetails from "./SaleDetails";
import Print from "../Print";
import { useReactToPrint } from "react-to-print";
import PrintPage from "../Print";
import { useSelector } from "react-redux";

export default function NewSale({
  setShowModal,
  setChecked,
  checked,
  showModal,
}) {
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
  });
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selected, setSelected] = useState("");
  const [units, setUnits] = useState([{ unit: "" }]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState("");
  const [total2, setTotal2] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [saleID, setSaleID] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [discount, setDiscount] = useState("");
  const [balance, setBalance] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [showFinal, setShowFinal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [tbc, setTbc] = useState(false);
  const [print, setPrint] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [sLoading, setSLoading] = useState(false);
  const [size, setSize] = useState("25%");

  const showAlert = useSnackbar();
  const { data: session } = useSession();
  const router = useRouter();

  const columns = [
    {
      field: "name",
      headerName: "Item",
      flex: 0.3,
    },
    {
      field: "unit",
      headerName: "Units",
      flex: 0.2,
      renderCell: ({ row }) => {
        if (showModal?.edit?.status === true) {
          return row?.unit;
        } else {
          return row?.unit;
        }
      },
    },
    {
      field: "unit_price",
      headerName: "Unit price",
      flex: 0.2,
      renderCell: ({ row }) => {
        if (showModal?.edit?.status === true) {
          return formatCurrency(`${row?.unit_price}`);
        } else {
          return row?.unit_price;
        }
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 0.2,
    },
    {
      field: "p_amount",
      headerName: "Amount",
      flex: 0.2,
      renderCell: ({ row }) => {
        if (showModal?.edit?.status === true) {
          return formatCurrency(`${row?.unit_price * row?.quantity}`);
        } else {
          return row?.p_amount;
        }
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 120,

      renderCell: ({ row, id }) => (
        <div className=" flex space-x-2 justify-center">
          <div
            onClick={() => {
              // console.log({ uu: params });
              // setShowModal({ status: true, id: id, type: "edit" });
              setEdit({ status: true, id });
              setFormData((prev) => ({ ...prev, ...row }));
              setSelectedProduct({
                id: row?.product_id,
                unit: row?.unit,
                name: row?.name,
              });
            }}
            className={`${
              edit?.status
                ? " bg-cyan-50 hover:bg-cyan-100"
                : "text-zinc-700 bg-gray-200  cursor-pointer"
            } h-8 cursor-pointer rounded-full group hover:ring-1 ring-sky-400 flex justify-center items-center   my-3`}
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
              if (!edit?.status) {
                setRows(rows.filter((i, key) => key !== id));
              }
            }}
            className={`${
              edit?.status
                ? "cursor-not-allowed bg-slate-200 hover:bg-slate-300"
                : "text-zinc-700 bg-gray-200 cursor-pointer"
            } h-8 flex justify-center items-center group hover:ring-1 ring-red-500   rounded-full my-3`}
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
    },
  ];
  const printReceiptSection = useReactToPrint({
    content: () => document?.getElementById("receipt-ref"),
  });
  async function getSaleId() {
    setLoading(true);
    setRows([]);
    setUnits([]);
    setAmountPaid("");
    setBalance("");
    setTotal("");
    setTotal2("");
    setDiscount("");
    setPrint(false);
    setTbc(false);
    setSelectedCustomer({
      name: "",
      address: "",
      phone: "",
    });
    setFormData({
      name: "",
      quantity: "",
      unit: "",
      p_amount: "",
      quantity: "",
    });

    const response = await axios.post("/api/get-sale-id");

    console.log(session, "da");
    setLoading(false);
    setSaleID(response.data);
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

  async function getSaleDetails() {
    setLoading(true);
    setLoadingText("Fetching Sales Data");
    const response = await axios.post("/api/sales/get-sale-details", {
      id: showModal?.edit?.id,
    });
    setLoading(false);
    setLoadingText("");
    const details = response.data?.sale;
    console.log({ details });
    setAmountPaid(formatCurrency(`${details?.amount_paid}`));
    setTotal(formatCurrency(`${details?.total_amount}`));
    const rows = details?.products.map((i) => {
      const row = { ...i, ...i.product };
      delete row?.product;

      return row;
    });
    // console.log({ rows }, "port");
    // return;
    setRows(rows);
    setSaleID(details?.sale_id);
    setDiscount(formatCurrency(`${details?.discount}`));
    setBalance(
      formatCurrency(`${details?.amount_paid - details?.total_amount}`)
    );

    setSelectedCustomer({
      name: details?.buyer_name,
      phone: details?.buyer_phone,
      address: details?.buyer_address,
    });
  }
  useEffect(() => {
    if (!showModal?.edit?.status) {
      Promise.all([getBranches(), getSaleId()]);
    }
  }, [checked]);

  useEffect(() => {
    if (showModal?.edit?.status === true) {
      getSaleDetails();
    }
  }, []);

  async function handleSubmit() {
    // return setShowFinal(true);

    try {
      if (rows.length > 0) {
        if (
          parseFloat(amountPaid?.replaceAll(",", "")) <
            parseFloat(total?.replaceAll(",", "")) &&
          selectedCustomer?.name === "" &&
          selectedCustomer?.phone === "" &&
          selectedCustomer?.address === ""
        ) {
          showAlert(
            "",
            "Please fill all required customer info to record as credit sale"
          );
          return;
        } else if (
          parseFloat(amountPaid?.replaceAll(",", "")) >
          parseFloat(total?.replaceAll(",", ""))
        ) {
          showAlert("", "Amount Paid is more than total sale amount");
          return;
        } else if (
          tbc &&
          selectedCustomer?.name === "" &&
          selectedCustomer?.phone === "" &&
          selectedCustomer?.address === ""
        ) {
          showAlert(
            "",
            "Please fill all required customer info to record as TBC sale"
          );
          return;
        } else if (
          print &&
          selectedCustomer?.name === "" &&
          selectedCustomer?.phone === "" &&
          selectedCustomer?.address === ""
        ) {
          showAlert(
            "",
            "Please fill all required customer info for receipt printing"
          );
          return;
        } else if (discount > total) {
          showAlert("", "Discount cannot be more than total");
          return;
        } else if (amountPaid > total) {
          showAlert("", "Amount Paid cannot be more than total");
          return;
        }
        setLoading(true);
        setLoadingText(
          showModal?.edit?.status
            ? "Saving Changes , Please wait..."
            : "Adding Sale, Please wait..."
        );
        const payload = {
          sale_id: saleID.toString(),
          total_amount: parseFloat(total?.replaceAll(",", "")),
          amount_paid: parseFloat(amountPaid?.replaceAll(",", "")),
          discount: parseFloat(discount?.replaceAll(",", "")),
          branch_id: session?.user?.branch_id,
          initiated_by: session?.user?.id,
          products: rows,
          tbc,
          buyer_name: selectedCustomer?.name,
          buyer_phone: selectedCustomer?.phone,
          buyer_address: selectedCustomer?.address,
        };
        const url = showModal?.edit?.status
          ? "/api/sales/update-sale"
          : "/api/sales/new-sale";

        const response = await axios.post(url, {
          ...payload,
        });
        if (showModal?.edit?.status === true) {
          setShowModal({ status: false });
        }
        showAlert("success", response.data?.message);
        setLoadingText("");
        setLoading(false);

        if (print) {
          printReceiptSection();
        }

        setChecked(!checked);
        // setShowFinal(true);
      } else {
        showAlert("", "Make at least one sale");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // console.log({ formData });

  useEffect(() => {
    if (selected) {
      setFormData((prev) => ({ ...prev, name: selected.name }));
      const arr = [];
    }
  }, [selected]);

  useEffect(() => {
    if (!showModal?.edit?.status) {
      let sum = 0;
      rows.map((i) => {
        const amount = i?.p_amount
          ? parseFloat(i?.p_amount?.replaceAll(",", ""))
          : 0;
        sum += amount;
      });

      setTotal(formatCurrency(`${sum}`));
      setTotal2(sum);
      setAmountPaid(formatCurrency(`${sum}`));
      setDiscount(formatCurrency(`${0}`));
      setBalance(formatCurrency(`${0}`));
    } else {
      let isFirstMount = true;
      if (!isFirstMount) {
        let sum = 0;
        rows.map((i) => {
          const amount = i?.p_amount
            ? parseFloat(i?.p_amount?.replaceAll(",", ""))
            : 0;
          sum += amount;
        });

        setTotal(formatCurrency(`${sum}`));
        setTotal2(sum);
        setAmountPaid(formatCurrency(`${sum}`));
        setDiscount(formatCurrency(`${0}`));
        setBalance(formatCurrency(`${0}`));
      }
      isFirstMount = false;
    }
  }, [rows]);

  function formatCurrency(amount) {
    return parseFloat(amount)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function editSales() {
    if (parseFloat(formData.s_quantity) < parseFloat(formData?.quantity)) {
      showAlert("", `Not enough stock quantity`);
      return;
    }

    if (
      formData.product_id == "" ||
      formData.unit == "" ||
      formData.quantity == "" ||
      formData.quantity == 0
    ) {
      showAlert("", "Kindly fill all required fields");
      return;
    }

    if (
      rows
        .filter((i, key) => key !== edit?.id)
        .some((i) => i.unit == formData?.unit)
    ) {
      showAlert("", "Cannot have the same product twice ");
      return;
    }
    setEdit({ status: false });
    const arr = [...rows];
    arr[edit?.id] = { ...formData };
    setRows(arr);
    setUnits([]);

    setFormData({
      name: "",
      unit_price: "",
      quantity: "",
      unit: "",
      p_amount: "",
      s_quantity: "",
    });
    setSelectedProduct("");
  }

  function addToSales() {
    // console.log({ formData });
    // return;
    if (parseFloat(formData.s_quantity) < parseFloat(formData?.quantity)) {
      showAlert("", `Not enough stock quantity`);
      return;
    }

    if (
      formData.product_id == "" ||
      formData.unit == "" ||
      formData.quantity == "" ||
      formData.quantity == 0
    ) {
      showAlert("", "Kindly fill all required fields");
      return;
    }

    if (rows.some((i) => i.unit == formData?.unit)) {
      showAlert("", "Cannot have the same product twice ");
      return;
    }

    const { ...rest } = formData;
    setRows((prev) => [...prev, { ...rest }]);
    setUnits([]);
    setSelectedProduct("");
    setFormData({
      name: "",
      unit_price: "",
      quantity: "",
      unit: "",
      p_amount: "",
      s_quantity: "",
      cost_price: "",
    });
  }

  async function getCustomers(customer) {
    try {
      setSLoading(true);
      axios
        .post(`/api/customers/get-customers?search=${customer}`, {
          key: "search",
          branch_id: session?.user?.branch_id,
        })
        .then((response) => {
          setCustomers(response.data);
          setSLoading(false);
        });
    } catch (e) {
      console.log(e, "c");
    }
  }

  console.log({ customers, rows });
  return (
    <div
      className={`${poppins?.className} scale-[0.95] overflow-x-hidden text-sm text-gray-500  -m-7 pt-6 pb-5 px-4`}
    >
      <div className="bg-white rounded border-2    flex justify-between py-2 px-2 md:px-4">
        <div className="md:w-[35%] w-full px-2">
          <div className="space-y-2 mt-2 ">
            <div className=" flex items-center md:items-start font-semibold justify-between md:flex-col">
              <span className="text-sm">Customer Info</span>

              <Menu position="bottom-end">
                <Menu.Target>
                  <button className="rounded md:hidden border-2 py-1 bg-emerald-500 text-white   px-2 flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span>Done</span>
                  </button>
                </Menu.Target>
                <Menu.Dropdown
                  className={`${poppins?.className} z-50 bg-indigo-50 shadow-lg `}
                >
                  <div className=" rounded font-semibold   px-2 py-2   ">
                    <div className="flex justify-between items-center mb-3">
                      <div className=" uppercase text-sm font-bold">
                        Sale summary
                      </div>
                      <div className="flex  justify-between items-center">
                        <label className="whitespace-nowrap w-[35%]">
                          Sales ID
                        </label>
                        <input
                          type="text"
                          disabled
                          value={saleID}
                          className="text-zinc-800 border border-gray-200 text-xs w-[65%] bg-purple-100 py-1 px-3 rounded"
                        />
                      </div>
                    </div>
                    {/* <hr /> */}
                    <div className=" flex space-x-2  ">
                      <div className="w-[50%] space-y-4">
                        <InputField
                          textAlign={"right"}
                          label={"Amount Paid"}
                          width={100}
                          type={"number"}
                          onFocus={(e) => {
                            setAmountPaid(e.target.value?.replaceAll(",", ""));
                          }}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              setAmountPaid(formatCurrency("0"));
                            } else {
                              setAmountPaid(formatCurrency(e.target.value));
                            }
                          }}
                          value={amountPaid}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : 0;
                            setBalance(
                              formatCurrency(
                                `${
                                  value - parseFloat(total.replaceAll(",", ""))
                                }`
                              )
                            );

                            setTbc(false);
                            setAmountPaid(e.target.value);
                          }}
                        />

                        <InputField
                          textAlign={"right"}
                          label={"Balance"}
                          width={100}
                          value={balance}
                          disabled={true}
                          onChange={(e) => setBalance(e.target.value)}
                        />
                      </div>

                      <div className="w-[50%] space-y-4">
                        <InputField
                          textAlign={"right"}
                          label={"Discount"}
                          width={100}
                          value={discount}
                          type={"number"}
                          onBlur={(e) => {
                            if (!e.target.value) {
                              setDiscount(0);
                            }
                          }}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : 0;
                            setDiscount(e.target.value);
                            setTotal(
                              formatCurrency(
                                `${parseFloat(total2) - parseFloat(value)}`
                              )
                            );
                            setBalance(formatCurrency(0));
                            setAmountPaid(
                              formatCurrency(
                                `${parseFloat(total2) - parseFloat(value)}`
                              )
                            );
                          }}
                          onFocus={(e) => {
                            setDiscount(e.target.value?.replaceAll(",", ""));
                          }}
                        />
                        <InputField
                          label={"Net Total"}
                          width={100}
                          textAlign={"right"}
                          disabled={true}
                          value={total}
                        />
                      </div>
                    </div>
                    <div className="flex mt-2 space-x-2 justify-between items-center ">
                      <Checkbox
                        checked={tbc}
                        disabled={amountPaid !== total}
                        onChange={(event) =>
                          setTbc(event.currentTarget.checked)
                        }
                        label={<div>To be Collected</div>}
                      />
                      <Checkbox
                        checked={print}
                        onChange={(event) =>
                          setPrint(event.currentTarget.checked)
                        }
                        label={<div>Print Receipt</div>}
                      />
                      <Button
                        label={
                          showModal?.edit?.status ? "Save Changes" : "Submit"
                        }
                        onClick={handleSubmit}
                        width={50}
                      />
                    </div>
                  </div>
                </Menu.Dropdown>
              </Menu>
              <hr className="hidden md:block" />
            </div>
            <div className="">
              <label className="text-sm font-medium text-[#2d2d8e]">Name</label>

              <Autocomplete
                // disablePortal

                id="combo-box-demo"
                InputLabelProps={{
                  shrink: true,
                }}
                options={customers}
                value={selectedCustomer}
                // sx={{ width: 300 }}
                onChange={(e, v) => {
                  console.log(v, "vvv");
                  setSelectedCustomer(v);
                  if (!v) {
                    setSelectedCustomer((prev) => ({
                      name: "",
                      phone: "",
                      address: "",
                    }));
                  }
                  // setFormData((prev) => ({
                  //   ...prev,
                  //   product_id: v?.id,
                  //   name: v?.name,
                  // }));
                  // setUnits(v?.in_stock);
                }}
                freeSolo={true}
                getOptionLabel={(i) => i?.name ?? ""}
                // noOptionsText={<div>No Customer match</div>}
                loading={sLoading}
                loadingText={
                  <div
                    className={`${poppins?.className} text-xs animate-bounce`}
                  >
                    Searching...
                  </div>
                }
                renderInput={(params) => {
                  // console.log({ params });
                  const { InputLabelProps, ...rest } = params;
                  return (
                    <TextField
                      {...rest}
                      size="small"
                      value={selectedCustomer?.name}
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                        setSelectedCustomer((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }));
                        console.log(e.target.value, "kkkkkkkkk");
                        getCustomers(e.target.value);
                      }}
                      // label="Customer Name"
                    />
                  );
                }}
              />
            </div>

            <InputField
              value={selectedCustomer?.address}
              type={"text"}
              label={"Address"}
              disabled={!!selectedCustomer?.id}
              onChange={(e) => {
                setSelectedCustomer((prev) => ({
                  ...prev,
                  address: e.target.value,
                }));
              }}
              width={100}
            />

            <InputField
              value={selectedCustomer?.phone}
              type={"text"}
              label={"Phone"}
              disabled={!!selectedCustomer?.id}
              onChange={(e) => {
                setSelectedCustomer((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }));
              }}
              width={100}
            />
          </div>
        </div>
        <div className="hidden md:block rounded font-semibold   px-2 py-2  w-[40%] border-indigo-300  border-dashed border-2">
          <div className="flex justify-between items-center mb-3">
            <div className=" uppercase text-sm font-bold">Sale summary</div>
            <div className="flex w-[200px] justify-between items-center">
              <label className="whitespace-nowrap w-[35%]">Sales ID</label>
              <input
                type="text"
                disabled
                value={saleID}
                className="text-zinc-800 border border-purple-100 text-xs w-[65%] bg-purple-100 py-1 px-3 rounded"
              />
            </div>
          </div>
          {/* <hr /> */}
          <div className=" flex space-x-2  ">
            <div className="w-[50%] space-y-4">
              <InputField
                textAlign={"right"}
                label={"Amount Paid"}
                width={100}
                type={"number"}
                onFocus={(e) => {
                  setAmountPaid(e.target.value?.replaceAll(",", ""));
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setAmountPaid(formatCurrency("0"));
                  } else {
                    setAmountPaid(formatCurrency(e.target.value));
                  }
                }}
                value={amountPaid}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : 0;
                  if (value < parseFloat(total?.replaceAll(",", ""))) {
                    setPrint(true);
                  } else {
                    setPrint(false);
                  }
                  setBalance(
                    formatCurrency(
                      `${value - parseFloat(total?.replaceAll(",", ""))}`
                    )
                  );
                  setTbc(false);
                  setAmountPaid(e.target.value);
                }}
              />

              <InputField
                textAlign={"right"}
                label={"Balance"}
                width={100}
                value={balance}
                disabled={true}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>

            <div className="w-[50%] space-y-4">
              <InputField
                textAlign={"right"}
                label={"Discount"}
                width={100}
                value={discount}
                type={"number"}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setDiscount(0);
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value ? parseFloat(e.target.value) : 0;
                  setDiscount(e.target.value);
                  setTotal(
                    formatCurrency(`${parseFloat(total2) - parseFloat(value)}`)
                  );
                  setBalance(formatCurrency(0));
                  setAmountPaid(
                    formatCurrency(`${parseFloat(total2) - parseFloat(value)}`)
                  );
                }}
                onFocus={(e) => {
                  setDiscount(e.target.value?.replaceAll(",", ""));
                }}
              />
              <InputField
                label={"Net Total"}
                width={100}
                textAlign={"right"}
                disabled={true}
                value={total}
              />
            </div>
          </div>
          <div className="flex mt-2 space-x-2 justify-between items-center ">
            <Checkbox
              checked={tbc}
              disabled={amountPaid !== total}
              onChange={(event) => {
                setPrint(event.currentTarget.checked);
                setTbc(event.currentTarget.checked);
              }}
              label={<div>To be Collected</div>}
            />
            <Checkbox
              checked={print}
              onChange={(event) => setPrint(event.currentTarget.checked)}
              label={<div>Print Receipt</div>}
            />
            <Button
              label={showModal?.edit?.status ? "Save Changes" : "Submit"}
              onClick={handleSubmit}
              width={50}
            />
          </div>
        </div>
      </div>
      <div className="md:flex space-x-2 p-2 mt-4  rounded  overflow-y-auto">
        <CustomBackdrop text={loadingText} isLoading={loading} />

        <div className="md:w-[35%] w-full bg-indigo-50 relative border-r-2 space-y-2   ">
          <div className="bg-white  rounded p-3 space-y-4">
            <div>
              <label className="text-sm font-medium text-[#2d2d8e]">
                Product Name
              </label>
              <Autocomplete
                // disablePortal
                id="combo-box-demo"
                options={products}
                size="small"
                value={selectedProduct}
                onChange={async (e, v) => {
                  console.log(v, "vvvv");
                  if (v != null) {
                    setSelectedProduct(v);
                    setLoading(true);
                    setLoadingText("Fetching Stock Data ...");
                    const response = await axios.post(
                      `/api/stocks/get-stocks`,
                      {
                        key: "distro",
                        product_id: v?.id,
                        branch_id: session?.user?.branch_id,
                      }
                    );
                    setLoadingText("");
                    setLoading(false);
                    console.log(v, "vvv", response.data);
                    const in_stock = response.data;
                    setFormData((prev) => ({
                      ...prev,
                      name: v?.name,
                      product_id: v?.id,
                      unit_price: formatCurrency(`${in_stock?.selling_price}`),
                      s_quantity: in_stock?.quantity,
                      quantity: 1,
                      unit: in_stock?.product.unit,
                      p_amount: formatCurrency(`${in_stock?.selling_price}`),
                      cost_price: in_stock?.cost_price,
                    }));
                  } else {
                    setFormData((prev) => ({
                      ...prev,
                      name: "",
                      product_id: "",
                      unit_price: "",
                      s_quantity: "",
                      quantity: "",
                      unit: "",
                      p_amount: "",
                      cost_price: "",
                    }));
                  }
                }}
                getOptionLabel={(i) => i?.name ?? ""}
                noOptionsText={
                  <div className={`${poppins?.className} text-xs `}>
                    No product match
                  </div>
                }
                loading={pLoading}
                loadingText={
                  <div
                    className={`${poppins?.className} text-xs animate-bounce`}
                  >
                    Searching...
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
                        if (e.target.value !== "" || e.target.value !== null) {
                          setPLoading(true);
                          axios
                            .post(
                              `/api/stocks/get-products?search=${e.target.value}`
                            )
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

            <div className="flex space-x-2">
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Selling Price"}
                  disabled={true}
                  value={formData.unit_price}
                  width={100}
                />
              </div>
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Unit"}
                  width={100}
                  disabled={true}
                  value={formData.unit}
                />
                {/* <Autocomplete
                  // disablePortal
                  id="combo-box-demo"
                  options={units}
                  size="small"
                  value={formData?.unit}
                  // sx={{ width: 100 }}
                  onChange={(e, v) => {
                    console.log(v, "vvv");
                    setFormData((prev) => ({
                      ...prev,
                      unit_price: v?.selling_price,
                      s_quantity: v?.quantity,
                      quantity: 1,
                      unit: v?.unit,
                      p_amount: v?.selling_price,
                    }));
                  }}
                  getOptionLabel={(i) => i?.unit}
                  noOptionsText={<div>No unit found</div>}
                  renderInput={(params) => (
                    <TextField
                      InputLabelProps={{
                        shrink: true / false,
                      }}
                      value={formData?.unit}
                      {...params}
                      label="Unit"
                    />
                  )}
                /> */}
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Current Available Stock"}
                  width={100}
                  disabled={true}
                  value={formData.s_quantity}
                />
              </div>
              <div className="w-[50%]">
                <InputField
                  label={"Quantity"}
                  width={100}
                  type={"number"}
                  value={formData.quantity}
                  onChange={(e) => {
                    // const numericValue = e.target.value.replace(/\D/g, "");

                    setFormData((prev) => ({
                      ...prev,
                      quantity: e.target.value && parseFloat(e.target.value),

                      p_amount:
                        e.target.value &&
                        formatCurrency(
                          `${
                            parseFloat(e.target.value) * formData.unit_price ??
                            "0"
                          }`
                        ),
                    }));
                  }}
                />
              </div>
            </div>

            {/* <InputField label={"Sales Price"} disabled={true} /> */}
            <div className="flex space-x-2 items-end">
              <div className="w-[50%]">
                <InputField
                  label={"Amount"}
                  width={100}
                  disabled={true}
                  value={formData.p_amount}
                />
              </div>
              {edit?.status ? (
                <Button
                  onClick={editSales}
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
                  label={"Edit sale"}
                  width={50}
                />
              ) : (
                <Button
                  onClick={addToSales}
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
                  label={"Add to sales"}
                  width={50}
                />
              )}
            </div>
            <div className="hidden">
              <ReceiptComponent
                data={{
                  rows: rows,
                  date: formatDateTime(new Date()),
                  total,
                  amountPaid,
                  discount,
                  selectedCustomer,
                  saleID,
                  tbc,
                }}
              />
            </div>
          </div>

          <Modal
            centered
            opened={showFinal}
            onClose={() => {
              setShowFinal(false);
            }}
            size={size}
            // fullScreen={size === "100%"}
          >
            <div className={`${poppins?.className} text-sm `}>
              <div className="flex justify-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-14 h-14 p-2 rounded-full text-gray-800 bg-gray-200"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 003 3h.27l-.155 1.705A1.875 1.875 0 007.232 22.5h9.536a1.875 1.875 0 001.867-2.045l-.155-1.705h.27a3 3 0 003-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0018 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM16.5 6.205v-2.83A.375.375 0 0016.125 3h-8.25a.375.375 0 00-.375.375v2.83a49.353 49.353 0 019 0zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 01-.374.409H7.232a.375.375 0 01-.374-.409l.526-5.784a.373.373 0 01.333-.337 41.741 41.741 0 018.566 0zm.967-3.97a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H18a.75.75 0 01-.75-.75V10.5zM15 9.75a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V10.5a.75.75 0 00-.75-.75H15z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex justify-center">
                Would you want to print receipt?
              </div>
              <div className="hidden">
                <ReceiptComponent
                  data={{
                    rows: rows,
                    date: formatDateTime(new Date()),
                    total,
                    amountPaid,
                    discount,
                    selectedCustomer,
                    saleID,
                    tbc,
                  }}
                />
              </div>
              {/* <div id="receipt-section" className="h-screen w-screen"></div> */}
              {/* <hr className="my-4" /> */}
              <div className="flex  justify-end space-x-3 mt-5">
                <button
                  onClick={() => {
                    // setSize("100%");

                    printReceiptSection();
                  }}
                  className="bg-black px-3 py-1 text-white rounded"
                >
                  Print Receipt
                </button>
                <button
                  onClick={() => {
                    setRows([]);
                    setAmountPaid("");
                    setBalance("");
                    setDiscount("");
                    setShowFinal(false);
                    setShowModal(false);
                    setChecked((prev) => !prev);
                    router.push("/dashboard/admin/sales");
                  }}
                  className="bg-gray-200 p-2 w-20 rounded"
                >
                  Skip
                </button>
              </div>
            </div>
          </Modal>
        </div>

        <div className="md:w-[65%] w-full ">
          <Datatable rows={rows} columns={columns} />
        </div>
      </div>
    </div>
  );
}

export function ReceiptComponent({ data }) {
  const { user } = useSelector((state) => state.general);
  console.log({ data });
  return (
    <div
      id="receipt-ref"
      // ref={receiptRef}
      // style={{ zoom: "0.95" }}
      className={`${poppins?.className} text-gray-800 w-full h-full  rounded`}
    >
      <div className="relative w-full h-full  bg-white  p-4  ">
        <div className="absolute w-full h-full flex items-center justify-center">
          <img
            className=" w-[450px] h-[450px] opacity-25"
            src="/logo.png"
            alt="Receipt Background"
          />
        </div>
        <div className="relative z-10 w-full">
          {/* <div className="h-screen">jj</div> */}
          <h2 className="text-2xl font-bold my-2">
            Ericman Block Manufacturing Enterprise
          </h2>
          <div className="flex space-x-2 text-gray-600">
            <span className="bg-blue-200 rounded-sm w-[65%] p-2">
              Dealers in: Blocks , Cement , Iron Rods & General Merchant
            </span>
            <span className="p-2 w-[35%] ">
              Contact us:
              <span className="flex space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M19.5 22.5a3 3 0 003-3v-8.174l-6.879 4.022 3.485 1.876a.75.75 0 01-.712 1.321l-5.683-3.06a1.5 1.5 0 00-1.422 0l-5.683 3.06a.75.75 0 01-.712-1.32l3.485-1.877L1.5 11.326V19.5a3 3 0 003 3h15z" />
                  <path d="M1.5 9.589v-.745a3 3 0 011.578-2.641l7.5-4.039a3 3 0 012.844 0l7.5 4.039A3 3 0 0122.5 8.844v.745l-8.426 4.926-.652-.35a3 3 0 00-2.844 0l-.652.35L1.5 9.59z" />
                </svg>
                {"   "}
                <span> P.O.Box 337 , Gicel Weija , Accra</span>
              </span>{" "}
              <span className="flex space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {"   "}
                <span>024-4453670 , 026-0665399</span>
              </span>
            </span>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="w-[65%]">
              <div className="flex space-x-2 ">
                <span className="font-semibold w-[40%]">Customer Name:</span>{" "}
                {data?.selectedCustomer?.name ?? "_____"}
              </div>
              <div className="flex space-x-2 ">
                <span className="font-semibold w-[40%]">Address:</span>{" "}
                {data?.selectedCustomer?.address ?? "_____"}
              </div>
              <div className="flex space-x-2 ">
                <span className="font-semibold w-[40%]">Phone:</span>{" "}
                {data?.selectedCustomer?.phone ?? "_____"}
              </div>
            </div>
            <div className="w-[35%]">
              <div className="flex space-x-2 ">
                {" "}
                <span className="font-semibold w-[30%]">Branch:</span>
                {user?.branch}
              </div>
              <div className="flex space-x-2 ">
                {" "}
                <span className="font-semibold w-[30%]">Sale ID:</span>{" "}
                {data?.saleID ?? "_____"}
              </div>
              <div className="flex space-x-2 ">
                {" "}
                <span className="font-semibold w-[30%]">Date:</span>{" "}
                {data?.date ?? "_____"}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <table className="border-2 w-full mt-4 mb-4">
              <tr className="font-semibold bg-blue-500 text-white text-center ">
                <td className="w-[35%] border-2">Item</td>
                <td className="w-[15%] border-2">Unit(s)</td>
                <td className="w-[15%] border-2">Quantity</td>
                <td className="w-[17.5%] border-2">Unit Price</td>
                <td className="w-[17.5%] border-2">Amount</td>
              </tr>
              {data?.rows?.length > 0 ? (
                data?.rows?.map((i) => {
                  return (
                    <tr className="odd:bg-gray-50">
                      <td className="w-[35%] border-2 px-2">{i?.name}</td>
                      <td className="w-[15%] border-2 px-2">{i?.unit}</td>
                      <td className="w-[15%] border-2 px-2">{i?.quantity}</td>
                      <td className="w-[17.5%] border-2 text-end px-2">
                        {i?.unit_price}
                      </td>
                      <td className="w-[17.5%] border-2 text-end px-2">
                        {i?.p_amount}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-2">
                    No items ...
                  </td>
                </tr>
              )}
            </table>
          </div>
          <div className="flex justify-end">
            <div className="w-[35%]">
              <div className="flex space-x-2">
                <span className="font-semibold w-[70%]">Net Total Amount:</span>{" "}
                <span className="text-end w-[40%] px-2">
                  {formatCurrency(data?.total)}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className="font-semibold w-[60%]">Discount :</span>{" "}
                <span className="text-end w-[40%] px-2">
                  {data?.discount ?? "_____"}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className="font-semibold w-[60%]">Amount Paid:</span>{" "}
                <span className="text-end w-[40%] px-2">
                  {data?.amountPaid ?? "0.00"}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className="font-semibold w-[60%]">Balance:</span>{" "}
                <span className="text-end w-[40%] px-2">
                  {formatCurrency(data?.amountPaid - data?.total)}
                </span>
              </div>
              <div className="flex space-x-2">
                <span className="font-semibold w-[60%]">
                  Gross Total Amount:
                </span>{" "}
                <span className="text-end w-[40%] px-2 font-semibold">
                  {formatCurrency(
                    parseFloat(data?.discount) + parseFloat(data?.total)
                  )}
                  {/* {formatCurrency(
                    data?.rows?.reduce((ac, i) => {
                      ac += i?.p_amount;
                      return ac;
                    }, 0)
                    // data?.total + data?.discount
                  )} */}
                </span>
              </div>
            </div>
          </div>
          <hr />

          <div>
            <div>Terms</div>
            <ul>
              <li className="flex space-x-2 items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {" "}
                  Customers should make sure they are satisfied with details
                  before collection of goods
                </span>
              </li>
              <li className="flex space-x-2 items-center">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Goods sold out are not returnable</span>
              </li>
              <li className="flex space-x-2 items-center">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span> Exchange of goods are not allowed after delivery</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <div>
      <div id="prin-section" className="flex justify-center">
        <video autoPlay src="/check.mp4" className="h-24 w-24" />
      </div>
      <div className="mt-2 mb-3 text-green-700 font-semibold text-base">
        Sales made successfully
      </div>
    </div> */}
    </div>
  );
}
