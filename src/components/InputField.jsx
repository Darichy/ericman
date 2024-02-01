import React from "react";
import TextField from "@mui/material/TextField";
import { InputAdornment } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { poppins } from "@/layouts/AuthLayout";

export default function InputField({
  id,
  name,
  value,
  type,
  width,
  label,
  disabled,
  onChange,
  required,
  textAlign,
  icon,
  error,
  onBlur,
  onFocus,
}) {
  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: "#A0AAB4",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#c2c2c2",
        borderWidth: 2,
      },
      "&:hover fieldset": {
        borderColor: "#B2BAC2",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4d88d6",
      },
    },
  });

  return (
    // <div style={{ width: `${width}%` }}>
    <div className={`${poppins?.className} flex flex-col space-y-0  "`}>
      {/* <CssTextField
        InputLabelProps={{
          shrink: true / false,
        }}
        size="small"
        style={{ width: `${width}%` }}
        disabled={disabled}
        // focused={value}
        // autoFocus={true}
        error={error}
        label={label}
        value={value}
        type={type}
        onChange={onChange}
        // id="custom-css-outlined-input"
      /> */}

      <div className="flex space-x-[2px]">
        <label className="text-sm font-medium text-[#2d2d8e]">{label}</label>
        {required === false ? "" : <span className="text-red-500">*</span>}
      </div>
      <input
        value={value}
        style={{ width: `${width}%` }}
        autocomplete="off"
        className={`${
          disabled
            ? "bg-zinc-200 border  border-zinc-300"
            : "border-[1.5px] bg-zinc-50 border-gray-300 "
        } py-[5.5px] ${
          textAlign === "right" ? "text-right" : ""
        } rounded pl-4 pr-2 focus:outline-none focus:ring-2 transition-all focus:ring-blue-400 text-sm  text-gray-800 `}
        type={"text"}
        onFocus={onFocus}
        disabled={disabled}
        onChange={(e) => {
          if (type === "number" || type === "decimal") {
            const v = e.target.value
              .replace(/[^\d.]+/g, "")
              .replace(/^(\d*\.\d*)\./, "$1");

            const ev = { target: { value: v } };
            onChange(ev);
          } else {
            onChange(e);
          }
        }}
        onBlur={onBlur}
      />
    </div>
  );
}
