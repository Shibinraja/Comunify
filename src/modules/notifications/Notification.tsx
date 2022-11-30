import { createContext, ReactElement, useEffect, useState } from 'react';

import cookie from 'react-cookies';
import { Centrifuge } from 'centrifuge';

import { fetch_refresh_token, getLocalRefreshToken } from '../../lib/request';
import { decodeToken } from '../../lib/decodeToken';
import subscribe from '@/lib/subscribe';
import { VITE_CENTRIFUGO_URL } from '@/lib/config';

import { Props } from '../../routes/routesTypes';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';

export const CentrifugoContext = createContext({} as Centrifuge);

interface NotificationContextProps {
  children: ReactElement;
}
export const Notifications: React.FC<Props> = ({ children }: NotificationContextProps) => {
  const tokenData = getLocalRefreshToken();
  const access_token = tokenData || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = access_token && decodeToken(access_token);

  const [centrifugo, setCentrifugo] = useState({} as Centrifuge);

  const getToken = (): Promise<string> =>
    new Promise((res, rej) => {
      const token = getLocalRefreshToken() as string;
      if (!token) {
        rej();
      }
      const decodedToken: DecodeToken = decodeToken(token) as DecodeToken;
      // check if token in localstorage is expired
      // if expired then call refresh token api
      // For Idle scenario as refresh token is refreshed only during api calls
      if (new Date(decodedToken.exp * 1000) < new Date()) {
        fetch_refresh_token().then((data) => {
          const responseData = (data?.data as { data: { token: string } }).data.token;
          localStorage.setItem('accessToken', responseData);
          res(responseData);
        });
      }
      res(token as string);
    });

  useEffect(() => {
    if (access_token) {
      // Centrifuge Connection
      const centrifuge = new Centrifuge(VITE_CENTRIFUGO_URL, {
        token: `${access_token}`,
        debug: true,
        timeout: 5000,
        // refresh token
        // as auth jwt is being used read token from local storage
        getToken() {
          return getToken();
        }
      });

      centrifuge.connect();

      // Subscriptions
      subscribe(centrifuge, decodedToken.id);

      setCentrifugo(centrifuge);

      return () => {
        centrifuge.disconnect();
      };
    }
  }, []);

  return <CentrifugoContext.Provider value={centrifugo}>{children}</CentrifugoContext.Provider>;
};
