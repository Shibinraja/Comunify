import React, { Fragment, useState } from 'react';
import Button from 'common/button';
import successIcon from '../../assets/images/tick-white.svg';
import { SubscriptionProps } from 'interface/interface';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';

const SubscriptionCard: React.FC<SubscriptionProps> = ({ subscriptionData }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line space-before-function-paren
  const selectPlan = async () => {
    if (location?.pathname?.includes('expired')) {
      setIsLoading(true);
      navigate(`/subscription/expired/activate-subscription`, { state: { selectedPlan: 'Comunify Plus' } });
      window.location.reload();
    } else {
      navigate('/subscription', { state: { subscriptionData } });
    }
  };

  return (
    <Fragment>
      <div key={subscriptionData?.id} className="mt-1.87  flex flex-col h-full">
        <div className="border-gradient-rounded pl-[22px] pr-[23px] pt-[20px] pb-[29px] bg-white rounded-0.9 h-full">
          <h5 className="flex items-center">
            <span className="price font-Poppins font-semibold text-renewalPrice leading-3.1">${subscriptionData?.amount}</span>
            <span className="font-Poppins font-medium text-subscriptionMonth text-base leading-6"> /month</span>{' '}
          </h5>
          <h6 className="pt-0.43 font-Poppins text-infoBlack text-base font-semibold leading-6">{subscriptionData?.name}</h6>
          <p className="pt-2.5 font-Poppins text-listGray font-normal text-xs leading-0.93 max-w-sm">{subscriptionData?.description}</p>
          <div className="border border-[#D9DBE9] mt-[21px] w-full"></div>
          <h6 className="pt-[19px] font-Poppins text-infoBlack text-base font-semibold leading-6">Features</h6>
          <div className="mt-2 ">
            {subscriptionData?.features?.map((featuresData: { value: string; comunifyFeature: { name: string } }, index: number) => (
              <div key={`featuresData_${index}`} className="flex items-center font-normal text-listGray text-error font-Poppins leading-1.56 pt-1">
                <div className="feature-box h-3 w-3 rounded-full flex justify-center items-center mr-2">
                  <img src={successIcon} alt="" />
                </div>
                {` ${featuresData.value === '1' ? 'Single' : featuresData.value} ${featuresData.comunifyFeature.name}`}
              </div>
            ))}
          </div>
          <Button
            text="Choose plan"
            onClick={selectPlan}
            disabled={isLoading}
            type="submit"
            className={`font-Poppins rounded-lg text-base ${
              isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            } font-semibold text-white hover:shadow-buttonShadowHover transition ease-in duration-300 w-full mt-[29px]  h-3.6 btn-gradient`}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default SubscriptionCard;
