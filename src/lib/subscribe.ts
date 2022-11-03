import { Centrifuge } from 'centrifuge';
import { showInfoToast } from 'common/toast/toastFunctions';
import { VITE_APP_ENV, VITE_OS_HOSTNAME } from './config';

const subscribe = (centrifuge: Centrifuge, channel: string) => {
  const sub = centrifuge.newSubscription(`${VITE_APP_ENV === 'local' ? VITE_OS_HOSTNAME : VITE_APP_ENV}-${channel}`);
  sub.on('publication', (ctx) => {
    showInfoToast(ctx.data.message);
  });
  sub.on('unsubscribed', (ctx) => {
    // eslint-disable-next-line no-console
    console.log(ctx);
  });

  sub.subscribe();
};

export default subscribe;
