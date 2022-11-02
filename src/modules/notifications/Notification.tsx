import { createContext, ReactElement, useEffect, useState } from 'react';
import { getLocalRefreshToken } from '../../lib/request';
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
      const token = getLocalRefreshToken();
      if (!token) {
        rej();
      }
      res(token);
    });

  useEffect(() => {
    if (access_token) {
      // Centrifuge Connection
      const centrifuge = new Centrifuge('wss://centrifugo.comunifyllc.com/connection/websocket', {
        token: access_token,
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
