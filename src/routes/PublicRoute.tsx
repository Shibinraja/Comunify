import type { ReactElement } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '@/hooks/useRedux';

interface Props {
    children: ReactElement;
}

const PublicRoute: React.FC<Props> = ({ children }) => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;
