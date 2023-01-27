/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import * as Yup from 'yup';
import Modal from 'react-modal';
import { Form, Formik } from 'formik';

import Input from 'common/input';
import Button from 'common/button';
import {
  NavigateToConnectPage,
  NavigateToDiscordConnectPage,
  NavigateToGithubConnectPage,
  NavigateToRedditConnectPage,
  NavigateToSalesForceConnectPage,
  NavigateToTwitterConnectPage
} from '../../../settings/services/settings.services';

import { PlatformsEnumType } from 'modules/settings/pages/integration/IntegrationDrawerTypes';
import { IntegrationModalDrawer } from 'modules/settings/pages/integration/IntegrationModalDrawer';

import {
  DiscordConnectResponse,
  DiscourseConnectResponse,
  GithubConnectResponseData,
  PlatformConnectResponse,
  RedditConnectResponseData
} from '../../../../interface/interface';
import {
  ConnectBody,
  DiscourseInitialValues,
  ModalState,
  PlatformIcons,
  PlatformResponse,
  VanillaForumsConnectData
} from '../../../settings/interface/settings.interface';

import { request } from '../../../../lib/request';
import { API_ENDPOINT } from '../../../../lib/config';
import usePlatform from '../../../../hooks/usePlatform';
import { getLocalWorkspaceId, setRefreshToken } from '@/lib/helper';
import { AxiosError, IntegrationResponse, NetworkResponse } from '../../../../lib/api';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';

import bgIntegrationImage from '../../../../assets/images/bg-sign.svg';
import discordIcon from '../../../../assets/images/discord.svg';
import nextIcon from '../../../../assets/images/next.svg';
import redditLogoIcon from '../../../../assets/images/reddit_logo.png';
import slackIcon from '../../../../assets/images/slack.svg';
import vanillaIcon from '../../../../assets/images/vanilla-forum.svg';
import githubIcon from '../../../../assets/images/github_logo.png';
import discourseIcon from '../../../../assets/images/discourse.png';
import twitterIcon from '../../../../assets/images/twitter.png';
import salesForceIcon from '../../../../assets/images/salesforce.png';

import settingsSlice from '../../../settings/store/slice/settings.slice';

import './Integration.css';
import useSkeletonLoading from '@/hooks/useSkeletonLoading';
import Skeleton from 'react-loading-skeleton';
import { width_70, width_90 } from 'constants/constants';

Modal.setAppElement('#root');

const vanillaInitialValues: Omit<VanillaForumsConnectData, 'workspaceId'> = {
  vanillaBaseUrl: '',
  vanillaAccessToken: ''
};

const discourseInitialValues: DiscourseInitialValues = {
  discourseBaseUrl: '',
  discourseAPIKey: '',
  discourseUserName: ''
};

const Integration: React.FC = () => {
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
  // eslint-disable-next-line no-unused-vars
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

  const dispatch = useDispatch();

  const { PlatformFilterResponse } = usePlatform();
  const PlatformIntegrationLoader = useSkeletonLoading(settingsSlice.actions.platformData.type);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const PlatformsConnected = JSON.parse(localStorage.getItem('platformsConnected')!);

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

    if (window.location.href.includes('state') && window.location.href.includes('code') && !window.location.href.includes('platform')) {
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
    if (error && Number(PlatformsConnected) > 0) {
      navigate(`/${workspaceId}/settings`);
    }
  }, [error]);

  const handleModals = (name: string, icon: string) => {
    switch (name) {
      case PlatformsEnumType.SLACK:
        setIsModalOpen((prevState) => ({ ...prevState, slack: true }));
        NavigateToConnectPage();
        setPlatformIcons((prevState) => ({ ...prevState, slack: icon }));
        break;
      case PlatformsEnumType.VANILLA:
        setPlatformIcons((prevState) => ({ ...prevState, vanillaForums: icon }));
        setIsModalOpen((prevState) => ({ ...prevState, vanilla: true }));
        break;
      case PlatformsEnumType.DISCORD:
        setIsModalOpen((prevState) => ({ ...prevState, discord: true }));
        NavigateToDiscordConnectPage();
        break;
      case PlatformsEnumType.REDDIT:
        setIsModalOpen((prevState) => ({ ...prevState, reddit: true }));
        NavigateToRedditConnectPage();
        setPlatformIcons((prevState) => ({ ...prevState, reddit: icon }));
        break;
      case PlatformsEnumType.GITHUB:
        setIsModalOpen((prevState) => ({ ...prevState, github: true }));
        NavigateToGithubConnectPage();
        setPlatformIcons((prevState) => ({ ...prevState, github: icon }));
        break;
      case PlatformsEnumType.DISCOURSE:
        setPlatformIcons((prevState) => ({ ...prevState, discourse: icon }));
        setIsModalOpen((prevState) => ({ ...prevState, discourse: true }));
        break;
      case PlatformsEnumType.TWITTER:
        setIsModalOpen((prevState) => ({ ...prevState, twitter: true }));
        NavigateToTwitterConnectPage();
        break;
      case PlatformsEnumType.SALESFORCE:
        setIsModalOpen((prevState) => ({ ...prevState, salesforce: true }));
        NavigateToSalesForceConnectPage();
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
            setIsLoading(false);
            setIsModalOpen((prevState) => ({ ...prevState, vanilla: false }));
            navigate(`/${workspaceId}/settings`);
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
    setIsLoading(true);
    const body: { domain: string; userName: string; apiKey: string; workspaceId: string } = {
      domain: values.discourseBaseUrl,
      userName: values.discourseUserName,
      apiKey: values.discourseAPIKey,
      workspaceId
    };
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
            navigate(`/${workspaceId}/settings`);
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
            navigate(`/${workspaceId}/settings`);
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
    if (isModalOpen.github) {
      setIsModalOpen((prevState) => ({ ...prevState, github: false }));
    }
    if (isModalOpen.twitter) {
      setIsModalOpen((prevState) => ({ ...prevState, twitter: false }));
    }
    if (isModalOpen.salesforce) {
      setIsModalOpen((prevState) => ({ ...prevState, salesForce: false }));
    }
  };

  const handleVanillaModal = (val: boolean) => {
    setIsModalOpen((prevState) => ({ ...prevState, vanilla: val }));
  };

  const connectedBtnClassName = `dark:bg-secondaryDark bg-connectButton shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81 rounded 
  h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient dark:bg-secondaryDark`;

  const disConnectedBtnClassName = `btn-disconnect-gradient shadow-contactCard font-Poppins text-white font-medium leading-5 text-error mt-0.81
   rounded h-8 w-6.56 cursor-pointer hover:shadow-buttonShadowHover transition ease-in 
   duration-300 dark:bg-secondaryDark dark:border dark:border-[#9B9B9B]`;

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">
        <div className="w-3/5 2xl:w-1/2 auth-layout-section flex items-center justify-center 3xl:justify-end pr-0 3xl:pr-16 h-[885px]">
          <div className="flex items-center justify-center">
            <img src={bgIntegrationImage} alt="" className="w-9/12 xl:w-[640px] 3xl:w-full object-cover" />
          </div>
        </div>
        <div className="flex justify-center w-1/2 3xl:items-center 3xl:justify-start  pl-0 3xl:pl-16">
          <div className="flex flex-col  no-scrollbar-firefox pt-[109.57px]">
            <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">Integrations </h3>{' '}
            <div className="flex flex-col gap-0.93 relative w-fit mt-1.8">
              <div className="grid grid-cols-3 gap-0.93">
                {!PlatformIntegrationLoader
                  ? PlatformFilterResponse?.map((data: PlatformResponse) => (
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
                          text={data.isConnected ? 'Disconnect' : 'Connect'}
                          className={data.isConnected ? disConnectedBtnClassName : connectedBtnClassName}
                          onClick={() => handleModals(data?.name.toLocaleLowerCase().trim(), data?.platformLogoUrl)}
                        />
                      </div>
                    ))
                  : Array.from({ length: 5 }, (_, i) => i + 1).map((type: number) => (
                      <div
                        key={type}
                        className="integration shadow-integrationCardShadow app-input-card-border border-integrationBorder w-8.5 h-11.68 rounded-0.6 box-border bg-white flex flex-col items-center justify-center"
                      >
                        <div className="flex items-center justify-center">
                          <Skeleton circle width={'4rem'} height={'4rem'} className="h-2.31 rounded-full w-[2.3125rem]" />
                        </div>
                        <div className="text-integrationGray leading-1.31 text-trial font-Poppins font-semibold mt-2">
                          <Skeleton width={width_70} />
                        </div>
                        <Skeleton width={width_90} />
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
              isOpen={isModalOpen.vanilla}
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
          </div>
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
            : isModalOpen?.github
            ? githubIcon
            : isModalOpen?.twitter
            ? twitterIcon
            : isModalOpen.discord
            ? discordIcon
            : isModalOpen.salesforce
            ? salesForceIcon
            : ''
        }
        contextText={
          isModalOpen.slack
            ? 'Slack'
            : isModalOpen.reddit
            ? 'Reddit'
            : isModalOpen.discord
            ? 'Discord'
            : isModalOpen.twitter
            ? 'Twitter'
            : isModalOpen.salesforce
            ? 'Salesforce'
            : ''
        }
      />
    </div>
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
