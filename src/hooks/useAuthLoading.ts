import { useAppSelector } from './useRedux';

const useAuthLoading = (): boolean => {
  const loadingState = useAppSelector((state) => state.loader.loadingState);

  return loadingState;
};

export default useAuthLoading;
