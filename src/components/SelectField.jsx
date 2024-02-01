import { Select } from "@mantine/core";
import { Autocomplete, TextField } from "@mui/material";
import React from "react";

export default function SelectField({
  id,
  name,
  value,
  type,
  data,
  width,
  label,
  disabled,
  freeSolo,
  inputValue,
  onChange,
  multiple,
  required,
  onKeyDown,
  getOptionLabel,
}) {
  // const top100Films = [
  //   { label: "The Shawshank Redemption", year: 1994 },
  //   { label: "The Godfather", year: 1972 },
  //   { label: "The Godfather: Part II", year: 1974 },
  // ];
  return (
    <div>
      <div className="flex space-x-[2px]">
        <label className="text-sm font-medium text-[#2d2d8e]">{label}</label>
        {!required && <span className="text-red-500">*</span>}
      </div>
      <div style={{ width: `${width}%` }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={data ?? ["No data found"]}
          value={value}
          inputValue={inputValue}
          freeSolo={freeSolo ?? false}
          disabled={disabled ?? false}
          size="small"
          multiple={multiple ?? false}
          onKeyDown={onKeyDown}
          onChange={(event, newValue) => {
            if (newValue !== "") {
              if (freeSolo) {
                onChange(newValue);
              } else {
                onChange(newValue);
                console.log(newValue);
              }
            }
          }}
          getOptionLabel={getOptionLabel}
          onInputChange={
            freeSolo
              ? (event, newValue) => {
                  onChange(newValue);
                }
              : (event, newValue) => {}
          }
          renderInput={(params) => {
            const { InputLabelProps, ...rest } = params;
            return (
              <TextField
                // value={value}
                InputLabelProps={{
                  shrink: !!value,
                }}
                {...params}
                // label={label}
              />
            );
          }}
        />
        {/* <Select
        data={data ?? ["No data", "hghg", "yt"]}
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        type={type ?? "text"}
        style={{ width: `${width}%` }}
        className={`focus:ring-2 focus:ring-blue-500  focus:outline-none rounded py-1 pl-2 `}
      /> */}
      </div>
    </div>
  );
}
