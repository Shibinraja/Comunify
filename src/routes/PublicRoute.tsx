import React, { Reducer, useEffect, useReducer } from 'react';
import { Navigate, NavigateFunction, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import cookie from 'react-cookies';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import { decodeToken } from '@/lib/decodeToken';
import { AppDispatch } from '../store';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { getLocalRefreshToken } from '@/lib/request';
import { Props, PublicRouteState, PublicRouteStateValues } from './routesTypes';
import { getLocalWorkspaceId, setRefreshToken } from '@/lib/helper';
import { showWarningToast } from 'common/toast/toastFunctions';

const reducer: Reducer<PublicRouteState, PublicRouteStateValues> = (state, action): { route: string } => {
  switch (action.type) {
    case 'SET_WELCOME_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_WORKSPACE_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_SUBSCRIPTION_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_DASHBOARD_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_RESEND_VERIFICATION_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_SUPER_ADMIN_USER_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_SUBSCRIPTION_EXPIRED':
      return { ...state, route: action.payload };
    case 'SET_PAYMENT_SUCCESS':
      return { ...state, route: action.payload };
    default:
      return state;
  }
};

const InitialRouteState = {
  route: '/'
};

// eslint-disable-next-line react/prop-types
const PublicRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const tokenData: string = getLocalRefreshToken();
  const access_token = tokenData || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = access_token && decodeToken(access_token);
  const workspaceId: string = decodedToken?.workspaceId || getLocalWorkspaceId();

  const [state, dispatchReducer] = useReducer<Reducer<PublicRouteState, PublicRouteStateValues>>(reducer, InitialRouteState);

  useEffect(() => {
    if (access_token) {
      localStorage.setItem('accessToken', access_token);
      checkWorkspaceCreation();
    }
  }, [access_token]);

  //Functionality to check the workspace and packages subscription and route dynamically to the respected page.

  const checkWorkspaceCreation = () => {
    if (!decodedToken?.isAdmin) {
      if (!decodedToken?.isEmailVerified) {
        dispatchReducer({ type: 'SET_RESEND_VERIFICATION_ROUTE', payload: '/resend-mail' });
        dispatch(authSlice.actions.setIsAuthenticated(true));
        return false;
      }
      if (!decodedToken?.isSubscribed && decodedToken?.isEmailVerified) {
        dispatchReducer({ type: 'SET_WELCOME_ROUTE', payload: '/welcome' });
        dispatch(authSlice.actions.setIsAuthenticated(true));
        return false;
      }
      if (!decodedToken?.isSubscribed || !decodedToken?.isWorkSpaceCreated) {
        dispatchReducer({ type: 'SET_WORKSPACE_ROUTE', payload: '/create-workspace' });
        dispatch(authSlice.actions.setIsAuthenticated(true));
        return false;
      }
      //Defunct as of now
      // if (!decodedToken?.isSubscribed && decodedToken?.isEmailVerified) {
      //   dispatchReducer({ type: 'SET_SUBSCRIPTION_ROUTE', payload: '/subscription' });
      //   dispatch(authSlice.actions.setIsAuthenticated(true));
      //   return false;
      // }
      if (decodedToken?.isSubscribed && decodedToken?.isWorkSpaceCreated) {
        setRefreshToken();
        if (decodedToken?.isExpired) {
          navigate(`/subscription/expired`);
          // dispatchReducer({ type: 'SET_SUBSCRIPTION_EXPIRED', payload: '/subscription/expired' });
          showWarningToast('Your subscription has expired! Please purchase a plan to continue using comunify');
          return false;
        }
        if (!decodedToken?.isPaymentSuccess) {
          navigate(`/subscription/expired/activate-subscription?paymentStatus=paymentFailed`);
          // dispatchReducer({ type: 'SET_PAYMENT_SUCCESS', payload: `/subscription/expired/activate-subscription?paymentStatus=paymentFailed` });
          return false;
        }
        dispatchReducer({ type: 'SET_DASHBOARD_ROUTE', payload: `/${workspaceId}/dashboard` });
        dispatch(authSlice.actions.setIsAuthenticated(true));
        return false;
      }
    }
    if (decodedToken.isAdmin) {
      dispatchReducer({ type: 'SET_SUPER_ADMIN_USER_ROUTE', payload: `/admin/users` });
      dispatch(authSlice.actions.setIsAuthenticated(true));
      return false;
    }
  };

  return isAuthenticated ? <Navigate to={state.route} /> : children;
};

export default PublicRoute;
