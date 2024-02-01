import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import Button from "@/components/Button";
import { LoadingOverlay, Modal, useMantineTheme } from "@mantine/core";

// import { prisma } from "../../../../../prisma/constant";
import { Backdrop, CircularProgress, Dialog, Snackbar } from "@mui/material";
import { API_SERVER } from "@/utils/constants";

import { useDemoData } from "@mui/x-data-grid-generator";
import axios from "axios";
// import NewUser from "./NewUser";
import { useDispatch } from "react-redux";
import { setShowSnackbar } from "@/store/snackbarSlice";
import Breadcrumb from "@/layouts/Breadcrumb";
import Tiles from "@/components/Tiles";
import { useRouter } from "next/router";
import CreateNewBranch from "@/components/branches/CreateNewBranch";

// import { getSession } from "next-auth/react";

// import { useDemoData } from "@mui/x-data-grid-generator";

export default function BranchManagement() {
  const [snackbar, setSnackbar] = useState({ state: false, message: "" });
  const [rows, setRows] = useState([]);
  const [showDialog, setShowDialog] = useState({ status: false, content: "" });
  const theme = useMantineTheme();

  const [showModal, setShowModal] = useState({
    status: false,
    id: "",
    type: "",
  });
  const [rowModesModel, setRowModesModel] = useState({});
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return <CreateNewBranch />;
}
