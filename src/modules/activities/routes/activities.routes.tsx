import React from 'react';
import { RoutesArray } from '../../../interface/interface';

const Activity = React.lazy(() => import('../pages/Activity'));

const activityRoutes: RoutesArray = {
    path: 'activity',
    children: [
        {
            path: '',
            element: <Activity />,
        },
    ],
};

export default activityRoutes;
