import { useAppSelector } from './useRedux';

const useLoading = (): boolean => {
  const loadingState = useAppSelector((state) => state.loader.loadingState);

  return loadingState;
};

export default useLoading;
