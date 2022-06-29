import QuickInfo from 'common/quickInfo/QuickInfo';
import React, { useEffect } from 'react';
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from '../../../common/toast/toastFunctions';

const Dashboard = () => {
  useEffect(() => {
    showWarningToast('The login was a success!');
  }, []);

  return (
    <div className='flex flex-col'>
      <QuickInfo />
    </div>
  );
};

export default Dashboard;
