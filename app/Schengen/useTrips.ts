import { SchengenDate } from "app/Schengen/types";
import { addDays, isBefore, max, min, subDays } from "date-fns";
import { Accessor } from "solid-js";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";

export const useTrips = (trips: Accessor<SchengenDate[]>) => {
  const startOfRolling180DayWindow = (date: Date | string) =>
    subDays(date, 180 - 1);

  const daysRemainingAt = (entranceDate: Date | string) => {
    let exitDate = entranceDate;
    let relevantTrips = trips()
      // don't display dates which don't affect our available days budget as of today
      .filter(
        (trip) =>
          !isBefore(trip.endDate, startOfRolling180DayWindow(entranceDate)),
      )
      // remove future trips from calculation
      .filter((trip) => isBefore(trip.date, exitDate))
      .map((trip) => ({ ...trip, daysUsed: 0 }));
    let duration = 0;

    while (duration < 90) {
      exitDate = addDays(entranceDate, duration);
      relevantTrips = relevantTrips
        // consider only trips which ended within our rolling window
        .filter(
          (trip) =>
            !isBefore(trip.endDate, startOfRolling180DayWindow(exitDate)),
        )
        // calculate trip's used days within our rolling window
        .map((trip) => ({
          ...trip,
          daysUsed:
            differenceInCalendarDays(
              min([trip.endDate, exitDate]),
              max([trip.date, startOfRolling180DayWindow(exitDate)]),
            ) + 1,
        }));
      const used = relevantTrips.reduce(
        (sum, { daysUsed }) => sum + daysUsed,
        0,
      );

      if (used + duration >= 90) {
        return duration;
      } else {
        duration++;
      }
    }

    return duration;
  };

  return { daysRemainingAt };
};
