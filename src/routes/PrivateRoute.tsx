import { useAppDispatch } from '@/hooks/useRedux';
import { decodeToken } from '@/lib/decodeToken';
import { getLocalRefreshToken } from '@/lib/request';
import { isBefore } from 'date-fns';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import React from 'react';
import cookie from 'react-cookies';
import { Navigate } from 'react-router';
import { Props } from './routesTypes';

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const tokenData = getLocalRefreshToken();

  const dispatch = useAppDispatch();
  const access_token = tokenData || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = access_token && decodeToken(access_token);
  const workspaceId = localStorage.getItem('workspaceId');

  if (!workspaceId && access_token) {
    localStorage.setItem('workspaceId', decodedToken.workspaceId);
  }

  const isExpired = decodedToken && isBefore(new Date(decodedToken?.exp * 1000), new Date());

  if (isExpired !== undefined && !isExpired) {
    return children;
  }

  dispatch(authSlice.actions.signOut());
  return <Navigate to="/" />;
};

export default PrivateRoute;
