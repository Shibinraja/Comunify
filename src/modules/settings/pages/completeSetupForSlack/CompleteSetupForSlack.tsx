/* eslint-disable space-before-function-paren */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import { getLocalWorkspaceId } from '@/lib/helper';
import React from 'react';
import { Location, useLocation, useNavigate } from 'react-router';
import Button from '../../../../common/button';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { API_ENDPOINT } from '../../../../lib/config';
import { request } from '../../../../lib/request';

const CompleteSetup: React.FC = () => {
  interface Body {
    workspaceId: string;
    workspacePlatformSettingsId: string | null;
  }
  const navigate = useNavigate();
  const location: Location | any = useLocation();
  const workspaceId = getLocalWorkspaceId();

  const sendCredentialsToSlack = async () => {
    try {
      const body: Body = {
        workspaceId,
        workspacePlatformSettingsId: location?.state?.workspacePlatformSettingId
      };
      showSuccessToast('Integration in progress...');
      const response = await request.post(`${API_ENDPOINT}/v1/slack/complete-setup`, body);
      if (response) {
        showSuccessToast('Successfully integrated');
        navigate('/settings');
      } else {
        showErrorToast('Integration failed');
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="font-Poppins">
      <div className="w-full m-auto p-5 mt-7 flex flex-col items-center justify-evenly">
        <p className="font-medium text-3xl">How to connect your community’s Slack activity to Comunify</p>
        <div className="mt-8 max-h-[50vh] overflow-y-auto member-section py-4 px-3">
          <div className="my-5">
            <h3 className="font-normal text-md">Step 1:</h3>
            <p className="text-gray-500 text-lg">Open up Slack, and click on the channel you want Comunify to connect with.</p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 2:</h3>
            <p className="text-gray-500 text-lg">Click on the channel name in the top left corner</p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 3:</h3>
            <p className="text-gray-500 text-lg">Click on the “Integrations” tab</p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 4:</h3>
            <p className="text-gray-500 text-lg">Click on the “Add an App”</p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 5:</h3>
            <p className="text-gray-500 text-lg">Click “Add” next to Comunify</p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 6:</h3>
            <p className="text-gray-500 text-lg">
              You will now see the Comunify logo in the channel thread. To add Comunify to more Slack channels, click on the Comunify logo.
            </p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text">Step 7:</h3>
            <p className="text-gray-500 text-lg">
              After clicking the logo, you will see a pop-up like the one below.
              <br />
              Click on “Add this app to a channel…”
            </p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 8:</h3>
            <p className="text-gray-500 text-lg">Click the “Select a channel” dropdown</p>
          </div>
          <div className="my-5">
            <h3 className="font-normal text-md">Step 9:</h3>
            <p className="text-gray-500 text-lg">Select the channel you would like to add</p>
          </div>
        </div>
        <div>
          <p className="font-medium text-2xl mt-8">Repeat steps 6 – 9 until you have all of the desired Slack channels added.</p>
          <p className="font-medium text-2xl mt-5">That’s it!</p>
        </div>

        <Button
          text="Complete Setup"
          type="submit"
          onClick={sendCredentialsToSlack}
          className="font-Poppins mt-6 rounded-lg text-base font-normal text-white transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient px-11 py-2"
        />
      </div>
    </div>
  );
};

export default CompleteSetup;
