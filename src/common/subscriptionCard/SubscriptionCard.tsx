import Button from 'common/button';
import successIcon from '../../assets/images/tostr.png';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';
import { SubscriptionProps } from 'interface/interface';


const SubscriptionCard: React.FC<SubscriptionProps> = ({ subscriptionData }) => {
    const navigate = useNavigate();

    const navigateToWorkSpace = (): void => {
        navigate('/create-workspace');
    };

    return (
        <Fragment>
            <div key={subscriptionData?.id} className="mt-1.87  flex flex-col ">
                <div className="border-gradient-rounded px-8 py-5 bg-white rounded-0.9 ">
                    <h5 className="flex items-center">
                        <span className="price font-Poppins font-semibold text-renewalPrice leading-3.1">{subscriptionData?.cost}</span>
                        <span className="font-Poppins font-medium text-slimGray text-base leading-6"> /month</span>{' '}
                    </h5>
                    <h6 className="pt-0.43 font-Poppins text-infoBlack text-base font-semibold leading-6">{subscriptionData?.name}</h6>
                    <p className="pt-2.5 font-Poppins text-listGray font-normal text-card leading-0.93 max-w-sm">{subscriptionData?.description}</p>
                    <div className="border mt-5 w-full"></div>
                    <h6 className="pt-5 font-Poppins text-infoBlack text-base font-semibold leading-6">Features</h6>
                    <div className="mt-2 ">
                        {subscriptionData?.features?.map((featuresData: string, index: number) => (
                            <div
                                key={`featuresData_${index}`}
                                className="flex items-center font-normal text-listGray text-error font-Poppins leading-1.56"
                            >
                                <span>
                                    <img src={successIcon} alt="" className="w-[17px] pr-1" />
                                </span>
                                {featuresData}
                            </div>
                        ))}
                    </div>
                    <Button
                        text="Choose the plan"
                        onClick={navigateToWorkSpace}
                        type="submit"
                        className="font-Poppins rounded-lg text-base font-semibold text-white hover:shadow-buttonShadowHover transition ease-in duration-300 w-full mt-1.8  h-3.6 btn-gradient "
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default SubscriptionCard;
