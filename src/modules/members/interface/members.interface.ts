export type MembersCountResponse = {
  count: number;
  title: string;
  analyticMessage: string;
};

export interface SeriesDataForMemberGraph {
  name: string;
  data: number[];
}

export interface MembersProfileActivityGraphData {
  series: SeriesDataForMemberGraph[];
  xAxis: string[];
}

export interface VerifyMembers {
  memberId: string;
}

export interface MemberGraphProps {
  activityGraphData: MembersProfileActivityGraphData;
}
export interface PlatformsData {
  id: string;
  name: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VerifyPlatform {
  memberId: VerifyMembers;
  platformId: string;
  name: string;
}
