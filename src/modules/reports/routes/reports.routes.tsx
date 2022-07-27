import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import Loadable from 'routes/suspenseLoader';


const Report = Loadable(React.lazy(() => import('../pages/Report')));
const CreateReport = Loadable(React.lazy(() => import('../pages/createReport/CreateReport')));

const reportRoutes: RoutesArray = {
  path: 'reports',
  children: [
    {
      path: '',
      element: <Report />
    },
    {
      path: 'create-report',
      element: <CreateReport />
    }
  ]
};

export default reportRoutes;
