import React from 'react';
import { RoutesArray } from '../../../interface/interface';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));

const dashboardRoutes: RoutesArray = {
    path: 'dashboard',
    children: [
        {
            path: '',
            element: <Dashboard />,
        }
    ],
};

export default dashboardRoutes;
