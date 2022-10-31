import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentIntentResult, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import React, { useEffect } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import { showSuccessToast } from '../../../../common/toast/toastFunctions';
import { getLocalWorkspaceId } from '../../../../lib/helper';
import { SubscriptionPackages } from '../../../authentication/interface/auth.interface';
import { chooseSubscription } from '../../../authentication/services/auth.service';

interface Props {
  subscriptionId: string;
  billingEmail: string;
  billingName: string;
  sendCredentials: boolean;
}

const SaveCardCredentials: React.FC<Props> = ({ subscriptionId, sendCredentials, billingEmail, billingName }) => {
  const elements: StripeElements | null = useElements();
  const stripe: Stripe | null = useStripe();

  useEffect(() => {
    if (sendCredentials) {
      handleCardDetailsSubmit();
    }
  }, [sendCredentials]);

  const navigate: NavigateFunction = useNavigate();
  const workspaceId: string = getLocalWorkspaceId();

  // eslint-disable-next-line space-before-function-paren
  const handleCardDetailsSubmit = async () => {
    const response: SubscriptionPackages = await chooseSubscription(subscriptionId);
    navigate(`/${workspaceId}/settings/add-card`);

    if (response?.clientSecret) {
      const cardElement = elements?.getElement(CardElement) as StripeCardElement;
      const stripeResponse: PaymentIntentResult | undefined = await stripe?.confirmCardPayment(response?.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingName,
            email: billingEmail
          }
        }
      });
      if (stripeResponse?.paymentIntent?.status === 'succeeded') {
        // navigate(`/${workspaceId}/settings/add-card`);
        showSuccessToast('Card details saved');
      }
    }
  };

  return (
    <div>
      <div className="card relative mt-3 flex flex-col justify-center">
        <CardElement
          className="border rounded-lg bg-white py-6 h-16 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
          id="card-element"
        />
      </div>
    </div>
  );
};

export default SaveCardCredentials;
