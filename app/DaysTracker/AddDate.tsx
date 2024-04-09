import { Accessor, Component, Setter, Show } from "solid-js";
import { Collapsible, Popover } from "@ark-ui/solid";
import { Input } from "common/Input.tsx";
import { Button } from "common/Button.tsx";
import {
  createForm,
  reset,
  SubmitHandler,
  zodForm,
} from "@modular-forms/solid";
import { z } from "zod";
import { SavedDate } from "./types";
import { isAfter, isMatch } from "date-fns";
import { Icon } from "common/Icon.tsx";

const schema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must follow the format: 2023-10-15")
    .refine((input) => isMatch(input, "yyyy-MM-dd"), {
      message: "Please provide a valid date in the format: 2023-10-15",
    }),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must follow the format: 2023-10-15")
    .or(z.literal("")),
  name: z.string().optional(),
});

type DateForm = z.infer<typeof schema>;

type Props = {
  dates: Accessor<SavedDate[]>;
  setDates: Setter<SavedDate[]>;
};

export const AddDate: Component<Props> = (props) => {
  const [dateForm, { Form, Field }] = createForm<DateForm>({
    validate: zodForm(schema),
  });

  const handleSubmit: SubmitHandler<DateForm> = (form) => {
    let endDate: string | undefined = form.endDate;
    if (form.endDate && !isAfter(form.endDate, form.date)) {
      endDate = undefined;
    }

    const newDates = [
      ...props.dates(),
      {
        date: form.date,
        endDate: endDate,
        name: form.name,
      },
    ];
    props.setDates(newDates);
    window.localStorage.setItem("savedDates", JSON.stringify(newDates));
    reset(dateForm);
  };

  return (
    <Popover.Root>
      <Popover.Trigger class="flex rounded-full bg-teal-500 p-2 hover:bg-teal-400">
        <Icon class="!font-semibold" name="add" size="2xl" />
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="min-w-96 rounded bg-gray-600 p-4">
          <Popover.Title>Pick a date</Popover.Title>
          <Form onSubmit={handleSubmit}>
            <Popover.Description class="space-y-2 py-2">
              <Field name="name">
                {(field, props) => (
                  <div class="flex w-full flex-col">
                    <Input
                      type="text"
                      label="Name"
                      value={field.value ?? ""}
                      {...props}
                    />
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
                      value={field.value}
                      {...props}
                    />
                    <Show when={field.error}>
                      <span class="text-red-500">{field.error}</span>
                    </Show>
                  </div>
                )}
              </Field>
              <Collapsible.Root>
                <Collapsible.Trigger class="hover:text-teal-500">
                  More options
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <Field name="endDate">
                    {(field, props) => (
                      <div class="flex w-full flex-col">
                        <label for="endDate">End date</label>
                        <Input
                          id="endDate"
                          type="date"
                          value={field.value}
                          {...props}
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
              <Button type="submit">Add</Button>
            </Popover.Description>
          </Form>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
