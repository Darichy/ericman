import { poppins } from "@/layouts/AuthLayout";
import { Menu } from "@mantine/core";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Datatable({
  loading,
  rows,
  columns,
  rowsPerPage,
  checkboxSelection,
  onRowSelection,
  selectedRows,
  autosize,
}) {
  const { screenWidth } = useSelector((state) => state.general);
  // console.log({ screenWidth: innerWidth });
  const [size, setSize] = useState("");
  useEffect(() => {
    setSize(window.innerWidth);
  }, []);
  let count = -1;
  function counter() {
    return (count += 1);
  }

  return (
    <div
      style={{
        width: `${size < 768 ? `${size - 8}px` : "100%"}`,
      }}
      className=" overflow-x-auto hideScroll"
    >
      {/* <Box sx={{ height: 520, width: "100%" }}> */}
      <DataGrid
        className="bg-white shadow"
        autoHeight={true}
        loading={loading}
        getRowId={(row) => counter()}
        rows={rows}
        columns={columns}
        density="compact"
        onRowSelectionModelChange={onRowSelection}
        rowSelectionModel={selectedRows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: rowsPerPage || 10, // Use rowsPerPage if available, otherwise default to 10
            },
          },
        }}
        pageSizeOptions={[5, 10, 20, 50, 100]} // Add more page size options if needed
        disableRowSelectionOnClick
        checkboxSelection={checkboxSelection ?? false}
      />

      {/* </Box> */}
    </div>
  );
}
