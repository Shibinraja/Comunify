/* eslint-disable no-unused-vars */

//Activity Type
export enum ActivityEnum {
  Activity = 'Activity',
  Member = 'Member'
}

// Input Body
export type SearchSuggestionArgsType = {
  workspaceId: string;
  cursor: string | null;
  prop: string;
  search: string;
  suggestionListCursor: string | null;
};


// Response Data
export type GlobalSearchDataResult =  {
  id: string,
  memberName: string,
  email: string,
  location: string,
  organization: string,
  value: string,
  displayValue: string,
  createdAt: string,
  icon: string,
  resultType: string
};

export type GlobalSearchDataResponse = {
  result: GlobalSearchDataResult[];
  nextCursor: string | null;
};
