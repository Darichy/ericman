import React, { useEffect, useState } from "react";
import Datatable from "../Datatable";
import axios from "axios";
import Button from "../Button";
import { LoadingOverlay } from "@mantine/core";
import { poppins } from "@/layouts/AuthLayout";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { Dialog } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { ReceiptComponent } from "./NewSales";

export default function SaleDetails({ id, type, setShowDetails, setShowSale }) {
  const [rows, setRows] = useState([]);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { data: session } = useSession();
  const columns = [
    {
      field: "Item",
      headerName: "Item",
      flex: 1,
      renderCell: ({ row }) => row.product.name,
    },
    {
      field: "unit",
      headerName: "Unit",
      // type: "number",
      flex: 1,
      renderCell: ({ row }) => row.product.unit,
    },
    {
      field: "unit_price",
      headerName: "Unit Price",

      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      // type: "number",
      flex: 1,
      // editable: true,
    },
  ];

  useEffect(() => {
    setLoading(true);
    const payload = type === "D" ? { id, key: "saleDetails" } : { id };
    axios.post("/api/sales/get-sale-details", payload).then((response) => {
      console.log(response, id, "ghana");
      setLoading(false);
      setDetails(response.data?.sale);
      setRows(response.data?.sale?.products);
    });
  }, []);

  console?.log(details, "kik");
  const printReceiptSection = useReactToPrint({
    content: () => document?.getElementById("receipt-ref"),
  });

  return (
    <div className={`${poppins.className} text-xs`}>
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <div className="hidden">
        <ReceiptComponent
          data={{
            rows: rows?.map((i) => ({
              name: i?.product?.name,
              unit: i?.product?.unit,
              quantity: i?.quantity,
              unit_price: formatCurrency(i?.unit_price),
              p_amount: formatCurrency(i?.quantity * i?.unit_price),
            })),
            date: formatDateTime(details?.created_at),
            total: formatCurrency(details?.total_amount),
            amountPaid: formatCurrency(details?.amount_paid),
            discount: formatCurrency(details?.discount),
            selectedCustomer: {
              name: details?.buyer_name,
              address: details?.buyer_address,
              phone: details?.buyer_phone,
            },
            saleID: details?.sale_id,
            // tbc,
          }}
        />
      </div>
      <div className=" space-y-2 text-gray-700 border rounded p-4">
        <div className="flex justify-between items-center ">
          <div>
            <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
              Sale Date:
            </span>
            <span className="w-[60%] text-end ml-2">
              {formatDateTime(details?.created_at)}
            </span>
          </div>
          {type !== "TBC" ? (
            <div
              onClick={() => {
                printReceiptSection();
              }}
              className={`
              text-zinc-700 bg-gray-200  cursor-pointer
              rounded-full group hover:ring-1 ring-sky-400 flex justify-center items-center`}
            >
              <div className="p-2 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6 group-hover:scale-[1.18]  transition-all group-hover:text-zinc-900"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2.75C5 1.784 5.784 1 6.75 1h6.5c.966 0 1.75.784 1.75 1.75v3.552c.377.046.752.097 1.126.153A2.212 2.212 0 0118 8.653v4.097A2.25 2.25 0 0115.75 15h-.241l.305 1.984A1.75 1.75 0 0114.084 19H5.915a1.75 1.75 0 01-1.73-2.016L4.492 15H4.25A2.25 2.25 0 012 12.75V8.653c0-1.082.775-2.034 1.874-2.198.374-.056.75-.107 1.127-.153L5 6.25v-3.5zm8.5 3.397a41.533 41.533 0 00-7 0V2.75a.25.25 0 01.25-.25h6.5a.25.25 0 01.25.25v3.397zM6.608 12.5a.25.25 0 00-.247.212l-.693 4.5a.25.25 0 00.247.288h8.17a.25.25 0 00.246-.288l-.692-4.5a.25.25 0 00-.247-.212H6.608z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
        <div className="flex border-b ">
          <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
            Customer Name:{" "}
          </span>
          <span className="w-[60%] text-end">
            {details?.buyer_name !== null && details?.buyer_name !== ""
              ? details?.buyer_name
              : "***"}
          </span>
        </div>
        {details?.status !== "RETURNED" && (
          <div className="flex border-b ">
            <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
              Amount Paid:{" "}
            </span>
            <span className="w-[60%] text-end">
              {formatCurrency(`${details?.amount_paid}`)}
            </span>
          </div>
        )}
        {details?.status !== "RETURNED" && (
          <div className="flex border-b ">
            <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
              Discount:{" "}
            </span>
            <span className="w-[60%] text-end">
              {formatCurrency(`${details?.discount}`)}
            </span>
          </div>
        )}
        <div className="flex border-b ">
          <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
            Balance:
          </span>
          <span className="w-[60%] text-end">
            {formatCurrency(`${details?.amount_paid - details?.total_amount}`)}
          </span>
        </div>
        <div className="flex border-b  ">
          <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
            Net Total Amount:
          </span>
          <span
            className={`${
              details?.status == "RETURNED" ? "text-red-600" : ""
            } w-[60%] text-end font-semibold"`}
          >
            {formatCurrency(`${details?.total_amount}`)}
          </span>
        </div>
        {details?.status == "RETURNED" && (
          <div className="flex  ">
            <span className="w-[40%] text-xs font-medium text-[#2d2d8e]">
              Return Reason:
            </span>
            <span className="w-[60%] text-end ">
              {`${details?.return_reason}`}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4  text-xs scale-95 -m-5">
        <div className="uppercase mb-1 font-semibold">All Sale Items</div>
        <Datatable rows={rows} columns={columns} />
      </div>

      {session?.user?.role_code !== "SA" &&
        formatDate(new Date()) === details?.created_at?.split("T")[0] && (
          <div className="flex justify-end mt-6 space-x-3">
            {!type && (
              <Button
                label={"Edit Sale"}
                onClick={() => {
                  setShowDetails({ status: false });
                  setShowSale({
                    status: true,
                    edit: { status: true, id: id },
                  });
                }}
              />
            )}
          </div>
        )}
    </div>
  );
}
