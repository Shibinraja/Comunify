import { State } from '../store';
import { useAppSelector } from './useRedux';

const usePlatform = () => {
  const { PlatformFilterResponse, PlatformsConnected } = useAppSelector((state: State) => state.settings);
  return { PlatformFilterResponse, PlatformsConnected };
};

export default usePlatform;
