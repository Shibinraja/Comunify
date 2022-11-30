import React from 'react';
import successToastIcon from '../../assets/images/svg/successToastIcon.svg';
import errorToastIcon from '../../assets/images/svg/errorToastIcon.svg';
import warningCloseButton from '../../assets/images/svg/warningCloseButton.svg';
import { toast } from 'react-toastify';
import ToastContent from './ToastContent';

export const showSuccessToast = (message: string) => {
  toast(<ToastContent title="Success" description={message} />, {
    type: 'success',
    icon: () => <img src={successToastIcon} />
  });
};

// TODO: Need to add proper icon
export const showInfoToast = (message: string) => {
  toast(<ToastContent title="Info" description={message} />, {
    type: 'info',
    theme: 'colored'
    // icon: () => <img src={successToastIcon} />
  });
};

export const showErrorToast = (message: string) => {
  toast(<ToastContent title="Failed!" description={message} />, {
    type: 'error',
    icon: () => <img src={errorToastIcon} />
  });
};

export const showWarningToast = (message: string) => {
  toast(<ToastContent title="Warning" description={message} />, {
    type: 'warning',
    icon: () => <img src={warningCloseButton} />
  });
};
