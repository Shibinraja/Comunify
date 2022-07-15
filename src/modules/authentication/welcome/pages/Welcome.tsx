import React from 'react';
import SubscriptionCard from 'common/subscriptionCard/SubscriptionCard';
import bgWelcomeImage from '../../../../assets/images/bg-sign.svg';
import './Welcome.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { SubscriptionPackages } from '../../interface/authentication.interface';
import authSlice from '../../store/slices/auth.slice';
import { useAppSelector } from '@/hooks/useRedux';


const Welcome:React.FC = () => {

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(authSlice.actions.getSubscriptions());
  },[])

  const subscriptionData = useAppSelector((state) => state.auth.subscriptionData);

  const comunifySubscriptionPlan:SubscriptionPackages[] = subscriptionData.length > 0 && subscriptionData.filter((plans:SubscriptionPackages)=> plans.planName.trim() !== 'Free Trial') || [];


  // Function to filter out free trial plan from the list of comunify plans and subscribe to it.
  const selectFreeTrialPlan = ():void => {
  const freeTrialSubscriptionPlan:SubscriptionPackages[] = subscriptionData.length > 0 && subscriptionData.filter((plans:SubscriptionPackages)=> plans.planName.trim() === 'Free Trial') || [];
  dispatch(authSlice.actions.freeTrialSubscription(freeTrialSubscriptionPlan[0]?.id))

  };

  return (
    <div className="w-full flex flex-col welcome-wrapper">
      <div className="flex w-full relative">
        <div className="w-full md:w-1/2 signup-cover-bg  bg-no-repeat pt-20 bg-left rounded-lg  bg-thinBlue flex items-center justify-center fixed pb-80">
          <img src={bgWelcomeImage} alt="welcome-image" className="image-welcome"/>
        </div>
        <div className="w-full md:w-1/2 flex flex-col pl-7.40 mt-16  overflow-y-auto no-scroll-bar absolute right-0 ">
          <div className="w-25.9">
            <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">
              Welcome to Comunify!
            </h1>{" "}
            <p className="mt-0.81 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
              Thank you for choosing comunify. Let’s get to know your
              communities better.
            </p>
            <div className="subscriptionCard">
                {comunifySubscriptionPlan?.map((data:SubscriptionPackages) => (
                    <SubscriptionCard  key={data.id} subscriptionData={data}/>
                ))}
            </div>
          </div>
          <div className="mt-5">
          <button
              className="free-trial-btn font-Inter text-desc w-25.9 font-normal leading-1.8 text-lightBlue box-border rounded-lg bg-white py-2.5 px-4 shadow-trialButtonShadow "
              onClick={selectFreeTrialPlan}
            >
              Continue with 14 Days Free Trial
            </button>
          </div>
        </div>
      </div>
      <div className="py-1.9"></div>
      <div className="footer"></div>
    </div>
  );
};

export default Welcome;


