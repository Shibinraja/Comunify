import { lazy } from 'react';
import { Loadable } from 'routes/suspenseLoader';
import { RoutesArray } from '../../../interface/interface';

const Members = Loadable(lazy(() => import('../pages/Members')));
const MembersProfileRoute = Loadable(lazy(() => import('../pages/membersProfile/membersProfile')));

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
