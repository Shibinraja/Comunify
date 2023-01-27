import React, { lazy } from 'react';
import Loadable from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';
import DiscordIntegrationDetails from '../pages/integration/DiscordIntegration';
import GithubIntegration from '../pages/integration/GithubIntegration';
import IntegrationDetails from '../pages/integrationDetails/IntegrationDetails';

const Settings = Loadable(lazy(() => import('../pages/Settings')));
const CompleteSetupForSlack = Loadable(lazy(() => import('../pages/completeSetupForSlack/CompleteSetupForSlack')));
const RedditIntegration = Loadable(lazy(() => import('../pages/integration/RedditIntegration')));
const SubscriptionExpiredAddCard = Loadable(lazy(() => import('../../authentication/subscriptionExpired/pages/SubscriptionExpiredActivate')));
const SalesForceSelectCommunity = Loadable(lazy(() => import('../pages/integration/SalesForceSelectCommunity')));

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
    },
    {
      element: <RedditIntegration />,
      path: 'reddit-integration'
    },
    {
      element: <SubscriptionExpiredAddCard />,
      path: 'subscription-add-card'
    },
    {
      element: <GithubIntegration />,
      path: 'github-integration'
    },
    {
      element: <SalesForceSelectCommunity />,
      path: 'salesforce-integration'
    }
  ]
};

export default settingRoutes;
