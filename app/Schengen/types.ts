import { SavedDate } from "app/DaysTracker/types";

export type SchengenDate = Omit<SavedDate, "endDate"> &
  Required<Pick<SavedDate, "endDate">>;
