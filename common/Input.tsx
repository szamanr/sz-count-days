import { Component, JSX, Show, splitProps } from "solid-js";
import { twClass } from "common/twClass";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
  class?: string;
  label?: JSX.Element;
  outerClass?: string;
};

export const Input: Component<Props> = (props) => {
  const [ownProps, inputProps] = splitProps(props, [
    "children",
    "class",
    "id",
    "label",
    "name",
    "outerClass",
  ]);
  return (
    <div class={twClass("flex flex-col", ownProps.outerClass)}>
      <Show when={ownProps.label}>
        <label for={ownProps.id ?? ownProps.name}>{ownProps.label}</label>
      </Show>
      <input
        class={twClass(
          "rounded border border-gray-200 px-2 py-1",
          "bg-gray-800 text-white",
          ownProps.class,
        )}
        id={ownProps.id ?? ownProps.name}
        name={ownProps.name}
        {...inputProps}
      >
        {ownProps.children}
      </input>
    </div>
  );
};
