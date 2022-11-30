import { Centrifuge } from 'centrifuge';

import { showInfoToast } from 'common/toast/toastFunctions';

import { VITE_APP_ENV, VITE_OS_HOSTNAME } from './config';

const subscribe = (centrifuge: Centrifuge, channel: string) => {
  const sub = centrifuge.newSubscription(`${VITE_APP_ENV === 'local' ? VITE_OS_HOSTNAME : VITE_APP_ENV}-${channel}`);

  sub.on('publication', (ctx) => {
    window.localStorage.setItem('newNotification', 'true');
    // Dispatch an event to check / subscribe to the notification when its published
    window.dispatchEvent(new Event('storage'));
    showInfoToast(ctx.data.message);
  });

  sub.subscribe();
};

export default subscribe;
