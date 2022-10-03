import QuickInfo from 'common/widgets/quickInfo/QuickInfo';
import HealthCard from 'common/widgets/healthCard/HealthCard';
import ActivitiesTab from 'common/widgets/activitiesTab/ActivitiesTab';
// import MembersTab from 'modules/dashboard/membersTab/pages/MembersTab';

export const initialWidgets = [
  {
    id: 'QuickInfo',
    layout: { i: 'QuickInfo', x: 0, y: 0, w: 2, h: 2 }
  }
  // {
  //   id: 'HealthCard',
  //   layout: { i: 'HealthCard', x: 2, y: 2, w: 2, h: 2 }
  // },
  // {
  //   id: 'ActivitiesTab',
  //   layout: { i: 'ActivitiesTab', x: 4, y: 4, w: 2, h: 2 }
  // }
];

export const widgetProfile = [
  {
    id: Math.random(),
    component: QuickInfo,
    layout: { i: 'QuickInfo', x: 0, y: 0, w: 2, h: 2 }
  },
  {
    id: Math.random(),
    component: HealthCard,
    layout: { i: 'HealthCard', x: 2, y: 2, w: 2, h: 2 }
  },
  {
    id: Math.random(),
    component: ActivitiesTab,
    layout: { i: 'ActivitiesTab', x: 4, y: 4, w: 2, h: 2 }
  }
];
