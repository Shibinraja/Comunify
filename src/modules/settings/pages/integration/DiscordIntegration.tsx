import Button from 'common/button';
import { useState } from 'react';
import discordIcon from '../../../../assets/images/discord.svg';
import dropdownIcon from '../../../../assets/images/filter-dropdown.svg';

const DiscordIntegrationDetails = () => {
  const [isChannelActive, setIsChannelActive] = useState(false);
  const options = ['neoit bot', 'neoito test', 'neoito check'];
  const [selectedChannel, setselectedChannel] = useState('');

  return (
    <div className="pt-20">
      <div className="flex flex-col w-full">
        <div>
          <img src={discordIcon} alt="" className="w-[2.6494rem] h-[2.6494rem]" />
        </div>
        <div className="font-Inter font-bold text-signIn leading-7 text-neutralBlack pt-3">Manage Discord Integration</div>
        <div className="font-Inter font-normal text-signIn text-workSpace">“Workspace name”</div>
        <div className="settings-card px-7 py-10 mt-6 box-border border-table rounded-0.9 shadow-paymentSubscriptionCard">
          <div className="flex flex-col pb-5">
            <div className="flex justify-end font-Poppins font-semibold text-base text-slimGray leading-6">Discord</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Discord workspace</div>
            <div className="font-Poppins font-semibold text-tag text-base leading-6">@workspace name</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Status</div>
            <div className="font-Poppins font-semibold text-slackStatus text-base leading-6">Connected</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Community</div>
            <div className="font-Poppins font-semibold text-base text-slimGray leading-6 capitalize">
              {' '}
              {selectedChannel ? selectedChannel : 'Not Seleted'}
            </div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Last Activity Retrieved</div>
            <div className="font-Poppins font-semibold text-base text-slimGray leading-6 ">August 15, 2022 4:18 pm</div>
          </div>
        </div>

        <div className="py-6">
          <div className="mt-5 flex flex-col pl-5 " onClick={() => setIsChannelActive(!isChannelActive)}>
            <label htmlFor="name" className="text-base font-Poppins text-infoBlack font-medium leading-1.31">
              Select Channel
            </label>
            <div className="relative w-20.5 2xl:w-full h-3.06 app-result-card-border flex items-center px-3 mt-0.375 shadow-ChannelInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 cursor-pointer ">
              {selectedChannel ? selectedChannel : 'Select'}
              <div className="absolute right-4">
                <img src={dropdownIcon} alt="" className={isChannelActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isChannelActive && (
              <div className="flex flex-col app-result-card-border box-border w-20.5 rounded-0.3 shadow-ChannelInput cursor-pointer absolute -bottom-[2.6rem] bg-white">
                {options.map((options) => (
                  <ul
                    className="cursor-pointer hover:bg-signUpDomain  transition ease-in duration-100 "
                    onClick={() => {
                      setselectedChannel(options);
                    }}
                    key={options.toString()}
                  >
                    <li value={selectedChannel} className="text-searchBlack font-Poppins font-normal leading-1.31 text-trial p-3 capitalize">
                      {options}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 font-Poppins font-semibold text-action text-infoBlack left-8">Actions</div>
        <div className="pt-[0.4375rem] font-Poppins font-semibold text-search left-5 max-w-[904px]">
          Remove{' '}
          <span className="font-normal">
            the discord integration from this comunify workspace. See the docs on how to uninstall the discord integration from a particular channel.
          </span>
        </div>
        <div className="flex justify-end pt-4">
          <Button
            text="Back to Integrations"
            type="submit"
            className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-[181.83px]  rounded border-none"
          />
          <Button
            text="Remove"
            type="submit"
            className="text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded shadow-contactBtn w-[123px] border-none h-2.81"
          />
        </div>
      </div>
    </div>
  );
};

export default DiscordIntegrationDetails;
