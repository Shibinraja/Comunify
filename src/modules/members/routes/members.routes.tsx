import React from 'react';
import { RoutesArray } from '../../../interface/interface';

const Members = React.lazy(() => import('../pages/Members'));
const MembersProfileRoute = React.lazy(() => import('../pages/membersProfile/membersProfile'));

const membersRoutes: RoutesArray = {
    path: 'members',
    children: [
        {
            path: '',
            element: <Members />,
        },
        {
            element: <MembersProfileRoute />,
            path: 'profile',
        },
    ],
};

export default membersRoutes;
