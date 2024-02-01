// pages/[...slug].js
import NewSale from "@/components/sales/NewSales";
import NewProduct from "@/components/stocks/NewProduct";
import Supplies from "@/components/stocks/Supplies";
import Breadcrumb from "@/layouts/Breadcrumb";
import { SegmentedControl } from "@mantine/core";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CatchAllPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { stocks } = router.query;
  const [route, setRoute] = useState();
  // console.log(router, "slugg");
  useEffect(() => {
    setRoute(router.asPath);
  }, [router]);
  let routes;
  if (session?.user?.role_code === "SA" || session?.user?.role_code === "A") {
    routes = [
      {
        label: "Current Stock",
        value: `/dashboard/${session?.user?.username}/stocks`,
      },
      {
        label: "Products",
        value: `/dashboard/${session?.user?.username}/stocks/products`,
      },
      {
        label: "Supplies",
        value: `/dashboard/${session?.user?.username}/stocks/supplies`,
      },
      {
        label: "TBC Goods",
        value: `/dashboard/${session?.user?.username}/stocks/tbc`,
      },
      {
        label: "Transfers",
        value: `/dashboard/${session?.user?.username}/stocks/transfers`,
      },
      {
        label: "Drawings",
        value: `/dashboard/${session?.user?.username}/stocks/drawings`,
      },
    ];
  } else {
    routes = [
      {
        label: "Current Stock",
        value: `/dashboard/${session?.user?.username}/stocks`,
      },
      {
        label: "Supplies",
        value: `/dashboard/${session?.user?.username}/stocks/supplies`,
      },
      {
        label: "TBC Goods",
        value: `/dashboard/${session?.user?.username}/stocks/tbc`,
      },
      {
        label: "Transfers",
        value: `/dashboard/${session?.user?.username}/stocks/transfers`,
      },
      {
        label: "Drawings",
        value: `/dashboard/${session?.user?.username}/stocks/drawings`,
      },
    ];
  }
  return (
    <div>
      <div className="flex justify-center hideScroll">
        <SegmentedControl
          // value={value}
          value={route}
          onChange={(value) => {
            setRoute(value);
            router.push(value);
          }}
          className="bg-zinc-300"
          data={routes}
        />
      </div>
      {stocks?.includes("products") ? (
        // <Breadcrumb>
        <Products />
      ) : // </Breadcrumb>
      stocks?.includes("supplies") ? (
        // <Breadcrumb>
        <Supplies />
      ) : stocks?.includes("transfers") ? (
        // <Breadcrumb>
        <Transfers />
      ) : stocks?.includes("tbc") ? (
        // <Breadcrumb>
        <TBC />
      ) : stocks?.includes("drawings") ? (
        // <Breadcrumb>
        <Drawings />
      ) : (
        // </Breadcrumb>
        <Stocks />
      )}
    </div>
  );
};

export default CatchAllPage;

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { Modal, useMantineTheme } from "@mantine/core";
import { Dialog } from "@mui/material";
import axios from "axios";
import Datatable from "@/components/Datatable";
import useSnackbar from "@/hooks/useSnackbar";
import Transfers from "@/components/stocks/Transfers";
import socket from "@/utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { emitEvent } from "@/store/websocketSlice";
import Products from "@/components/stocks/Products";
import { formatCurrency } from "@/utils/constants";
import Filter from "@/components/Filter";
import TBC from "@/components/stocks/TBCGoods";

function Stocks() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();
  const [add, setAdd] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [checked, setChecked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  const socket = useSelector((state) => state.websocket.socket);
  const dispatch = useDispatch();

  const arr = [
    {
      field: "name",
      headerName: "Item Name",
      flex: 0.3,
      renderCell: ({ row }) => {
        return row.product.name;
      },
      // editable: true,
    },
    {
      field: "unit",
      headerName: "Unit",
      flex: 0.3,
      renderCell: ({ row }) => {
        return row.product.unit;
      },
      // editable: true,
    },
    session?.user?.role_code === "SA"
      ? {
          field: "branch_code",
          headerName: "Branch",
          width: 150,
          // role: "SA",
          filterable: true,
          renderCell: (param) => {
            return param.row.branch?.name;
          },
        }
      : undefined,
    session?.user?.role_code === "SA"
      ? {
          field: "cost_price",
          headerName: "Cost Price",
          // type: "number",
          width: 150,
          renderCell: ({ row, id }) => formatCurrency(row?.cost_price),
        }
      : undefined,

    {
      field: "selling_price",
      headerName: "Selling Price",
      // type: "number",
      // align: "right",
      flex: 0.3,
      renderCell: ({ row, id }) => formatCurrency(row?.selling_price),
      // editable: true,
    },

    {
      field: "quantity",
      // align: "right",
      headerName: "Quantity in Stock",
      // type: "number",
      width: 150,
      filterable: true,
    },

    session?.user?.role_code === "SA"
      ? {
          field: "actions",
          type: "actions",
          headerName: "Actions",
          width: 100,
          cellClassName: "actions",
          renderCell: ({ row, id }) => (
            <div className=" flex space-x-2 justify-center">
              <div
                onClick={() => {
                  setShowModal({ status: true, value: row });
                }}
                className={`
                  text-zinc-700 bg-gray-200  cursor-pointer
                 h-8  rounded-full group hover:ring-1 ring-sky-400 flex justify-center items-center   my-3`}
              >
                <div className="p-2 ">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 group-hover:scale-[1.18]  transition-all group-hover:text-zinc-900"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ),
        }
      : undefined,
  ];

  const columns = arr.filter((i) => {
    return i !== undefined;
  });

  const router = useRouter();
  async function getProducts() {
    setLoading(true);
    const response = await axios.post("/api/stocks/get-stocks", {
      branch_id: session?.user?.branch_id,
    });
    setRefetch(!refetch);
    console.log(response, "ghana");
    setLoading(false);
    setRows(response.data.products);
  }

  async function handleDeleteProduct(id) {
    const response = await axios.post("/api/stocks/delete-product", {
      id,
    });
    setShowDialog({
      status: false,
    });
    showAlert("", response.data.message);
    getProducts();
  }

  useEffect(() => {
    getProducts();
  }, [checked]);

  return (
    <div className="px-8  flex justify-center">
      <Modal
        title={<div className="uppercase font-semibold">Edit Stock</div>}
        opened={showModal?.status}
        onClose={() => {
          setShowModal(false);
        }}
        closeOnClickOutside={false}
        size={"30%"}
        // overlayProps={{
        //   color:
        //     theme.colorScheme === "dark"
        //       ? theme.colors.dark[9]
        //       : theme.colors.gray[2],
        //   opacity: 0.55,
        //   blur: 3,
        // }}
      >
        <StockDetail
          stock={showModal?.value}
          setShowModal={setShowModal}
          setChecked={setChecked}
        />
        {/* <NewProduct setShowModal={setShowModal} /> */}
      </Modal>
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          <div className="flex justify-end p-2">
            <div
              className={`${
                session?.user?.role_code == "SA" ||
                session?.user?.role_code == "A"
                  ? " flex space-x-4"
                  : "flex justify-end"
              }"w-[30%] "`}
            >
              <Filter
                refetch={refetch}
                setRows={setRows}
                filterOptions={
                  session?.user?.role_code == "SA"
                    ? ["Branch-branch.name", "Item-product.name"]
                    : ["Item-product.name"]
                }
                rows={rows}
              />
            </div>
          </div>
          <div className="bg-white   h-auto">
            <Datatable loading={loading} rows={rows} columns={columns} />
          </div>
        </div>
      </div>

      <Dialog
        open={showDialog?.status}
        onClose={() => {
          setShowDialog({ status: false, content: "" });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="p-5 rounded ">
          Are you sure you want to delete user?.. <br /> This action cannot be
          reversed
          <div className="flex justify-end">
            <button
              onClick={() => {
                handleDeleteProduct(showDialog.content);
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

import InputField from "@/components/InputField";
import { LoadingOverlay, Text } from "@mantine/core";
import Slide from "@mui/material/Slide";
import { poppins } from "@/layouts/AuthLayout";
import Drawings from "@/components/stocks/Drawings";

export function StockDetail({ stock, showModal, setShowModal, setChecked }) {
  const { data: session } = useSession();
  const showAlert = useSnackbar();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    balance: "0.00",
  });
  const [loading, setLoading] = useState(false);
  async function updateStock() {
    try {
      setLoading(true);
      const response = await axios.post("/api/stocks/update-stock", {
        ...formData,
      });

      setFormData({
        name: "",
        address: "",
        phone: "",
        balance: "",
        created_by: session?.user?.id,
      });
      setLoading(false);
      showAlert("success", response.data.message);
      setChecked((prev) => !prev);
      setShowModal({ status: false, type: "" });
    } catch (e) {
      console.log(e, "c");
    }
  }
  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  function handleChange(e, name, select) {
    if (select) {
      return setFormData((prev) => ({ ...prev, [name]: e }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.value && parseFloat(e.target.value),
      }));
    }
  }

  async function updateCustomerDetails() {
    try {
      setLoading(true);
      const response = await axios.post("/api/customers/update-customer", {
        ...formData,
      });

      setFormData({
        selling_price: "",
        cost_price: "",
        product_id: "",
      });
      setLoading(false);
      showAlert("", response.data.message);
      setChecked((prev) => !prev);
      setShowModal({ status: false, type: "" });
    } catch (e) {
      console.log(e, "c");
    }
  }

  useEffect(() => {
    setFormData({
      // id: stock?.id,
      // name: stock?.name,
      product_id: stock?.product?.id,
      branch_id: stock?.branch?.id,
      selling_price: stock?.selling_price,
      cost_price: stock?.cost_price,
      // created_by: session?.user?.id,
    });
  }, []);
  return (
    <div className={`${poppins?.className} w-full text-sm`}>
      <LoadingOverlay
        loaderProps={{ size: "md", color: "#272a37", variant: "dots" }}
        visible={loading}
        overlayBlur={2}
      />
      <div className=" space-y-2 rounded p-3  bg-white pr-5 border-gray-500">
        <div className="mb-3 text-gray-500 ">
          You are about to update{" "}
          <span className="font-semibold text-indigo-600">
            {stock?.product?.name}
          </span>{" "}
          at{" "}
          <span className="font-semibold text-indigo-600">
            {stock?.branch?.name}
          </span>
        </div>

        <InputField
          label={"Selling Price"}
          value={formData?.selling_price}
          onChange={(e) => {
            handleChange(e, "selling_price");
          }}
          width={100}
        />

        <InputField
          label={"Cost Price"}
          value={formData?.cost_price}
          onChange={(e) => {
            handleChange(e, "cost_price");
          }}
          width={100}
        />

        {/* <div className="">
          <InputField
            value={formData?.cost_price}
            onChange={(e) => {
              handleChange(e, "cost_price");
            }}
            type={"number"}
            label={" cost_price Number"}
            width={100}
          />
        </div> */}
        {/* <div className="">
          <InputField
            value={formData?.balance}
            onChange={(e) => {
              handleChange(e, "balance");
            }}
            type={"number"}
            label={" Balance"}
            width={500}
          />
        </div> */}

        <div className="flex justify-end w-full mt-3">
          <Button onClick={updateStock} label={"Update stock"} width={100} />
        </div>
      </div>
    </div>
  );
}
