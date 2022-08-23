/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import unsplashIcon from '../../../../assets/images/unsplash.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import nextIcon from '../../../../assets/images/next.svg';
import vanillaIcon from '../../../../assets/images/vanilla-forum.svg';
import bgIntegrationImage from '../../../../assets/images/bg-sign.svg';
import './Integration.css';
import Button from 'common/button';
import Modal from 'react-modal';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { request } from '../../../../lib/request';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { API_ENDPOINT, SLACK_CONNECT_ENDPOINT } from '../../../../lib/config';
import { getLocalWorkspaceId } from '@/lib/helper';
import Input from 'common/input';

Modal.setAppElement('#root');

interface Body {
  code: string | null;
  workspaceId: string;
}

interface VanillaForumsData {
  vanillaBaseUrl: string;
  vanillaAccessToken: string;
  workspaceId: string;
  workspacePlatformSettingsId?: string;
}

// interface VanillaConnectResponse {
//     id: string;
//     workspacePlatformSettingsId: string;
//     type: string;
//     domain: string;
//     channelId: string | null,
//     auth_token: string;
//     clientSecret: null,
//     clientId: null,
//     status: string;
//     createdAt: string;
//     updatedAt: string;
// }

const Integration: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const workspaceId = getLocalWorkspaceId();
  const [searchParams] = useSearchParams();
  const [isVanillaModalOpen, setVanillaModalOpen] = useState<boolean>(false);
  const handleVanillaModal = (val: boolean) => {
    setVanillaModalOpen(val);
  };
  const [vanillaForumsData, setVanillaForumsData] = useState<VanillaForumsData>({ vanillaAccessToken: '', vanillaBaseUrl: '', workspaceId: '' });

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
      localStorage.setItem('workspacePlatformSettingId', response?.data?.data?.id);
      if (response) {
        setIsModalOpen(false);
        navigate(`/${workspaceId}/settings/complete-setup`, { state: { workspacePlatformSettingId: response?.data?.data?.id } });
      } else {
        showErrorToast('Integration failed');
      }
      // eslint-disable-next-line no-empty
    } catch {}
  };

  // eslint-disable-next-line space-before-function-paren
  const sendVanillaData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.preventDefault();
      const body: VanillaForumsData = {
        vanillaBaseUrl: vanillaForumsData.vanillaBaseUrl,
        vanillaAccessToken: vanillaForumsData.vanillaAccessToken,
        workspaceId
      };
      const connectResponse = await request.post(`${API_ENDPOINT}/v1/vanilla/connect`, body);
      if (connectResponse?.data?.data?.id) {
        showSuccessToast('Integration in progress');
        try {
          const completeSetupResponse = await request.post(`${API_ENDPOINT}/v1/vanilla/complete-setup`, {
            workspaceId,
            workspacePlatformSettingsId: connectResponse?.data?.data?.id
          });
          if (completeSetupResponse) {
            showSuccessToast('Successfully integrated');
            setVanillaModalOpen((prevState) => !prevState);
            navigate(`/${workspaceId}/settings`);
          }
        } catch (error) {
          showErrorToast('Integration Failed');
        }
      }
    } catch (error) {
      showErrorToast('Integration Failed');
    }
  };

  const navigateToConnectPage = () => {
    window.location.href = SLACK_CONNECT_ENDPOINT;
  };

  return (
    <div className="create-password">
      <div className="auth-layout-integration">
        <div className="flex w-full height-calc container mx-auto">
          <div className="w-1/2 rounded-r-lg flex items-center justify-center object-cover p-28  bg-left overflow-hidden">
            <img src={bgIntegrationImage} alt="" className="object-cover" />
          </div>
          <div className="flex justify-center w-1/2 3xl:items-center">
            <div className="flex flex-col pt-10 overflow-scroll">
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
                        <img src={vanillaIcon} alt="" className="h-2.31" />
                      </div>
                      <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Vanilla Forums</div>
                      <Button
                        type="button"
                        text="CONNECT"
                        className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                        onClick={() => handleVanillaModal(true)}
                      />
                      <Modal
                        isOpen={isVanillaModalOpen}
                        shouldCloseOnOverlayClick={false}
                        onRequestClose={() => handleVanillaModal(false)}
                        className="w-24.31 pb-12 mx-auto rounded-lg border-integration-modal bg-white shadow-modal outline-none"
                        style={{
                          overlay: {
                            display: 'flex',
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            alignItems: 'center'
                          }
                        }}
                      >
                        <div className="vanilla">
                          <h3 className="flex items-center justify-center pt-9 font-Inter text-xl font-semibold leading-6">
                            <img src={vanillaIcon} alt="" className="px-2.5" />
                            integrate <span className="font-normal px-2">Vanilla Forums</span>
                          </h3>
                          <div className="flex flex-col px-[1.875rem] pt-9">
                            <form>
                              <div className="form-group">
                                <label htmlFor="siteUrl" className="font-Poppins font-normal text-infoBlack text-sm leading-5">
                                  Site URL*
                                </label>
                                <h1 className="font-Inter font-normal text-error leading-7 text-vanillaDescription">
                                  Enter the full URL to your Vanilla site.
                                  <span className="text-tag cursor-pointer hover:underline"> Learn more.</span>
                                </h1>
                                <Input
                                  type="text"
                                  placeholder="Enter URL"
                                  label="Site URL"
                                  id="siteUrlId"
                                  name="SiteUrl"
                                  value={vanillaForumsData?.vanillaBaseUrl}
                                  onChange={(e) => setVanillaForumsData((prevState) => ({ ...prevState, vanillaBaseUrl: e.target.value }))}
                                  className="h-2.81 pr-3.12 rounded-md border-app-result-card-border mt-[0.4375rem] bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-thinGray placeholder:text-sm placeholder:leading-6 placeholder:font-Poppins font-Poppins box-border"
                                />
                              </div>
                              <div className="form-group pt-1.12">
                                <label htmlFor="accessToken" className="font-Poppins font-normal text-infoBlack text-sm leading-5">
                                  Access Token*
                                </label>
                                <h1 className="font-Inter font-normal text-error leading-7 text-vanillaDescription">
                                  You can learn how to create an access Token<span className="text-tag cursor-pointer hover:underline"> here.</span>
                                </h1>
                                <Input
                                  type="text"
                                  placeholder="Enter access token"
                                  label="Access Token"
                                  id="accessTokenId"
                                  name="accessToken"
                                  value={vanillaForumsData?.vanillaAccessToken}
                                  onChange={(e) => setVanillaForumsData((prevState) => ({ ...prevState, vanillaAccessToken: e.target.value }))}
                                  className="h-2.81 pr-3.12 rounded-md border-app-result-card-border mt-[0.4375rem] bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-thinGray placeholder:text-sm placeholder:leading-6 placeholder:font-Poppins font-Poppins box-border"
                                />
                              </div>
                              <div className="flex justify-end pt-[1.875rem]">
                                <Button
                                  text="Cancel"
                                  className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                                  onClick={() => handleVanillaModal(false)}
                                />
                                <Button
                                  text="Save"
                                  onClick={(e) => sendVanillaData(e)}
                                  className="text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded shadow-contactBtn w-5.25 border-none h-2.81"
                                />
                              </div>
                            </form>
                          </div>
                        </div>
                      </Modal>
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
                      className="right-[400px] top-72 absolute  mt-24 rounded-lg modals-tag bg-white shadow-modal outline-none"
                    >
                      <div className="flex flex-col items-center justify-center  h-14.56 w-22.31 shadow-modal rounded-lg border-fetching-card">
                        <div className=" bg-no-repeat bg-center bg-contain ">
                          <img src={slackIcon} alt="" className="rounded-full w-2.68 h-2.68" />
                        </div>
                        <div className="mt-4 text-integrationGray font-Poppins fomt-normal text-desc leadind-1.68">
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
                    <div className="flex items-center pb-5" onClick={() => navigate(`/${workspaceId}/dashboard`)}>
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
      </div>
    </div>
  );
};

export default Integration;
