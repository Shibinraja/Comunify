import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import  Loadable  from 'routes/suspenseLoader';

const Account = Loadable(React.lazy(() => import('../pages/account')));

const accountRoutes: RoutesArray = {
    path: 'account',
    children: [
        {
            path: '',
            element: <Account />,
        },
    ],
};

export default accountRoutes;
