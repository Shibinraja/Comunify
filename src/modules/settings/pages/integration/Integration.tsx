/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import * as Yup from 'yup';
import Modal from 'react-modal';
import { Form, Formik } from 'formik';
import Skeleton from 'react-loading-skeleton';

import Button from 'common/button';
import Input from '../../../../common/input';
import { TabPanel } from 'common/tabs/TabPanel';
import { ModalDrawer } from 'common/modals/ModalDrawer';
import {
  NavigateToConnectPage,
  NavigateToDiscordConnectPage,
  NavigateToGithubConnectPage,
  NavigateToRedditConnectPage,
  NavigateToSalesForceConnectPage,
  NavigateToTwitterConnectPage
} from 'modules/settings/services/settings.services';

import { PlatformsEnumType } from './IntegrationDrawerTypes';

import {
  DiscordConnectResponse,
  DiscourseConnectResponse,
  GithubConnectResponseData,
  PlatformConnectResponse,
  RedditConnectResponseData
} from '../../../../interface/interface';
import {
  ConnectBody,
  ConnectedPlatforms,
  DiscourseInitialValues,
  ModalState,
  PlatformIcons,
  PlatformResponse,
  PlatformsStatus,
  VanillaForumsConnectData
} from '../../interface/settings.interface';

import { API_ENDPOINT } from '@/lib/config';
import { AppDispatch } from '../../../../store';
import { request } from '../../../../lib/request';
import usePlatform from '../../../../hooks/usePlatform';
import { capitalizeFirstLetter, getLocalWorkspaceId } from '../../../../lib/helper';
import { IntegrationModalDrawer } from './IntegrationModalDrawer';
import { AxiosError, IntegrationResponse, NetworkResponse } from '../../../../lib/api';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';

import discordIcon from '../../../../assets/images/discord.svg';
import githubLogoIcon from '../../../../assets/images/github_logo.png';
import redditLogoIcon from '../../../../assets/images/reddit_logo.png';
import slackIcon from '../../../../assets/images/slack.svg';
import vanillaIcon from '../../../../assets/images/vanilla-forum.svg';
import discourseIcon from '../../../../assets/images/discourse.png';
import twitterIcon from '../../../../assets/images/twitter.png';
import salesForceIcon from '../../../../assets/images/salesforce.png';

import settingsSlice from '../../store/slice/settings.slice';

import './Integration.css';
import 'react-loading-skeleton/dist/skeleton.css';

Modal.setAppElement('#root');

interface PlatformDisconnect {
  workspacePlatformSettingsId: string | null;
}
interface ConfirmPlatformToDisconnect {
  platform: string;
  workspacePlatformSettingsId: string;
  platformIcon: string;
}

const vanillaInitialValues: Omit<VanillaForumsConnectData, 'workspaceId'> = {
  vanillaBaseUrl: '',
  vanillaAccessToken: ''
};

const discourseInitialValues: DiscourseInitialValues = {
  discourseBaseUrl: '',
  discourseAPIKey: '',
  discourseUserName: ''
};

const Integration: React.FC<{ hidden: boolean; selectedTab: string }> = ({ hidden, selectedTab }) => {
  const [isModalOpen, setIsModalOpen] = useState<ModalState>({
    slack: false,
    vanilla: false,
    discord: false,
    reddit: false,
    github: false,
    discourse: false,
    twitter: false,
    salesforce: false
  });
  const [showAlert, setShowAlert] = useState<ModalState>({
    slack: false,
    vanilla: false,
    discord: false,
    reddit: false,
    github: false,
    discourse: false,
    twitter: false,
    salesforce: false
  });
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
    reddit: undefined,
    github: undefined,
    discourse: undefined,
    twitter: undefined,
    salesforce: undefined
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonConnect] = useState<boolean>(true);
  const [reconnectLoading, setReconnectLoading] = useState<boolean>(false);
  const [integrationDisconnect, setIntegrationDisconnect] = useState<boolean>(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceId = getLocalWorkspaceId();
  const dispatch: AppDispatch = useDispatch();
  const { PlatformFilterResponse } = usePlatform();

  const { PlatformsConnected } = usePlatform();

  useEffect(() => {
    if (selectedTab === 'integrations') {
      dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
    }
  }, [selectedTab]);

  useEffect(() => {
    dispatch(settingsSlice.actions.platformData({ workspaceId }));
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
    if (window.location.href.includes('state') && window.location.href.includes('code') && !window.location.href.includes('platform')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToReddit(codeParams);
        }
      }
    }

    if (window.location.href.includes('code') && window.location.href.includes('platform')) {
      if (searchParams.get('platform') === 'twitter') {
        if (searchParams.get('code')) {
          const codeParams: null | string = searchParams.get('code');
          if (codeParams !== '') {
            connectToTwitter(codeParams);
          }
        }
      }
      if (searchParams.get('platform') === 'salesforce') {
        if (searchParams.get('code')) {
          const codeParams: null | string = searchParams.get('code');
          if (codeParams !== '') {
            connectToSalesForce(codeParams);
          }
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
    if (!window.location.href.includes('state') && window.location.href.includes('code')) {
      if (searchParams.get('code')) {
        const codeParams: null | string = searchParams.get('code');
        if (codeParams !== '') {
          connectToGithub(codeParams);
        }
      }
    }
    if (window.location.href.includes('code') && window.location.href.includes('platform')) {
      if (searchParams.get('platform') === 'github') {
        if (searchParams.get('code')) {
          const codeParams: null | string = searchParams.get('code');
          if (codeParams !== '') {
            connectToGithub(codeParams);
          }
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
    setIsModalOpen((prevState) => ({ ...prevState, vanilla: val }));
  };

  const handleModals = (name: string, icon: string, isIntegrated: boolean, isConnected: boolean) => {
    switch (name) {
      case PlatformsEnumType.SLACK:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, slack: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, slack: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, slack: true }));
            NavigateToConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.VANILLA:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, vanillaForums: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, vanilla: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, vanilla: true }));
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} Forums is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.DISCORD:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, discord: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, discord: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, discord: true }));
            NavigateToDiscordConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.REDDIT:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, reddit: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, reddit: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, reddit: true }));
            NavigateToRedditConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.GITHUB:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, github: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, github: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, github: true }));
            NavigateToGithubConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.DISCOURSE:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, discourse: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState: ModalState) => ({ ...prevState, discourse: true }));
          } else {
            setIsModalOpen((prevState: ModalState) => ({ ...prevState, discourse: true }));
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.TWITTER:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, twitter: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, twitter: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, twitter: true }));
            NavigateToTwitterConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
          setIsLoading(false);
        }
        break;
      case PlatformsEnumType.SALESFORCE:
        setIsLoading(true);
        if (!checkForConnectedPlatform(name)) {
          setPlatformIcons((prevState) => ({ ...prevState, salesforce: icon }));
          if (isIntegrated && !isConnected) {
            setShowAlert((prevState) => ({ ...prevState, salesforce: true }));
          } else {
            setIsModalOpen((prevState) => ({ ...prevState, salesforce: true }));
            NavigateToSalesForceConnectPage();
            setIsLoading(false);
          }
        } else {
          showWarningToast(`${capitalizeFirstLetter(name)} is already connected to your workspace`);
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
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
      } catch {
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
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
  const sendVanillaData = async (values: Omit<VanillaForumsConnectData, 'workspaceId'>) => {
    setIsLoading(true);
    try {
      const body: VanillaForumsConnectData = {
        vanillaBaseUrl: values.vanillaBaseUrl,
        vanillaAccessToken: values.vanillaAccessToken,
        workspaceId
      };
      const connectResponse: IntegrationResponse<PlatformConnectResponse> = await request.post(`${API_ENDPOINT}/v1/vanilla/connect`, body);
      if (connectResponse?.data?.data?.id) {
        try {
          const completeSetupResponse: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/vanilla/complete-setup`, {
            workspaceId,
            workspacePlatformAuthSettingsId: connectResponse?.data?.data?.id
          });
          if (completeSetupResponse?.data?.message) {
            dispatch(settingsSlice.actions.platformData({ workspaceId }));
            showSuccessToast('Successfully integrated');
            dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
            setIsLoading(false);
            setIsModalOpen((prevState) => ({ ...prevState, vanillaForums: false }));
          }
        } catch (e) {
          const error = e as AxiosError<unknown>;
          showErrorToast(error?.response?.data?.message);
          setIsLoading(false);
        }
      }
    } catch (e) {
      const error = e as AxiosError<unknown>;
      showErrorToast(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const sendDiscourseData = async (values: DiscourseInitialValues) => {
    const body: { domain: string; userName: string; apiKey: string; workspaceId: string } = {
      domain: values.discourseBaseUrl,
      userName: values.discourseUserName,
      apiKey: values.discourseAPIKey,
      workspaceId
    };
    setIsLoading(true);
    try {
      const connectResponse: IntegrationResponse<DiscourseConnectResponse> = await request.post(`${API_ENDPOINT}/v1/discourse/connect`, body);
      if (connectResponse?.data?.data?.id) {
        try {
          const completeSetupResponse: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/discourse/complete-setup`, {
            workspaceId,
            workspacePlatformAuthSettingsId: connectResponse?.data?.data?.id
          });
          if (completeSetupResponse?.data?.message) {
            dispatch(settingsSlice.actions.platformData({ workspaceId }));
            showSuccessToast('Successfully integrated');
            setIsLoading(false);
            setIsModalOpen((prevState) => ({ ...prevState, discourse: false }));
            dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
          }
        } catch (e) {
          const error = e as AxiosError<unknown>;
          showErrorToast(error?.response?.data?.message);
          setIsLoading(false);
        }
      }
    } catch (e) {
      const error = e as AxiosError<unknown>;
      showErrorToast(error?.response?.data?.message);
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
  const connectToGithub = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, github: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<GithubConnectResponseData> = await request.post(`${API_ENDPOINT}/v1/github/connect`, body);
      if (response?.data?.data) {
        setIsModalOpen((prevState) => ({ ...prevState, github: false }));
        navigate(`/${workspaceId}/settings/github-integration`, {
          state: { githubConnectResponse: response?.data?.data }
        });
        showSuccessToast('Authenticated successfully');
      } else {
        showErrorToast('Integration failed');
        setIsModalOpen((prevState) => ({ ...prevState, github: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      setIsModalOpen((prevState) => ({ ...prevState, github: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const connectToTwitter = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, twitter: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<GithubConnectResponseData> = await request.post(`${API_ENDPOINT}/v1/twitter/connect`, body);
      if (response?.data?.data) {
        showSuccessToast('Authenticated successfully');
        try {
          const completeSetupResponse: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/twitter/complete-setup`, {
            workspaceId,
            workspacePlatformAuthSettingsId: response?.data?.data?.id
          });
          if (completeSetupResponse?.data?.message) {
            dispatch(settingsSlice.actions.platformData({ workspaceId }));
            showSuccessToast('Successfully integrated');
            setIsLoading(false);
            setIsModalOpen((prevState) => ({ ...prevState, twitter: false }));
          }
        } catch (e) {
          const error = e as AxiosError<unknown>;
          showErrorToast(error?.response?.data?.message);
          setIsLoading(false);
        }
      } else {
        showErrorToast('Integration failed');
        setIsModalOpen((prevState) => ({ ...prevState, twitter: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      setIsModalOpen((prevState) => ({ ...prevState, twitter: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const connectToSalesForce = async (codeParams: string | null) => {
    try {
      setIsModalOpen((prevState) => ({ ...prevState, salesforce: true }));
      const body: ConnectBody = {
        code: codeParams,
        workspaceId
      };
      const response: IntegrationResponse<DiscordConnectResponse> = await request.post(`${API_ENDPOINT}/v1/salesforce/connect`, body);
      if (response?.data?.data) {
        setIsModalOpen((prevState) => ({ ...prevState, salesforce: false }));
        navigate(`/${workspaceId}/settings/salesforce-integration`, {
          state: { salesforceConnectResponse: response?.data?.data }
        });
        showSuccessToast('Authenticated successfully');
      } else {
        showErrorToast('Integration failed');
        setIsModalOpen((prevState) => ({ ...prevState, salesforce: false }));
      }
    } catch {
      showErrorToast('Integration failed');
      setIsModalOpen((prevState) => ({ ...prevState, salesforce: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForSlack = async (platform: string) => {
    setReconnectLoading(true);
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setShowAlert((prevState) => ({ ...prevState, slack: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setShowAlert((prevState) => ({ ...prevState, slack: false }));
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setShowAlert((prevState) => ({ ...prevState, slack: false }));
      setReconnectLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForVanilla = async (platform: string) => {
    const body = {
      workspaceId
    };
    setReconnectLoading(true);
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} Forums was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setReconnectLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForDiscord = async (platform: string) => {
    setReconnectLoading(true);
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setShowAlert((prevState) => ({ ...prevState, discord: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setShowAlert((prevState) => ({ ...prevState, discord: false }));
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setShowAlert((prevState) => ({ ...prevState, discord: false }));
      setReconnectLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForReddit = async (platform: string) => {
    setReconnectLoading(true);
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setShowAlert((prevState) => ({ ...prevState, reddit: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setShowAlert((prevState) => ({ ...prevState, reddit: false }));
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setShowAlert((prevState) => ({ ...prevState, reddit: false }));
      setReconnectLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForGithub = async (platform: string) => {
    setReconnectLoading(true);
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setShowAlert((prevState) => ({ ...prevState, github: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setShowAlert((prevState) => ({ ...prevState, github: false }));
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setShowAlert((prevState) => ({ ...prevState, github: false }));
      setReconnectLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForDiscourse = async (platform: string) => {
    const body = {
      workspaceId
    };
    setReconnectLoading(true);
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
        setShowAlert((prevState) => ({ ...prevState, discourse: false }));
      } else {
        showErrorToast('Failed to connect to the platform');
        setReconnectLoading(false);
        setShowAlert((prevState) => ({ ...prevState, discourse: false }));
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setReconnectLoading(false);
      setShowAlert((prevState) => ({ ...prevState, discourse: false }));
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForTwitter = async (platform: string) => {
    setReconnectLoading(true);
    const body = {
      workspaceId
    };
    try {
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setShowAlert((prevState) => ({ ...prevState, twitter: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setShowAlert((prevState) => ({ ...prevState, twitter: false }));
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setShowAlert((prevState) => ({ ...prevState, twitter: false }));
      setReconnectLoading(false);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const handlePlatformReconnectForSalesforce = async (platform: string) => {
    setReconnectLoading(true);
    const body = {
      workspaceId
    };
    try {
      setShowAlert((prevState) => ({ ...prevState, salesforce: true }));
      const response: IntegrationResponse<string> = await request.post(`${API_ENDPOINT}/v1/${platform.toLocaleLowerCase().trim()}/connect`, body);
      if (response?.data?.message) {
        setShowAlert((prevState) => ({ ...prevState, salesforce: false }));
        dispatch(settingsSlice.actions.connectedPlatforms({ workspaceId }));
        dispatch(settingsSlice.actions.platformData({ workspaceId }));
        showSuccessToast(`${capitalizeFirstLetter(platform)} was successfully connected`);
        setReconnectLoading(false);
      } else {
        showErrorToast('Failed to connect to the platform');
        setShowAlert((prevState) => ({ ...prevState, salesforce: false }));
        setReconnectLoading(false);
      }
    } catch {
      showErrorToast('Failed to connect to the platform');
      setShowAlert((prevState) => ({ ...prevState, salesforce: false }));
      setReconnectLoading(false);
    }
  };

  const handleOnSubmit = () => {
    //     const platformEntries= Object.entries(showAlert);
    //     const platformName = platformEntries.find(((platform) => {
    //        if(platform.includes(true)) {
    //         return platform;
    //         }
    // }));
    if (showAlert.slack) {
      handlePlatformReconnectForSlack(PlatformsEnumType.SLACK);
    }
    if (showAlert.vanilla) {
      handlePlatformReconnectForVanilla(PlatformsEnumType.VANILLA);
    }
    if (showAlert.discord) {
      handlePlatformReconnectForDiscord(PlatformsEnumType.DISCORD);
    }
    if (showAlert.reddit) {
      handlePlatformReconnectForReddit(PlatformsEnumType.REDDIT);
    }
    if (showAlert.github) {
      handlePlatformReconnectForGithub(PlatformsEnumType.GITHUB);
    }
    if (showAlert.discourse) {
      handlePlatformReconnectForDiscourse(PlatformsEnumType.DISCOURSE);
    }
    if (showAlert.twitter) {
      handlePlatformReconnectForTwitter(PlatformsEnumType.TWITTER);
    }
    if (showAlert.salesforce) {
      handlePlatformReconnectForSalesforce(PlatformsEnumType.SALESFORCE);
    }
  };

  const handleModalClose = () => {
    if (isModalOpen.slack || showAlert.slack) {
      setIsModalOpen((prevState) => ({ ...prevState, slack: false }));
      setShowAlert((prevState) => ({ ...prevState, slack: false }));
    }
    if (isModalOpen.discord || showAlert.discord) {
      setIsModalOpen((prevState) => ({ ...prevState, discord: false }));
      setShowAlert((prevState) => ({ ...prevState, discord: false }));
    }
    if (isModalOpen.reddit || showAlert.reddit) {
      setIsModalOpen((prevState) => ({ ...prevState, reddit: false }));
      setShowAlert((prevState) => ({ ...prevState, reddit: false }));
    }
    if (showAlert.vanilla) {
      setShowAlert((prevState) => ({ ...prevState, vanilla: false }));
    }
    if (isModalOpen.github) {
      setIsModalOpen((prevState) => ({ ...prevState, github: false }));
    }
    if (showAlert.discourse) {
      setShowAlert((prevState) => ({ ...prevState, discourse: false }));
    }
    if (showAlert.twitter) {
      setShowAlert((prevState) => ({ ...prevState, twitter: false }));
    }
    if (isModalOpen.salesforce || showAlert.salesforce) {
      setIsModalOpen((prevState) => ({ ...prevState, salesforce: false }));
      setShowAlert((prevState) => ({ ...prevState, salesforce: false }));
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
                className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5 mb-5"
              >
                <div className="flex flex-wrap items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={data?.platformLogoUrl} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">{data?.name}</div>
                <Button
                  type="button"
                  text="Connect"
                  className={!isButtonConnect ? disConnectedBtnClassName : connectedBtnClassName}
                  onClick={() => handleModals(data?.name.toLocaleLowerCase().trim(), data?.platformLogoUrl, data?.isIntegrated, data.isConnected)}
                />
              </div>
            ))}
            {window.location.href.includes('stage') ||
              (window.location.href.includes('app') && (
                <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                  <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                    <img src={discourseIcon} alt="" className="h-2.31" />
                  </div>
                  <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Discourse</div>
                  <Button
                    disabled={isLoading ? true : false}
                    type="button"
                    text="Coming soon"
                    className="bg-black shadow-contactCard font-Poppins cursor-none text-white font-medium leading-5 text-error mt-0.81 rounded-full h-6 w-6.56"
                  />
                </div>
              ))}
            {/* <div className="app-input-card-border shadow-integrationCardShadow w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center mr-5">
                <div className="flex items-center justify-center h-16 w-16 bg-center bg-cover bg-subIntegrationGray">
                  <img src={salesForceIcon} alt="" className="h-2.31" />
                </div>
                <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">Salesforce</div>
                <Button
                  disabled={isLoading ? true : false}
                  type="button"
                  text="Coming soon"
                  className="bg-black shadow-contactCard font-Poppins cursor-none text-white font-medium leading-5 text-error mt-0.81 rounded-full h-6 w-6.56"
                />
              </div> */}
          </div>

          <Modal
            isOpen={isModalOpen.vanilla}
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => setIsModalOpen((prevState) => ({ ...prevState, vanilla: false }))}
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
                <Formik initialValues={vanillaInitialValues} onSubmit={sendVanillaData} validationSchema={vanillaDataSchema}>
                  {({ errors, handleBlur, handleChange, touched, values }): JSX.Element => (
                    <Form>
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
                          name="vanillaBaseUrl"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.vanillaBaseUrl}
                          errors={Boolean(touched.vanillaBaseUrl && errors.vanillaBaseUrl)}
                          helperText={touched.vanillaBaseUrl && errors.vanillaBaseUrl}
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
                          name="vanillaAccessToken"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.vanillaAccessToken}
                          errors={Boolean(touched.vanillaAccessToken && errors.vanillaAccessToken)}
                          helperText={touched.vanillaAccessToken && errors.vanillaAccessToken}
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
                          disabled={isLoading ? true : !values.vanillaAccessToken || !values.vanillaBaseUrl ? true : false}
                          className={`text-white font-Poppins text-error font-medium leading-5 btn-save-modal
                       cursor-pointer rounded shadow-contactBtn w-5.25  ${
                         isLoading
                           ? 'opacity-50 cursor-not-allowed '
                           : !values.vanillaAccessToken || !values.vanillaBaseUrl
                           ? 'opacity-50 cursor-not-allowed '
                           : ''
                       } border-none h-2.81`}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </Modal>
          <Modal
            isOpen={isModalOpen.discourse}
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => setIsModalOpen((previousState: ModalState) => ({ ...previousState, discourse: false }))}
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
                <img src={discourseIcon} alt="" className="px-2.5 w-14" />
                integrate <span className="font-normal px-2">Discourse</span>
              </h3>
              <div className="flex flex-col px-[1.875rem] pt-9">
                <Formik initialValues={discourseInitialValues} onSubmit={sendDiscourseData} validationSchema={discourseDataSchema}>
                  {({ errors, handleBlur, handleChange, touched, values }): JSX.Element => (
                    <Form>
                      <div className="form-group">
                        <label htmlFor="siteUrl" className="font-Poppins font-normal text-infoBlack text-sm leading-5">
                          Site URL*
                        </label>
                        <h1 className="font-Inter font-normal text-error leading-7 text-vanillaDescription">
                          Enter the full URL to your Discourse site in this format: https://{`yourdomain`}.com
                        </h1>
                        <Input
                          type="text"
                          placeholder="Enter URL"
                          label="Site URL"
                          id="siteUrlId"
                          name="discourseBaseUrl"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.discourseBaseUrl}
                          errors={Boolean(touched.discourseBaseUrl && errors.discourseBaseUrl)}
                          helperText={touched.discourseBaseUrl && errors.discourseBaseUrl}
                          className="h-2.81 pr-3.12 rounded-md border-app-result-card-border mt-[0.4375rem] bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-thinGray placeholder:text-sm placeholder:leading-6 placeholder:font-Poppins font-Poppins box-border"
                        />
                      </div>
                      <div className="form-group pt-4">
                        <label htmlFor="siteUrl" className="font-Poppins font-normal text-infoBlack text-sm leading-5">
                          Username*
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter Username"
                          label="Username"
                          id="usernameId"
                          name="discourseUserName"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.discourseUserName}
                          errors={Boolean(touched.discourseUserName && errors.discourseUserName)}
                          helperText={touched.discourseUserName && errors.discourseUserName}
                          className="h-2.81 pr-3.12 rounded-md border-app-result-card-border mt-[0.4375rem] bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-thinGray placeholder:text-sm placeholder:leading-6 placeholder:font-Poppins font-Poppins box-border"
                        />
                      </div>
                      <div className="form-group pt-1.12">
                        <label htmlFor="accessToken" className="font-Poppins font-normal text-infoBlack text-sm leading-5">
                          API Key*
                        </label>
                        <h1 className="font-Inter font-normal text-error leading-7 text-vanillaDescription">
                          You can learn how to generate an API Key
                          <span className="text-tag cursor-pointer hover:underline pl-1">
                            <a href="https://meta.discourse.org/t/create-and-configure-an-api-key/230124" target={'_blank'} rel="noreferrer">
                              here.
                            </a>{' '}
                          </span>
                        </h1>
                        <Input
                          type="text"
                          placeholder="Enter API Key"
                          label="API Key"
                          id="apiKeyId"
                          name="discourseAPIKey"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values?.discourseAPIKey}
                          errors={Boolean(touched.discourseAPIKey && errors.discourseAPIKey)}
                          helperText={touched.discourseAPIKey && errors.discourseAPIKey}
                          className="h-2.81 pr-3.12 rounded-md border-app-result-card-border mt-[0.4375rem] bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-thinGray placeholder:text-sm placeholder:leading-6 placeholder:font-Poppins font-Poppins box-border"
                        />
                      </div>
                      <div className="flex justify-end pt-[1.875rem]">
                        <Button
                          text="Cancel"
                          type="submit"
                          className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                          onClick={() => setIsModalOpen((previousState: ModalState) => ({ ...previousState, discourse: false }))}
                        />
                        <Button
                          text="Save"
                          type="submit"
                          disabled={
                            isLoading ? true : !values.discourseBaseUrl || !values.discourseUserName || !values.discourseAPIKey ? true : false
                          }
                          className={`text-white font-Poppins text-error font-medium leading-5 btn-save-modal
                 cursor-pointer rounded shadow-contactBtn w-5.25  ${
                   isLoading
                     ? 'opacity-50 cursor-not-allowed '
                     : !values.discourseBaseUrl || !values.discourseUserName || !values.discourseAPIKey
                     ? 'opacity-50 cursor-not-allowed '
                     : ''
                 } border-none h-2.81`}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
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
        isOpen={isModalOpen.slack || isModalOpen.reddit || isModalOpen.discord || isModalOpen.github || isModalOpen.twitter || isModalOpen.salesforce}
        isClose={handleModalClose}
        iconSrc={
          isModalOpen.slack
            ? slackIcon
            : isModalOpen.reddit
            ? redditLogoIcon
            : isModalOpen.discord
            ? discordIcon
            : isModalOpen.github
            ? githubLogoIcon
            : isModalOpen.discourse
            ? discourseIcon
            : isModalOpen.salesforce
            ? salesForceIcon
            : isModalOpen.twitter
            ? twitterIcon
            : ''
        }
        contextText={
          isModalOpen.slack
            ? 'Slack'
            : isModalOpen.reddit
            ? 'Reddit'
            : isModalOpen.discord
            ? 'Discord'
            : isModalOpen.github
            ? 'Github'
            : isModalOpen.twitter
            ? 'Twitter'
            : isModalOpen.salesforce
            ? 'Salesforce'
            : ''
        }
      />
      <ModalDrawer
        isOpen={Object.values(showAlert).includes(true) ? true : false}
        isClose={handleModalClose}
        loader={reconnectLoading}
        onSubmit={handleOnSubmit}
        iconSrc={
          showAlert.slack
            ? slackIcon
            : showAlert.reddit
            ? redditLogoIcon
            : showAlert.discord
            ? discordIcon
            : showAlert.vanilla
            ? vanillaIcon
            : showAlert.discourse
            ? discourseIcon
            : showAlert.twitter
            ? twitterIcon
            : showAlert.salesforce
            ? salesForceIcon
            : ''
        }
        contextText={`Are you sure you want to reconnect ${
          showAlert.slack
            ? 'Slack'
            : showAlert.discord
            ? 'Discord'
            : showAlert.reddit
            ? 'Reddit'
            : showAlert.github
            ? 'Github'
            : showAlert.discourse
            ? 'Discourse'
            : showAlert.twitter
            ? 'Twitter'
            : showAlert.salesforce
            ? 'Salesforce'
            : ''
        }  to your workspace?`}
      />
    </TabPanel>
  );
};

export default Integration;

const vanillaDataSchema = Yup.object().shape({
  vanillaBaseUrl: Yup.string().required('Site URL is required').trim(),
  vanillaAccessToken: Yup.string().required('Access Token is required').trim()
});

const discourseDataSchema = Yup.object().shape({
  discourseBaseUrl: Yup.string().required('Site URL is required').trim(),
  discourseUserName: Yup.string().required('Username is required').trim(),
  discourseAPIKey: Yup.string().required('API Key is required').trim()
});
