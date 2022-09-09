import { useSelector } from 'react-redux';
import { State } from '../store';

const useSkeletonLoading = (action: string): boolean => {
  const loadingState = useSelector((state: State) => state.loader.loadingActions);

  return loadingState.includes(action);
};

export default useSkeletonLoading;
