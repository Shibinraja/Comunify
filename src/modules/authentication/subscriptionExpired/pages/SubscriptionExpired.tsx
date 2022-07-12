import React from "react";
import SubscriptionCard from "common/subscriptionCard/SubscriptionCard";

const SubscriptionExpired:React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-7.59">
      <h3 className="text-neutralBlack font-bold font-Inter text-signIn leading-2.8">Subscription Expired!</h3>
      <p className="mt-2.5 text-lightGray font-Inter font-normal leading-1.43 text-desc">Choose a plan to continue.</p>
      <div className="subscriptionCard">
        <SubscriptionCard />
      </div>
      <div className="py-1.9"></div>
    </div>
  );
};

export default SubscriptionExpired;
