import { State } from '../store';
import { useAppSelector } from './useRedux';

const usePlatform = () => {
  const platformData = useAppSelector((state: State) => state.settings.PlatformFilterResponse);
  return platformData;
};

export default usePlatform;
