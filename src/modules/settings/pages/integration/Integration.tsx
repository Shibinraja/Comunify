/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import Button from 'common/button';
import React, { useEffect, useState } from 'react';
import slackIcon from '../../../../assets/images/slack.svg';
import discordIcon from '../../../../assets/images/discord.svg';
import redditLogoIcon from '../../../../assets/images/reddit_logo.png';
import githubLogoIcon from '../../../../assets/images/github_logo.png';
import { TabPanel } from 'common/tabs/TabPanel';
import { NavigateToConnectPage, NavigateToDiscordConnectPage, NavigateToRedditConnectPage } from 'modules/settings/services/settings.services';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import vanillaIcon from '../../../../assets/images/vanilla-forum.svg';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import usePlatform from '../../../../hooks/usePlatform';
import { DiscordConnectResponse, PlatformConnectResponse, RedditConnectResponseData } from '../../../../interface/interface';
import { IntegrationResponse, NetworkResponse } from '../../../../lib/api';
import { API_ENDPOINT } from '../../../../lib/config';
import { getLocalWorkspaceId } from '../../../../lib/helper';
import { request } from '../../../../lib/request';
import { AppDispatch } from '../../../../store';
import {
  ConnectedPlatforms,
  ModalState,
  PlatformIcons,
  PlatformResponse,
  PlatformsStatus,
  ConnectBody,
  VanillaForumsConnectData
} from '../../interface/settings.interface';
import settingsSlice from '../../store/slice/settings.slice';
import Input from '../../../../common/input';
import './Integration.css';
import { IntegrationModalDrawer } from './IntegrationModalDrawer';
import { PlatformsEnumType } from './IntegrationDrawerTypes';

Modal.setAppElement('#root');

interface PlatformDisconnect {
  workspacePlatformSettingsId: string | null;
}
interface ConfirmPlatformToDisconnect {
  platform: string;
  workspacePlatformSettingsId: string;
  platformIcon: string;
}

const Integration: React.FC<{ hidden: boolean }> = ({ hidden }) => {
  const [isModalOpen, setIsModalOpen] = useState<ModalState>({ slack: false, vanillaForums: false, discord: false, reddit: false });
  const [isWarningModalOpen, setIsWarningModalOpen] = useState<boolean>(false);
  const [confirmPlatformToDisconnect, setConfirmPlatformToDisconnect] = useState<ConfirmPlatformToDisconnect>({
    platform: '',
    workspacePlatformSettingsId: '',
    platformIcon: ''
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [platformIcons, setPlatformIcons] = useState<PlatformIcons>({
    slack: undefined,
    vanillaForums: undefined,
    discord: undefined,
    reddit: undefined
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [platformStatus, setPlatformStatus] = useState<PlatformsStatus>({ platform: undefined, status: undefined });
  const [vanillaForumsData, setVanillaForumsData] = useState<VanillaForumsConnectData>({
    vanillaAccessToken: '',
    vanillaBaseUrl: '',
    workspaceId: ''
  });
  const [integrationDisconnect, setIntegrationDisconnect] = useState<boolean>(false);
  const { PlatformFilterResponse } = usePlatform();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = getLocalWorkspaceId();
  const [isButtonConnect] = useState<boolean>(true);

  const { PlatformsConnected } = usePlatform();

  useEffect(() => {
    dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
    if (window.location.href.includes('guild_id') && window.location.href.includes('permissions')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToDiscord(codeParams);
        }
      }
    }
    if (window.location.href.includes('state') && window.location.href.includes('code')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToReddit(codeParams);
        }
      }
    }
    if (window.location.href.includes('state') && !window.location.href.includes('code')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          getData(codeParams);
        }
      }
    }
  }, []);

  const checkForConnectedPlatform = (platformName: string) => {
    const data = PlatformsConnected?.find(
      (obj: ConnectedPlatforms) => obj?.name.toLocaleLowerCase().trim() === `${platformName.toLocaleLowerCase().trim()}`
    );
    return data;
  };

  const handleVanillaModal = (val: boolean) => {
    setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: val }));
  };

  const handleModals = (name: string, icon: string, isIntegrated: boolean) => {
    switch (name) {
      case PlatformsEnumType.SLACK:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, slack: icon }));
          if (isIntegrated === true) {
            handlePlatformReconnectForSlack(name);
          } else {
            NavigateToConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${name} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.VANILLA:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, vanillaForums: icon }));
          if (isIntegrated === true) {
            handlePlatformReconnectForVanilla(name);
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: true }));
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${name} Forums is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.DISCORD:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, discord: icon }));
          if (isIntegrated === true) {
            handlePlatformReconnectForDiscord(name);
          } else {
            NavigateToDiscordConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${name} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.REDDIT:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, reddit: icon }));
          if (isIntegrated === true) {
            handlePlatformReconnectForReddit(name);
          } else {
            NavigateToRedditConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${name} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      default:
        break;
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handleDisconnect = async (platform: string, workspacePlatformSettingsId: string, platformIcon: string) => {
    setConfirmPlatformToDisconnect({ platform, workspacePlatformSettingsId, platformIcon });
    setIsWarningModalOpen(true);
  };

  // eslint-disable-next-line space-before-function-paren
  const handleConfirmation = async (state: boolean) => {
    const body: PlatformDisconnect = {
      workspacePlatformSettingsId: confirmPlatformToDisconnect.workspacePlatformSettingsId
    };
    if (!state) {
      setIsWarningModalOpen(false);
    } else {
      try {
        setIntegrationDisconnect(true);
        const disconnectResponse: IntegrationResponse<PlatformsStatus> = await request.post(
          `${API_ENDPOINT}/v1/${confirmPlatformToDisconnect.platform.toLocaleLowerCase().trim()}/disconnect`,
          body
        );
        if (disconnectResponse?.data?.data?.status?.toLocaleLowerCase().trim() === 'disabled') {
          setIsWarningModalOpen(false);
          setIntegrationDisconnect(false);
          if (disconnectResponse?.data?.data?.platform?.toLocaleLowerCase().trim() === 'vanilla') {
            showSuccessToast(`${confirmPlatformToDisconnect.platform} Forums was successfully disconnected from your workspace`);
            dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
          } else {
            showSuccessToast(`${confirmPlatformToDisconnect.platform} was successfully disconnected from your workspace`);
            dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
          }
        }
      } catch {
        setIntegrationDisconnect(false);
        showErrorToast(`${confirmPlatformToDisconnect.platform} disconnection failed`);
      }
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
            dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
            showSuccessToast('Successfully integrated');
            setIsLoading(false);
            setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: false }));
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

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForSlack = async (platform: string) => {
    setIsModalOpen((prevState) => ({ ...prevState, slack: true }));
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        showSuccessToast(`${platform} was successfully connected`);
        setIsLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForVanilla = async (platform: string) => {
    const body = {
      workspaceId
    };
    showSuccessToast('Integration in progress...');
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        showSuccessToast(`${platform} Forums was successfully connected`);
        setIsLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForDiscord = async (platform: string) => {
    setIsModalOpen((prevState) => ({ ...prevState, discord: true }));
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        showSuccessToast(`${platform} was successfully connected`);
        setIsLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForReddit = async (platform: string) => {
    setIsModalOpen((prevState) => ({ ...prevState, reddit: true }));
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        showSuccessToast(`${platform} was successfully connected`);
        setIsLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
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

  const connectedBtnClassName = `dark:bg-secondaryDark bg-connectButton shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded 
    h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient dark:bg-secondaryDark`;

  const disConnectedBtnClassName = `btn-disconnect-gradient shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81
     rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in 
     duration-300 dark:bg-secondaryDark dark:border dark:border-[#9B9B9B]`;

  return (
    <TabPanel hidden={hidden}>
      <div className="settings-integration container mt-2.62 pb-20">
        {PlatformsConnected?.length > 0 && (
          <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.43">Connected Integrations</h3>
        )}
        <div className="flex mt-1.8 flex-wrap w-full pb-1.68 border-b border-bottom-card">
          {PlatformsConnected?.map((data: ConnectedPlatforms) => (
            <div key={`${data?.id + data?.name}`}>
              {data?.name !== undefined ? (
                <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={data?.platformLogoUrl} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">{data?.name}</div>
                  <Button
                    type="button"
                    text={isButtonConnect ? 'Disconnect' : 'Connect'}
                    className={isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                    onClick={() => handleDisconnect(data?.name, data?.id, data?.platformLogoUrl)}
                  />
                </div>
              ) : (
                <Skeleton width={150} count={8} />
              )}
            </div>
          ))}
        </div>

        <div className="pending-connect mt-1.8">
          <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.43">Integrations</h3>
          <p className="font-Poppins font-normal text-error leading-1.43 mt-0.5">
            Choose from any of the following data sources to connect with and see what your community members are up to!
          </p>

          <div className="flex mt-1.8 flex-wrap w-full">
            {PlatformFilterResponse?.map((data: PlatformResponse) => (
              <div
                key={`${data?.id + data?.name}`}
                className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5"
              >
                <div className="flex flex-wrap items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={data?.platformLogoUrl} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">{data?.name}</div>
                <Button
                  type="button"
                  text="Connect"
                  className={!isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                  onClick={() => handleModals(data?.name.toLocaleLowerCase().trim(), data?.platformLogoUrl, data?.isIntegrated)}
                />
              </div>
            ))}

            <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
              <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                <img src={githubLogoIcon} alt="" className="h-2.31" />
              </div>
              <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Github</div>
              <Button
                disabled={isLoading ? true : false}
                type="button"
                text="Coming soon"
                className="bg-black shadow-contactCard font-Poppins cursor-none text-white font-medium leading-5 text-error mt-0.81 rounded-full h-6 w-6.56"
              />
            </div>
          </div>

          <Modal
            isOpen={isModalOpen.vanillaForums}
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: false }))}
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
                      type="submit"
                      className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                      onClick={() => handleVanillaModal(false)}
                    />
                    <Button
                      text="Save"
                      type="submit"
                      disabled={isLoading ? true : !vanillaForumsData.vanillaAccessToken || !vanillaForumsData.vanillaBaseUrl ? true : false}
                      onClick={(e) => sendVanillaData(e)}
                      className={`text-white font-Poppins text-error font-medium leading-5 btn-save-modal
                       cursor-pointer rounded shadow-contactBtn w-5.25  ${
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
          <Modal
            isOpen={isWarningModalOpen}
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => setIsWarningModalOpen(false)}
            className="w-24.31 h-18.43 mx-auto rounded-lg modals-tag bg-white shadow-modal flex items-center justify-center"
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
            <div className="flex flex-col items-center justify-center ">
              <div className="bg-cover w-12">
                <img src={confirmPlatformToDisconnect.platformIcon} alt="" />
              </div>
              <div className="mt-5 leading-6 text-black font-Inter font-semibold text-xl w-2/3 text-center">
                {`Are you sure you want to disconnect ${confirmPlatformToDisconnect.platform} from your workspace?`}
              </div>
              <div className="flex mt-1.8">
                <Button
                  type="button"
                  text="NO"
                  className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
                  onClick={() => handleConfirmation(false)}
                />
                <Button
                  type="button"
                  disabled={integrationDisconnect}
                  text="YES"
                  // eslint-disable-next-line max-len
                  className={`border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal ${
                    integrationDisconnect ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleConfirmation(true)}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <IntegrationModalDrawer
        isOpen={isModalOpen.slack || isModalOpen.reddit || isModalOpen.discord}
        isClose={handleModalClose}
        iconSrc={isModalOpen.slack ? slackIcon : isModalOpen.reddit ? redditLogoIcon : isModalOpen.discord ? discordIcon : ''}
        contextText={isModalOpen.slack ? 'Slack' : isModalOpen.reddit ? 'Reddit' : isModalOpen.discord ? 'Discord' : ''}
      />
    </TabPanel>
  );
};

export default Integration;
