import React, { Dispatch, useEffect, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/useRedux';
import { AnyAction } from 'redux';
import { State } from '../../../../store';

import Modal from 'react-modal';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Skeleton from 'react-loading-skeleton';

import Button from 'common/button';
import authSlice from '../../../authentication/store/slices/auth.slice';
import { createCardService, deleteCardService, getCardDetailsService, selectCardService } from '../../services/settings.services';
import { AddedCardDetails, ClientSecret, SubscriptionDetails, UpgradeData } from '../../interface/settings.interface';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import { SubscriptionPackages } from '../../../authentication/interface/auth.interface';
import { chooseSubscription } from '../../../authentication/services/auth.service';

import { getLocalWorkspaceId } from '../../../../lib/helper';
import MasterCardIcon from '../../../../assets/images/masterCard.svg';
import VisaCardIcon from '../../../../assets/images/visa.svg';
import deleteIcon from '../../../../assets/images/delete.svg';
import { stripePublishableKey } from '@/lib/config';

const CheckoutForm = React.lazy(() => import('../../pages/subscription/CheckoutForm'));

interface SelectedCard {
  id: string;
  cardNumber: number;
}

interface Props {
  subscriptionDetails?: SubscriptionDetails;
}

const AddCard: React.FC<Props> = ({ subscriptionDetails }) => {
  const [isLoading, setIsLoading] = useState<{ autoRenewal: boolean; upgrade: boolean; confirmationModal: boolean }>({
    autoRenewal: false,
    upgrade: false,
    confirmationModal: false
  });
  const dispatch: Dispatch<AnyAction> = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const workspaceId: string = getLocalWorkspaceId();
  const [addCardForm, setAddCardForm] = useState<boolean>(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [addedCardDetails, setAddedCardDetails] = useState<AddedCardDetails[]>([]);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | undefined>(undefined);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [isConfirmationModal, setIsConfirmationModal] = useState<{ deleteCard: boolean; upgradePlan: boolean }>({
    deleteCard: false,
    upgradePlan: false
  });
  const [callEffect, setCallEffect] = useState<boolean>(false);
  const stripePromise = loadStripe(stripePublishableKey);

  useEffect(() => {
    getSecretKeyForStripe();
  }, []);

  useEffect(() => {
    getCardDetails();
  }, []);

  useEffect(() => {
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
    if (isDefault) {
      showWarningToast('Cannot delete a default payment method');
    } else {
      setIsConfirmationModal((prev) => ({ ...prev, deleteCard: true }));
      setSelectedCardId(id);
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
    setAddCardForm(false);
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlanUpgrade = async () => {
    if (subscriptionDetails?.subscriptionPackage?.name?.toLocaleLowerCase().trim() === 'free trial' || subscriptionDetails === undefined) {
      setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: true }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const upgradeFromExistingPlan = async () => {
    setIsLoading((prev) => ({ ...prev, upgrade: true }));
    const subscriptionId: string = subscriptionData?.filter(
      (data: SubscriptionPackages) => data?.viewName.toLocaleLowerCase().trim() !== 'free trial'
    )[0]?.id;
    const body: UpgradeData = {
      paymentMethod: addedCardDetails?.filter((item: AddedCardDetails) => item.isDefault)[0]?.stripePaymentMethodId,
      upgrade: true
    };
    const response: SubscriptionPackages = await chooseSubscription(subscriptionId, body);
    if (response?.status?.toLocaleLowerCase().trim() === 'paid') {
      showSuccessToast('Plan upgraded to Comunify Plus!');
      navigate(`/${workspaceId}/settings`, { state: { selectedTab: 'billing_history', loadingToastCondition: 'showLoadingToast' } });
      setIsLoading((prev) => ({ ...prev, upgrade: false }));
      setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: false }));
    } else {
      showErrorToast('Subscription failed');
      setIsConfirmationModal((prev) => ({ ...prev, upgradePlan: false }));
      setIsLoading((prev) => ({ ...prev, upgrade: false }));
    }
  };

  const handleEffect = () => {
    setCallEffect(true);
  };

  const passNewlyAddedCardDetailsToChild = (newlyAddedCardData: AddedCardDetails) => {
    setAddedCardDetails([...addedCardDetails, newlyAddedCardData]);
  };

  return (
    <div className="flex flex-col  font-Poppins w-full h-full overflow-y-auto ">
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
            <button
              className="font-medium text-error text-tag hover:text-download"
              onClick={() => {
                getSecretKeyForStripe();
                setAddCardForm(true);
              }}
            >
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
                    className={`flex items-center ${addedCardDetails?.length === 1 ? 'cursor-not-allowed' : 'cursor-pointer'
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

      <div className="pt-10 pb-4 flex justify-end">

        <div className="flex">
          <Button
            type="button"
            text="Upgrade Plan"
            disabled={subscriptionDetails?.subscriptionPackage?.name.toLocaleLowerCase().trim() === 'comunify plus'}
            onClick={handlePlanUpgrade}
            className={`submit border-none text-white font-Poppins text-error font-medium leading-1.31 ${subscriptionDetails?.subscriptionPackage?.name.toLocaleLowerCase().trim() === 'comunify plus'
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
              } w-[123px] h-2.81 rounded shadow-contactBtn btn-save-modal`}
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
                  <CheckoutForm
                    handleCheckoutFormModal={handleCheckoutFormModal}
                    redirectCondition=""
                    handleEffect={handleEffect}
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
                Are you sure you want to delete the selected card?
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
                  className={`border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border ${isLoading.confirmationModal ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
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
                  className={`border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border ${isLoading.upgrade ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                    } rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal`}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
