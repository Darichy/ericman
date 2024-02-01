import useSnackbar from "@/hooks/useSnackbar";
import { LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import SelectField from "../SelectField";
import { Autocomplete, TextField } from "@mui/material";
import InputField from "../InputField";
import Button from "../Button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { emitEvent } from "@/store/websocketSlice";
import { poppins } from "@/layouts/AuthLayout";

export default function NewTransfer({
  totalGoods,
  setDistribution,
  setChecked,
  setOpenModal,
}) {
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const showAlert = useSnackbar();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  useEffect(() => {
    async function getBranches() {
      try {
        const response = await axios.get("/api/get-branches");
        if (response.status === 200) {
          // dispatch(authenticate);
          const filteredBranches = response.data.filter(
            (i) => i?.id !== session?.user?.branch_id
          );
          setBranches(filteredBranches);
          console.log(response.data, "branches", session);
        } else {
          console.log(response.data, "c");
        }
      } catch (e) {
        console.log(e, "c");
      }
    }

    Promise.all([getBranches()]);
  }, []);

  useEffect(() => {
    if (typeof selectedProduct === "string") {
      axios
        .post(`/api/stocks/get-products`, {
          query: selectedProduct,
        })
        .then((response) => {
          setProducts(response.data ?? []);
        });
    }
  }, [selectedProduct]);

  useEffect(() => {
    console.log(formData?.product_id, selectedBranch);
    if (selectedProduct?.id && selectedBranch) {
      setLoading(true);
      axios
        .post(`/api/stocks/get-stocks`, {
          key: "distro",
          product_id: selectedProduct?.id,
          branch_id: session?.user?.branch_id,
        })
        .then((response) => {
          // console.log(response, "hjhjhjh");
          // return;
          const { quantity, product } = response.data;
          setLoading(false);
          setFormData((prev) => ({
            ...prev,
            av_stock: quantity,
            unit: product?.unit,
            // totalRem,
          }));

          if (response?.data === null) {
            setFormData((prev) => ({
              ...prev,
              av_stock: 0,
              unit: 0,
              // totalRem,
            }));
            return;
          }
        });
    }
  }, [selectedProduct, selectedBranch]);

  function addToList() {
    if (!formData?.t_quantity || !selectedBranch || !selectedProduct) {
      showAlert("", "Kindly fill all required fields");
      return;
    }
    if (formData?.t_quantity > formData?.av_stock) {
      showAlert("", "You do not have enough goods to transfer");
      return;
    }

    if (list.some((i) => selectedProduct?.name === i?.name)) {
      showAlert(
        "",
        "You cannot have two sets of the same product in one transfer"
      );
      return;
    }
    setList((prev) => [
      ...prev,
      {
        id: selectedProduct?.id,
        name: selectedProduct?.name,
        quantity: formData?.t_quantity,
        unit: formData?.unit,
        quantity: formData?.t_quantity,
      },
    ]);
    setFormData({
      av_stock: "",
      unit: "",
      t_quantity: "",
    });

    setSelectedProduct("");
  }

  async function handleSubmit() {
    setLoading(true);
    const response = await axios.post("/api/stocks/create-transfer", {
      initiated_by: session?.user?.id,
      trans_branch: session?.user?.branch_id,
      receiving_branch: selectedBranch?.id,
      products: list,
    });
    dispatch(
      emitEvent({
        eventName: "sendNotification",
        eventData: { sender: session?.user?.username, to: selectedBranch?.id },
      })
    );
    dispatch(
      emitEvent({
        eventName: "sendNotification",
        eventData: { sender: session?.user?.username, to: "admin" },
      })
    );
    setLoading(false);
    showAlert("success", response.data.message);
    setChecked((prev) => !prev);
    setOpenModal(false);
  }

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
              label={"Receiving Branch"}
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
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="text-sm font-medium text-[#2d2d8e]">
                Product Name
              </label>
              <Autocomplete
                // disablePortal
                id="combo-box-demo"
                options={products}
                size="small"
                value={selectedProduct}
                onChange={(e, v) => {
                  // console.log(v, "vvv");

                  setSelectedProduct(v);
                  setFormData((prev) => ({
                    ...prev,
                    name: v?.name ?? "",
                    product_id: v?.product_id ?? "",
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
                      // label="Product Name"
                    />
                  );
                }}
              />
            </div>
            <div className="w-[50%]">
              <InputField
                required={false}
                label={"Units"}
                width={100}
                disabled={true}
                value={formData?.unit}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            {/* <div className="w-[50%]">
                  <SelectField
                    label={"Units"}
                    width={"100"}
                    value={formData?.unit}
                    data={units}
                    onChange={(e) => handleChange(e, "unit", true)}
                  />
                </div> */}
            <div className="w-[50%]">
              <InputField
                required={false}
                label={"Current Available stock"}
                width={100}
                disabled={true}
                value={formData?.av_stock}
              />
            </div>
            <div className="w-[50%]">
              <InputField
                required={false}
                label={"Transfer Quantity"}
                width={100}
                value={formData?.t_quantity}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    t_quantity: e.target.value && parseFloat(e.target.value),
                    // totalRem,
                  }));
                }}
              />
            </div>
          </div>

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
                onClick={handleSubmit}
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
          <div className="max-h-[100px] cursor-pointer mt-2 space-x-2 bg-gray-100 rounded p-2 justify-start flex flex-wrap overflow-y-auto space-y-1">
            {list.map((i) => (
              <div
                // onClick={() => {
                //   setFormData({
                //     ...i,
                //   });
                //   const arr = list?.filter((a) => a.name !== i.name);

                //   setList(arr);
                // }}
                className="bg-black text-white py-1 text-sm space-x-1 flex justify-between px-2 items-center rounded-full "
              >
                <span>
                  {i.name} - {i.quantity}
                  {i.unit}
                </span>
                <svg
                  onClick={() => {
                    const arr = list?.filter((a) => a.name !== i.name);

                    setList(arr);
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 fill-zinc-500 hover:fill-zinc-400 transition-all"
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
