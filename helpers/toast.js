import { toast } from "react-toastify";

const toastBody = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const notifySuccess = (message) => toast.success(message, toastBody);

export const notifyError = (message) => toast.error(message, toastBody);
