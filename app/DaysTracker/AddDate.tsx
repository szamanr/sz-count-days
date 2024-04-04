import { Component, Show } from "solid-js";
import { Popover } from "@ark-ui/solid";
import { Input } from "common/Input.tsx";
import { Button } from "common/Button.tsx";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { z } from "zod";
import { SavedDate } from "./types";
import { isMatch } from "date-fns";

const schema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must follow the format: 2012-08-06"),
  name: z.string().optional(),
});

type DateForm = z.infer<typeof schema>;

type Props = {
  addDate: (date: SavedDate) => void;
};

export const AddDate: Component<Props> = (props) => {
  const [dateForm, { Form, Field }] = createForm<DateForm>({
    validate: zodForm(schema),
  });

  const handleSubmit: SubmitHandler<DateForm> = (form) => {
    const isValid = isMatch(form.date, "yyyy-MM-dd");
    if (!isValid) throw new Error("Invalid date");

    props.addDate({ date: form.date, name: form.name });
    dateForm.element?.reset();
  };

  return (
    <Popover.Root>
      <Popover.Trigger class="w-full">Pick new date</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="min-w-96 rounded bg-stone-600 p-4">
          <Popover.Title>Pick a date</Popover.Title>
          <Form onSubmit={handleSubmit}>
            <Popover.Description class="space-y-2 py-2">
              <Field name="name">
                {(field, props) => (
                  <div class="flex w-full flex-col">
                    <Input type="text" label="Name" {...props} />
                    <Show when={field.error}>
                      <span class="text-red-500">{field.error}</span>
                    </Show>
                  </div>
                )}
              </Field>
              <Field name="date">
                {(field, props) => (
                  <div class="flex w-full flex-col">
                    <Input
                      type="date"
                      label="Date"
                      required={true}
                      {...props}
                    />
                    <Show when={field.error}>
                      <span class="text-red-500">{field.error}</span>
                    </Show>
                  </div>
                )}
              </Field>
              <Button type="submit">Add</Button>
            </Popover.Description>
          </Form>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
