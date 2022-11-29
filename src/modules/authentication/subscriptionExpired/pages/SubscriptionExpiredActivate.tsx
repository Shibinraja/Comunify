import React, { Dispatch, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../../../hooks/useRedux';

import { useDispatch } from 'react-redux';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import { AnyAction } from 'redux';
import { State } from '../../../../store';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';

import Button from 'common/button';
import Input from '../../../../common/input';
import authSlice from '../../store/slices/auth.slice';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import { getLocalWorkspaceId, setRefreshToken } from '../../../../lib/helper';
import { AddedCardDetails, BillingDetails, ClientSecret, SubscriptionDetails, UpgradeData } from '../../../settings/interface/settings.interface';
import {
  createCardService,
  deleteCardService,
  getCardDetailsService,
  getChoseSubscriptionPlanDetailsService,
  selectCardService
} from '../../../settings/services/settings.services';
import { SubscriptionPackages } from '../../interface/auth.interface';
import { chooseSubscription } from '../../services/auth.service';

import { alphabets_only_regex_with_single_space, email_regex, whiteSpace_single_regex } from 'constants/constants';
import { stripePublishableKey } from '@/lib/config';
import deleteIcon from '../../../../assets/images/delete.svg';
import MasterCardIcon from '../../../../assets/images/masterCard.svg';
import VisaCardIcon from '../../../../assets/images/visa.svg';
import ToggleButton from 'common/ToggleButton/ToggleButton';

const CheckoutForm = React.lazy(() => import('../../../settings/pages/subscription/CheckoutForm'));

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
  const [searchParams] = useSearchParams();
  const paymentStatus: string | null = searchParams.get('paymentStatus');
  const workspaceId: string = getLocalWorkspaceId();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [addedCardDetails, setAddedCardDetails] = useState<AddedCardDetails[]>([]);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | undefined>(undefined);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [toggle, setToggle] = useState<boolean>(true);
  const [isConfirmationModal, setIsConfirmationModal] = useState<{ deleteCard: boolean; upgradePlan: boolean }>({
    deleteCard: false,
    upgradePlan: false
  });
  const [callEffect, setCallEffect] = useState<boolean>(false);
  const [isBillingDetailsModal, setIsBillingDetailsModal] = useState<{ billingDetails: boolean; cardDetails: boolean }>({
    billingDetails: false,
    cardDetails: false
  });
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({ billingName: '', billingEmail: '' });
  const stripePromise: Promise<Stripe | null> = loadStripe(stripePublishableKey);
  const subscriptionPlanDetails: SubscriptionPackages[] = useAppSelector((state: State) => state.auth.subscriptionData);

  const comunifyPlusPlanDetails = subscriptionPlanDetails?.filter(
    (data: SubscriptionPackages) => data?.name?.toLocaleLowerCase().trim() === 'comunify plus'
  )[0];

  const previousToggleValue: React.MutableRefObject<boolean> = useRef(toggle);

  useEffect(() => {
    getSecretKeyForStripe();
    getCurrentSubscriptionPlanDetails();
    getCardDetails();
    dispatch(authSlice.actions.getSubscriptions());
  }, []);

  useEffect(() => {
    if (callEffect === true) {
      getCardDetails();
      setTimeout(() => {
        showSuccessToast('Payment method list updated');
      }, 1000);
      setCallEffect(false);
    }
  }, [callEffect]);

  useEffect(() => {
    if (paymentStatus) {
      showWarningToast('Card payment has failed. Please retry or add another payment card to complete payment');
    }
  }, [paymentStatus]);

  // Handling toasts for activate/de-activate auto-renewal
  useMemo(() => {
    if (previousToggleValue.current !== toggle) {
      if (toggle) {
        showSuccessToast('Plan auto renewal activated');
        previousToggleValue.current = toggle;
      } else {
        showSuccessToast('Plan auto renewal de-activated');
        previousToggleValue.current = toggle;
      }
    }
  }, [toggle]);

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
    if (isDefault) {
      showWarningToast('Cannot delete a default payment method');
    } else {
      setIsConfirmationModal((prev) => ({ ...prev, deleteCard: true }));
      setSelectedCardId(id);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const getCurrentSubscriptionPlanDetails = async () => {
    const response: SubscriptionDetails = await getChoseSubscriptionPlanDetailsService();
    if (response?.stripeSubscriptionId) {
      previousToggleValue.current = response?.autoRenewal;
      setToggle(response?.autoRenewal);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const deleteSelectedCard = async (id: string) => {
    setIsLoading((prev) => ({ ...prev, confirmationModal: true }));
    const response = await deleteCardService(id);
    if (response) {
      setIsLoading((prev) => ({ ...prev, confirmationModal: false }));
      setIsConfirmationModal((prev) => ({ ...prev, deleteCard: false }));
      showSuccessToast('Payment card Removed');
      getCardDetails();
    } else {
      setIsLoading((prev) => ({ ...prev, confirmationModal: false }));
      setIsConfirmationModal((prev) => ({ ...prev, deleteCard: false }));
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
    setIsBillingDetailsModal((prev) => ({ ...prev, cardDetails: false }));
  };

  // eslint-disable-next-line space-before-function-paren
  const upgradeFromExistingPlan = async () => {
    setIsLoading((prev) => ({ ...prev, upgrade: true }));
    const subscriptionId: string = subscriptionPlanDetails?.filter(
      (data: SubscriptionPackages) => data?.viewName.toLocaleLowerCase().trim() !== 'free trial'
    )[0]?.id;
    const body: UpgradeData = {
      paymentMethod: addedCardDetails?.filter((item: AddedCardDetails) => item.isDefault)[0]?.stripePaymentMethodId,
      upgrade: true,
      autoRenewal: toggle
    };
    const response: SubscriptionPackages = await chooseSubscription(subscriptionId, body);
    if (response?.status?.toLocaleLowerCase().trim() === 'paid') {
      showSuccessToast('Plan upgraded to Comunify Plus!');
      navigate(`/${workspaceId}/settings`, { state: { selectedTab: 'billing_history', loadingToastCondition: 'showLoadingToast' } });
      setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: false }));
      setIsLoading((prev) => ({ ...prev, upgrade: false }));
      setRefreshToken();
    } else {
      showErrorToast('Subscription failed');
      setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: false }));
      setIsLoading((prev) => ({ ...prev, upgrade: false }));
    }
  };

  const handleBillingDetailsSubmit = (values: BillingDetails) => {
    setBillingDetails(values);
    showSuccessToast('Saved billing name and email');
    setIsBillingDetailsModal({ billingDetails: false, cardDetails: true });
  };

  const handleCardDetailForms = () => {
    if (!addedCardDetails?.length) {
      setIsBillingDetailsModal((prev) => ({ ...prev, billingDetails: true }));
    } else {
      getSecretKeyForStripe();
      setIsBillingDetailsModal((prev) => ({ ...prev, cardDetails: true }));
    }
  };

  const handleEffect = () => {
    setCallEffect(true);
  };

  const billingDetailsInitialValues = {
    billingName: '',
    billingEmail: ''
  };

  const passNewlyAddedCardDetailsToChild = (newlyAddedCardData: AddedCardDetails) => {
    setAddedCardDetails([...addedCardDetails, newlyAddedCardData]);
  };

  return (
    <div className="w-full flex flex-col justify-center mb-16 mt-14 items-center">
      <div className="w-3/4 mt-16 mb-32">
        <h3 className="text-neutralBlack font-bold font-Inter text-signIn leading-2.8 place-self-start mb-5">
          {paymentStatus ? 'Payment Failed' : 'Subscription'}
        </h3>
        <div className="p-8 pb-40 flex flex-col font-Poppins h-full overflow-y-auto border-2 rounded-0.9 mb-13">
          <div className="pt-[27px] pb-8 border-b border-greyDark">
            <div className="flex justify-between  items-center">
              <div className="flex flex-col">
                <h3 className=" text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Selected Plan</h3>
                <p className="text-listGray font-medium  text-trial leading-1.31 mt-1 dark:text-greyDark">
                  Plan Name : <span className="text-download font-semibold  ">{location?.state?.selectedPlan ?? 'No Active Plan'}</span>{' '}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <h5 className="flex items-center">
                  <span className="price font-semibold text-renewalPrice leading-3.1">${comunifyPlusPlanDetails?.amount}</span>
                  <span className="font-medium text-subscriptionMonth text-base leading-6 mt-[5px]"> /{'month'}</span>{' '}
                </h5>
              </div>
            </div>
          </div>

          {!!addedCardDetails?.length && (
            <div className="pt-10 pb-8 border-b border-greyDark">
              <div className="flex justify-between  items-center">
                <div className="flex flex-col">
                  <h3 className=" text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Auto Renewal</h3>
                  <p className="text-listGray font-normal  text-trial leading-1.31 mt-1 dark:text-greyDark">
                    Your auto renewal is {toggle ? 'active' : 'inactive'}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="text-[#8692A6] text-trial font-medium leading-1.31  dark:text-white">No</div>
                  <ToggleButton value={toggle} onChange={() => setToggle((prev) => !prev)} isLoading={isLoading.autoRenewal} />
                  <div className="text-trial font-medium leading-1.31  dark:text-white">Yes</div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-[27px] pb-6">
            <div className="flex justify-between  items-center">
              <div className="flex flex-col">
                <h3 className=" text-base text-renewalBlack leading-1.31 font-semibold dark:text-white">Payment Method</h3>
                <p className="text-listGray font-medium  text-trial leading-1.31 mt-1 dark:text-greyDark">
                  Primary Card :{' '}
                  <span className="text-download font-semibold  ">
                    XXXX XXXX XXXX{' '}
                    {selectedCard?.cardNumber ??
                      addedCardDetails?.filter((data: AddedCardDetails) => data?.isDefault === true)[0]?.cardLastFourDigits ??
                      'XXXX'}
                  </span>{' '}
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <button className="font-medium text-error text-tag hover:text-download" onClick={handleCardDetailForms}>
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
                      <Button
                        type="submit"
                        onClick={() => handleDeleteCard(data?.id, data?.isDefault)}
                        disabled={addedCardDetails?.length === 1 ? true : false}
                        className={`flex items-center ${
                          addedCardDetails?.length === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
                        } justify-center border border-[#EAEDF3] hover:border hover:border-red-400 h-[46px] w-[46px] rounded-[3px]`}
                        text={''}
                      >
                        <img src={deleteIcon} alt="" />
                      </Button>
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
                text="Upgrade Plan"
                disabled={isLoading.upgrade || !addedCardDetails?.length ? true : false}
                onClick={() => setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: true }))}
                className={`submit border-none text-white font-Poppins text-error font-medium leading-1.31 ${
                  isLoading.upgrade || !addedCardDetails?.length ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }  w-[123px] h-2.81 rounded shadow-contactBtn btn-save-modal`}
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col">
              <Modal
                isOpen={isBillingDetailsModal.cardDetails}
                shouldCloseOnOverlayClick={false}
                onRequestClose={() => setIsBillingDetailsModal((prev) => ({ ...prev, cardDetails: false }))}
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
                      <CheckoutForm
                        handleCheckoutFormModal={handleCheckoutFormModal}
                        redirectCondition=""
                        handleEffect={handleEffect}
                        billingDetails={billingDetails}
                        passNewlyAddedCardDetailsToChild={passNewlyAddedCardDetailsToChild}
                      />
                    </Elements>
                  )}
                </div>
              </Modal>
            </div>
            <div>
              <Modal
                isOpen={isConfirmationModal.deleteCard}
                shouldCloseOnOverlayClick={false}
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
                      onClick={() => setIsConfirmationModal((prev) => ({ ...prev, deleteCard: false }))}
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
              <Modal
                isOpen={isConfirmationModal.upgradePlan}
                shouldCloseOnOverlayClick={false}
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
                    Are you sure you want to proceed with the upgrade?
                  </div>
                  <div className="flex mt-1.8">
                    <Button
                      type="button"
                      text="NO"
                      className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
                      onClick={() => setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: false }))}
                    />
                    <Button
                      type="button"
                      text="YES"
                      onClick={upgradeFromExistingPlan}
                      disabled={isLoading.upgrade}
                      className={`border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border ${
                        isLoading.upgrade ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      } rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal`}
                    />
                  </div>
                </div>
              </Modal>
            </div>

            <div>
              <div className="flex flex-col ">
                <Modal
                  isOpen={isBillingDetailsModal.billingDetails}
                  shouldCloseOnOverlayClick={false}
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
                  <div className="flex flex-col">
                    <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Upgrade</h3>
                    <Formik
                      initialValues={billingDetailsInitialValues}
                      onSubmit={handleBillingDetailsSubmit}
                      validateOnChange={true}
                      validationSchema={billingDetailsScheme}
                    >
                      {({ errors, handleBlur, handleChange, handleSubmit, touched, values }): JSX.Element => (
                        <Form
                          className="flex flex-col relative  px-1.93 mt-9"
                          onSubmit={handleSubmit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        >
                          <label htmlFor="name " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                            Billing Name
                          </label>
                          <Input
                            type="text"
                            name="billingName"
                            id="billingNameId"
                            value={values.billingName}
                            className="mt-0.375 inputs app-result-card-border box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                            placeholder="Enter Name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={Boolean(touched.billingName && errors.billingName)}
                            helperText={touched.billingName && errors.billingName}
                          />
                          <label htmlFor="description" className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack mt-1.06">
                            Billing Email
                          </label>
                          <Input
                            name="billingEmail"
                            id="billingEmailId"
                            value={values.billingEmail}
                            className="mt-0.375 inputs app-result-card-border box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                            placeholder="example@email.com"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errors={Boolean(touched.billingEmail && errors.billingEmail)}
                            helperText={touched.billingEmail && errors.billingEmail}
                          />
                          <div className="flex items-center justify-end mt-1.8">
                            <Button
                              text="Cancel"
                              type="submit"
                              className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                              onClick={() => setIsBillingDetailsModal((prev) => ({ ...prev, billingDetails: false }))}
                            />
                            <Button
                              text="Save"
                              type="submit"
                              className={`text-white font-Poppins text-error font-medium leading-5 btn-save-modal rounded shadow-contactBtn w-5.25 cursor-pointer border-none h-2.81`}
                            />
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const billingDetailsScheme = Yup.object().shape({
  billingName: Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(4, 'Billing Name must be at least 4 characters')
    .max(25, 'Billing Name should not exceed above 25 characters')
    .matches(alphabets_only_regex_with_single_space, 'Numbers and special characters are not allowed')
    .matches(whiteSpace_single_regex, 'White spaces are not allowed')
    .required('Billing Name is a required field')
    .nullable(true),
  billingEmail: Yup.string()
    .email('Must be a valid email')
    .matches(email_regex, 'Must be a valid email')
    .max(100)
    .required('Billing Email is required')
});

export default SubscriptionExpiredActivate;
