import useAuthLoading from '@/hooks/useAuthLoading';
import { getResolution } from '@/lib/resolution';
import Footer from 'common/footer';
import Header from 'common/header';
import Loader from 'common/Loader/Loader';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import { maximum_screen_height } from 'constants/constants';
import React, { Fragment, useEffect } from 'react';
import { Outlet } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import ResolutionLayout from './ResolutionLayout';

const AuthLayout: React.FC = () => {
  const { width: screenWidth } = getResolution();
  const loader = useAuthLoading();

  const [searchParams] = useSearchParams();
  const google_signIn_error: string = searchParams.get('err') || '';
  const google_signUp_success: string = searchParams.get('success') || '';

  useEffect(() => {
    if (google_signIn_error) {
      showErrorToast('Signin failed, please try again');
    }
  }, [google_signIn_error]);

  useEffect(() => {
    if (google_signUp_success) {
      showSuccessToast('Account created successfully');
    }
  }, [google_signUp_success]);

  return (
    <Fragment>
      {screenWidth < maximum_screen_height ? (
        <ResolutionLayout />
      ) : (
        <div className="flex flex-col overflow-y-auto">
          <Header />
          {loader && <Loader />}
          <Outlet />
          <Footer />
        </div>
      )}
    </Fragment>
  );
};

export default AuthLayout;
