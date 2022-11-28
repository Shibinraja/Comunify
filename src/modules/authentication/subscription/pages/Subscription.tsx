import React, { Fragment, useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentCard } from './PaymentCard';
import cookie from 'react-cookies';
import './Subscription.css';

import { SubscriptionProps } from 'interface/interface';
import { createCardService } from '../../../settings/services/settings.services';
import { ClientSecret } from '../../../settings/interface/settings.interface';
import { stripePublishableKey } from '@/lib/config';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import { decodeToken } from '@/lib/decodeToken';

const Subscription: React.FC = () => {
  const { subscriptionData } = useLocation().state as SubscriptionProps;
  const navigate: NavigateFunction = useNavigate();
  const [clientSecret, setClientSecret] = useState<string>('');
  const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);
  const stripePromise = loadStripe(stripePublishableKey);

  useEffect(() => {
    getSecretKeyForStripe();
  }, []);

  useEffect(() => {
    if (decodedToken?.isPaymentSuccess) {
      navigate('/create-workspace');
    }
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
