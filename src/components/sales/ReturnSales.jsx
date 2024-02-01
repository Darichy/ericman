import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import React, { useEffect, useState } from "react";
import { DataGrid, GridAddIcon } from "@mui/x-data-grid";
import { Slide } from "@mui/material";
import Fab from "@mui/material/Fab";
import axios from "axios";
import { API_SERVER, formatDateTime } from "@/utils/constants";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";
import Datatable from "../Datatable";
import { useRouter } from "next/router";
import { Checkbox, LoadingOverlay, Modal, Tooltip } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import Image from "next/image";
import { poppins } from "@/layouts/AuthLayout";
import { Tag } from "@/pages/dashboard/[userId]/sales/[[...sales]]";
import CustomBackdrop from "../Backdrop";
import Filter from "../Filter";

export default function ReturnSale({ setChecked1, setShowModal }) {
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
  const [originalRows, setOriginalRows] = useState([]);
  const [customers, setCustomers] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
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
  const [showSearch, setShowSearch] = useState(false);
  const [OSaleID, setOSaleID] = useState("");
  const [checked, setChecked] = useState(false);
  const [pLoading, setPLoading] = useState(false);
  const [rReason, setrReason] = useState("");
  const showAlert = useSnackbar();
  const { data: session } = useSession();
  const router = useRouter();

  const columns = [
    {
      field: "name",
      headerName: "Item",
      flex: 1,
      renderCell: ({ row }) => row.product?.name,
    },
    {
      field: "unit",
      headerName: "Units",
      flex: 1,
      renderCell: ({ row }) => row.product?.unit,
    },
    {
      field: "unit_price",
      headerName: "Unit price",
      flex: 1,
      renderCell: ({ row }) => formatCurrency(row?.unit_price),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "p_amount",
      headerName: "Amount",
      flex: 1,
      renderCell: ({ row }) => formatCurrency(row.unit_price * row.quantity),
    },
    {
      field: "Action",
      headerName: "Action",
      flex: 1,
      renderCell: ({ row, id }) => (
        <div className=" flex space-x-2 justify-center">
          <div
            onClick={() => {
              // console.log({ uu: params });
              // setShowModal({ status: true, id: id, type: "edit" });
              setEdit({ status: true, id });
              setFormData((prev) => ({
                ...prev,
                ...row,
                unit: row.product?.unit,
                unit_price: formatCurrency(row?.unit_price),
                amount: formatCurrency(row?.unit_price * row?.quantity),
              }));
              setSelectedProduct({
                id: row?.product_id,
                unit: row?.unit,
                name: row?.name,
              });
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
              setRows(rows.filter((i, key) => key !== id));
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
      //   <div className={`flex space-x-2 justify-center`}>
      //     <div
      //       onClick={() => {
      //         // console.log({ uu: params });
      //         // setShowModal({ status: true, id: id, type: "edit" });
      //         setEdit(true);
      //         setFormData((prev) => ({
      //           ...prev,
      //           ...row,
      //           unit: row.product?.unit,
      //           unit_price: formatCurrency(row?.unit_price),
      //           amount: formatCurrency(row?.unit_price * row?.quantity),
      //         }));
      //         setSelectedProduct({
      //           id: row?.product_id,
      //           unit: row?.unit,
      //           name: row?.name,
      //         });
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
      //         setRows(rows.filter((i, key) => key !== id));
      //       }}
      //       className="h-8 flex justify-center items-center cursor-pointer bg-red-500 hover:bg-red-400 rounded my-3"
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

  useEffect(() => {
    let sum = 0;
    rows.map((i) => {
      const amount = i?.quantity * i?.unit_price;
      sum += amount;
    });

    setTotal(formatCurrency(`${sum}`));
  }, [rows]);

  async function getSaleId() {
    setLoading(true);
    setRows([]);
    setUnits([]);
    setAmountPaid("");
    setBalance("");
    setTotal("");
    // setTotal2("");
    setDiscount("");
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

    Promise.all([getBranches(), getSaleId()]);
  }, []);

  async function handleSubmit() {
    if (rReason == "") {
      showAlert("", "Kindly enter return reason");
      return;
    }
    setShowSearch({ status: false });
    try {
      if (rows.length > 0) {
        setLoading(true);
        const payload = {
          sale_id: saleID.toString(),
          total_amount: parseFloat(total),
          branch_id: session?.user?.branch_id,
          initiated_by: session?.user?.id,
          products: rows.map((i) => ({
            product_id: i.product?.id,
            quantity: i.quantity,
            unit_price: i.unit_price,
            cost_price: i.cost_price,
          })),
          return_reason: rReason,
          status: "RETURNED",
          original_sale_id: OSaleID,
          buyer_name: selectedCustomer?.name,
          buyer_phone: selectedCustomer?.phone,
          buyer_address: selectedCustomer?.address,
        };
        // return console.log({ payload });
        const response = await axios.post("/api/sales/new-sale", {
          ...payload,
        });
        if (response?.status === 201) {
          showAlert("", response.data?.message);
          setLoading(false);
          return;
        }
        showAlert("success", response.data?.message);

        setRows([]);
        setAmountPaid("");
        setBalance("");
        setDiscount("");
        setLoading(false);
        setChecked1((prev) => !prev);
        setShowModal({ status: false });
        // setShowFinal(true);
      } else {
        showAlert("", "You have not recorded any goods to return");
      }
      // router.push("/dashboard/admin/sales");
    } catch (error) {
      console.log(error);
    }
  }

  console.log({ formData });

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

  console.log({ formData });
  function editSales() {
    if (formData?.quantity === "" || formData?.quantity === 0) {
      showAlert("", `Return quantity cannot be empty or 0`);
      return;
    }
    if (
      OSaleID &&
      parseFloat(formData.quantity) >
        originalRows?.find((i) => formData?.product?.name === i?.product?.name)
          ?.quantity
    ) {
      showAlert("", `Cannot return more than was bought`);
      return;
    }
    setEdit(false);
    let sum = 0;
    // rows.forEach((i) => {
    //   sum += i.unit_price * i.quantity ?? 0;
    // });
    // sum += formData?.unit_price * formData?.quantity;
    // setTotal(sum);
    // setTotal2(sum);

    const arr = [...rows];
    arr[edit?.id] = { ...formData };
    setRows(arr);
    setUnits([]);

    setFormData({
      name: "",
      unit_price: "",
      quantity: "",
      unit: "",
      amount: "",
      product: { name: "" },
    });
    setSelectedProduct("");
  }

  function addToSales() {
    setEdit(false);
    if (formData.p_quantity == "0") {
      showAlert("", `The quantity of ${formData.name} cannot be zero`);
      return;
    }

    if (
      formData.product_id == "" ||
      formData.unit == "" ||
      formData.quantity == ""
    ) {
      showAlert("", "Kindly fill all required fields");
      return;
    }

    if (rows.some((i) => i.unit == formData?.unit)) {
      showAlert("", "Cannot have the same product twice ");
      return;
    }
    let sum = 0; // if (!Object.values(formData).includes("")) {
    rows.map((i) => {
      sum += i.p_amount ?? 0;
    });
    sum += formData.p_amount;
    setTotal(sum);
    // setTotal2(sum);
    setAmountPaid(sum);
    setDiscount(0);
    setBalance(0);
    const { ...rest } = formData;
    setRows((prev) => [...prev, { ...rest }]);
    setUnits([]);
    setSelectedProduct("");
    setFormData({
      name: "",
      unit_price: "",
      quantity: "",
      unit: "",
      amount: "",
      return: "",
    });
  }

  console.log(
    { originalRows },
    originalRows?.find((i) => "Cement" === i?.product?.name)
  );
  async function getCustomers() {
    try {
      axios
        .post(`/api/customers/get-customers?search=${selectedCustomer}`, {
          key: "search",
          branch_id: session?.user?.branch_id,
        })
        .then((response) => {
          setCustomers(response.data);
        });
    } catch (e) {
      console.log(e, "c");
    }
  }
  console.log({ rows });
  useEffect(() => {
    if (OSaleID) {
      setLoading(true);
      setLoadingText("Loading...");
      axios
        .post("/api/sales/get-sale-details", {
          key: "saleDetails",
          id: OSaleID,
        })
        .then((response) => {
          setLoading(false);
          setLoadingText("");
          const sale = response.data?.sale;
          if (sale !== null) {
            setTotal(sale.total_amount);
            setDiscount(sale.discount);
            setAmountPaid(sale.amount_paid);
            setBalance(sale.amount_paid - sale.total_amount);

            setSelectedCustomer({
              name: sale?.buyer_name,
              address: sale.buyer_address,
              phone: sale.buyer_phone,
            });
            console.log({ response, sale });
            // return;
            setRows(sale.products);
            setOriginalRows(sale?.products);
          } else {
            setTotal("");
            setDiscount("");
            setAmountPaid("");
            setBalance("");
            setSelectedCustomer({
              name: "",
              address: "",
              phone: "",
            });
            setRows([]);
          }
        });
    }
  }, [checked]);

  // useEffect(() => {
  //   setLoading(true);
  //   axios
  //     .post(`/api/stocks/get-products?search=${selectedProduct}`, {
  //       branch_id: session?.user?.branch_id,
  //     })
  //     .then((response) => {
  //       setLoading(false);
  //       setProducts(response.data);
  //     });
  // }, [selectedProduct]);

  useEffect(() => {
    getCustomers();
  }, [selectedCustomer]);

  console.log({ customers, rows });
  return (
    <div className={`${poppins.className} text-sm scale-[0.95]"`}>
      <Modal
        closeOnClickOutside={false}
        centered
        title={
          <div className="uppercase font-semibold text-sm">
            {showSearch?.type === "final" ? "Return Reason" : "Search sales"}
          </div>
        }
        size={"50%"}
        className="h-[80%]"
        onClose={() => {
          setShowSearch({ status: false });
        }}
        opened={showSearch?.status && showSearch?.type !== "final"}
      >
        {showSearch?.type === "final" ? (
          <div className="flex flex-col">
            <InputField
              label={"Please Enter Return Reason"}
              onChange={(e) => {
                setrReason(e.target.value);
              }}
            />
            <div className="flex justify-end my-2">
              <Button label={"Return sale"} onClick={handleSubmit} />
            </div>
          </div>
        ) : (
          <Search
            setChecked={setChecked}
            setShowModal={setShowSearch}
            setSelected={setOSaleID}
          />
        )}
      </Modal>

      <Modal
        closeOnClickOutside={false}
        centered
        title={
          <div className="uppercase font-semibold text-sm">
            {showSearch?.type === "final" ? "Return Reason" : "Search sales"}
          </div>
        }
        size={"30%"}
        className="h-[80%]"
        onClose={() => {
          setShowSearch({ status: false });
        }}
        opened={showSearch?.status && showSearch?.type === "final"}
      >
        {showSearch?.type === "final" ? (
          <div className="flex flex-col">
            <InputField
              label={"Please Enter Return Reason"}
              onChange={(e) => {
                setrReason(e.target.value);
              }}
            />
            <div className="flex justify-end my-2">
              <Button label={"Return sale"} onClick={handleSubmit} />
            </div>
          </div>
        ) : (
          <Search
            setChecked={setChecked}
            setShowModal={setShowSearch}
            setSelected={setOSaleID}
          />
        )}
      </Modal>
      <div></div>
      <div className="bg-white rounded border-2    flex space-x-3 justify-between py-2 px-3">
        <div className="w-[33%] ">
          <div className="space-y-2 mt-2 ">
            <div className="flex pt-2 space-x-3 justify-between items-end">
              <div className="w-[85%]">
                <InputField
                  label={"Original sale ID"}
                  value={OSaleID}
                  onChange={(e) => {
                    // 231013ANY006
                    setOSaleID(e.target.value);
                    if (!e.target.value) {
                      setTotal("");
                      setDiscount("");
                      setAmountPaid("");
                      setBalance("");
                      setFormData({
                        name: "",
                        unit_price: "",
                      });
                      setSelectedCustomer({
                        name: "",
                        address: "",
                        phone: "",
                      });
                      setSelectedProduct("");
                      setRows([]);
                    }
                  }}
                  width={100}
                />
              </div>

              <Button
                label={OSaleID ? "Fetch" : "Search"}
                onClick={() => {
                  OSaleID
                    ? setChecked(!checked)
                    : setShowSearch({ status: true });
                }}
              />
            </div>
            <InputField
              value={selectedCustomer?.name}
              type={"text"}
              label={"Buyer name"}
              disabled={OSaleID}
              width={100}
              // onChange={(e) => {
              //   setSelectedCustomer((prev) => ({
              //     ...prev,
              //     address: e.target.value,
              //   }));
              // }}
              // width={50}
            />
            {/* {OSaleID ? (
              
            ) : (
              <div className="">
                <label className="text-sm font-medium text-[#2d2d8e]">
                  Buyer name
                </label>

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
                  noOptionsText={<div>No Customer match</div>}
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
            )} */}
            <div className="flex space-x-2">
              <InputField
                value={selectedCustomer?.address}
                type={"text"}
                label={"Address"}
                disabled={true}
                width={100}
                onChange={(e) => {
                  setSelectedCustomer((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }));
                }}
              />
              <InputField
                value={selectedCustomer?.phone}
                type={"text"}
                label={"Phone"}
                disabled={true}
                width={100}
                onChange={(e) => {
                  setSelectedCustomer((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
        {originalRows?.length > 0 && OSaleID && (
          <div className=" flex-grow p-2 text-xs shadow text-gray-500 rounded border h-full overflow-y-auto bg-green-50">
            <div className="font-semibold">Detail of Original Sale</div>
            <table className="w-full">
              <tr>
                <th>Item</th>
                <th>Unit</th>
                <th>Quantity</th>
              </tr>
              {originalRows?.map((i) => (
                <tr className="text-center">
                  <td>{i?.product?.name}</td>
                  <td>{i?.product?.unit}</td>
                  <td>{i?.quantity}</td>
                </tr>
              ))}
            </table>
          </div>
        )}
        <div className="bg-white  px-2 py-2 space-y-2 w-[30%] border-indigo-300 rounded  border-dashed border-2 ">
          <div className="flex justify-between items-center">
            <div className=" uppercase text-sm font-semibold">Sale summary</div>
            <div className="flex w-[200px] space-x-2 justify-between items-center">
              <label className="whitespace-nowrap ">Sales ID</label>
              <input
                type="text"
                disabled
                value={saleID}
                className="text-zinc-800 font-semibold  w-[65%] text-xs bg-purple-100 py-1 px-3 rounded"
              />
            </div>
          </div>
          <hr />

          {/* <div className="w-[50%] space-y-4">
              <InputField
                textAlign={"right"}
                label={"Amount Paid"}
                width={100}
                value={amountPaid}
                onChange={(e) => {
                  setBalance(parseFloat(e.target.value) - parseFloat(total));
                  setAmountPaid(e.target.value);
                }}
              />

              <InputField
                textAlign={"right"}
                label={"Balance"}
                width={100}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div> */}

          <div className="  ">
            {/* <InputField
                textAlign={"right"}
                label={"Discount"}
                width={100}
                value={discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  setTotal(parseFloat(total2) - parseFloat(e.target.value));
                  setAmountPaid(
                    parseFloat(total2) - parseFloat(e.target.value)
                  );
                }}
              /> */}

            <div className="flex flex-col space-y-4 justify-end items-end mt-3">
              <InputField
                label={"Total"}
                width={100}
                textAlign={"right"}
                disabled={true}
                value={total}
              />

              <Button
                label={"Submit Sale"}
                onClick={() => {
                  if (rows?.length <= 0) {
                    showAlert("", "You have not recorded any goods to return");
                    return;
                  } else {
                    setShowSearch({ status: true, type: "final" });
                  }
                }}
                width={50}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mt-2 border-2 rounded py-2  overflow-y-auto">
        <LoadingOverlay
          loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
          visible={loading}
          overlayBlur={2}
        />
        {/* <CustomBackdrop text={loadingText} isLoading={loading} /> */}
        <div className="w-[34.5%] relative space-y-2 border-r-2    border-gray-200">
          <div className="bg-white  p-3 space-y-4">
            {/* <div>
              <label className="text-sm font-medium text-[#2d2d8e]">
                Product Name
              </label>
              <Autocomplete
                // disablePortal
                id="combo-box-demo"
                options={products}
                size="small"
                // disabled={OSaleID}
                value={selectedProduct}
                onChange={async (e, v) => {
                  console.log(v, "vvvv");
                  if (v != null) {
                    setSelectedProduct(v);
                    setLoading(true);
                    // setLoadingText("Fetching Stock Data ...");
                    const response = await axios.post(
                      `/api/stocks/get-stocks`,
                      {
                        key: "distro",
                        product_id: v?.id,
                        branch_id: session?.user?.branch_id,
                      }
                    );
                    // setLoadingText("");
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
                      amount: formatCurrency(`${in_stock?.selling_price * 1}`),
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
                noOptionsText={<div>No product match</div>}
                loading={pLoading}
                loadingText={"searching..."}
                renderInput={(params) => {
                  // console.log({ params });
                  const { InputLabelProps, ...rest } = params;
                  return (
                    <TextField
                      {...rest}
                      disabled={OSaleID}
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
                        setSelectedProduct(e.target.value);
                      }}
                      // label="Product Name"
                    />
                  );
                }}
              />
            </div> */}

            <InputField
              required={false}
              label={"Product Name"}
              disabled={true}
              value={formData?.product?.name}
              width={100}
            />

            <div className="flex space-x-2">
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Unit Price"}
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
                  value={formData?.unit}
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-[50%]">
                <InputField
                  required={false}
                  label={"Amount"}
                  width={100}
                  disabled={true}
                  value={formData?.amount}
                />
              </div>

              <div className="w-[50%]">
                <InputField
                  label={"Return Quantity"}
                  width={100}
                  value={formData?.quantity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: e.target.value && parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            {/* <InputField label={"Sales Price"}disabled={OSaleID} /> */}
            <div className="flex justify-end space-x-2 items-end">
              {/* <div className="w-[50%]"> */}
              {/* <InputField
                  label={"Amount"}
                  width={100}
                  disabled={OSaleID}
                  value={formData?.return * formData?.unit_price}
                /> */}
              {/* </div> */}

              {edit && (
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
                  label={"return goods"}
                  width={50}
                />
              )}
            </div>
          </div>

          <Modal
            centered
            opened={showFinal}
            onClose={() => {
              setShowFinal(false);
            }}
          >
            <div
              style={{ zoom: "0.95" }}
              className="flex  justify-center bg-gray-50 rounded border border-dashed border-green-600"
            >
              <div>
                <div className="flex justify-center">
                  {" "}
                  <video autoPlay src="/check.mp4" className="h-24 w-24" />
                </div>
                <div className="mt-2 mb-3 text-green-700 font-semibold text-base">
                  Sales made successfully
                </div>
              </div>
            </div>

            <hr className="my-4" />
            <div className="flex justify-between mt-3">
              <button className="bg-black px-3 py-1 text-white rounded">
                Print Receipt
              </button>
              <button
                onClick={() => {
                  setShowFinal(false);
                  router.push("/dashboard/admin/sales");
                }}
                className="bg-gray-200 p-2 w-20 rounded"
              >
                Skip
              </button>
            </div>
          </Modal>
          {/* <div className="px-3 py-2"> */}

          {/* </div> */}
          {/* <div className="absolute top-[28%] -right-8">
            <Fab
              color="primary"
              onClick={() => {
                if (
                  formData.name == "" ||
                  formData.unit == "" ||
                  formData.p_quantity == ""
                ) {
                  showAlert("", "Kindly fill all required fields");
                  return;
                }
                let sum = 0; // if (!Object.values(formData).includes("")) {
                rows.map((i) => {
                  sum += parseFloat(i.p_amount.replaceAll(",", "")) ?? 0;
                });
                sum += parseFloat(formData.p_amount.replaceAll(",", ""));
                setTotal(sum);
                setTotal2(sum);
                setAmountPaid(sum);
                setDiscount(0);
                const { cost_price, label, quantity, ...rest } = formData;
                setRows((prev) => [...prev, { ...rest }]);
                setUnits([]);
                setFormData({
                  name: "",
                  selling_price: "",
                  p_quantity: "",
                  unit: "",
                  p_amount: "",
                  quantity: "",
                });

                setItem("");
                // }
              }}
              className="bg-blue-500"
            >
              <GridAddIcon />
            </Fab>
          </div> */}
        </div>

        <div className="flex-grow scale-95 -mx-6 ">
          <Datatable rows={rows} columns={columns} />
        </div>
      </div>
    </div>
  );
}

function Search({ setShowModal, setSelected, setChecked }) {
  const [filterParams, setFilterParams] = useState();
  const [loading, setLoading] = useState();
  const [rows, setRows] = useState([]);
  const [refetch, setRefetch] = useState(false);

  // const { data: session } = useSession();
  const columns = [
    {
      field: "sale_id",
      headerName: "Sale ID",
      flex: 1,
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
      field: "buyer",
      headerName: "Buyer",
      flex: 1,
      renderCell: (param) => {
        return param.row.sale.buyer_name;
      },
    },
    {
      field: "name",
      headerName: "Product",
      flex: 1,
      renderCell: (param) => {
        return param.row.product.name;
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",

      flex: 0.5,
    },
    // {
    //   field: "p_amount",
    //   headerName: "Amount",
    //   flex: 1,
    //   renderCell: (param) => {
    //     console.log(param.row.quantity * param.row.unit_price, "total");
    //     return param.row.quantity * param.row.unit_price;
    //   },
    //   valueFormatter: ({ value }) => {
    //     return console.log({ value });
    //   },
    // },
    {
      // field: "p_amount",
      headerName: "Sale Date",
      flex: 1,
      renderCell: (param) => {
        // console.log(param.row.quantity * param.row.unit_price, "total");
        return (
          <div className={`${poppins?.className} text-xs`}>
            {formatDateTime(param.row.sale.created_at)}
          </div>
        );
      },
    },
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

      getActions: ({ row }) => {
        return [
          <div
            onClick={() => {
              setSelected(row.sale_id);
              setChecked((prev) => !prev);
              setShowModal({ status: false });
              // setDetails({ status: true, id: row.id });
            }}
            className="h-8 flex justify-center items-center cursor-pointer   p-1    my-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 hover:stroke-emerald-500 hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
              />
            </svg>
          </div>,

          ,
        ];
      },
    },
  ];

  // const columns = arr.filter((i) => {
  //   return i !== undefined;
  // });
  async function handleDateChange(value) {
    setFilterParams(value);
    if (!value.includes(null)) {
      setLoading(true);
      const response = await axios.post("/api/sales/get-sales", {
        filters: { dateRange: value, key: "returnSearch" },
      });
      setRefetch(!refetch);
      setLoading(false);
      setRows(response.data.sales);
    }
  }

  function onCloseDate() {
    // setFilters(false);
    setFilterParams([]);
    // setChecked(!checked);
  }
  return (
    <div className={`${poppins?.className} space-y-2 text-sm"`}>
      <div className="h-4"></div>
      <div className="flex justify-end text-sm">
        <Filter
          rows={rows}
          setRows={setRows}
          refetch={refetch}
          filterOptions={["Buyer Name-sale.buyer_name"]}
          onCloseDate={onCloseDate}
          dateFilter={{ value: filterParams, onChange: handleDateChange }}
        />
      </div>
      <div className="scale-[0.95] -mx-4">
        <Datatable
          loading={loading}
          rowsPerPage={5}
          rows={rows}
          columns={columns}
        />
      </div>
      <div className="h-10"></div>
    </div>
  );
}
