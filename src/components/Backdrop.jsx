import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

export default function CustomBackdrop({ isLoading, text }) {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
      // onClick={handleClose}
    >
      <div className="min-w-[200px] max-w-[350px] h-[100px] rounded-lg p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full rounded-lg h-full backdrop-blur-lg bg-[#3939391b]  backdrop-filter">
          &nbsp;
        </div>
        <div className="flex flex-col items-center">
          <CircularProgress color="inherit" />
          <div className="relative z-10 p-4 text-sm">
            {text === "" ? "Loading ..." : text}
          </div>
        </div>
      </div>
      {/* <CircularProgress color="inherit" /> */}
    </Backdrop>
  );
}
