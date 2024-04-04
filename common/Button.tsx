import { Component, JSX, mergeProps, splitProps } from "solid-js";
import { twClass } from "common/twClass";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "none" | "base" | "danger" | "negative";
};

export const Button: Component<Props> = (passedProps) => {
  const props = mergeProps({ variant: "base" }, passedProps);
  const [ownProps, buttonProps] = splitProps(props, [
    "children",
    "class",
    "disabled",
    "onClick",
    "variant",
  ]);

  return (
    <button
      class={twClass(
        "flex w-fit items-center gap-2 px-1 py-1",
        "text-left font-semibold",
        "rounded",
        {
          "bg-teal-500 px-2 text-white hover:bg-teal-600":
            ownProps.variant === "base",
          "bg-red-500 px-2 text-white hover:bg-red-600":
            ownProps.variant === "danger",
          "hover:text-teal-500": ownProps.variant === "negative",
        },
        ownProps.class,
      )}
      disabled={ownProps.disabled}
      onClick={ownProps.onClick}
      {...buttonProps}
    >
      {ownProps.children}
    </button>
  );
};
