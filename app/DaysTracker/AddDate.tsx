import { Component } from "solid-js";
import { Popover } from "@ark-ui/solid";
import { Input } from "common/Input.tsx";
import { Button } from "common/Button.tsx";
import { createForm, SubmitHandler } from "@modular-forms/solid";

type DateForm = {
  name?: string;
  date: string;
};

export const AddDate: Component = () => {
  const [dateForm, { Form, Field, FieldArray }] = createForm<DateForm>();

  const addDate: SubmitHandler<DateForm> = (form) => {
    console.debug(form.name, form.date);
  };

  return (
    <Popover.Root>
      <Popover.Trigger class="w-full">Pick new date</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="min-w-64 rounded bg-stone-600 p-4">
          <Popover.Title>Pick a date</Popover.Title>
          <Form onSubmit={addDate}>
            <Popover.Description class="space-y-2 py-2">
              <div class="grid grid-cols-3">
                <Field name="name">
                  {(_, props) => (
                    <Input
                      outerClass="col-span-2"
                      type="text"
                      label="Name"
                      {...props}
                    />
                  )}
                </Field>
              </div>
              <div class="grid grid-cols-3">
                <Field name="date">
                  {(_, props) => (
                    <Input
                      outerClass="col-span-2"
                      type="date"
                      label="Date"
                      {...props}
                    />
                  )}
                </Field>
              </div>
              <Button type="submit">Add</Button>
            </Popover.Description>
          </Form>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
