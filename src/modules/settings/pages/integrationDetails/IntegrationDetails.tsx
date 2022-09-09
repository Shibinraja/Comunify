import Button from 'common/button';
import slackIcon from '../../../../assets/images/slack.svg';

const IntegrationDetails = () => (
  <div className="pt-20">
    <div className="flex flex-col w-full">
      <div>
        <img src={slackIcon} alt="" className="w-[2.6494rem] h-[2.6494rem]" />
      </div>
      <div className="font-Inter font-bold text-signIn leading-7 text-neutralBlack pt-3">Manage Slack Integration</div>
      <div className="font-Inter font-normal text-signIn text-workSpace">“Workspace name”</div>
      <div className="settings-card px-7 py-10 mt-6 box-border border-table rounded-0.9 shadow-paymentSubscriptionCard">
        <div className="flex flex-col pb-5">
          <div className="flex justify-end font-Poppins font-semibold text-base text-slimGray leading-6">Slack</div>
        </div>
        <div className="flex justify-between py-5 border-top-card">
          <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Slack workspace</div>
          <div className="font-Poppins font-semibold text-tag text-base leading-6">@workspace name</div>
        </div>
        <div className="flex justify-between py-5 border-top-card">
          <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Status</div>
          <div className="font-Poppins font-semibold text-slackStatus text-base leading-6">Connected</div>
        </div>
        <div className="flex justify-between py-5 border-top-card">
          <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Community</div>
          <div className="font-Poppins font-semibold text-base text-slimGray leading-6">#Channel 1 and #general</div>
        </div>
        <div className="flex justify-between py-5 border-top-card">
          <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Last Activity Retrieved</div>
          <div className="font-Poppins font-semibold text-base text-slimGray leading-6">August 15, 2022 4:18 pm</div>
        </div>
      </div>

      <div className="pt-8 font-Poppins font-semibold text-action text-infoBlack left-8">Actions</div>
      <div className="pt-[0.4375rem] font-Poppins font-semibold text-search left-5 max-w-[904px]">
        Remove{' '}
        <span className="font-normal">
          the slack integration from this comunify workspace. See the docs on how to uninstall the slack integration from a particular channel.
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

export default IntegrationDetails;
