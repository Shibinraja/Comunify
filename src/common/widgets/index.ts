import { lazy } from 'react';

const QuickInfo = lazy(() => import('./quickInfo/QuickInfo'));
const ActivitiesTab = lazy(() => import('./activitiesTab/ActivitiesTab'));
const HealthCard = lazy(() => import('./healthCard/HealthCard'));
const MembersTab = lazy(() => import('./membersTab/MembersTab'));
const MemberGrowth = lazy(() => import('./memberGrowth/MemberGrowth'));
const ActivityGrowth = lazy(() => import('./activityGrowth/ActivityGrowth'));
const TopContributor = lazy(() => import('./topContributor/TopContributor'));
const ActiveMembers = lazy(() => import('./activeMembers/ActiveMembers'));
const InActiveMembers = lazy(() => import('./inactiveMembers/InactiveMembers'));
const NewActivities = lazy(() => import('./newActivities/NewActivities'));
const Highlights = lazy(() => import('./highlights/Highlights'));

export default {
  QuickInfo,
  HealthCard,
  ActivitiesTab,
  MembersTab,
  MemberGrowth,
  ActivityGrowth,
  TopContributor,
  ActiveMembers,
  InActiveMembers,
  NewActivities,
  Highlights
} as any;
