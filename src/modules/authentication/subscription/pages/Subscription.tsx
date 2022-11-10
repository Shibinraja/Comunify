import React, { Fragment, useEffect, useState } from 'react';
import './Subscription.css';
import { useLocation } from 'react-router';
import { SubscriptionProps } from 'interface/interface';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentCard } from './PaymentCard';
import { createCardService } from '../../../settings/services/settings.services';
import { ClientSecret } from '../../../settings/interface/settings.interface';

const Subscription: React.FC = () => {
  const { subscriptionData } = useLocation().state as SubscriptionProps;
  const [clientSecret, setClientSecret] = useState<string>('');
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);

  useEffect(() => {
    getSecretKeyForStripe();
  }, []);

  const options = {
    clientSecret: clientSecret && clientSecret
  };

  // eslint-disable-next-line space-before-function-paren
  const getSecretKeyForStripe = async () => {
    const response: ClientSecret = await createCardService();
    setClientSecret(response?.clientSecret);
  };

  return (
    <Fragment>
      {stripePromise && options.clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentCard subscriptionData={subscriptionData} />
        </Elements>
      )}
    </Fragment>
  );
};

export default Subscription;
