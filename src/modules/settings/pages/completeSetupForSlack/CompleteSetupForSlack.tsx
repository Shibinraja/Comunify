/* eslint-disable space-before-function-paren */
import { getLocalWorkspaceId } from '@/lib/helper';
import React from 'react';
import { Location, useLocation, useNavigate } from 'react-router';
import Button from '../../../../common/button';
import { showErrorToast, showSuccessToast } from '../../../../common/toast/toastFunctions';
import { NetworkResponse } from '../../../../lib/api';
import { API_ENDPOINT } from '../../../../lib/config';
import { request } from '../../../../lib/request';
import step1Image from '../../../../assets/images/slack-step-1.svg';
import step2Image from '../../../../assets/images/slack-step-2.svg';
import step3Image from '../../../../assets/images/slack-step-3.svg';
import step4Image from '../../../../assets/images/slack-step-4.svg';
import step5Image from '../../../../assets/images/slack-step-5.svg';
import step6Image from '../../../../assets/images/slack-step-6.svg';
import step7Image from '../../../../assets/images/slack-step-7.svg';
import step8Image from '../../../../assets/images/slack-step-8.svg';
import step9Image from '../../../../assets/images/slack-step-9.svg';

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
        workspacePlatformSettingsId: location?.state?.workspacePlatformSettingId || localStorage.getItem('workspacePlatformSettingId')
      };
      showSuccessToast('Integration in progress...');
      const response: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/slack/complete-setup`, body);
      if (response) {
        showSuccessToast('Successfully integrated');
        navigate(`/${workspaceId}/settings`);
      } else {
        showErrorToast('Integration failed');
      }
    } catch {
      showErrorToast('Integration Failed');
    }
  };
  return (
    <div className="completeSetup pt-[4.5625rem]">
      <div className="flex flex-col">
        <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-8">Let’s get Integrated</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4 max-w-[39.9375rem]">
          To start creating activities and members, please add Comunify to the slack channels you want to monitor in Comunify.
        </p>
        <h3 className="font-Poppins font-semibold text-base leading-6 text-slimGray pt-5">Instructions on:</h3>
        <h3 className="font-Poppins font-semibold text-base leading-6 text-infoBlack pt-4">
          How to connect your community’s slack activity to Comunify.
        </h3>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 1</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">
          Open up slack, and click on the channel you want Comunify to connect with.
        </p>
        <div className="pt-4">
          <img src={step1Image} alt="" className="w-[24.8125rem] h-[2.5625rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 2</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">Click on the channel name in the top left corner</p>
        <div className="pt-4">
          <img src={step2Image} alt="" className="w-[23.25rem] h-16" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 3</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">Click on the “Integration” tab.</p>
        <div className="pt-4">
          <img src={step3Image} alt="" className="w-[25.125rem] h-[21.375rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 4</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">Click on the “Add”an “App”</p>
        <div className="pt-4">
          <img src={step4Image} alt="" className="w-[31.875rem] h-[25.3125rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 5</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">Click “Add” next to comunify.</p>
        <div className="pt-4">
          <img src={step5Image} alt="" className="w-[34.125rem] h-[26.9375rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 6</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4 max-w-[40.75rem]">
          You will now see the comunify logo in the channel thread. To add Comunify to more slack channels, click on the comunify logo.
        </p>
        <div className="pt-4">
          <img src={step6Image} alt="" className="w-[30.5rem] h-[22.625rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 7</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">
          After clicking the logo, you will see a pop-up like the one below. Click on “Add this app to a channel...”
        </p>
        <div className="pt-4">
          <img src={step7Image} alt="" className="w-[20.3125rem] h-[18.0625rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 8</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">Click the “Select a channel” dropdown.</p>
        <div className="pt-4">
          <img src={step8Image} alt="" className="w-[25.1875rem] h-[10.875rem]" />
        </div>
      </div>
      <div className="flex flex-col pt-10">
        <h3 className="font-Poppins font-semibold text-sm leading-6 text-slimGray">Step 9</h3>
        <p className="font-Poppins font-normal text-error leading-5 pt-4">Select the channel you’d like to add.</p>
        <div className="pt-4">
          <img src={step9Image} alt="" className="w-[24.875rem] h-[11.75rem]" />
        </div>
        <h3 className="pt-10 font-Poppins font-semibold text-base text-infoBlack leading-6">
          Repeat steps 6-9 until you have all of the desired Slack channels added.
        </h3>
      </div>
      <div className="flex justify-end pb-10">
        <Button
          text="Complete Setup"
          type="submit"
          onClick={sendCredentialsToSlack}
          className="font-Poppins mt-6 rounded-lg text-error font-medium leading-5 text-white transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient h-2.81 w-[158px]"
        />
      </div>
    </div>
  );
};

export default CompleteSetup;
