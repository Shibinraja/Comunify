/* eslint-disable react/display-name */
import React, { Suspense } from 'react';
import LoadingScreen from 'common/Loader/LoadingScreen';

// Function to load fallbackUI when react renders the user component/ route based on it's priority.

const Loadable = (Component:any) => (props: JSX.IntrinsicAttributes) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

export default Loadable;
