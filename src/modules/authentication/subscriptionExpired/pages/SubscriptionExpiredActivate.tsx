import React, { Dispatch, useEffect, useState } from 'react';
import MasterCardIcon from '../../../../assets/images/masterCard.svg';
import VisaCardIcon from '../../../../assets/images/visa.svg';
import deleteIcon from '../../../../assets/images/delete.svg';
import Button from 'common/button';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import { getLocalWorkspaceId } from '../../../../lib/helper';
import {
  createCardService,
  deleteCardService,
  getCardDetailsService,
  getChoseSubscriptionPlanDetailsService,
  selectCardService,
  setPlanAutoRenewalService
} from '../../../settings/services/settings.services';
import {
  AddedCardDetails,
  ClientSecret,
  SubscriptionDetails,
  UpdateSubscriptionAutoRenewal,
  UpdateSubscriptionBody,
  UpgradeData
} from '../../../settings/interface/settings.interface';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import Modal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../../../settings/pages/subscription/CheckoutForm';
import { SubscriptionPackages } from '../../interface/auth.interface';
import { chooseSubscription } from '../../services/auth.service';
import { useDispatch } from 'react-redux';
import authSlice from '../../store/slices/auth.slice';
import { useAppSelector } from '../../../../hooks/useRedux';
import { State } from '../../../../store';
import Skeleton from 'react-loading-skeleton';
import ToggleButton from 'common/ToggleButton/ToggleButton';
import { AnyAction } from 'redux';

interface SelectedCard {
  id: string;
  cardNumber: number;
}

const SubscriptionExpiredActivate: React.FC = () => {
  const [isLoading, setIsLoading] = useState<{ autoRenewal: boolean; upgrade: boolean; confirmationModal: boolean }>({
    autoRenewal: false,
    upgrade: false,
    confirmationModal: false
  });
  const location: Location | any = useLocation();
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const workspaceId: string = getLocalWorkspaceId();
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails | undefined>();
  const [addCardForm, setAddCardForm] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
  const [addedCardDetails, setAddedCardDetails] = useState<AddedCardDetails[]>();
  const [selectedCard, setSelectedCard] = useState<SelectedCard | undefined>(undefined);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [toggle, setToggle] = useState<boolean>(true);
  const [isConfirmationModal, setIsConfirmationModal] = useState<boolean>(false);
  const [callEffect, setCallEffect] = useState<boolean>(false);
  const stripePromise = loadStripe(`${import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}`);

  useEffect(() => {
    getSecretKeyForStripe();
  }, []);

  useEffect(() => {
    getCurrentSubscriptionPlanDetails();
  }, []);

  useEffect(() => {
    getCardDetails();
  }, []);

  useEffect(() => {
    dispatch(authSlice.actions.getSubscriptions());
  }, []);

  useEffect(() => {
    if (callEffect === true) {
      setTimeout(() => {
        getCardDetails();
        showSuccessToast('Payment method list updated');
        setCallEffect(false);
      }, 6000);
    }
  }, [callEffect]);

  const subscriptionData = useAppSelector((state: State) => state.auth.subscriptionData);

  // eslint-disable-next-line space-before-function-paren
  const getCardDetails = async () => {
    const response: AddedCardDetails[] = await getCardDetailsService();
    setAddedCardDetails(response);
    const defaultCard = response?.filter((data: AddedCardDetails) => data?.isDefault === true)[0];
    setSelectedCard({ id: defaultCard?.id, cardNumber: defaultCard?.cardLastFourDigits });
  };

  // eslint-disable-next-line space-before-function-paren
  const getSecretKeyForStripe = async () => {
    const response: ClientSecret = await createCardService();
    setClientSecret(response?.clientSecret);
  };

  // eslint-disable-next-line space-before-function-paren
  const handleDeleteCard = async (id: string, isDefault: boolean) => {
    if (addedCardDetails?.length && addedCardDetails?.length === 1) {
      showWarningToast('A minimum of one payment method is required');
    }
    if (isDefault) {
      showWarningToast('Cannot delete a default payment method');
    } else {
      setIsConfirmationModal(true);
      setSelectedCardId(id);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const getCurrentSubscriptionPlanDetails = async () => {
    const response: SubscriptionDetails = await getChoseSubscriptionPlanDetailsService();
    setSubscriptionDetails(response);
    setToggle(response?.autoRenewal);
  };

  // eslint-disable-next-line space-before-function-paren
  const deleteSelectedCard = async (id: string) => {
    setIsLoading((prev) => ({ ...prev, confirmationModal: true }));
    const response = await deleteCardService(id);
    if (response) {
      setIsLoading((prev) => ({ ...prev, confirmationModal: false }));
      setIsConfirmationModal(false);
      showSuccessToast('Payment card deleted. Updating payment method list...');
      handleEffect();
    } else {
      setIsLoading((prev) => ({ ...prev, confirmationModal: false }));
      setIsConfirmationModal(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handleSelectDefaultPaymentCard = async (id: string, cardNumber: number, event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSelectedCard({ id, cardNumber });
    const response: AddedCardDetails = await selectCardService(id);
    if (response) {
      showSuccessToast('Default payment method updated');
    }
    await getCardDetails();
  };

  // eslint-disable-next-line space-before-function-paren
  const setPlanAutoRenewal = async () => {
    setIsLoading((prev) => ({ ...prev, autoRenewal: true }));
    const updateSubscriptionBody: UpdateSubscriptionBody = {
      autoRenewal: toggle ? false : true,
      subscriptionId: subscriptionDetails?.stripeSubscriptionId ?? '',
      userSubscriptionId: subscriptionDetails?.id ?? ''
    };
    const response: UpdateSubscriptionAutoRenewal = await setPlanAutoRenewalService(updateSubscriptionBody);
    if (Object.keys(response).length) {
      setToggle(response?.autoRenewSubscription);
      if (response?.autoRenewSubscription === false) {
        showSuccessToast('Plan auto renewal de-activated');
      } else if (response?.autoRenewSubscription === true) {
        showSuccessToast('Plan auto renewal activated');
      }
      setIsLoading((prev) => ({ ...prev, autoRenewal: false }));
    } else {
      showErrorToast('Failed to alter your current plan auto renewal setting');
      setToggle((prev) => !prev);
    }
  };

  const options = {
    clientSecret: clientSecret && clientSecret,
    // Fully customizable with appearance API.
    appearance: {
      //   theme: 'none',
      variables: {
        borderRadius: '5px'
        // outline: 'black'
      },
      //   hideIcon: true,

      rules: {
        // hideIcon: true
      }
    }
  };

  const handleCheckoutFormModal = () => {
    setAddCardForm((prev: boolean) => !prev);
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlanUpgrade = async () => {
    if (subscriptionDetails?.subscriptionPackage?.name?.toLocaleLowerCase().trim() === 'free trial' || !subscriptionDetails) {
      setIsLoading((prev) => ({ ...prev, upgrade: true }));
      const subscriptionId: string = subscriptionData?.filter(
        (data: SubscriptionPackages) => data?.viewName.toLocaleLowerCase().trim() !== 'free trial'
      )[0]?.id;
      const body: UpgradeData = {
        paymentMethod: addedCardDetails?.filter((item: AddedCardDetails) => item.isDefault)[0]?.stripePaymentMethodId,
        upgrade: true
      };
      const response: SubscriptionPackages = await chooseSubscription(subscriptionId, body);
      if (response?.status === 'paid') {
        navigate(`/${workspaceId}/settings`, { state: { selectedTab: 'billing_history' } });
        setIsLoading((prev) => ({ ...prev, upgrade: false }));
        window.location.reload();
        showSuccessToast('Plan upgraded to Comunify Plus!');
      } else {
        setIsLoading((prev) => ({ ...prev, upgrade: false }));
      }
    } else {
      showWarningToast('Comunify Plus is already activated');
    }
  };

  const handleEffect = () => {
    setCallEffect(true);
  };

  return (
    <div className="w-full flex flex-col justify-center mb-16 mt-14 items-center">
      <div className="w-3/4 mt-16 mb-32">
        <h3 className="text-neutralBlack font-bold font-Inter text-signIn leading-2.8 place-self-start mb-5">Subscription</h3>
        <div className="p-8 pb-40 flex flex-col font-Poppins h-full overflow-y-auto border-2 rounded-0.9 mb-13">
          {/* <div className="pt-10 pb-8 border-b border-greyDark">
            <div className="flex justify-between  items-center">
              <div className="flex flex-col">
                <h3 className=" text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Auto Renewal</h3>
                <p className="text-listGray font-normal  text-trial leading-1.31 mt-1 dark:text-greyDark">
                  Your auto renewal is {toggle ? 'active' : 'inactive'}
                </p>
              </div>
              <div className="flex gap-3 items-center">
                <div className="text-[#8692A6] text-trial font-medium leading-1.31  dark:text-white">No</div>
                <ToggleButton value={toggle} onChange={() => setPlanAutoRenewal()} isLoading={isLoading.autoRenewal} />
                <div className="text-trial font-medium leading-1.31  dark:text-white">Yes</div>
              </div>
            </div>
          </div> */}
          <div className="pt-[27px] pb-8 border-b border-greyDark">
            <div className="flex justify-between  items-center">
              <div className="flex flex-col">
                <h3 className=" text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Selected Plan</h3>
                <p className="text-listGray font-medium  text-trial leading-1.31 mt-1 dark:text-greyDark">
                  Plan Name :{' '}
                  <span className="text-download font-semibold  ">
                    {subscriptionDetails?.subscriptionPackage?.name ?? location?.state?.selectedPlan ?? 'No active plan'}
                  </span>{' '}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <h5 className="flex items-center">
                  <span className="price font-semibold text-renewalPrice leading-3.1">
                    {subscriptionDetails?.subscriptionPackage?.name.toLocaleLowerCase().trim() === 'free trial' ? '$0' : '$49'}
                  </span>
                  <span className="font-medium text-subscriptionMonth text-base leading-6 mt-[5px]">
                    {' '}
                    /{subscriptionDetails?.subscriptionPackage?.name.toLocaleLowerCase().trim() === 'free trial' ? '14 days' : 'month'}
                  </span>{' '}
                </h5>
              </div>
            </div>
          </div>

          <div className="pt-[27px] pb-6">
            <div className="flex justify-between  items-center">
              <div className="flex flex-col">
                <h3 className=" text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Payment Method</h3>
                <p className="text-listGray font-medium  text-trial leading-1.31 mt-1 dark:text-greyDark">
                  Primary Card :{' '}
                  <span className="text-download font-semibold  ">
                    XXXX XXXX XXXX{' '}
                    {addedCardDetails?.filter((data: AddedCardDetails) => data?.isDefault === true)[0]?.cardLastFourDigits ??
                      selectedCard?.cardNumber ??
                      'XXXX'}{' '}
                  </span>{' '}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <button className="font-medium text-error text-tag hover:text-download" onClick={() => setAddCardForm(true)}>
                  ADD CARD
                </button>
              </div>
            </div>
          </div>

          {addedCardDetails?.length ? (
            addedCardDetails?.map((data: AddedCardDetails) => (
              <div key={`${data?.id + Math.random()}`} className="pb-2">
                {data ? (
                  <div className="flex items-center">
                    <div className="flex items-center w-1/6 radio-btn">
                      <label>
                        <input
                          onChange={(e) => {
                            if (data?.id !== selectedCard?.id) {
                              handleSelectDefaultPaymentCard(data?.id, data?.cardLastFourDigits, e);
                            }
                          }}
                          type="radio"
                          name="radio-button"
                          value="css"
                          checked={selectedCard?.id === data?.id ? true : false}
                          // checked={(data?.isDefault && data?.isDefault) || selectedCard?.id === data?.id ? true : false}
                        />
                        <span>
                          {' '}
                          <img src={data?.brand === 'visa' ? VisaCardIcon : MasterCardIcon} alt="" className="w-[57.6px] h-[33.6px] ml-[19px]" />
                        </span>
                      </label>
                    </div>

                    <div className="flex items-center w-2/6 justify-between relative -left-8">
                      <span className="text-sm font-medium text-download capitalize">{data?.brand}</span>
                      <span className="text-sm font-medium text-download">XXXX-XXXX-XXXX-{data?.cardLastFourDigits}</span>
                    </div>
                    <div className="flex items-center justify-center w-2/6">
                      <span className="text-[15px] font-medium text-listGray">
                        Exp Date : {data?.expMonth < 10 ? `0${data?.expMonth}` : data?.expMonth}/{data?.expYear}
                      </span>
                    </div>

                    <div className="flex gap-4 items-center justify-end  w-1/6">
                      <button
                        type="submit"
                        onClick={() => handleDeleteCard(data?.id, data?.isDefault)}
                        className="flex items-center justify-center border border-[#EAEDF3] hover:border hover:border-red-400 h-[46px] w-[46px] rounded-[3px]"
                      >
                        <img src={deleteIcon} alt="" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Skeleton width={800} count={1} height={45} />
                )}
              </div>
            ))
          ) : (
            <div>
              <p className="text-listGray font-Poppins font-semibold mt-8 text-2xl leading-1.31 dark:text-greyDark">No payment cards added</p>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <div className="flex">
              <Button
                type="button"
                text="Back"
                className="mr-2.5 font-Poppins text-error font-medium border-cancel  leading-1.31 text-thinGray cursor-pointer w-[123px] h-2.81 rounded box-border"
                onClick={() => {
                  navigate(`/subscription/expired`);
                }}
              />
              <Button
                type="button"
                text="Upgrade"
                disabled={isLoading.upgrade}
                onClick={handlePlanUpgrade}
                className={`submit border-none text-white font-Poppins text-error font-medium leading-1.31 ${
                  isLoading.upgrade ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }  w-[123px] h-2.81 rounded shadow-contactBtn btn-save-modal`}
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col">
              <Modal
                isOpen={addCardForm}
                shouldCloseOnOverlayClick={false}
                onRequestClose={() => setAddCardForm(false)}
                className="w-24.31 pb-12 mx-auto rounded-lg border-fetching-card bg-white shadow-modal"
                style={{
                  overlay: {
                    display: 'flex',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    alignItems: 'center'
                  }
                }}
              >
                <div className="flex flex-col p-4">
                  <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Payment Information</h3>
                  {stripePromise && options.clientSecret && (
                    <Elements stripe={stripePromise} options={options}>
                      <CheckoutForm handleCheckoutFormModal={handleCheckoutFormModal} redirectCondition="" handleEffect={handleEffect} />
                    </Elements>
                  )}
                </div>
              </Modal>
            </div>
            <div>
              <Modal
                isOpen={isConfirmationModal}
                shouldCloseOnOverlayClick={false}
                onRequestClose={() => setIsConfirmationModal(false)}
                className="w-24.31 h-18.43 mx-auto rounded-lg modals-tag bg-white shadow-modal flex items-center justify-center"
                style={{
                  overlay: {
                    display: 'flex',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    alignItems: 'center'
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center ">
                  <div className="mt-5 leading-6 text-black font-Inter font-semibold text-xl w-2/3 text-center">
                    Are you sure want to delete the selected card?
                  </div>
                  <div className="flex mt-1.8">
                    <Button
                      type="button"
                      text="NO"
                      className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
                      onClick={() => setIsConfirmationModal(false)}
                    />
                    <Button
                      type="button"
                      text="YES"
                      onClick={() => deleteSelectedCard(selectedCardId)}
                      disabled={isLoading.confirmationModal}
                      className={`border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border ${
                        isLoading.confirmationModal ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal`}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredActivate;
