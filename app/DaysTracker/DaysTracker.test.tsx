import { cleanup, render, screen, within } from "@solidjs/testing-library";
import { DaysTracker } from "app/DaysTracker/DaysTracker";
import { beforeEach, expect, it } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { add, format } from "date-fns";

const addDate = async ({ date, name }: { date: Date; name?: string }) => {
  await userEvent.click(screen.getByRole("button", { name: "add" }));

  if (name) {
    await userEvent.click(screen.getByLabelText(/Name/i));
    await userEvent.type(screen.getByLabelText(/Name/i), name);
  }

  await userEvent.click(screen.getByLabelText("Date"));
  await userEvent.type(
    screen.getByLabelText("Date"),
    format(date, "yyyy-MM-dd"),
  );
  await userEvent.click(screen.getByRole("button", { name: "Add" }));
};

beforeEach(() => {
  cleanup();
  localStorage.removeItem("savedDates");
  userEvent.setup();
});

it("can add date", async () => {
  render(() => <DaysTracker />);

  const date = add(new Date(), { months: 1, days: 5 });

  await addDate({ date: date });

  const displayedDates = screen.getAllByTestId("day");
  expect(displayedDates).toHaveLength(1);
  expect(displayedDates[0]).toHaveTextContent(
    `It's 1 month 5 days until ${format(date, "dd MMM yyyy")}`,
  );
});

it("can add date with name", async () => {
  render(() => <DaysTracker />);

  const date = add(new Date(), { days: 14 });

  await addDate({ date: date, name: "anniversary" });

  const displayedDates = screen.getAllByTestId("day");
  expect(displayedDates).toHaveLength(1);
  expect(displayedDates[0]).toHaveTextContent(
    `It's 14 days until anniversary (${format(date, "dd MMM yyyy")})`,
  );
});

it("can remove date", async () => {
  const date = { date: "2024-01-01", name: "year start" };
  localStorage.setItem("savedDates", JSON.stringify([date]));
  render(() => <DaysTracker />);

  const displayedDates = screen.getAllByTestId("dayContainer");
  expect(displayedDates).toHaveLength(1);
  const displayedDate = displayedDates[0];
  expect(displayedDate).toHaveTextContent(
    `year start (${format(date.date, "dd MMM yyyy")})`,
  );

  await userEvent.hover(displayedDate);
  await userEvent.click(
    within(displayedDate).getByRole("button", { name: "close" }),
  );

  expect(screen.queryByTestId("dayContainer")).not.toBeInTheDocument();
});
