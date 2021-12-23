import { toast } from "react-toastify";
toast.configure({
  autoClose: 3000,
  draggable: true,
  hideProgressBar: false,
  position: "top-right",
  closeOnClick: true,
  pauseOnHover: true,
});

export const nSuccess = (msg) => {
  toast.success(msg);
};

export const nWarning = (msg) => {
  toast.warn(msg);
};

export const nError = (msg, code) => {
  if (code) {
    toast.error(`${`Code: ` + code}` + " - " + msg + ".");
  } else {
    toast.error(msg);
  }
};

export const nInfo = (msg) => {
  toast.info(msg);
};
