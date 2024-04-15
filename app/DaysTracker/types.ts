export type SavedDate = {
  endDate?: string;
  date: string;
  name?: string;
};

export type Settings = {
  /** true = "81 days", false (default) = "2 months 20 days" */
  displayDurationInDays?: boolean;
};
