import { decodeToken } from '@/lib/decodeToken';
import { getLocalRefreshToken } from '@/lib/request';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import React from 'react';
import cookie from 'react-cookies';
import { Props } from './routesTypes';

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const tokenData = getLocalRefreshToken();

  const access_token = tokenData || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = access_token && decodeToken(access_token);

  const workspaceId = localStorage.getItem('workspaceId');

  if (!workspaceId && access_token) {
    localStorage.setItem('workspaceId', decodedToken.workspaceId);
  }

  return children;
};

export default PrivateRoute;
