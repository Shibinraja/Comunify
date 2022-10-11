/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
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
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import { API_ENDPOINT } from '../../../../lib/config';
import { getLocalWorkspaceId, setRefreshToken } from '@/lib/helper';
import Input from 'common/input';
import { IntegrationResponse, NetworkResponse } from '../../../../lib/api';
import { DiscordConnectResponse, PlatformConnectResponse } from '../../../../interface/interface';
import { ModalState, PlatformResponse, PlatformIcons, VanillaForumsConnectData, ConnectBody } from '../../../settings/interface/settings.interface';
import usePlatform from '../../../../hooks/usePlatform';
import { useDispatch } from 'react-redux';
import settingsSlice from '../../../settings/store/slice/settings.slice';
import { NavigateToConnectPage, NavigateToDiscordConnectPage } from '../../../settings/services/settings.services';

Modal.setAppElement('#root');

const Integration: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<ModalState>({ slack: false, vanillaForums: false, discord: false });
  // eslint-disable-next-line no-unused-vars
  const [platformIcons, setPlatformIcons] = useState<PlatformIcons>({ slack: undefined, vanillaForums: undefined });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const platformData = usePlatform();
  const navigate = useNavigate();
  const workspaceId = getLocalWorkspaceId();
  const [searchParams] = useSearchParams();
  const handleVanillaModal = (val: boolean) => {
    setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: val }));
  };
  const [vanillaForumsData, setVanillaForumsData] = useState<VanillaForumsConnectData>({
    vanillaAccessToken: '',
    vanillaBaseUrl: '',
    workspaceId: ''
  });

  useEffect(() => {
    setRefreshToken();
    dispatch(settingsSlice.actions.platformData({ workspaceId }));
    if (window.location.href.includes('state')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          getData(codeParams);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (window.location.href.includes('guild_id') && window.location.href.includes('permissions')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToDiscord(codeParams);
        }
      }
    }
  }, []);

  const handleModals = (name: string, icon: string) => {
    switch (name) {
      case 'slack':
        NavigateToConnectPage();
        setPlatformIcons((prevState) => ({ ...prevState, slack: icon }));
        break;
      case 'vanilla':
        setPlatformIcons((prevState) => ({ ...prevState, vanillaForums: icon }));
        setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: true }));
        break;
      case 'discord':
        setIsLoading(true);
        NavigateToDiscordConnectPage();
        break;

      default:
        break;
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const getData = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, slack: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<PlatformConnectResponse> = await request.post(`${API_ENDPOINT}/v1/slack/connect`, body);
      localStorage.setItem('workspacePlatformAuthSettingsId', response?.data?.data?.id);
      localStorage.setItem('workspacePlatformSettingsId', response?.data?.data?.workspacePlatformSettingsId);
      if (response?.data?.data?.id) {
        setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
        navigate(`/${workspaceId}/settings/complete-setup`, { state: { workspacePlatformAuthSettingsId: response?.data?.data?.id } });
        showSuccessToast('Authenticated successfully');
      } else {
        showErrorToast('Integration failed');
        setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const sendVanillaData = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    try {
      event.preventDefault();
      const body: VanillaForumsConnectData = {
        vanillaBaseUrl: vanillaForumsData.vanillaBaseUrl,
        vanillaAccessToken: vanillaForumsData.vanillaAccessToken,
        workspaceId
      };
      const connectResponse: IntegrationResponse<PlatformConnectResponse> = await request.post(`${API_ENDPOINT}/v1/vanilla/connect`, body);
      if (connectResponse?.data?.message?.toLocaleLowerCase().trim() == 'already connected') {
        showWarningToast('Vanilla Forums is already connected to your workspace');
        setIsLoading(false);
      }
      if (connectResponse?.data?.data?.id) {
        showSuccessToast('Integration in progress...');
        try {
          const completeSetupResponse: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/vanilla/complete-setup`, {
            workspaceId,
            workspacePlatformAuthSettingsId: connectResponse?.data?.data?.id
          });
          if (completeSetupResponse?.data?.message) {
            dispatch(settingsSlice.actions.platformData({ workspaceId }));
            showSuccessToast('Successfully integrated');
            setIsLoading(false);
            setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: false }));
            navigate(`/${workspaceId}/settings`);
          }
        } catch (error) {
          showErrorToast('Integration Failed');
          setIsLoading(false);
        }
      }
    } catch (error) {
      showErrorToast('Integration Failed');
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const connectToDiscord = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, discord: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<DiscordConnectResponse> = await request.post(`${API_ENDPOINT}/v1/discord/connect`, body);
      //   if (response) {
      //     navigate(`/${workspaceId}/settings/discord-integration`);
      //   }
      //   localStorage.setItem('workspacePlatformAuthSettingsId', response?.data?.data?.id);
      //   localStorage.setItem('workspacePlatformSettingsId', response?.data?.data?.workspacePlatformSettingsId);
      if (response?.data?.data) {
        // setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
        navigate(`/${workspaceId}/settings/discord-integration`, {
          state: { discordConnectResponse: response?.data?.data }
        });
        showSuccessToast('Authenticated successfully');
      } else {
        showErrorToast('Integration failed');
        // setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      //   setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
    }
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
                    {platformData.map((data: PlatformResponse) => (
                      <div
                        key={`${data?.id + data?.name}`}
                        className="integration shadow-integrationCardShadow app-input-card-border border-integrationBorder w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center"
                      >
                        <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                          <img src={data?.platformLogoUrl} alt="" className="h-2.31 rounded-full w-[2.3125rem]" />
                        </div>
                        <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">{data?.name}</div>
                        <Button
                          type="button"
                          text="CONNECT"
                          className="bg-connectButton shadow-connectButtonShadow font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                          onClick={() => handleModals(data?.name.toLocaleLowerCase().trim(), data?.platformLogoUrl)}
                        />
                      </div>
                    ))}
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

                <Modal
                  isOpen={isModalOpen.slack}
                  shouldCloseOnOverlayClick={true}
                  onRequestClose={() => setIsModalOpen((prevState) => ({ ...prevState, slack: false }))}
                  className="rounded-lg modals-tag bg-white shadow-modal  flex justify-center outline-none"
                  style={{
                    overlay: {
                      display: 'flex',
                      position: 'fixed',
                      top: 0,
                      left: '60%',
                      bottom: 0,
                      right: 0,
                      alignItems: 'center',
                      backgroundColor: 'transparent'
                    }
                  }}
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

                <Modal
                  isOpen={isModalOpen.vanillaForums}
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
                            Enter the full URL to your Vanilla site in this format: https://{`yourdomain`}.com
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
                            You can learn how to create an access Token
                            <span className="text-tag cursor-pointer hover:underline pl-1">
                              <a href="https://success.vanillaforums.com/kb/articles/41" target={'_blank'} rel="noreferrer">
                                here.
                              </a>{' '}
                            </span>
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
                            disabled={isLoading ? true : !vanillaForumsData.vanillaAccessToken || !vanillaForumsData.vanillaBaseUrl ? true : false}
                            onClick={(e) => sendVanillaData(e)}
                            className={`text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded 
                            shadow-contactBtn w-5.25 ${
                              isLoading
                                ? 'opacity-50 cursor-not-allowed '
                                : !vanillaForumsData.vanillaAccessToken || !vanillaForumsData.vanillaBaseUrl
                                ? 'opacity-50 cursor-not-allowed '
                                : ''
                            } border-none h-2.81`}
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;
