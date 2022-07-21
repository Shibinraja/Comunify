import { useAppSelector } from '@/hooks/useRedux';
import { Props } from './routesTypes';

const GuestRoute: React.FC<Props> = ({ children }) => {
    return children;
};

export default GuestRoute;
