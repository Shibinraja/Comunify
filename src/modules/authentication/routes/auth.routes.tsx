import React from 'react';
import PublicRoute from '../../../routes/PublicRoute';
import { RoutesArray } from '../../../interface/interface';

const SignIn = React.lazy(() => import('../signIn/pages/SignIn'));
const SignUp = React.lazy(() => import('../signUp/pages/SignUp'));
const ForgotPassword = React.lazy(
  () => import('../forgotPassword/pages/ForgotPassword'),
);
const AuthLayout = React.lazy(() => import('../../../layout/AuthLayout'));

let authRoutes: RoutesArray[] = [
  {
    element: <AuthLayout />,
    path: '/',
    children: [
      {
        path: '/',
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
        path: '/forgot-password',
      },
    ],
  },
];

export default authRoutes;
