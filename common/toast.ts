import Toastify from "toastify-js";

export const toast = (text: string, options?: Toastify.Options) => {
  const mergedOptions: Toastify.Options = {
    ...{
      backgroundColor: "#0f766e",
      className: "!bg-teal-500",
      duration: 3000,
      text: text,
      gravity: "bottom",
      position: "left",
    },
    ...options,
  };

  Toastify(mergedOptions).showToast();
};
