import { createContext, ReactElement, useEffect, useState } from 'react';
import { fetch_refresh_token, getLocalRefreshToken } from '../../lib/request';
import cookie from 'react-cookies';
import { Props } from '../../routes/routesTypes';
import { Centrifuge } from 'centrifuge';
import { decodeToken } from '../../lib/decodeToken';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import subscribe from '@/lib/subscribe';

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
      const centrifuge = new Centrifuge('wss://centrifugo.comunifyllc.com/connection/websocket', {
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
