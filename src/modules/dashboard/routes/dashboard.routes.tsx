import React from 'react';
import { Loadable } from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';

const Dashboard = Loadable(React.lazy(() => import('../pages/Dashboard')));

const dashboardRoutes: RoutesArray = {
    path: 'dashboard',
    element: <Dashboard />
};

export default dashboardRoutes;
