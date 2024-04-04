import { Component, Show } from "solid-js";
import { Popover } from "@ark-ui/solid";
import { Input } from "common/Input.tsx";
import { Button } from "common/Button.tsx";
import { createForm, SubmitHandler, zodForm } from "@modular-forms/solid";
import { z } from "zod";

const schema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must follow the format: 2012-08-06"),
  name: z.string().optional(),
});

type DateForm = z.infer<typeof schema>;

export const AddDate: Component = () => {
  const [_, { Form, Field }] = createForm<DateForm>({
    validate: zodForm(schema),
  });

  const addDate: SubmitHandler<DateForm> = (form) => {
    console.debug(form.name, form.date);
  };

  return (
    <Popover.Root>
      <Popover.Trigger class="w-full">Pick new date</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="min-w-96 rounded bg-stone-600 p-4">
          <Popover.Title>Pick a date</Popover.Title>
          <Form onSubmit={addDate}>
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
