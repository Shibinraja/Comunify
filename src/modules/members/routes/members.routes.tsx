import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import PrivateRoute from '../../../routes/PrivateRoute';

const Members = React.lazy(() => import('../pages/Members'));

const membersRoutes: RoutesArray = {
  element: (
    <PrivateRoute>
      <Members />
    </PrivateRoute>
  ),
  path: '/dashboard/members',
};

export default membersRoutes;
