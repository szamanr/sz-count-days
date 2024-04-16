import { SavedDate } from "app/DaysTracker/types";

export type SchengenDate = SavedDate & Required<Pick<SavedDate, "endDate">>;
