import React, { useEffect } from "react";
import SubscriptionCard from "common/subscriptionCard/SubscriptionCard";
import { AppDispatch } from "../../../../store";
import { SubscriptionPackages } from "../../interface/authentication.interface";
import { useDispatch } from "react-redux";
import authSlice from "../../store/slices/auth.slice";
import { useAppSelector } from '@/hooks/useRedux';

const SubscriptionExpired:React.FC = () => {

const dispatch: AppDispatch = useDispatch();

const subscriptionData = useAppSelector((state) => state.auth.subscriptionData);

const comunifySubscriptionPlan:SubscriptionPackages[] = subscriptionData.length > 0 && subscriptionData.filter((plans:SubscriptionPackages)=> plans.planName.trim() !== 'Free Trial') || [];

useEffect(() => {
  dispatch(authSlice.actions.getSubscriptions())
},[])

  return (
    <div className="w-full flex flex-col items-center justify-center mt-7.59">
      <h3 className="text-neutralBlack font-bold font-Inter text-signIn leading-2.8">Subscription Expired!</h3>
      <p className="mt-2.5 text-lightGray font-Inter font-normal leading-1.43 text-desc">Choose a plan to continue.</p>
      <div className="subscriptionCard">
        {comunifySubscriptionPlan?.map((data:SubscriptionPackages) => data?.name !== 'Free Trial' && (
             <SubscriptionCard  key={data.id} subscriptionData={data}/>
        ) )}
      </div>
      <div className="py-1.9"></div>
    </div>
  );
};

export default SubscriptionExpired;


