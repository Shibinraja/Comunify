import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import PrivateRoute from '../../../routes/PrivateRoute';

const Members = React.lazy(() => import('../pages/Members'));
const MembersProfileRoute = React.lazy(() => import('../pages/membersProfile/membersProfile'));


const membersRoutes: RoutesArray = {
  element: (
    <PrivateRoute>
      <Members />
    </PrivateRoute>
  ),
  path: '/dashboard/members',
};

const membersProfileRoutes: RoutesArray = {
  element:(
    <PrivateRoute>
      <MembersProfileRoute />
    </PrivateRoute>
  ),
  path:'/members/profile/:id'
}
export default membersRoutes; membersProfileRoutes;

