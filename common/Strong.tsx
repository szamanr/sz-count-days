import { ParentComponent } from "solid-js";

export const Strong: ParentComponent = ({ children }) => (
  <span class="font-medium text-teal-500">{children}</span>
);
