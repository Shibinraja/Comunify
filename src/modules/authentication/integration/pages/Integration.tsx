import unsplashIcon from "../../../../assets/images/unsplash.svg";
import slackIcon from "../../../../assets/images/slack.svg";
import nextIcon from "../../../../assets/images/next.svg";
import bgIntegrationImage from "../../../../assets/images/bg-sign.svg";

import "./Integration.css";
import Button from "common/button";
import Modal from "react-modal";
import { useState } from "react";
import { useNavigate } from 'react-router';
Modal.setAppElement("#root");

const Integration: React.FC = () => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col pb-10 integration-wrapper">
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
          <div className="flex flex-col gap-0.93 mt-1.87 relative w-fit">
            <div className="flex gap-0.93">
              <div className="integration shadow-integrationCardShadow border-integrationBorder w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={unsplashIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={slackIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={unsplashIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
            </div>
            <div className="flex gap-0.93">
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={unsplashIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={slackIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={unsplashIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
            </div>
            <div className="flex gap-0.93">
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={unsplashIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={slackIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <div className="integration shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={unsplashIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                  Khoros
                </div>
                <Button
                  type="button"
                  text="CONNECT"
                  className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                />
              </div>
              <Modal
                isOpen={isModalOpen}
                shouldCloseOnOverlayClick={true}
                onRequestClose={() => setisModalOpen(false)}
                className="right-[400px] top-72 absolute  mt-24 rounded-lg modals-tag bg-white shadow-modal"
              >
                <div className="flex flex-col items-center justify-center  h-14.56 w-22.31 shadow-modal rounded-lg border-fetching-card">
                  <div className=" bg-no-repeat bg-center bg-contain ">
                    <img src={slackIcon} alt="" className="rounded-full w-2.68 h-2.68" />
                  </div>
                  <div className="mt-4 text-integray font-Poppins fomt-normal text-desc leadind-1.68">
                    Fetching data from <span className="text-black font-normal">Slack</span> 
                  </div>
                  <div className="mt-1.8">
                    <div className="dot-pulse">
                      <div className="dot-pulse__dot"></div>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          <div className="flex justify-end">
            <div className="flex items-center pb-5" onClick={()=> navigate('/dashboard')}>
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
      </div>
      <div className="py-1.9"></div>
    </div>
  );
};

export default Integration;
