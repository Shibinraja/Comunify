import SubscriptionCard from 'common/subscriptionCard/SubscriptionCard';
import bgWelcomeImage from '../../../../assets/images/bg-sign.svg';
import './Welcome.css';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const navigateToCreateWorkspace = () => {
    navigate("/create-workspace");
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
              <SubscriptionCard />
            </div>
          </div>
          <div className="mt-5">
          <button
              className="free-trial-btn font-Inter text-desc w-25.9 font-normal leading-1.8 text-lightBlue box-border rounded-lg bg-white py-2.5 px-4 shadow-trialButtonShadow "
              onClick={navigateToCreateWorkspace}
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
