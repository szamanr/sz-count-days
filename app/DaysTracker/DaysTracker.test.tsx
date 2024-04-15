import { cleanup, render, screen, within } from "@solidjs/testing-library";
import { DaysTracker } from "app/DaysTracker/DaysTracker";
import { beforeEach, expect, it } from "vitest";
import { userEvent } from "@testing-library/user-event";
import { add, differenceInDays, format } from "date-fns";

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
  history.replaceState(null, "", "/");
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

it("can share date", async () => {
  const date = { date: "2024-01-01", name: "year start" };
  localStorage.setItem("savedDates", JSON.stringify([date]));
  render(() => <DaysTracker />);

  const displayedDate = screen.getByTestId("dayContainer");

  await userEvent.hover(displayedDate);
  await userEvent.click(
    within(displayedDate).getByRole("button", { name: "share" }),
  );
  expect(location.href).toContain("?date=2024-01-01+year+start");
  expect(await navigator.clipboard.readText()).toContain(
    "?date=2024-01-01+year+start",
  );
});

it("can reorder dates", async () => {
  const dates = [
    { date: "1024-01-01", name: "date 1" },
    { date: "2024-01-01", name: "date 2" },
    { date: "3024-01-01", name: "date 3" },
  ];
  localStorage.setItem("savedDates", JSON.stringify(dates));
  render(() => <DaysTracker />);

  let displayedDates = screen.getAllByTestId("dayContainer");
  expect(displayedDates).toHaveLength(3);
  expect(displayedDates[0]).toHaveTextContent("date 1");
  expect(displayedDates[1]).toHaveTextContent("date 2");
  expect(displayedDates[2]).toHaveTextContent("date 3");

  await userEvent.hover(displayedDates[0]);
  await userEvent.click(
    within(displayedDates[0]).getByRole("button", { name: "arrow_downward" }),
  );

  displayedDates = screen.getAllByTestId("dayContainer");
  expect(displayedDates).toHaveLength(3);
  expect(displayedDates[0]).toHaveTextContent("date 2");
  expect(displayedDates[1]).toHaveTextContent("date 1");
  expect(displayedDates[2]).toHaveTextContent("date 3");

  await userEvent.hover(displayedDates[0]);
  await userEvent.click(
    within(displayedDates[2]).getByRole("button", { name: "arrow_upward" }),
  );

  displayedDates = screen.getAllByTestId("dayContainer");
  expect(displayedDates).toHaveLength(3);
  expect(displayedDates[0]).toHaveTextContent("date 2");
  expect(displayedDates[1]).toHaveTextContent("date 3");
  expect(displayedDates[2]).toHaveTextContent("date 1");
});

it("can remove all dates", async () => {
  const dates = [
    { date: "1024-01-01", name: "date 1" },
    { date: "2024-01-01", name: "date 2" },
    { date: "3024-01-01", name: "date 3" },
  ];
  localStorage.setItem("savedDates", JSON.stringify(dates));
  render(() => <DaysTracker />);

  let displayedDates = screen.getAllByTestId("dayContainer");
  expect(displayedDates).toHaveLength(3);

  await userEvent.click(screen.getByRole("button", { name: "menu" }));
  await userEvent.click(screen.getByRole("button", { name: /Delete all/i }));
  await userEvent.click(screen.getByRole("button", { name: "Delete" })); // confirm

  expect(screen.queryByTestId("dayContainer")).not.toBeInTheDocument();
});

it("can share all dates", async () => {
  const dates = [
    { date: "1024-01-01", name: "date 1" },
    { date: "2024-01-01", name: "date 2" },
    { date: "3024-01-01", name: "date 3" },
  ];
  localStorage.setItem("savedDates", JSON.stringify(dates));
  render(() => <DaysTracker />);

  await userEvent.click(screen.getByRole("button", { name: "menu" }));
  await userEvent.click(screen.getByRole("button", { name: /Share all/i }));

  const searchQuery =
    "?date=1024-01-01+date+1&date=2024-01-01+date+2&date=3024-01-01+date+3";
  expect(location.href).toContain(searchQuery);
  expect(await navigator.clipboard.readText()).toContain(searchQuery);
});

it("can toggle to display as days", async () => {
  const date = add(new Date(), { months: 1, days: 5 });
  const dayDifference = differenceInDays(date, new Date());
  localStorage.setItem("savedDates", JSON.stringify([{ date }]));
  render(() => <DaysTracker />);

  let displayedDate = screen.getByTestId("dayContainer");
  expect(displayedDate).toHaveTextContent(
    `It's 1 month 5 days until ${format(date, "dd MMM yyyy")}`,
  );

  await userEvent.click(screen.getByRole("button", { name: "menu" }));
  await userEvent.click(screen.getByRole("button", { name: /Toggle/i }));

  displayedDate = screen.getByTestId("dayContainer");
  expect(displayedDate).toHaveTextContent(
    `It's ${dayDifference} days until ${format(date, "dd MMM yyyy")}`,
  );
});
