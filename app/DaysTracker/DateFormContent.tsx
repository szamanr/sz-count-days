import { Collapsible, Popover } from "@ark-ui/solid";
import {
  createForm,
  reset,
  SubmitHandler,
  zodForm,
} from "@modular-forms/solid";
import { isAfter } from "date-fns";
import { Component, Show } from "solid-js";
import { z } from "zod";
import { Button } from "common/Button";
import { Icon } from "common/Icon";
import { Input } from "common/Input";

const schema = z.object({
  date: z
    .string()
    .date("Please provide a valid date in the format: 2023-10-15"),
  endDate: z
    .string()
    .date("Please provide a valid date in the format: 2023-10-15")
    .or(z.literal("")),
  name: z.string().optional(),
});

type DateForm = z.infer<typeof schema>;

type Props = {
  initialValues?: { name?: string; date?: string; endDate?: string };
  onSubmit: (values: { name?: string; date: string; endDate?: string }) => void;
  title?: string;
  submitLabel?: string;
};

export const DateFormContent: Component<Props> = (props) => {
  const [dateForm, { Form, Field }] = createForm<DateForm>({
    validate: zodForm(schema),
    initialValues: {
      name: props.initialValues?.name ?? "",
      date: props.initialValues?.date ?? "",
      endDate: props.initialValues?.endDate ?? "",
    },
  });

  const handleSubmit: SubmitHandler<DateForm> = (form) => {
    let endDate: string | undefined = form.endDate;
    if (form.endDate && !isAfter(form.endDate, form.date)) {
      endDate = undefined;
    }
    props.onSubmit({ name: form.name, date: form.date, endDate });
    reset(dateForm);
  };

  return (
    <>
      <Popover.Title>{props.title ?? "Pick a date"}</Popover.Title>
      <Form onSubmit={handleSubmit}>
        <Popover.Description class="space-y-2 py-2">
          <Field name="name">
            {(field, fieldProps) => (
              <div class="flex w-full flex-col">
                <Input
                  type="text"
                  label="Name"
                  value={field.value ?? ""}
                  {...fieldProps}
                />
                <Show when={field.error}>
                  <span class="text-red-500">{field.error}</span>
                </Show>
              </div>
            )}
          </Field>
          <Field name="date">
            {(field, fieldProps) => (
              <div class="flex w-full flex-col">
                <Input
                  type="date"
                  label="Date"
                  required={true}
                  value={field.value}
                  {...fieldProps}
                />
                <Show when={field.error}>
                  <span class="text-red-500">{field.error}</span>
                </Show>
              </div>
            )}
          </Field>
          <Collapsible.Root defaultOpen={!!props.initialValues?.endDate}>
            <Collapsible.Trigger class="hover:text-teal-500">
              More options
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Field name="endDate">
                {(field, fieldProps) => (
                  <div class="flex w-full flex-col">
                    <label for="endDate">End date</label>
                    <Input
                      id="endDate"
                      type="date"
                      value={field.value}
                      {...fieldProps}
                    />
                    <p class="flex items-center space-x-1 text-sm text-gray-400">
                      <Icon name="info" size="sm" />
                      <span>Optional. Add to show event duration.</span>
                    </p>
                    <Show when={field.error}>
                      <span class="text-red-500">{field.error}</span>
                    </Show>
                  </div>
                )}
              </Field>
            </Collapsible.Content>
          </Collapsible.Root>
          <Button type="submit">{props.submitLabel ?? "Add"}</Button>
        </Popover.Description>
      </Form>
    </>
  );
};
