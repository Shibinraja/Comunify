import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';

const Members = Loadable(lazy(() => import('../pages/Users')));
const Account = Loadable(React.lazy(() => import('../../account/pages/account')));

const superAdminMembersRoutes: RoutesArray = {
  children: [
    {
      path: 'users',
      element: <Members />
    },
    {
      path: 'settings',
      element: <Account />
    }
  ]
};

export default superAdminMembersRoutes;
