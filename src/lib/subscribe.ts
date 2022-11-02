import { Centrifuge } from 'centrifuge';
import { showInfoToast } from 'common/toast/toastFunctions';

const subscribe = (centrifuge: Centrifuge, channel: string) => {
  // use env
  const sub = centrifuge.newSubscription(`${'ntpl-IdeaPad-5-15ITL05-Ua'}-${channel}`);
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
