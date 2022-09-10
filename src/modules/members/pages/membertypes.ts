/* eslint-disable no-unused-vars */
export type memberFilterExportProps = {
  checkTags: string;
  checkPlatform: string;
  checkOrganization: string;
  checkLocation: string;
  endDate: string | undefined;
  startDate: string | undefined;
};

export type MemberTypesProps = {
  page: number;
  limit: number;
  searchText: string;
  memberFilterExport: (arg0: memberFilterExportProps) => void;
};

export type customDateLinkProps = {
  '1day': boolean;
  '7day': boolean;
  '1month': boolean;
};

export type filterDateProps = {
  filterStartDate:string,
  filterEndDate:string
};
