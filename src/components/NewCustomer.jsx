import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import AuthLayout from "@/layouts/AuthLayout";
import { LoadingOverlay, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_SERVER } from "@/utils/constants";
import { Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";

export default function Newcustomer({
  customer,
  showModal,
  setShowModal,
  setChecked,
}) {
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    balance: "0.00",
  });
  const [loading, setLoading] = useState(false);
  async function handleCustomerCreation() {
    try {
      if (
        formData?.name === "" ||
        formData?.address === "" ||
        formData?.phone === ""
      ) {
        showAlert("", "Kindly fill all required fields");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/customers/create-customer", {
        ...formData,
      });

      setFormData({
        name: "",
        address: "",
        phone: "",
        balance: "",
        created_by: session?.user?.id,
      });
      setLoading(false);
      showAlert("success", response.data.message);
      setChecked((prev) => !prev);
      setShowModal({ status: false, type: "" });
    } catch (e) {
      console.log(e, "c");
    }
  }
  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  function handleChange(e, name, select) {
    if (select) {
      return setFormData((prev) => ({ ...prev, [name]: e }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value?.replace(/\s+/g, " "),
      }));
    }
  }

  async function updateCustomerDetails() {
    try {
      if (
        formData?.name === "" ||
        formData?.address === "" ||
        formData?.phone === ""
      ) {
        showAlert("", "Kindly fill all required fields");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/customers/update-customer", {
        ...formData,
      });

      setFormData({
        name: "",
        address: "",
        phone: "",
        balance: "",
        created_by: session?.user?.id,
      });
      setLoading(false);
      showAlert("success", response.data.message);
      setChecked((prev) => !prev);
      setShowModal({ status: false, type: "" });
    } catch (e) {
      console.log(e, "c");
    }
  }

  useEffect(() => {
    if (showModal.type === "edit") {
      setFormData({
        id: customer.id,
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        balance: customer.balance,
        created_by: session?.user?.id,
      });
    }
  }, []);
  return (
    <div className="w-full">
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <div className=" space-y-2 rounded p-3  bg-white pr-5 border-gray-500">
        <InputField
          label={"Customer Name"}
          value={formData?.name}
          onChange={(e) => {
            handleChange(e, "name");
          }}
          width={100}
        />
        <div className=" ">
          <InputField
            label={"Address"}
            value={formData?.address}
            onChange={(e) => {
              handleChange(e, "address");
            }}
            width={100}
          />
        </div>

        <div className="">
          <InputField
            value={formData?.phone}
            onChange={(e) => {
              handleChange(e, "phone");
            }}
            type={"number"}
            label={" Phone Number"}
            width={100}
          />
        </div>
        {/* <div className="">
          <InputField
            value={formData?.balance}
            onChange={(e) => {
              handleChange(e, "balance");
            }}
            type={"number"}
            label={" Balance"}
            width={500}
          />
        </div> */}

        <div className="flex justify-end w-full mt-3">
          {showModal?.type === "edit" ? (
            <Button
              onClick={updateCustomerDetails}
              label={"Save Changes"}
              width={100}
            />
          ) : (
            <Button
              onClick={handleCustomerCreation}
              label={"Create Customer"}
              width={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}
