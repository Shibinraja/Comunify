import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import Loadable from 'routes/suspenseLoader';

const Activity = Loadable(React.lazy(() => import('../pages/Activity')));

const activityRoutes: RoutesArray = {
  path: 'activity',
  children: [
    {
      path: '',
      element: <Activity />
    }
  ]
};

export default activityRoutes;
