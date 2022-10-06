import { lazy } from 'react';

const QuickInfo = lazy(() => import('./quickInfo/QuickInfo'));
const ActivitiesTab = lazy(() => import('./activitiesTab/ActivitiesTab'));
const HealthCard = lazy(() => import('./healthCard/HealthCard'));
const MembersTab = lazy(() => import('./membersTab/MembersTab'));
const MemberGrowth = lazy(() => import('./memberGrowth/MemberGrowth'));
const ActivityGrowth = lazy(() => import('./activityGrowth/ActivityGrowth'));

export default { QuickInfo, HealthCard, ActivitiesTab, MembersTab, MemberGrowth, ActivityGrowth } as any;
