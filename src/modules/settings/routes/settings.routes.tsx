import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';

const Settings = Loadable(lazy(() => import('../pages/Settings')));
const CompleteSetupForSlack = Loadable(lazy(() => import('../pages/completeSetupForSlack/CompleteSetupForSlack')));

const settingRoutes: RoutesArray = {
  path: 'settings',
  children: [
    {
      path: '',
      element: <Settings />
    },
    {
      element: <CompleteSetupForSlack />,
      path: 'complete-setup'
    }
  ]
};

export default settingRoutes;
