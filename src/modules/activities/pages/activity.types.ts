/* eslint-disable no-unused-vars */

export type activityFilterExportProps = {
  checkTags: string;
  checkPlatform: string;
  endDate: string | undefined;
  startDate: string | undefined;
};

export type ActivityStreamTypesProps = {
  page: number;
  limit: number;
  searchText: string;
  activityFilterExport: (arg0: activityFilterExportProps) => void;
};
