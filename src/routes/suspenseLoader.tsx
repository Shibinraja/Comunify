import LoadingScreen from 'common/Loader/LoadingScreen';
import { Suspense } from 'react';

// Function to load fallbackUI when react renders the user component/ route based on it's priority.

export const Loadable = (Component:any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );