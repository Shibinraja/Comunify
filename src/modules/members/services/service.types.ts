export type memberSuggestionType = {
  workspaceId: string;
  memberId: string;
  cursor: string | null;
  prop: string;
  search: string;
  suggestionListCursor: string | null;
};

export type mergeMembersType = {
  workspaceId: string;
  memberId: string;
  mergeList: {
    primaryMemberId: string;
    memberId: string;
  }[];
};

export type unMergeMembersType = {
  workspaceId: string;
  memberId: string;
  unMergeId: string;
};
