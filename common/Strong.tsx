import { ParentComponent } from "solid-js";
import { twClass } from "common/twClass";

type Props = {
  class?: string;
};

export const Strong: ParentComponent<Props> = (props) => (
  <span class={twClass("font-medium text-teal-500", props.class)}>
    {props.children}
  </span>
);
