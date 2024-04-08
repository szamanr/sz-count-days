import Toastify from "toastify-js";

export const toast = (text: string) => {
  Toastify({
    backgroundColor: "#0f766e",
    duration: 3000,
    text: text,
    gravity: "bottom",
    position: "left",
  }).showToast();
};
