import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_SERVER } from "@/utils/constants";
import { Snackbar } from "@mui/material";
import Slide from "@mui/material/Slide";
import InputField from "../InputField";
import SelectField from "../SelectField";
import Button from "../Button";
import { LoadingOverlay } from "@mantine/core";
import { useDispatch } from "react-redux";
import { setShowSnackbar } from "@/store/snackbarSlice";

import useSnackbar from "@/hooks/useSnackbar";
import { poppins } from "@/layouts/AuthLayout";

export default function NewBranch({ id, type, setShowModal, setChecked }) {
  const [loading, setLoading] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const showAlert = useSnackbar();
  console.log({ formData });

  function handleChange(e, name, select) {
    if (select) {
      return setFormData((prev) => ({ ...prev, [name]: e }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  }

  async function handleCreateBranch() {
    try {
      if (formData?.name == "" || formData?.code == "") {
        showAlert("", "Kindly fill all required fields");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/branches/create-branch", {
        ...formData,
      });

      setFormData({
        name: "",
        code: "",
      });

      setLoading(false);
      showAlert("success", response.data.message);
      setChecked((prev) => !prev);
      setShowModal({ status: false });
    } catch (e) {
      console.log(e, "c");
    }
  }

  async function updateBranchDetails() {
    try {
      setLoading(true);
      const response = await axios.post("/api/branches/update-branch", {
        ...formData,
      });

      setFormData({ name: "" });
      showAlert("success", response.data.message);
      setLoading(false);
      setShowModal(false);
      setChecked((prev) => !prev);
    } catch (e) {
      console.log(e, "c");
    }
  }
  useEffect(() => {
    if (type === "edit") {
      setFormData({
        name: id.name,
        code: id.code,
        prevCode: id.code,
      });
    }
  }, []);
  return (
    <div
      className={` ${poppins?.className} text-sm w-full  space-x-2 p-2 item-center"`}
    >
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <hr />
      <div className=" w-full space-y-2 rounded p-3  pr-5 border-gray-500">
        <InputField
          label={"Branch Name"}
          value={formData?.name}
          onChange={(e) => {
            handleChange(e, "name");
          }}
          width={100}
        />
        <InputField
          label={"Branch Code"}
          value={formData?.code}
          onChange={(e) => {
            handleChange(e, "code");
          }}
          width={100}
        />

        <hr />
        <div className="flex justify-end w-full mt-3">
          {type !== "edit" ? (
            <Button
              onClick={handleCreateBranch}
              label={"Create Branch"}
              width={100}
            />
          ) : (
            <Button
              onClick={updateBranchDetails}
              label={"Update branch"}
              width={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}
