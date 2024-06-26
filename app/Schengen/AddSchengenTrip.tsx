import { Popover } from "@ark-ui/solid";
import {
  createForm,
  getValue,
  reset,
  SubmitHandler,
  zodForm,
} from "@modular-forms/solid";
import { isAfter, isSameDay } from "date-fns";
import { Accessor, Component, For, Show } from "solid-js";
import { z } from "zod";
import { useTrips } from "app/Schengen/useTrips";
import { Button } from "common/Button";
import { formattedDate } from "common/formattedDate";
import { Icon } from "common/Icon";
import { Input } from "common/Input";
import { toast } from "common/toast";
import { SchengenDate } from "./types";

const schema = z.object({
  date: z
    .string()
    .date("Please provide a valid date in the format: 2023-10-15"),
  endDate: z
    .string()
    .date("Please provide a valid date in the format: 2023-10-15"),
  name: z.string().optional(),
});

type DateForm = z.infer<typeof schema>;

type Props = {
  trips: Accessor<SchengenDate[]>;
  setTrips: (dates: SchengenDate[]) => void;
};

export const AddSchengenTrip: Component<Props> = (props) => {
  const { overlappingTrips } = useTrips(props.trips);

  const [dateForm, { Form, Field }] = createForm<DateForm>({
    validate: zodForm(schema),
  });

  const handleSubmit: SubmitHandler<DateForm> = (form) => {
    if (
      !isAfter(form.endDate, form.date) &&
      !isSameDay(form.endDate, form.date)
    ) {
      toast("Exit date must be on or after entrance date!", {
        className: "!bg-red-500",
      });
      return;
    }

    const newDates = [
      ...props.trips(),
      {
        date: form.date,
        endDate: form.endDate,
        name: form.name,
      },
    ];
    props.setTrips(newDates);
    reset(dateForm);
  };

  return (
    <Popover.Root>
      <Popover.Trigger class="flex rounded-full bg-teal-500 p-2 hover:bg-teal-400">
        <Icon class="!font-semibold" name="add" size="2xl" />
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content class="z-10 min-w-96 rounded bg-gray-600 p-4">
          <Popover.Title>Add a trip</Popover.Title>
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
                      label="Entrance date"
                      required={true}
                      type="date"
                      value={field.value}
                      {...props}
                    />
                    <Show when={field.error}>
                      <span class="text-red-500">{field.error}</span>
                    </Show>
                  </div>
                )}
              </Field>
              <Field name="endDate">
                {(field, props) => (
                  <div class="flex w-full flex-col">
                    <Input
                      id="endDate"
                      label="Exit date"
                      required={true}
                      type="date"
                      value={field.value}
                      {...props}
                    />
                    <Show when={field.error}>
                      <span class="text-red-500">{field.error}</span>
                    </Show>
                  </div>
                )}
              </Field>
              <For
                each={overlappingTrips(
                  getValue(dateForm, "date") ?? "",
                  getValue(dateForm, "endDate") ?? undefined,
                )}
              >
                {(trip) => {
                  const tripDates = `${formattedDate(trip.date)} - ${formattedDate(trip.endDate)}`;
                  return (
                    <p class="text-red-500">
                      <span>overlaps with </span>
                      <span>
                        <Show when={trip.name} fallback={tripDates}>
                          {trip.name} ({tripDates})
                        </Show>
                      </span>
                    </p>
                  );
                }}
              </For>
              <Button type="submit">Add</Button>
            </Popover.Description>
          </Form>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};
