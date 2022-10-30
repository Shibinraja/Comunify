import React, { lazy } from 'react';
import PublicRoute from '../../../routes/PublicRoute';
import { RoutesArray } from '../../../interface/interface';
import CreateNewPassword from '../createNewPassword/pages/CreateNewPassword';
import PrivateRoute from 'routes/PrivateRoute';
import GuestRoute from 'routes/GuestGuard';
import Loadable from 'routes/suspenseLoader';

//Public Route
const SignIn = Loadable(lazy(() => import('../signIn/pages/SignIn')));
const SignUp = Loadable(lazy(() => import('../signUp/pages/SignUp')));
const ForgotPassword = Loadable(lazy(() => import('../forgotPassword/pages/ForgotPassword')));
const CreateWorkSpace = Loadable(lazy(() => import('../createWorkSpace/pages/CreateWorkSpace')));
const ResendVerificationMail = Loadable(lazy(() => import('../resendVerificationMail/ResendVerification')));
const AuthLayout = Loadable(lazy(() => import('../../../layout/AuthLayout')));

//Private Route
const Welcome = Loadable(lazy(() => import('../welcome/pages/Welcome')));
const Integration = Loadable(lazy(() => import('../integration/pages/Integration')));
const Subscription = Loadable(lazy(() => import('../subscription/pages/Subscription')));
const SubscriptionExpired = Loadable(lazy(() => import('../subscriptionExpired/pages/SubscriptionExpired')));
const SubscriptionExpiredAactivate = Loadable(lazy(() => import('../../authentication/subscriptionExpired/pages/SubscriptionExpiredAactivate')));


const authRoutes: RoutesArray[] = [
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
        )
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        )
      },
      {
        path: '/create-workspace',
        element: (
          <PrivateRoute>
            <CreateWorkSpace />
          </PrivateRoute>
        )
      },
      {
        path: '/forgot-password',
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        )
      },
      {
        path: '/create-password',
        element: (
          <PublicRoute>
            <CreateNewPassword />
          </PublicRoute>
        )
      },
      {
        path: '/resend-mail',
        element: (
          <GuestRoute>
            <ResendVerificationMail />
          </GuestRoute>
        )
      },
      {
        element: (
          <PrivateRoute>
            <Welcome />
          </PrivateRoute>
        ),
        path: '/welcome'
      },
      {
        element: (
          <PrivateRoute>
            <Integration />
          </PrivateRoute>
        ),
        path: '/integration'
      },
      {
        element: (
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        ),
        path: '/subscription'
      },
      {
        element: (
          <PrivateRoute>
            <SubscriptionExpired />
          </PrivateRoute>
        ),
        path: '/subscription/expired'
      },
      {
        element: (
          <PrivateRoute>
            <SubscriptionExpiredAactivate/>
          </PrivateRoute>
        ),
        path: '/subscription/expired/activate-subscription'
      }
    ]
  }
];

export default authRoutes;
