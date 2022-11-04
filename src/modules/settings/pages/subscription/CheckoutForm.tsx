import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { SetupIntentResult, Stripe, StripeElements } from '@stripe/stripe-js';
import React, { Fragment, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import Button from '../../../../common/button';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { getLocalWorkspaceId } from '../../../../lib/helper';
import { SubscriptionPackages } from '../../../authentication/interface/auth.interface';
import { chooseSubscription } from '../../../authentication/services/auth.service';
import { BillingDetails, UpgradeData } from '../../interface/settings.interface';

interface Props {
  handleCheckoutFormModal?: () => void;
  redirectCondition: string;
  billingDetails?: BillingDetails;
  subscriptionId?: string;
  submitForm?: boolean;
  disableButtonLoader?: () => void;
  handleEffect?: () => void;
}

const CheckoutForm: React.FC<Props> = ({
  handleCheckoutFormModal,
  redirectCondition,
  billingDetails,
  subscriptionId,
  submitForm,
  disableButtonLoader,
  handleEffect
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const elements: StripeElements | null = useElements();
  const stripe: Stripe | null = useStripe();
  const navigate: NavigateFunction = useNavigate();
  const workspaceId = getLocalWorkspaceId();

  useEffect(() => {
    if (redirectCondition === 'signup-card' && submitForm === true) {
      handlePaymentViaSignUp();
    }
  }, [submitForm]);

  // eslint-disable-next-line space-before-function-paren
  const saveCardCredentialsOnStripe = async (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const response: SetupIntentResult = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: {
        // receipt_email: billingDetails?.billingEmail ?? 'edsadsada@yopmail.com',
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
    } else {
      if (redirectCondition === 'add-card') {
        setTimeout(() => {
          if (handleCheckoutFormModal) {
            handleCheckoutFormModal();
          }
          navigate(`/${workspaceId}/settings`, { state: { selectedTab: 'subscription' } });
          showSuccessToast('Card added successfully. Updating payment method list...');
          setIsLoading(false);
          window.location.reload();
        }, 6000);
      } else {
        if (handleEffect) {
          handleEffect();
        }
        if (handleCheckoutFormModal) {
          handleCheckoutFormModal();
        }
        showSuccessToast('Card added successfully. Updating payment method list...');
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
      const stripeResponse: SetupIntentResult = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
        confirmParams: {
          // receipt_email: billingDetails?.billingEmail ?? undefined,
          payment_method_data: {
            billing_details: {
              name: billingDetails?.billingName ?? undefined,
              email: billingDetails?.billingEmail ?? undefined
            }
          }
        }
      });
      if (stripeResponse?.setupIntent?.status === 'succeeded') {
        const body: UpgradeData = {
          paymentMethod: stripeResponse?.setupIntent?.payment_method as string,
          upgrade: true
        };
        const response: SubscriptionPackages = await chooseSubscription(subscriptionId, body);
        if (response) {
          showSuccessToast('Payment Successful and subscription plan activated');
          if (disableButtonLoader) {
            disableButtonLoader();
          }
          navigate(`/create-workspace`);
        } else {
          if (disableButtonLoader) {
            disableButtonLoader();
          }
        }
      } else {
        if (disableButtonLoader) {
          disableButtonLoader();
        }
      }
    }
  };

  return (
    <Fragment>
      <form id="payment-form">
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
      </form>
    </Fragment>
  );
};

export default CheckoutForm;
