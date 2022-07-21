import { useAppSelector } from '@/hooks/useRedux';
import { Props } from './routesTypes';

const GuestRoute: React.FC<Props> = ({ children }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return children;
};

export default GuestRoute;
