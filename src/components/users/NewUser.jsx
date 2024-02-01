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
import { Poppins } from "@next/font/google";
import useSnackbar from "@/hooks/useSnackbar";

const poppins = Poppins({
  weight: ["400"],
  subsets: ["latin"],
});

export default function NewUser({ id, type, setShowModal, setChecked }) {
  const [loading, setLoading] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [hide, setHide] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    branch_id: "",
    role_code: "",
  });
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const showAlert = useSnackbar();
  console.log({ formData, roles });

  function handleChange(e, name, select) {
    if (select) {
      return setFormData((prev) => ({ ...prev, [name]: e ?? "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    }
  }

  function autoGeneratePassword() {
    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const length = 7;
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    setFormData((prev) => ({ ...prev, password: result }));
    return;
  }

  const dispatch = useDispatch();

  async function handleCreateUser() {
    try {
      if (
        formData.full_name == "" ||
        formData.branch_id == "" ||
        formData.phone == "" ||
        formData.role_code == "" ||
        formData.username == ""
      ) {
        showAlert("", "Kindly fill all required fields");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/users/create-user", {
        ...formData,
        role_code: formData.role_code?.code,
        branch_id: formData.branch_id?.id,
      });
      if (response.status === 200) {
        // dispatch(authenticate);
        setFormData({
          full_name: "",
          username: "",
          email: "",
          phone: "",
          branch_id: "",
          role_code: "",
        });

        // setBranches(response.data);
        setLoading(false);
        setShowModal(false);
        setChecked((prev) => !prev);
        showAlert("success", response.data.message);
        console.log(response.data, "c");
      } else if (response.status === 201) {
        setLoading(false);
        showAlert("", response.data.message);
      }
    } catch (e) {
      console.log(e, "c");
    }
  }

  async function getUserById() {
    setLoading(true);
    const response = await axios.post("/api/users/get-user-by-id", { id });
    const { full_name, username, email, phone, branch, role } = response.data;
    setFormData({
      id: response?.data?.id,
      full_name,
      username,
      email,
      phone,
      branch_id: { id: branch?.id, name: branch?.name },
      role_code: { description: role?.description, code: role?.code },
    });
    // setHide(true);
    setLoading(false);
  }

  async function updateUserDetails() {
    try {
      if (
        formData.full_name == "" ||
        formData.branch_id == "" ||
        formData.phone == "" ||
        formData.role_code == "" ||
        formData.username == ""
      ) {
        showAlert("", "Kindly fill all required fields");
        return;
      }
      setLoading(true);
      const response = await axios.post("/api/users/update-user", {
        ...formData,
        role_code: formData.role_code?.code,
        branch_id: formData.branch_id?.id,
        id: formData?.id,
      });
      setLoading(false);
      if (response?.status === 201) {
        showAlert("", response.data.message);
        return;
      }
      setFormData({
        id: "",
        full_name: "",
        username: "",
        email: "",
        phone: "",
        branch_id: "",
        role_code: "",
      });
      showAlert("success", response.data.message);
      // setBranches(response.data);

      setShowModal(false);
      setChecked((prev) => !prev);
    } catch (e) {
      console.log(e, "c");
      showAlert("", "Something went wrong :(");
    }
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

    async function getRoles() {
      try {
        const response = await axios.get("/api/get-roles");
        if (response.status === 200) {
          setRoles(response.data);
        } else {
          console.log(response.data, "c");
        }
      } catch (e) {
        console.log(e, "c");
      }
    }

    Promise.all([getBranches(), getRoles()]);
    // handleCustomerCreation();

    if (type === "edit") {
      getUserById();
    }
  }, []);
  return (
    <div
      className={` ${poppins.className} text-sm w-full  space-x-2 p-2 item-center"`}
    >
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <hr />
      <div className=" w-full space-y-3 rounded p-3  pr-5 border-gray-500">
        <InputField
          label={"Full name"}
          value={formData?.full_name}
          onChange={(e) => {
            handleChange(e, "full_name");
          }}
          width={100}
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
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          }
        />
        <InputField
          label={"Username"}
          value={formData?.username}
          onChange={(e) => {
            handleChange(e, "username");
          }}
          width={100}
        />
        <InputField
          label={"Email"}
          value={formData?.email}
          onChange={(e) => {
            handleChange(e, "email");
          }}
          required={false}
          width={100}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
              <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
            </svg>
          }
        />
        {!changePass && type === "edit" ? (
          <div className="flex w-full cursor-pointer space-x-2 items-center my-2 justify-between">
            <div className=" w-full">
              <div className="bg-yellow-50 border border-yellow-400 space-x-3 text-xs  flex items-center justify-center p-[6px] rounded text-gray-500 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 fill-yellow-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                    clipRule="evenodd"
                  />
                </svg>

                <span
                  className="hover:underline"
                  onClick={() => {
                    setChangePass(true);
                  }}
                >
                  Click here to change password
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className=" flex items-end space-x-3 justify-between">
            <div className="w-[70%]">
              <InputField
                value={formData?.password}
                onChange={(e) => {
                  handleChange(e, "password");
                }}
                label={" Password"}
                width={100}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 7a5 5 0 113.61 4.804l-1.903 1.903A1 1 0 019 14H8v1a1 1 0 01-1 1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 01.293-.707L8.196 8.39A5.002 5.002 0 018 7zm5-3a.75.75 0 000 1.5A1.5 1.5 0 0114.5 7 .75.75 0 0016 7a3 3 0 00-3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
            </div>
            <div className="w-[35%]">
              <Button
                onClick={autoGeneratePassword}
                label={"Autogenerate"}
                width={100}
              />
            </div>
          </div>
        )}
        <InputField
          label={"Phone"}
          type={"number"}
          value={formData?.phone}
          onChange={(e) => {
            handleChange(e, "phone");
          }}
          width={100}
        />
        <div className=" ">
          <SelectField
            label={"Role"}
            value={formData?.role_code}
            getOptionLabel={(row) => row.description ?? ""}
            onChange={(e) => {
              handleChange(e, "role_code", true);
              if (e?.code === "SA") {
                setHide(false);
              } else {
                setHide(true);
              }
            }}
            data={roles?.filter((i) => i?.code !== "SA")}
            width={"100"}
          />
        </div>
        {hide && (
          <div className=" ">
            <SelectField
              label={"Branch"}
              value={formData?.branch_id}
              getOptionLabel={(i) => i?.name ?? ""}
              onChange={(e) => {
                handleChange(e, "branch_id", true);
              }}
              data={branches}
              width={"100"}
            />
          </div>
        )}

        <hr />
        <div className="flex justify-end w-full mt-3">
          {type !== "edit" ? (
            <Button
              onClick={handleCreateUser}
              label={"Create User"}
              width={100}
            />
          ) : (
            <Button
              onClick={updateUserDetails}
              label={"Update User Information"}
              width={100}
            />
          )}
        </div>
      </div>
    </div>
  );
}
