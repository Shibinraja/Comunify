
import unsplashIcon from '../../../../assets/images/unsplash.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import nextIcon from '../../../../assets/images/next.svg';
import bgIntegrationImage from '../../../../assets/images/bg-sign.svg';

import './Integration.css';
import Button from 'common/button';

const Integration = () => {
  return (
    <div className="w-full flex flex-col  h-screen ">
    <div className="flex w-full relative">
      <div className="w-full md:w-1/2 signup-cover-bg bg-no-repeat pt-20 bg-left rounded-lg  bg-thinBlue flex items-center justify-center fixed pb-80">
        <img src={bgIntegrationImage} alt="" />
      </div>
      <div className="w-full md:w-1/2  mt-16 flex flex-col lg:pl-7.53  overflow-y-auto no-scroll-bar absolute right-0 pb-20">
        <div>
          <h3 className="font-Inter text-signIn font-bold text-neutralBlack leading-2.8">
            Integrations
          </h3>
        </div>
        <div className="flex flex-col gap-0.93 mt-1.87 relative">
          <div className="flex gap-0.93">
            <div className="integration shadow-integrationCardShadow border-integrationBorder w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={unsplashIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={slackIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={unsplashIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
          </div>
          <div className="flex gap-0.93">
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={unsplashIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={slackIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={unsplashIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect"  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
          </div>
          <div className="flex gap-0.93">
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={unsplashIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={slackIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
            <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={unsplashIcon} alt="" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                Khoros
              </div>
              <Button type="button" text="connect" className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient">
                CONNECT
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute left-[500px] bottom-5">
          <div className="flex items-center pb-5">
            <div className="p-2 leading-1.56 text-skipGray font-Inter font-normal text-reset cursor-pointer">
              Skip
            </div>
            <div>
              <img src={nextIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="py-1.9"></div>
  </div>
  );
};

export default Integration;
