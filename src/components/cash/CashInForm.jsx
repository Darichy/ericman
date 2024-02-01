import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import AuthLayout, { poppins } from "@/layouts/AuthLayout";

import { LoadingOverlay, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  API_SERVER,
  formatCurrency,
  formatDate,
  formatDateTime,
} from "@/utils/constants";
import { Snackbar, Switch } from "@mui/material";
import Slide from "@mui/material/Slide";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";

export default function CashInForm({
  cash,
  showModal,
  setShowModal,
  setChecked,
}) {
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    io: "O",
    branch_code: session?.user?.branch_code,
  });
  const [loading, setLoading] = useState(false);
  const [selectedType, setselectedType] = useState("");

  async function handleRevenueCreation() {
    try {
      if (
        formData?.amount == "" ||
        formData?.description == "" ||
        formData?.type == ""
      ) {
        showAlert("", "Kindly fill all required fields");
        // setLoading(false);
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/cash/add-transaction", {
        ...formData,
      });

      setFormData({
        description: "",
        amount: "",
        type: "",
      });
      setLoading(false);
      showAlert("success", response.data.message);
      setChecked((prev) => !prev);
      setShowModal({ status: false, type: "" });
    } catch (e) {
      console.log(e, "c");
    }
  }

  function handleChange(e, name, select) {
    if (select) {
      return setFormData((prev) => ({ ...prev, [name]: e }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  }

  async function updatecashDetails() {
    try {
      setLoading(true);
      const response = await axios.post("/api/cash/update-revenue", {
        ...formData,
      });

      setFormData({
        description: "",
        amount: "",
        type: "",
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
        id: cash?.id,
        type: cash?.type,
        description: cash?.description,
        amount: cash?.io === "O" ? -1 * cash?.amount : cash?.amount,
        io: cash?.io,
        // balance: cash?.balance,
        // created_by: session?.user?.username,
      });

      setselectedType(cash?.type);
    }
  }, []);

  async function getBF() {
    setLoading(true);
    const response = await axios.post("/api/cash/get-transactions", {
      key: "get-BF",
    });
    if (response?.status === 202) {
      showAlert("", response.data.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setFormData((prev) => ({
      ...prev,
      amount: response?.data?.bf,
      description: `B/F from ${formatDateTime(
        new Date(response?.data?.date),
        false
      )}`,
    }));
  }
  return (
    <div className={`${poppins?.className} w-full text-sm`}>
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <div className=" space-y-2 rounded p-3  bg-white pr-5 border-gray-500">
        <SelectField
          label={"Type of transaction"}
          data={["B/F", "DEPOSIT", "TO BANK", "OTHER"]}
          value={selectedType}
          onChange={(v) => {
            setselectedType(v);
            if (v === "DEPOSIT") {
              setFormData((prev) => ({ ...prev, io: "I" }));
            } else if (v === "B/F") {
              setFormData((prev) => ({ ...prev, io: "I" }));
              getBF();
            } else if (v === "TO BANK") {
              setFormData((prev) => ({ ...prev, io: "O" }));
            }
            setFormData((prev) => ({
              ...prev,
              type: v === "TO BANK" ? "BANK" : v === "B/F" ? "BF" : v,
            }));
          }}
          width={100}
        />

        <InputField
          label={"Description"}
          disabled={formData?.type === "BF"}
          value={formData?.description}
          onChange={(e) => {
            handleChange(e, "description");
          }}
        />

        <InputField
          label={"Amount"}
          type={"number"}
          disabled={formData?.type === "BF"}
          value={
            formData?.type === "BF"
              ? formatCurrency(formData?.amount)
              : formData?.amount
          }
          onChange={(e) => {
            handleChange(e, "amount");
          }}
          width={"100"}
        />
        <div>
          <label className="text-sm font-semibold text-[#2d2d8e] w-[45%]">
            Cash Out
          </label>
          <Switch
            disabled={formData?.type !== "OTHER" || formData?.type == "BANK"}
            checked={formData?.io === "I"}
            onChange={(e) => {
              if (e.target.checked) {
                setFormData((prev) => ({ ...prev, io: "I" }));
              } else {
                setFormData((prev) => ({ ...prev, io: "O" }));
              }
            }}
            // inputProps={{ 'aria-label': 'controlled' }}
          />
          <label className="text-sm font-semibold text-[#2d2d8e] w-[45%]">
            Cash In
          </label>
        </div>
        <div className="flex justify-end w-full mt-3">
          {showModal?.type === "edit" ? (
            <Button
              onClick={updatecashDetails}
              label={"Save Changes"}
              width={100}
            />
          ) : (
            <Button
              onClick={handleRevenueCreation}
              label={"Add Transaction"}
              width={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}
