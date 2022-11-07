/* eslint-disable indent */
import { getLocalWorkspaceId, setRefreshToken } from '@/lib/helper';
import Button from 'common/button';
import Input from 'common/input';
import { PlatformsEnumType } from 'modules/settings/pages/integration/IntegrationDrawerTypes';
import { IntegrationModalDrawer } from 'modules/settings/pages/integration/IntegrationModalDrawer';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import bgIntegrationImage from '../../../../assets/images/bg-sign.svg';
import discordIcon from '../../../../assets/images/discord.svg';
import redditLogoIcon from '../../../../assets/images/reddit_logo.png';
import nextIcon from '../../../../assets/images/next.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import vanillaIcon from '../../../../assets/images/vanilla-forum.svg';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import usePlatform from '../../../../hooks/usePlatform';
import { DiscordConnectResponse, PlatformConnectResponse, RedditConnectResponseData } from '../../../../interface/interface';
import { IntegrationResponse, NetworkResponse } from '../../../../lib/api';
import { API_ENDPOINT } from '../../../../lib/config';
import { request } from '../../../../lib/request';
import { ConnectBody, ModalState, PlatformIcons, PlatformResponse, VanillaForumsConnectData } from '../../../settings/interface/settings.interface';
import { NavigateToConnectPage, NavigateToDiscordConnectPage, NavigateToRedditConnectPage } from '../../../settings/services/settings.services';
import settingsSlice from '../../../settings/store/slice/settings.slice';
import './Integration.css';

Modal.setAppElement('#root');

const Integration: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<ModalState>({ slack: false, vanillaForums: false, discord: false, reddit: false });
  // eslint-disable-next-line no-unused-vars
  const [platformIcons, setPlatformIcons] = useState<PlatformIcons>({
    slack: undefined,
    vanillaForums: undefined,
    discord: undefined,
    reddit: undefined
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [vanillaForumsData, setVanillaForumsData] = useState<VanillaForumsConnectData>({
    vanillaAccessToken: '',
    vanillaBaseUrl: '',
    workspaceId: ''
  });

  const dispatch = useDispatch();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const  PlatformsConnected  = JSON.parse(localStorage.getItem('platformsConnected')!);
  const { PlatformFilterResponse } = usePlatform();
  const navigate = useNavigate();
  const workspaceId = getLocalWorkspaceId();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    setRefreshToken();
    dispatch(settingsSlice.actions.platformData({ workspaceId }));

    if (window.location.href.includes('guild_id') && window.location.href.includes('permissions')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToDiscord(codeParams);
        }
      }
    }

    if (window.location.href.includes('state') && window.location.href.includes('code')) {
      if (searchParams.get('code') && searchParams.get('state')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToReddit(codeParams);
        }
      }

      if (searchParams.get('code') && !searchParams.get('state')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToSlack(codeParams);
        }
      }
    }
  }, []);

  useEffect(() => {
    if(error && Number(PlatformsConnected) > 0) {
      navigate(`/${workspaceId}/settings`);
    }
  }, [error]);

  const handleModals = (name: string, icon: string) => {
    switch (name) {
      case PlatformsEnumType.SLACK:
        NavigateToConnectPage();
        setPlatformIcons((prevState) => ({ ...prevState, slack: icon }));
        break;
      case PlatformsEnumType.VANILLA:
        setPlatformIcons((prevState) => ({ ...prevState, vanillaForums: icon }));
        setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: true }));
        break;
      case PlatformsEnumType.DISCORD:
        NavigateToDiscordConnectPage();
        break;

      case PlatformsEnumType.REDDIT:
        NavigateToRedditConnectPage();
        setPlatformIcons((prevState) => ({ ...prevState, reddit: icon }));
        break;
      default:
        break;
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const connectToSlack = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, slack: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<PlatformConnectResponse> = await request.post(`${API_ENDPOINT}/v1/slack/connect`, body);
      localStorage.setItem('workspacePlatformAuthSettingsId', response?.data?.data?.id);
      localStorage.setItem('workspacePlatformSettingsId', response?.data?.data?.workspacePlatformId);
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
      if (response?.data?.data) {
        setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
        navigate(`/${workspaceId}/settings/discord-integration`, {
          state: { discordConnectResponse: response?.data?.data }
        });
        showSuccessToast('Authenticated successfully');
      } else {
        showErrorToast('Integration failed');
        setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const connectToReddit = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, reddit: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<RedditConnectResponseData> = await request.post(`${API_ENDPOINT}/v1/reddit/connect`, body);
      if (response?.data?.data) {
        setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
        navigate(`/${workspaceId}/settings/reddit-integration`, {
          state: { redditConnectResponse: response?.data?.data }
        });
        showSuccessToast('Authenticated successfully');
      } else {
        showErrorToast('Integration failed');
        setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
    }
  };

  const handleModalClose = () => {
    if (isModalOpen.slack) {
      setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
    }
    if (isModalOpen.discord) {
      setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
    }
    if (isModalOpen.reddit) {
      setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
    }
  };

  const handleVanillaModal = (val: boolean) => {
    setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: val }));
  };

  const connectedBtnClassName = `dark:bg-secondaryDark bg-connectButton shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded 
  h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient dark:bg-secondaryDark`;

  const disConnectedBtnClassName = `btn-disconnect-gradient shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81
   rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in 
   duration-300 dark:bg-secondaryDark dark:border dark:border-[#9B9B9B]`;

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
                    {PlatformFilterResponse?.map((data: PlatformResponse) => (
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
                          text= {data.isConnected ? 'Disconnect' : 'Connect'}
                          className={data.isConnected  ? disConnectedBtnClassName : connectedBtnClassName}
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
      <IntegrationModalDrawer
        isOpen={isModalOpen.slack || isModalOpen.reddit || isModalOpen.discord}
        isClose={handleModalClose}
        iconSrc={isModalOpen.slack ? slackIcon : isModalOpen.reddit ? redditLogoIcon : isModalOpen.discord ? discordIcon : ''}
        contextText={
          isModalOpen.slack
            ? 'Slack'
            : isModalOpen.reddit
            ? 'Reddit'
            : isModalOpen.discord
            ? 'Discord'
            : ''
        }
      />
    </div>
  );
};

export default Integration;
