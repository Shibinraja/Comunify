/* eslint-disable no-unused-expressions */
import React, { Fragment, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { SetupIntentResult, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';

import Button from '../../../../common/button';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { getNewlyAddedCardDetailsService } from 'modules/settings/services/settings.services';
import { SubscriptionPackages } from '../../../authentication/interface/auth.interface';
import { chooseSubscription } from '../../../authentication/services/auth.service';
import { AddedCardDetails, BillingDetails, UpgradeData } from '../../interface/settings.interface';

interface Props {
  handleCheckoutFormModal?: () => void;
  redirectCondition: string;
  billingDetails?: BillingDetails;
  subscriptionId?: string;
  submitForm?: boolean;
  disableButtonLoader?: () => void;
  handleEffect?: () => void;
  // eslint-disable-next-line no-unused-vars
  passNewlyAddedCardDetailsToChild?: (newlyAddedCardData: AddedCardDetails) => void;
}

const CheckoutForm: React.FC<Props> = ({
  handleCheckoutFormModal,
  redirectCondition,
  billingDetails,
  subscriptionId,
  submitForm,
  disableButtonLoader,
  handleEffect,
  passNewlyAddedCardDetailsToChild
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const elements: StripeElements | null = useElements();
  const stripe: Stripe | null = useStripe();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    if (redirectCondition === 'signup-card' && submitForm === true) {
      handlePaymentViaSignUp();
    }
  }, [submitForm]);

  // eslint-disable-next-line space-before-function-paren
  const getNewlyAddedCardDetails = async (paymentMethodId: string) => {
    const newCardDetails: AddedCardDetails = await getNewlyAddedCardDetailsService({ paymentId: paymentMethodId });
    return newCardDetails;
  };

  // eslint-disable-next-line space-before-function-paren
  const saveCardCredentialsOnStripe = async (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const paymentElement: StripePaymentElement | null = elements.getElement('payment');
    if (!paymentElement) {
      showErrorToast('Failed to load payment card form');
      return;
    }
    const response: SetupIntentResult = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: {
        payment_method_data: {
          billing_details: {
            name: billingDetails?.billingName ?? undefined,
            email: billingDetails?.billingEmail ?? undefined
          }
        }
      }
    });
    if (response?.error?.message) {
      setIsLoading(false);
      showErrorToast(response?.error?.message);
      return;
    }
    if (redirectCondition === 'add-card') {
      if (response?.setupIntent?.payment_method) {
        const newCardData = await getNewlyAddedCardDetails(response?.setupIntent?.payment_method as string);
        if (newCardData.cardLastFourDigits) {
          passNewlyAddedCardDetailsToChild && passNewlyAddedCardDetailsToChild(newCardData);
          setIsLoading(false);
          handleCheckoutFormModal && handleCheckoutFormModal();
          setTimeout(() => {
            showSuccessToast('Payment card added successfully');
          }, 1000);
        }
        setIsLoading(false);
      }
    } else {
      if (response?.setupIntent?.payment_method) {
        const newCardData = await getNewlyAddedCardDetails(response?.setupIntent?.payment_method as string);
        if (newCardData.cardLastFourDigits) {
          passNewlyAddedCardDetailsToChild && passNewlyAddedCardDetailsToChild(newCardData);
          showSuccessToast('Payment card added');
          handleEffect && handleEffect();
          setIsLoading(false);
          handleCheckoutFormModal && handleCheckoutFormModal();
        }
        setIsLoading(false);
      }
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePaymentViaSignUp = async () => {
    if (subscriptionId) {
      if (!stripe || !elements) {
        return;
      }
      const paymentElement: StripePaymentElement | null = elements.getElement('payment');
      if (!paymentElement) {
        showErrorToast('Failed to load payment card form');
        return;
      }
      const stripeResponse: SetupIntentResult = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: billingDetails?.billingName ?? undefined,
              email: billingDetails?.billingEmail ?? undefined
            }
          }
        }
      });
      if (stripeResponse?.error?.message) {
        setIsLoading(false);
        showErrorToast(stripeResponse?.error?.message);
        return;
      }
      if (stripeResponse?.setupIntent?.status === 'succeeded') {
        const body: UpgradeData = {
          paymentMethod: stripeResponse?.setupIntent?.payment_method as string,
          upgrade: true
        };
        const response: SubscriptionPackages = await chooseSubscription(subscriptionId, body);
        if (response?.status?.toLocaleLowerCase().trim() === 'paid') {
          showSuccessToast('Payment Successful and subscription plan activated');
          disableButtonLoader && disableButtonLoader();
          navigate(`/create-workspace`);
        } else {
          disableButtonLoader && disableButtonLoader();
          showErrorToast('Subscription failed');
        }
      } else {
        disableButtonLoader && disableButtonLoader();
      }
    }
  };

  return (
    <Fragment>
      <PaymentElement className="mt-8" id="payment-element" onLoadError={() => showErrorToast('Failed to load payment form')} />
      {redirectCondition !== 'signup-card' && (
        <div className="flex items-center justify-end mt-1.8">
          <Button
            text="Cancel"
            type="button"
            onClick={handleCheckoutFormModal && handleCheckoutFormModal}
            className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
          />
          <Button
            text="Save Card"
            disabled={isLoading}
            onClick={saveCardCredentialsOnStripe}
            className={`text-white font-Poppins text-error font-medium ${
              isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } leading-5 btn-save-modal rounded shadow-contactBtn px-4 py-2  cursor-pointer border-none h-2.81`}
          />
        </div>
      )}
    </Fragment>
  );
};

export default CheckoutForm;
