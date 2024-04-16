export type SavedDate = {
  endDate?: string;
  date: string;
  name?: string;
};

export type Settings = {
  /** true = "81 days", false (default) = "2 months 20 days" */
  displayDurationInDays: boolean;
  /** true: 1-3 jan = 3 days, false (default): 1-3 jan = 2 days */
  includeLastDay: boolean;
};
