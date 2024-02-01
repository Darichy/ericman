import React from "react";
import { Button as B } from "@mui/material";
import { poppins } from "@/layouts/AuthLayout";
function Button({ type, icon, width, label, onClick, color }) {
  const bgColor = color;
  return (
    <B
      variant="contained"
      className={`${poppins.className} capitalize rounded py-[0.3rem] bg-gradient-to-b from-cyan-500 to-blue-500  whitespace-nowrap text-[0.84rem]`}
      disableElevation
      onClick={onClick}
      icon={icon}
    >
      {label}
    </B>
  );
}

export default Button;
