import { setShowSnackbar } from "@/store/snackbarSlice";
import { useDispatch } from "react-redux";

export default function useSnackbar() {
  const dispatch = useDispatch();
  return (type, message) => {
    dispatch(
      setShowSnackbar({
        status: true,
        type,
        message,
      })
    );

    setTimeout(() => {
      dispatch(
        setShowSnackbar({
          status: false,
          type: "",
          message: "",
        })
      );
    }, 3000);
  };
}
