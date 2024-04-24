import {
  addDays,
  areIntervalsOverlapping,
  isBefore,
  isValid,
  isWithinInterval,
  max,
  min,
  subDays,
} from "date-fns";
import { differenceInCalendarDays } from "date-fns/differenceInCalendarDays";
import { Accessor } from "solid-js";
import { SchengenDate } from "app/Schengen/types";

type Hook = {
  daysRemainingAt: (entranceDate: Date | string) => number;
  overlappingTrips: (
    date: Date | string,
    endDate?: Date | string,
  ) => SchengenDate[];
};

export const useTrips = (trips: Accessor<SchengenDate[]>): Hook => {
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

  const overlappingTrips = (date: Date | string, endDate?: Date | string) => {
    if (!date && !endDate) return [];

    if (endDate) {
      if (!isValid(new Date(endDate)) || !isValid(new Date(date))) {
        console.error(
          `received invalid dates ("${date}", "${endDate}") when trying to find overlapping trips.`,
        );
        return [];
      }
      return trips().filter((trip) =>
        areIntervalsOverlapping(
          { start: date, end: endDate },
          {
            start: trip.date,
            end: trip.endDate,
          },
        ),
      );
    }

    if (!isValid(new Date(date))) {
      console.error(
        `received invalid date "${date}" when trying to find overlapping trips.`,
      );
      return [];
    }

    return trips().filter((trip) =>
      isWithinInterval(date, {
        start: trip.date,
        end: trip.endDate,
      }),
    );
  };

  return { daysRemainingAt, overlappingTrips };
};
