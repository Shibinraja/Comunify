import React, { Fragment } from 'react';
import Button from 'common/button';
import successIcon from '../../assets/images/tick-white.svg';
import { SubscriptionProps } from 'interface/interface';
import { useDispatch } from 'react-redux';
import authSlice from '../../modules/authentication/store/slices/auth.slice';

const SubscriptionCard: React.FC<SubscriptionProps> = ({ subscriptionData }) => {
  const dispatch = useDispatch();

  const selectPlan = (): void => {
    dispatch(authSlice.actions.chooseSubscription(subscriptionData?.id));
  };

  return (
    <Fragment>
      <div key={subscriptionData?.id} className="mt-1.87  flex flex-col h-full">
        <div className="border-gradient-rounded px-8 py-5 bg-white rounded-0.9 h-full">
          <h5 className="flex items-center">
            <span className="price font-Poppins font-semibold text-renewalPrice leading-3.1">${subscriptionData?.amount}</span>
            <span className="font-Poppins font-medium text-subscriptionMonth text-base leading-6"> /month</span>{' '}
          </h5>
          <h6 className="pt-0.43 font-Poppins text-infoBlack text-base font-semibold leading-6">{subscriptionData?.name}</h6>
          <p className="pt-2.5 font-Poppins text-listGray font-normal text-card leading-0.93 max-w-sm">{subscriptionData?.description}</p>
          <div className="border mt-6 w-full"></div>
          <h6 className="pt-6 font-Poppins text-infoBlack text-base font-semibold leading-6">Features</h6>
          <div className="mt-2 ">
            {subscriptionData?.features?.map((featuresData: { value: string; comunifyFeature: { name: string } }, index: number) => (
              <div key={`featuresData_${index}`} className="flex items-center font-normal text-listGray text-error font-Poppins leading-1.56 pt-1">
                <div className='feature-box h-3 w-3 rounded-full flex justify-center items-center mr-2'>
                  <img src={successIcon} alt=""  />

                </div>
                {` ${featuresData.value === '1' ? 'Single': featuresData.value} ${featuresData.comunifyFeature.name}`}
              </div>
            ))}
          </div>
          <Button
            text="Choose the plan"
            onClick={selectPlan}
            type="submit"
            className="font-Poppins rounded-lg text-base font-semibold text-white hover:shadow-buttonShadowHover transition ease-in duration-300 w-full mt-1.8  h-3.6 btn-gradient "
          />
        </div>
      </div>
    </Fragment>
  );
};

export default SubscriptionCard;
