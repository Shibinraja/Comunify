import React, { useEffect } from 'react';
import cookie from 'react-cookies';
import SubscriptionCard from 'common/subscriptionCard/SubscriptionCard';
import bgWelcomeImage from '../../../../assets/images/bg-sign.svg';
import './Welcome.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { DecodeToken, SubscriptionPackages } from '../../interface/auth.interface';
import authSlice from '../../store/slices/auth.slice';
import { useAppSelector } from '@/hooks/useRedux';
import { setRefreshToken } from '../../../../lib/helper';
import { decodeToken } from '@/lib/decodeToken';
import { NavigateFunction, useNavigate } from 'react-router';

const Welcome: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate: NavigateFunction = useNavigate();
  const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);

  useEffect(() => {
    setRefreshToken();
    dispatch(authSlice.actions.getSubscriptions());
  }, []);

  useEffect(() => {
    if (decodedToken?.isPaymentSuccess) {
      navigate('/create-workspace');
    }
  }, []);

  const subscriptionData = useAppSelector((state) => state.auth.subscriptionData);

  const comunifySubscriptionPlan: SubscriptionPackages[] =
    (subscriptionData.length > 0 && subscriptionData.filter((plans: SubscriptionPackages) => plans.viewName.trim() !== 'Free Trial')) || [];

  // Function to filter out free trial plan from the list of comunify plans and subscribe to it.
  const selectFreeTrialPlan = (): void => {
    const freeTrialSubscriptionPlan: SubscriptionPackages[] =
      (subscriptionData.length > 0 && subscriptionData.filter((plans: SubscriptionPackages) => plans.viewName.trim() === 'Free Trial')) || [];
    dispatch(authSlice.actions.chooseSubscription(freeTrialSubscriptionPlan[0]?.id));
  };

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">
        <div className="w-3/5 2xl:w-1/2 auth-layout-section flex items-center justify-center 3xl:justify-end pr-0   3xl:pr-16 py-10">
          <div className="flex items-center justify-center">
            <img src={bgWelcomeImage} alt="" className="w-9/12 xl:w-[621px] 3xl:w-full object-cover" />
          </div>
        </div>

        <div className="flex justify-center w-1/2 xl:items-center 3xl:justify-start  pl-0 3xl:pl-16 pb-16">
          <div className="flex flex-col pt-16 pb-6 ">
            <div className="w-25.9">
              <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">Welcome to Comunify!</h1>{' '}
              <p className="mt-0.81 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
                Thank you for choosing comunify. Let’s get to know your communities better.
              </p>
              <div className="subscriptionCard  mx-auto  w-25.9 h-[417px]">
                {comunifySubscriptionPlan?.map((data: SubscriptionPackages) => (
                  <SubscriptionCard key={data.id} subscriptionData={data} />
                ))}
              </div>
            </div>
            <div className="mt-5">
              <button
                className="free-trial-btn font-Inter text-desc w-[415px] h-3.6 font-normal leading-1.8 text-lightBlue box-border rounded-lg bg-white py-2.5 px-4 shadow-trialButtonShadow "
                onClick={selectFreeTrialPlan}
              >
                Continue with 14 Days Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
