import { Navigate } from 'react-router';
import { useAppSelector } from '@/hooks/useRedux';
import { Props } from './routesTypes';

const GuestRoute: React.FC<Props> = ({ children }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return isAuthenticated ?  children : <Navigate to = '/'/> ;
};

export default GuestRoute;
