import { cleanup, render, screen, within } from "@solidjs/testing-library";
import { userEvent } from "@testing-library/user-event";
import { add, format, sub } from "date-fns";
import { beforeEach, expect, it } from "vitest";
import { Schengen } from "app/Schengen/Schengen";
import { formattedDate } from "common/formattedDate";

const addTrip = async ({
  startDate,
  endDate,
  name,
}: {
  startDate: Date;
  endDate: Date;
  name?: string;
}) => {
  await userEvent.click(screen.getByRole("button", { name: "add" }));

  if (name) {
    await userEvent.click(screen.getByLabelText(/Name/i));
    await userEvent.type(screen.getByLabelText(/Name/i), name);
    await userEvent.click(screen.getByLabelText(/Name/i));
  }

  await userEvent.click(screen.getByLabelText("Entrance date"));
  await userEvent.type(
    screen.getByLabelText("Entrance date"),
    format(startDate, "yyyy-MM-dd"),
  );

  await userEvent.click(screen.getByLabelText("Exit date"));
  await userEvent.type(
    screen.getByLabelText("Exit date"),
    format(endDate, "yyyy-MM-dd"),
  );

  await userEvent.click(screen.getByRole("button", { name: "Add" }));
};

beforeEach(() => {
  cleanup();
  localStorage.removeItem("schengenDates");
  userEvent.setup();
  history.replaceState(null, "", "/schengen");
});

it("displays trips ordered by start date", async () => {
  const dates = [
    { date: "3024-01-01", endDate: "3024-01-15", name: "trip 3" },
    { date: "1024-01-01", endDate: "1024-01-15", name: "trip 1" },
    { date: "2024-01-01", endDate: "2024-01-15", name: "trip 2" },
  ];
  localStorage.setItem("schengenDates", JSON.stringify(dates));
  render(() => <Schengen />);

  const displayedTrips = screen.getAllByTestId("dayContainer");
  expect(displayedTrips).toHaveLength(3);
  expect(displayedTrips[0]).toHaveTextContent("trip 1");
  expect(displayedTrips[1]).toHaveTextContent("trip 2");
  expect(displayedTrips[2]).toHaveTextContent("trip 3");
});

it("displays summary", async () => {
  render(() => <Schengen />);

  const exitDate = add(new Date(), { days: 89 });

  expect(screen.getByText("If you enter on")).toBeInTheDocument();
  expect(screen.getByText("you can stay for")).toBeInTheDocument();
  expect(screen.getByText("until")).toBeInTheDocument();

  const summaryRows = screen.getAllByTestId("summaryRow");
  expect(summaryRows).toHaveLength(1);
  expect(summaryRows[0]).toHaveTextContent("Today");
  expect(summaryRows[0]).toHaveTextContent("90 days");
  expect(summaryRows[0]).toHaveTextContent(`${formattedDate(exitDate)}`);
});

it("can add future trip", async () => {
  render(() => <Schengen />);

  const tripLength = 8;
  const startDate = add(new Date(), { days: 14 });
  const endDate = add(new Date(), { days: 14 + tripLength - 1 });

  await addTrip({ startDate, endDate });

  const displayedDates = screen.getAllByTestId("day");
  expect(displayedDates).toHaveLength(1);
  expect(displayedDates[0]).toHaveTextContent(
    `It's 14 days until trip (${formattedDate(startDate)} - ${formattedDate(endDate)}, ${tripLength} days)`,
  );
});

it("can add trip with name", async () => {
  render(() => <Schengen />);

  const startDate = add(new Date(), { days: 14 });
  const endDate = add(new Date(), { days: 21 });

  await addTrip({ startDate, endDate, name: "portugal" });

  const displayedDates = screen.getAllByTestId("day");
  expect(displayedDates).toHaveLength(1);
  expect(displayedDates[0]).toHaveTextContent(
    `It's 14 days until portugal (${formattedDate(startDate)} - ${formattedDate(endDate)}, 8 days)`,
  );
});

it("can remove trip", async () => {
  const date = {
    date: "2024-01-01",
    endDate: "2024-01-15",
    name: "new year getaway",
  };
  localStorage.setItem("schengenDates", JSON.stringify([date]));
  render(() => <Schengen />);

  const displayedDates = screen.getAllByTestId("dayContainer");
  expect(displayedDates).toHaveLength(1);
  const displayedDate = displayedDates[0];
  expect(displayedDate).toHaveTextContent(
    `new year getaway (${formattedDate(date.date)} - ${formattedDate(date.endDate)}, 15 days)`,
  );

  await userEvent.hover(displayedDate);
  await userEvent.click(
    within(displayedDate).getByRole("button", { name: "close" }),
  );

  expect(screen.queryByTestId("dayContainer")).not.toBeInTheDocument();
});

it("can share trip", async () => {
  const date = {
    date: "2024-01-01",
    endDate: "2024-01-15",
    name: "new year getaway",
  };
  localStorage.setItem("schengenDates", JSON.stringify([date]));
  render(() => <Schengen />);

  const displayedDate = screen.getByTestId("dayContainer");

  await userEvent.hover(displayedDate);
  await userEvent.click(
    within(displayedDate).getByRole("button", { name: "share" }),
  );
  expect(location.href).toContain(
    "?date=2024-01-01+2024-01-15+new+year+getaway",
  );
  expect(await navigator.clipboard.readText()).toContain(
    "?date=2024-01-01+2024-01-15+new+year+getaway",
  );
});

it("can remove all trips", async () => {
  const trips = [
    { date: "1024-01-01", endDate: "1024-01-15", name: "trip 1" },
    { date: "2024-01-01", endDate: "2024-01-15", name: "trip 2" },
    { date: "3024-01-01", endDate: "3024-01-15", name: "trip 3" },
  ];
  localStorage.setItem("schengenDates", JSON.stringify(trips));
  render(() => <Schengen />);

  const displayedTrips = screen.getAllByTestId("dayContainer");
  expect(displayedTrips).toHaveLength(3);

  await userEvent.click(screen.getByRole("button", { name: "menu" }));
  await userEvent.click(screen.getByRole("button", { name: /Delete all/i }));
  await userEvent.click(screen.getByRole("button", { name: "Delete" })); // confirm

  expect(screen.queryByTestId("dayContainer")).not.toBeInTheDocument();
});

it("can share all trips", async () => {
  const trips = [
    { date: "1024-01-01", endDate: "1024-01-15", name: "trip 1" },
    { date: "2024-01-01", endDate: "2024-01-15", name: "trip 2" },
    { date: "3024-01-01", endDate: "3024-01-15", name: "trip 3" },
  ];
  localStorage.setItem("schengenDates", JSON.stringify(trips));
  render(() => <Schengen />);

  await userEvent.click(screen.getByRole("button", { name: "menu" }));
  await userEvent.click(screen.getByRole("button", { name: /Share all/i }));

  const searchQuery =
    "?date=1024-01-01+1024-01-15+trip+1&date=2024-01-01+2024-01-15+trip+2&date=3024-01-01+3024-01-15+trip+3";
  expect(location.href).toContain(searchQuery);
  expect(await navigator.clipboard.readText()).toContain(searchQuery);
});

it("calculates summary for a single future trip", async () => {
  const tripLength = 8;
  const startDate = add(new Date(), { days: 14 });
  const endDate = add(new Date(), { days: 14 + tripLength - 1 });
  const nextFullExitDate = add(endDate, { days: 180 });
  const nextFullEntranceDate = sub(nextFullExitDate, { days: 90 - 1 });
  const trips = [{ date: startDate, endDate, name: "trip 1" }];
  localStorage.setItem("schengenDates", JSON.stringify(trips));
  render(() => <Schengen />);

  const summaryRows = screen.getAllByTestId("summaryRow");
  expect(summaryRows).toHaveLength(3);
  expect(summaryRows[0]).toHaveTextContent("Today");
  expect(summaryRows[0]).toHaveTextContent("90 days");
  expect(summaryRows[1]).toHaveTextContent(
    `${formattedDate(add(endDate, { days: 1 }))}`,
  );
  expect(summaryRows[1]).toHaveTextContent(`${90 - tripLength} days`);
  expect(summaryRows[2]).toHaveTextContent(
    `${formattedDate(nextFullEntranceDate)}`,
  );
  expect(summaryRows[2]).toHaveTextContent("90 days");
});

it("calculates summary for multiple future trips", async () => {
  const trips = [
    {
      date: add(new Date(), { days: 10 }),
      endDate: add(new Date(), { days: 10 + 7 - 1 }),
      name: "1 week in france",
    },
    {
      date: add(new Date(), { days: 20 }),
      endDate: add(new Date(), { days: 20 + 14 - 1 }),
      name: "2 weeks in spain",
    },
  ];
  localStorage.setItem("schengenDates", JSON.stringify(trips));
  render(() => <Schengen />);

  const nextFullExitDate = add(add(new Date(), { days: 20 + 14 - 1 }), {
    days: 180,
  });
  const nextFullEntranceDate = sub(nextFullExitDate, { days: 90 - 1 });

  const summaryRows = screen.getAllByTestId("summaryRow");
  expect(summaryRows).toHaveLength(5);
  expect(summaryRows[0]).toHaveTextContent("Today");
  expect(summaryRows[0]).toHaveTextContent("90 days");

  // 83 days after 1w trip
  expect(summaryRows[1]).toHaveTextContent(
    `${formattedDate(add(new Date(), { days: 10 + 7 }))}`,
  );
  expect(summaryRows[1]).toHaveTextContent(`${90 - 7} days`);
  // 69 days after 1w trip and 2w trip
  expect(summaryRows[2]).toHaveTextContent(
    `${formattedDate(add(new Date(), { days: 20 + 14 }))}`,
  );
  expect(summaryRows[2]).toHaveTextContent(`${90 - 7 - 14} days`);
  // 76 days after 1w trip expires but 2w trip still counts
  expect(summaryRows[3]).toHaveTextContent(
    `${formattedDate(add(new Date(), { days: 10 + 7 - 1 + 180 - (90 - 14) + 1 }))}`,
  );
  expect(summaryRows[3]).toHaveTextContent(`${90 - 14} days`);

  expect(summaryRows[4]).toHaveTextContent(
    `${formattedDate(nextFullEntranceDate)}`,
  );
  expect(summaryRows[4]).toHaveTextContent("90 days");
});
