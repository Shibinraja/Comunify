/* eslint-disable space-before-function-paren */
import Button from 'common/button';
import { useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';
import discordIcon from '../../../../assets/images/discord.svg';
import dropdownIcon from '../../../../assets/images/filter-dropdown.svg';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { DiscordChannel, DiscordConnectResponse } from '../../../../interface/interface';
import { NetworkResponse } from '../../../../lib/api';
import { API_ENDPOINT } from '../../../../lib/config';
import { getLocalWorkspaceId } from '../../../../lib/helper';
import { request } from '../../../../lib/request';

const DiscordIntegrationDetails: React.FC = () => {
  const [isChannelActive, setIsChannelActive] = useState<boolean>(false);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [channelDetails, setChannelDetails] = useState<ChannelDetails[]>([]);
  const [selectedChannelDetails, setSelectedChannelDetails] = useState<ChannelDetails>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const location: Location | any = useLocation();
  const workspaceId: string = getLocalWorkspaceId();

  interface ChannelDetails {
    channelName: string;
    channelId: string;
  }
  interface CompleteSetupBody {
    workspacePlatformAuthSettingsId: string | null;
    workspaceId: string;
    channelName: string;
    channelId: string;
  }

  const connectResponse: DiscordConnectResponse = location?.state?.discordConnectResponse;

  const channelDataArray: ChannelDetails[] = connectResponse?.channels?.map((data: DiscordChannel) => ({
    channelName: data?.name,
    channelId: data?.id
  }));

  useEffect(() => {
    if (!channelDetails.length) {
      setChannelDetails(channelDataArray);
    }
  }, [channelDataArray]);

  const selectChannel = (channel: string) => {
    setSelectedChannel(channel);
    const selectedChannelData: ChannelDetails | undefined = channelDetails?.find((data: ChannelDetails) => data?.channelName === channel);
    if (selectedChannelData) {
      setSelectedChannelDetails(selectedChannelData);
    }
  };

  const navigateToSettingsPage = (): void => {
    navigate({ pathname: '' });
    navigate(`/${workspaceId}/settings`);
  };

  // eslint-disable-next-line space-before-function-paren
  const discordCompleteSetup = async () => {
    setIsLoading(true);
    try {
      const body: CompleteSetupBody = {
        workspaceId,
        workspacePlatformAuthSettingsId: connectResponse?.id,
        channelName: selectedChannel,
        channelId: selectedChannelDetails ? selectedChannelDetails?.channelId : ''
      };
      const response: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/discord/complete-setup`, body);
      if (response?.data?.message) {
        showSuccessToast('Successfully integrated');
        setIsLoading(false);
        navigate(`/${workspaceId}/settings`);
      } else {
        showErrorToast('Integration failed');
        setIsLoading(false);
      }
    } catch {
      showErrorToast('Integration Failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <div className="flex flex-col w-full">
        <div>
          <img src={discordIcon} alt="" className="w-[2.6494rem] h-[2.6494rem]" />
        </div>
        <div className="font-Inter font-bold text-signIn leading-7 text-neutralBlack pt-3">Manage Discord Integration</div>
        <div className="font-Inter font-normal text-signIn text-workSpace">{connectResponse?.guildName}</div>
        <div className="settings-card px-7 py-10 mt-6 box-border border-table rounded-0.9 shadow-paymentSubscriptionCard">
          <div className="flex flex-col pb-5">
            <div className="flex justify-end font-Poppins font-semibold text-base text-slimGray leading-6">Discord</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Discord workspace</div>
            <div className="font-Poppins font-semibold text-tag text-base leading-6">{connectResponse?.guildName}</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Status</div>
            <div className="font-Poppins font-semibold text-slackStatus text-base leading-6">Connected</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Channel</div>
            <div className="font-Poppins font-semibold text-base text-slimGray leading-6 capitalize">
              {' '}
              {selectedChannel ? selectedChannel : 'Not Selected'}
            </div>
          </div>
          {/* <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Last Activity Retrieved</div>
            <div className="font-Poppins font-semibold text-base text-slimGray leading-6 ">August 15, 2022 4:18 pm</div>
          </div> */}
        </div>

        <div className="py-6">
          <div className="mt-5 flex flex-col w-80" onClick={() => setIsChannelActive(!isChannelActive)}>
            <label htmlFor="name" className="text-base font-Poppins text-infoBlack font-medium leading-1.31">
              Select Channel
            </label>
            <div className="relative w-20.5 2xl:w-full h-3.06 app-result-card-border flex items-center px-3 mt-2 shadow-ChannelInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 cursor-pointer ">
              {selectedChannel ? selectedChannel : 'Select'}
              <div className="absolute right-4">
                <img src={dropdownIcon} alt="" className={isChannelActive ? 'rotate-0' : 'rotate-180'} />
              </div>
              {isChannelActive && (
                <div className="flex flex-col app-result-card-border box-border w-[320px] right-0 top-[3.15rem] rounded-0.3 shadow-ChannelInput cursor-pointer absolute  bg-white min-h-[50px] max-h-60 overflow-auto">
                  {channelDetails?.map((options: ChannelDetails) => (
                    <ul
                      className="cursor-pointer hover:bg-signUpDomain  transition ease-in duration-100 "
                      onClick={() => {
                        selectChannel(options?.channelName);
                      }}
                      key={`${options?.channelId + Math.random()}`}
                    >
                      <li value={selectedChannel} className="text-searchBlack font-Poppins font-normal leading-1.31 text-trial p-3 capitalize">
                        {options?.channelName}
                      </li>
                    </ul>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <div className="pt-8 font-Poppins font-semibold text-action text-infoBlack left-8">Actions</div>
        <div className="pt-[0.4375rem] font-Poppins font-semibold text-search left-5 max-w-[904px]">
          Remove{' '}
          <span className="font-normal">
            the discord integration from this comunify workspace. See the docs on how to uninstall the discord integration from a particular channel.
          </span>
        </div> */}
        <div className="flex justify-end pt-4">
          <Button
            text="Cancel"
            type="submit"
            className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  w-5.25 h-2.81  rounded border-none"
            onClick={() => navigateToSettingsPage()}
          />
          <Button
            text="Complete Setup"
            type="submit"
            disabled={isLoading ? true : false}
            onClick={() => {
              if (!selectedChannel) {
                showErrorToast('Please select a channel');
              } else {
                discordCompleteSetup();
              }
            }}
            className={`text-white font-Poppins text-error font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } leading-5 btn-save-modal rounded shadow-contactBtn py-3 px-4 border-none h-2.81`}
          />
        </div>
      </div>
    </div>
  );
};

export default DiscordIntegrationDetails;
