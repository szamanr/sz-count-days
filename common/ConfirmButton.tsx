import { isUndefined } from "lodash";
import {
  Component,
  ComponentProps,
  createSignal,
  JSX,
  Show,
  splitProps,
} from "solid-js";
import { Button } from "./Button";

type Props = ComponentProps<typeof Button> & {
  messages?: {
    no?: JSX.Element;
    prompt?: JSX.Element;
    yes?: JSX.Element;
  };
};

export const ConfirmButton: Component<Props> = (props) => {
  const [ownProps, buttonProps] = splitProps(props, [
    "class",
    "formAction",
    "messages",
    "onClick",
  ]);

  const [showConfirm, setShowConfirm] = createSignal(false);

  return (
    <Show
      when={showConfirm()}
      fallback={
        <Button
          class={ownProps.class}
          onClick={() => setShowConfirm(true)}
          {...buttonProps}
        />
      }
    >
      <div class="flex items-center gap-2">
        <span>
          {isUndefined(ownProps.messages?.prompt)
            ? "Are you sure?"
            : ownProps.messages?.prompt}
        </span>
        <Button
          class={ownProps.class}
          formAction={ownProps.formAction}
          onClick={ownProps.onClick}
          variant="danger"
        >
          {ownProps.messages?.yes ?? "Yes"}
        </Button>
        <Button
          class={ownProps.class}
          onClick={() => setShowConfirm(false)}
          variant="negative"
        >
          {isUndefined(ownProps.messages?.no) ? "No" : ownProps.messages?.no}
        </Button>
      </div>
    </Show>
  );
};
