// components/DynamicInputRows.js
import React, { useEffect, useRef, useState } from "react";
import InputField from "./InputField";
import { useSession } from "next-auth/react";

const DynamicInputRows = ({ setFormData, branch_id }) => {
  const { data: session } = useSession();

  const [rows, setRows] = useState([
    {
      unit: "",
      cost_price: "",
      selling_price: "",
      quantity: 0,
      branch_id,
    },
  ]);
  const containerRef = useRef(null);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        unit: "",
        cost_price: "",
        selling_price: "",
        quantity: 0,
        branch_id,
      },
    ]);
  };

  useEffect(() => {
    setRows([
      {
        unit: "",
        cost_price: "",
        selling_price: "",
        quantity: 0,
        branch_id,
      },
    ]);
  }, [branch_id]);

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const deleteRow = (id) => {
    const updatedRows = rows.filter((row, key) => key !== id);
    setRows(updatedRows);
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, in_stock: rows }));
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [rows]);

  return (
    <table
      ref={containerRef}
      style={{ overflowY: "scroll", height: "200px" }}
      className="transition-all scroll-container"
    >
      <thead className>
        <tr className="">
          <td className="w-[15%]">Unit</td>
          <td className="w-[15%]">Cost price</td>
          <td className="w-[15%]">Selling Price</td>
          {/* <td className="w-[15%]">Quantity</td> */}
          <td className="w-[15%]">Action</td>
        </tr>
      </thead>

      {rows.map((row, index) => (
        <tr key={index} className=" justify-between items-center w-full">
          <td className="w-[25%]">
            <InputField
              required={false}
              // label={"Unit"}
              width={100}
              placeholder="Input 1"
              value={row.unit}
              onChange={(e) => handleInputChange(index, "unit", e.target.value)}
            />
          </td>
          <td className="w-[25%]">
            <InputField
              required={false}
              // label={"Cost Price"}
              type="number"
              width={100}
              placeholder="Input 2"
              value={row.cost_price}
              onChange={(e) =>
                handleInputChange(
                  index,
                  "cost_price",
                  parseFloat(e.target.value)
                )
              }
            />
          </td>
          <td className="w-[25%]">
            <InputField
              required={false}
              type="number"
              width={100}
              placeholder="Input 3"
              value={row.selling_price}
              onChange={(e) =>
                handleInputChange(
                  index,
                  "selling_price",
                  parseFloat(e.target.value)
                )
              }
            />
          </td>
          {/* 
          <td className="w-[25%]">
            <InputField
              required={false}
              type="number"
              width={100}
              placeholder="Input 3"
              value={row.quantity}
              onChange={(e) =>
                handleInputChange(index, "quantity", parseFloat(e.target.value))
              }
            />
          </td> */}

          <td className="w-[10%] flex">
            {rows.length > 1 && (
              <button
                className="addRowButton  px-2 py-2 bg-red-500 rounded-full"
                onClick={() => {
                  deleteRow(index);
                }}
              >
                x
              </button>
            )}

            {index === rows.length - 1 && (
              <button
                className="addRowButton  px-2 py-2 bg-blue-500 rounded-full"
                onClick={handleAddRow}
              >
                +
              </button>
            )}
          </td>
        </tr>
      ))}

      <style jsx>{`
        input[type="text"] {
          width: 150px;
          padding: 5px;
        }

        .addRowButton {
          margin-left: 10px;
        }
        .scroll-container {
          overflow-y: scroll;
          height: 200px;
          scroll-behavior: smooth;
        }
      `}</style>
    </table>
  );
};

export default DynamicInputRows;
