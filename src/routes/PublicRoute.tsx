import React, { Reducer, useEffect, useReducer } from 'react';
import { Navigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import cookie from 'react-cookies';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import { decodeToken } from '@/lib/decodeToken';
import { AppDispatch } from '../store';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { getLocalRefreshToken } from '@/lib/request';
import { Props, PublicRouteState, PublicRouteStateValues } from './routesTypes';
import { getLocalWorkspaceId } from '@/lib/helper';

const reducer: Reducer<PublicRouteState, PublicRouteStateValues> = (state, action): { route: string } => {
  switch (action.type) {
    case 'SET_WELCOME_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_WORKSPACE_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_DASHBOARD_ROUTE':
      return { ...state, route: action.payload };
    case 'SET_RESEND_VERIFICATION_ROUTE':
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
  const tokenData = getLocalRefreshToken();

  const access_token = tokenData || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = access_token && decodeToken(access_token);
  const workspaceId = decodedToken?.workspaceId || getLocalWorkspaceId();

  const [state, dispatchReducer] = useReducer<Reducer<PublicRouteState, PublicRouteStateValues>>(reducer, InitialRouteState);

  useEffect(() => {
    if (access_token) {
      localStorage.setItem('accessToken', access_token);
      checkWorkspaceCreation();
    }
  }, [access_token]);

  //Functionality to check the workspace and packages subscription and route dynamically to the respected page.

  const checkWorkspaceCreation = () => {
    if (!decodedToken?.isVerified) {
      dispatchReducer({ type: 'SET_RESEND_VERIFICATION_ROUTE', payload: '/resend-mail' });
      dispatch(authSlice.actions.setIsAuthenticated(true));
      return false;
    }
    if (!decodedToken?.isSubscribed) {
      dispatchReducer({ type: 'SET_WELCOME_ROUTE', payload: '/welcome' });
      dispatch(authSlice.actions.setIsAuthenticated(true));
      return false;
    }
    if (!decodedToken?.isSubscribed || !decodedToken?.isWorkSpaceCreated) {
      dispatchReducer({ type: 'SET_WORKSPACE_ROUTE', payload: '/create-workspace' });
      dispatch(authSlice.actions.setIsAuthenticated(true));
      return false;
    }
    if (decodedToken?.isSubscribed && decodedToken?.isWorkSpaceCreated) {
      dispatchReducer({ type: 'SET_DASHBOARD_ROUTE', payload: `/${workspaceId}/dashboard` });
      dispatch(authSlice.actions.setIsAuthenticated(true));
      return false;
    }
  };

  return isAuthenticated ? <Navigate to={state.route} /> : children;
};

export default PublicRoute;
