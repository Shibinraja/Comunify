import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';
import DiscordIntegrationDetails from '../pages/integration/DiscordIntegration';
import IntegrationDetails from '../pages/integrationDetails/IntegrationDetails';

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
    },
    {
      path: 'integrationDetails/:id',
      element: <IntegrationDetails />
    },
    {
      element: <DiscordIntegrationDetails />,
      path: 'discord-integration'
    }
  ]
};

export default settingRoutes;
