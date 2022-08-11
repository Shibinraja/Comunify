/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import unsplashIcon from '../../../../assets/images/unsplash.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import nextIcon from '../../../../assets/images/next.svg';
import bgIntegrationImage from '../../../../assets/images/bg-sign.svg';
import './Integration.css';
import Button from 'common/button';
import Modal from 'react-modal';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { request } from '../../../../lib/request';
import { showErrorToast } from '../../../../common/toast/toastFunctions';
import { API_ENDPOINT } from '../../../../lib/config';
import { getLocalWorkspaceId } from '@/lib/helper';

Modal.setAppElement('#root');

const Integration: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const workspaceId = getLocalWorkspaceId();

  //   const handleModalopen = () => {
  //     setIsModalOpen(true);
  //   };
  const [searchParams] = useSearchParams();

  interface Body {
    code: string | null;
    workspaceId: string;
  }

  useEffect(() => {
    if (searchParams.get('code')) {
      const codeParams: null | string = searchParams.get('code');
      if (codeParams !== '') {
        getData(codeParams);
      }
    }
  }, []);

  // eslint-disable-next-line space-before-function-paren
  const getData = async (codeParams: string | null) => {
    try {
      setIsModalOpen(true);
      const body: Body = {
        code: codeParams,
        workspaceId
      };
      const response = await request.post(`${API_ENDPOINT}/v1/slack/connect`, body);
      if (response) {
        setIsModalOpen(false);
        navigate('/settings/complete-setup', { state: { workspacePlatformSettingId: response?.data?.data?.id } });
      } else {
        showErrorToast('Integration failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToConnectPage = () => {
    window.location.href =
      'https://slack.com/oauth/v2/authorize?client_id=3699971256053.3748193065905&scope=channels:history,channels:read,incoming-webhook,links:read,reactions:read,users:read,users:read.email,team:read&user_scope=channels:history,channels:read,reactions:read,users:read,users:read.email,team:read';
  };

  return (
    <div className="create-password">
      <div className="flex w-full height-calc">
        <div className="w-1/2 rounded-r-lg  bg-thinBlue flex items-center justify-center object-cover p-28 signup-cover-bg bg-no-repeat bg-left overflow-hidden">
          <img src={bgIntegrationImage} alt="" className="object-cover" />
        </div>
        <div className="flex flex-col w-1/2 pt-10 pl-7.53 overflow-scroll">
          <div>
            <h3 className="font-Inter text-signIn font-bold text-neutralBlack leading-2.8">Integrations</h3>
            <div className="flex flex-col gap-0.93 relative w-fit mt-1.8">
              <div className="flex gap-0.93">
                <div className="integration shadow-integrationCardShadow app-input-card-border border-integrationBorder w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={slackIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Slack</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                    onClick={navigateToConnectPage}
                  />
                </div>
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
              </div>
              <div className="flex gap-0.93">
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
              </div>
              <div className="flex gap-0.93">
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
                <div className="integration shadow-integrationCardShadow app-input-card-border w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={unsplashIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Khoros</div>
                  <Button
                    type="button"
                    text="CONNECT"
                    className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
                <Modal
                  isOpen={isModalOpen}
                  shouldCloseOnOverlayClick={true}
                  onRequestClose={() => setIsModalOpen(false)}
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
                <div className="flex items-center pb-5" onClick={() => navigate('/dashboard')}>
                  <div className="p-2 leading-1.56 text-skipGray font-Inter font-normal text-reset cursor-pointer">Skip</div>
                  <div>
                    <img src={nextIcon} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;
