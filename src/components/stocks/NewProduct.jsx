import Button from "@/components/Button";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import AuthLayout from "@/layouts/AuthLayout";

import { LoadingOverlay, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

import StockLayout from "@/layouts/StockLayout";
import { Slide, Snackbar } from "@mui/material";
import axios from "axios";
import { API_SERVER } from "@/utils/constants";
import DynamicInputRows from "../test";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
function NewProduct({ setShowModal, setChecked, from, edit }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
  });
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const showAlert = useSnackbar();

  async function handleProductCreation() {
    if (formData.name === "" || formData.unit === "") {
      showAlert("", "Kindly fill all required fields");

      return;
    }
    try {
      setLoading(true);
      const url = !edit
        ? "/api/stocks/create-product"
        : "/api/stocks/update-product";
      const response = await axios.post(url, {
        ...formData,
      });
      console.log({ response });
      setLoading(false);
      if (response?.status === 202) {
        showAlert("", response.data?.message);

        return;
      }

      setShowModal({ status: false });

      setShowModal({ status: false });
      showAlert("success", response.data?.message);
      setChecked((prev) => !prev);
      setFormData({
        name: "",
        unit: "",
      });
    } catch (e) {
      console.log(e, "c");
    }
  }

  console.log({ formData }, "jfj");
  function handleChange(e, name, select) {
    if (select) {
      return setFormData((prev) => ({
        ...prev,
        [name]: e,
      }));
    }
    return setFormData((prev) => ({
      ...prev,
      [name]: e.target.value?.replace(/\s+/g, " "),
    }));
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
  console.log({ selectedBranch });
  useEffect(() => {
    getBranches();
    if (edit) {
      setFormData({
        id: edit?.id,
        name: edit?.name,
        unit: edit?.unit,
      });
    }
  }, []);
  return (
    <div className="flex justify-center space-x-2 p-2 full">
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <div className=" w-full space-y-3 h-1/2 overflow-y-auto rounded p-3 bg-white pr-5 border-gray-500">
        <InputField
          label={"Product Name"}
          onChange={(e) => {
            handleChange(e, "name");
          }}
          value={formData?.name}
          width={100}
        />

        {/* <div className="">
          <Autocomplete
            // disablePortal
            id="combo-box-demo"
            options={branches}
            size="small"
            // sx={{ width: 300 }}
            onChange={(e, v) => {
              setSelectedBranch(v?.id);
            }}
            value={selectedBranch}
            getOptionLabel={(i) => i?.name}
            // noOptionsText={<div>No product match</div>}
            renderInput={(params) => (
              <TextField
                // InputLabelProps={{
                //   shrink: true,
                // }}
                {...params}
                value={selectedBranch}
                label="Pick a branch"
              />
            )}
          />
        </div> */}
        <InputField
          label={"Unit"}
          width={100}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, unit: e.target.value }));
          }}
          value={formData?.unit}
        />

        {/* <SelectField
          label={"Branch"}
          value={selectedBranch}
          onChange={(e) => {}}
          data={branches}
          width={"100"}
        /> */}

        <hr />

        {/* <div className="h-[300px] overflow-y-auto">
          <DynamicInputRows
            setFormData={setFormData}
            branch_id={selectedBranch}
          />
        </div> */}

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleProductCreation}
            label={edit ? "Edit Product" : "Submit"}
            width={100}
          />
        </div>
      </div>
    </div>
  );
}

export default NewProduct;
