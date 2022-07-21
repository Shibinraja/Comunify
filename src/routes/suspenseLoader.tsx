import LoadingScreen from 'common/Loader/LoadingScreen';
import { Suspense } from 'react';

export const Loadable = (Component:any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );