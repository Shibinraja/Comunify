/* eslint-disable no-unused-vars */
import React, { ReactElement }  from 'react';
import { Navigate } from 'react-router';
import { getLocalRefreshToken } from '@/lib/request';
import { Props } from './routesTypes';


const PrivateRoute: React.FC<Props> = ({ children }) => {
  // const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  //   const subscriptionToken: string | null = localStorage.getItem('accessToken');
  //   const decodeJWTToken = (token: string | null): SubscriptionToken => {
  //     const value: SubscriptionToken | any = Boolean(token) && decodeToken(`${token}`);
  //     return value;
  //   };

  const refreshToken: string | null = getLocalRefreshToken();
  //   const decodedToken: SubscriptionToken = decodeJWTToken(subscriptionToken);
  //   const expiryDate: Date = new Date(decodedToken?.exp);
  //   const currentDate: Date = new Date();

  const checkAuthAndExpiry = (page: ReactElement): ReactElement => {
    if (refreshToken) {
      // if (expiryDate < currentDate && !location.pathname.includes('/subscription/expired/')) {
      //     return <Navigate to={`/subscription/expired/${decodedToken?.id}`} />;
      // }
      return page;
    }
    return <Navigate to="/" />;

  };

  return checkAuthAndExpiry(children);
};

export default PrivateRoute;
