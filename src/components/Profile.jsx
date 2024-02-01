import { poppins } from "@/layouts/AuthLayout";
import React, { useState } from "react";
import Button from "./Button";
import { Loader } from "@mantine/core";
import axios from "axios";
import useSnackbar from "@/hooks/useSnackbar";

export default function Profile({ username }) {
  const [showPassword, setShowPassword] = useState({ old: false, new: false });
  const [formData, setFormData] = useState({ username, oldP: "" });
  const [loading, setloading] = useState(false);
  const showAlert = useSnackbar();
  async function validatePassword() {
    try {
      setloading(true);
      const response = await axios.post("/api/validate-password", {
        password: formData.oldP.trim(),
      });
      setloading(false);
      showAlert(
        response.status === 200 ? "success" : "",
        response.data?.message
      );
      if (response.status === 200) {
        setShowPassword({ new: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handlePasswordChange() {
    try {
      if (formData.newP === "" || formData.conNewP === "") {
        showAlert("", "Kindly fill all fields");
        return;
      }

      if (formData.newP !== formData.conNewP) {
        showAlert("", "Password mismatch , Please check!");
        return;
      }
      setloading(true);
      const response = await axios.post("/api/change-password", {
        password: formData.newP,
      });
      setloading(false);
      showAlert(
        response.status === 200 ? "success" : "",
        response.data?.message
      );
      if (response.status === 200) {
        setShowPassword({ new: false, old: false });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`${poppins.className} text-sm`}>
      <div className={`flex justify-center w-full `}>
        <div>
          <div className="font-semibold text-left text-[22px] text-gray-600">
            Your Profile -{" "}
            <span className="text-indigo-800">@{formData?.username}</span>
            {loading && (
              <div className="flex justify-center mt-3">
                <Loader color="blue" size="sm" variant="dots" />
              </div>
            )}
          </div>
          <img
            src={"/auth.jpg"}
            height={200}
            width={250}
            // alt="Auth image"
          />
        </div>
      </div>
      <div className="space-y-2">
        {/* <div className="flex items-center">
          <label className="w-[40%]">Username</label>
          <input
            value={`@${formData?.username}`}
            type="text"
            className="bg-gradient-to-b from-gray-200 to-gray-100 w-[60%] focus:ring ring-blue-500 focus:outline-none py-1 px-2 rounded"
          />
        </div> */}

        {showPassword?.old && (
          <div className="flex items-center">
            <label className="w-[40%] text-indigo-600">Enter password</label>

            <input
              autoFocus={true}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  validatePassword();
                }
              }}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, oldP: e.target.value }));
              }}
              type="text"
              className="bg-gradient-to-t from-gray-200 to-gray-100 w-[60%] focus:ring ring-blue-500 focus:outline-none py-1 px-2 rounded"
            />
          </div>
        )}
        {showPassword?.new && (
          <>
            {" "}
            <div className="flex items-center">
              <label className="w-[40%] text-indigo-600">New Password</label>
              <input
                autoFocus={true}
                value={formData.newP}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, newP: e.target.value }));
                }}
                type="text"
                className="bg-gradient-to-b from-gray-200 to-gray-100 w-[60%] focus:ring ring-blue-500 focus:outline-none py-1 px-2 rounded"
              />
            </div>
            <div className="flex items-center">
              <label className="w-[40%] text-indigo-600">
                Confirm Password
              </label>
              <input
                value={formData.conNewP}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, conNewP: e.target.value }));
                }}
                type="text"
                className="bg-gradient-to-b from-gray-200 to-gray-100 w-[60%] focus:ring ring-blue-500 focus:outline-none py-1 px-2 rounded"
              />
            </div>
          </>
        )}
      </div>
      <hr className="mt-4 mb-2" />
      <div className="flex justify-center mt-3">
        {(showPassword.old === false || showPassword.new === false) && (
          <Button
            label={"Change Password"}
            onClick={() => {
              setShowPassword({ old: true });
            }}
          />
        )}
        {showPassword.new && (
          <Button
            label={"Commit Changes"}
            onClick={() => {
              handlePasswordChange();
            }}
          />
        )}
      </div>
    </div>
  );
}
