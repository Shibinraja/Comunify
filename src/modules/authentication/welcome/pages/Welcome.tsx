import Button from 'common/button';
import bgWelcomeImage from "../../../../assets/images/bg-sign.svg";
import successIcon from '../../../../assets/images/tostr.png';
import  './Welcome.css';

const Welcome = () => {
  return (
    <div className="w-full flex flex-col h-screen ">
      <div className="flex w-full relative">
        <div className="w-1/2 password-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed">
          <img src={bgWelcomeImage} alt="" />
        </div>
        <div className="w-1/2 flex pl-7.40 mt-7.59 flex-col min-h-[500px]  overflow-y-auto no-scroll-bar absolute right-0 top-7.59">
          <div className="w-25.9">
            <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">
              Welcome to Comunify!
            </h1>
            <p className="mt-0.81 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
              Thank you for choosing comunify. Let’s get to know your
              communities better.
            </p>
            <div className="mt-1.87  flex flex-col ">
              <div className="border-sub px-8 py-5 bg-white rounded-0.9">
                <h5 className="flex items-center">
                  <span className="price font-Poppins font-semibold text-price leading-3.1">$29</span>
                  <span className="font-Poppins font-medium text-subscriptionMonth text-base leading-6">/month</span>{" "}
                </h5>
                <h6 className="pt-0.43 font-Poppins text-infoBlack text-base font-semibold leading-6">Comunify Plus</h6>
                <p className="pt-2.5 font-Poppins text-listGray font-normal text-card leading-0.93 max-w-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Mauris ac nisi in turpis viverra convallis id sit amet eros.
                </p>
                <div className="border mt-5 w-full"></div>
                <h6 className="pt-5 font-Poppins text-infoBlack text-base font-semibold leading-6">Features</h6>
                <div className="mt-2">
                  <div className="flex items-center font-normal text-listGray text-error font-Poppins leading-1.56">
                    <span>
                      <img src={successIcon} alt="" className="w-[17px] pr-1" />
                    </span>
                    Single User
                  </div>
                  <div className="flex items-center font-normal text-listGray text-error font-Poppins leading-1.56">
                    <span>
                      <img src={successIcon} alt="" className="w-[17px] pr-1" />
                    </span>
                    5 Platforms
                  </div>
                  <div className="flex items-center font-normal text-listGray text-error font-Poppins leading-1.56">
                    <span>
                      <img src={successIcon} alt="" className="w-[17px] pr-1" />
                    </span>
                    Customizable Reports
                  </div>
                  <div className=" flex items-center font-normal text-listGray text-error font-Poppins leading-1.56">
                    <span>
                      <img src={successIcon} alt="" className="w-[17px] pr-1" />
                    </span>
                    Configurable Dashboard
                  </div>
                </div>
                <Button
                  text="Choose the plan"
                  type="submit"
                  className="font-Poppins rounded-lg text-base text-white hover:shadow-buttonShadowHover transition ease-in duration-300 w-full mt-1.8  h-3.6"
                />
              </div>
            </div>
          </div>
          <div className="mt-5 pb-48">
            <button className="free-trial-btn font-Inter text-desc w-25.9 font-normal leading-1.8 text-lightBlue box-border rounded-lg bg-white py-2.5 px-4 shadow-trialButtonShadow">
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
