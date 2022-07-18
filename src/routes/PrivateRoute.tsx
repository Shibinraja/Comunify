import { ReactElement } from 'react';
import { Navigate } from 'react-router';
import { getLocalRefreshToken } from '@/lib/request';
import { SubscriptionToken } from '../modules/authentication/interface/authentication.interface';
import jwt_decode from 'jwt-decode';
import { decodeToken } from '@/lib/decodeToken';
import { Props } from './routesTypes';


const PrivateRoute: React.FC<Props> = ({ children }) => {
    // const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    let subscriptionToken: string | null = localStorage.getItem('accessToken');

    const decodeJWTToken = (token: string | null): SubscriptionToken => {
        let value: SubscriptionToken | any = Boolean(token) && decodeToken(`${token}`);
        return value;
    };

    let refreshToken: string | null = getLocalRefreshToken();
    let decodedToken: SubscriptionToken = decodeJWTToken(subscriptionToken);
    let expiryDate: Date = new Date(decodedToken?.exp);
    let currentDate: Date = new Date();

    const checkAuthAndExpiry = (page: ReactElement): ReactElement => {
        if (Boolean(refreshToken)) {
            // if (expiryDate < currentDate && !location.pathname.includes('/subscription/expired/')) {
            //     return <Navigate to={`/subscription/expired/${decodedToken?.id}`} />;
            // }
            return page;
        } else {
            return <Navigate to="/" />;
        }
    };

    return checkAuthAndExpiry(children);
};

export default PrivateRoute;
