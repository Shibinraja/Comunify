import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';

const Members = Loadable(lazy(() => import('../pages/Members')));
const MembersProfileRoute = Loadable(lazy(() => import('../pages/membersProfile/membersProfile')));
const MembersReview = Loadable(lazy(() => import('../pages/membersReview/membersReview')));

const membersRoutes: RoutesArray = {
  path: ':workspaceId/members',
  children: [
    {
      path: '',
      element: <Members />
    },
    {
      element: <MembersProfileRoute />,
      path: 'profile'
    },
    {
      element: <MembersReview />,
      path: 'members-review'
    }
  ]
};

export default membersRoutes;
