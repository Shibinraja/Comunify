import React from 'react';
import { RoutesArray } from '../../../interface/interface';
import Loadable from 'routes/suspenseLoader';
import ReportHistory from '../pages/reportHistory/ReportHistory';

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
    },
    {
      path: 'report-history',
      element: <ReportHistory />
    }
  ]
};

export default reportRoutes;
