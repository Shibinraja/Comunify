import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';

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
      path: 'profile',
      element: <MembersProfileRoute />
    },
    {
      path: 'members-review',
      element: <MembersReview />
    }
  ]
};

export default membersRoutes;
