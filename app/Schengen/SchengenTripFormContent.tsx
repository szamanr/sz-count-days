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
import { Button } from "common/Button";
import { formattedDate } from "common/formattedDate";

import { Input } from "common/Input";
import { toast } from "common/toast";
import { SchengenDate } from "./types";
import { useTrips } from "./useTrips";

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
  excludeTrip?: SchengenDate;
  initialValues?: { name?: string; date?: string; endDate?: string };
  onSubmit: (values: { name?: string; date: string; endDate: string }) => void;
  title?: string;
  submitLabel?: string;
};

export const SchengenTripFormContent: Component<Props> = (props) => {
  const filteredTrips = () =>
    props.excludeTrip
      ? props.trips().filter((t) => t !== props.excludeTrip)
      : props.trips();

  const { overlappingTrips } = useTrips(filteredTrips);

  const [dateForm, { Form, Field }] = createForm<DateForm>({
    validate: zodForm(schema),
    initialValues: {
      name: props.initialValues?.name ?? "",
      date: props.initialValues?.date ?? "",
      endDate: props.initialValues?.endDate ?? "",
    },
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
    props.onSubmit({ name: form.name, date: form.date, endDate: form.endDate });
    reset(dateForm);
  };

  return (
    <>
      <Popover.Title>{props.title ?? "Add a trip"}</Popover.Title>
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
                  label="Entrance date"
                  required={true}
                  type="date"
                  value={field.value}
                  {...fieldProps}
                />
                <Show when={field.error}>
                  <span class="text-red-500">{field.error}</span>
                </Show>
              </div>
            )}
          </Field>
          <Field name="endDate">
            {(field, fieldProps) => (
              <div class="flex w-full flex-col">
                <Input
                  id="endDate"
                  label="Exit date"
                  required={true}
                  type="date"
                  value={field.value}
                  {...fieldProps}
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
          <Button type="submit">{props.submitLabel ?? "Add"}</Button>
        </Popover.Description>
      </Form>
    </>
  );
};
