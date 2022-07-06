import type { ReactElement } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '@/hooks/useRedux';
import { getLocalRefreshToken } from '@/lib/request';

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isAuthenticated = getLocalRefreshToken();

  return Boolean(isAuthenticated) ? children : <Navigate to='/' />;
};

export default PrivateRoute;
