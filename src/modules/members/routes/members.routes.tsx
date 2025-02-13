import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';
import MergedMembers from '../pages/mergedMembers/MergedMembers';

const Members = Loadable(lazy(() => import('../pages/Members')));
const MembersProfileRoute = Loadable(lazy(() => import('../pages/membersProfile/MembersProfile')));
const MembersReview = Loadable(lazy(() => import('../pages/membersReview/membersReview')));

const membersRoutes: RoutesArray = {
  path: 'members',
  children: [
    {
      path: '',
      element: <Members />
    },
    {
      path: ':memberId/profile',
      element: <MembersProfileRoute />
    },
    {
      path: ':memberId/members-review',
      element: <MembersReview />
    },
    {
      path: ':memberId/merged-members',
      element: <MergedMembers />
    }
  ]
};

export default membersRoutes;
