import { useEffect, useState } from 'react';
import { NavigateFunction, useLocation, useNavigate } from 'react-router';

import Button from 'common/button';
import { GithubConnectResponseData, GithubRepositories } from 'interface/interface';
import { showErrorToast, showSuccessToast, showWarningToast } from '../../../../common/toast/toastFunctions';
import { NetworkResponse } from '../../../../lib/api';
import { API_ENDPOINT } from '../../../../lib/config';

import { getLocalWorkspaceId } from '../../../../lib/helper';
import { request } from '../../../../lib/request';

import dropdownIcon from '../../../../assets/images/filter-dropdown.svg';
import githubIcon from '../../../../assets/images/github_logo.png';

const GithubIntegration: React.FC = () => {
  const [isRepositoryActive, setIsRepositoryActive] = useState<boolean>(false);
  const [repository, setRepository] = useState<string>('');
  const [repositoryDetails, setRepositoryDetails] = useState<GithubRepositories[]>([]);
  const [selectedRepositoryDetails, setSelectedRepositoryDetails] = useState<GithubRepositories>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate: NavigateFunction = useNavigate();
  const location: Location | any = useLocation();
  const workspaceId: string = getLocalWorkspaceId();

  interface CompleteSetupBody {
    workspacePlatformAuthSettingsId: string | null;
    workspaceId: string;
    repositoryName: string;
    repositoryId: string;
  }

  const connectResponse: GithubConnectResponseData = location?.state?.githubConnectResponse;

  useEffect(() => {
    if (connectResponse?.filteredRepository?.length) {
      setRepositoryDetails(connectResponse?.filteredRepository);
    } else {
      showWarningToast('No Repositories to Select');
    }
  }, [connectResponse]);

  const selectRepository = (RepositoryName: string) => {
    setRepository(RepositoryName);
    const selectedRepositoryData: GithubRepositories | undefined = repositoryDetails?.find(
      (data: GithubRepositories) => data?.repoName === RepositoryName
    );
    if (selectedRepositoryData) {
      setSelectedRepositoryDetails(selectedRepositoryData);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const githubCompleteSetup = async () => {
    setIsLoading(true);
    try {
      const body: CompleteSetupBody = {
        workspaceId,
        workspacePlatformAuthSettingsId: connectResponse?.id,
        repositoryName: repository,
        repositoryId: selectedRepositoryDetails ? (selectedRepositoryDetails?.repoId as string) : ''
      };
      showSuccessToast('Integration in progress...');
      const response: NetworkResponse<string> = await request.post(`${API_ENDPOINT}/v1/github/complete-setup`, body);
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
          <img src={githubIcon} alt="" className="w-[2.6494rem] h-[2.6494rem]" />
        </div>
        <div className="font-Inter font-bold text-signIn leading-7 text-neutralBlack pt-3">Manage Github Integration</div>
        <div className="settings-card px-7 py-10 mt-6 box-border border-table rounded-0.9 shadow-paymentSubscriptionCard">
          <div className="flex flex-col pb-5">
            <div className="flex justify-end font-Poppins font-semibold text-base text-slimGray leading-6">Github</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Status</div>
            <div className="font-Poppins font-semibold text-slackStatus text-base leading-6">Connected</div>
          </div>
          <div className="flex justify-between py-5 border-top-card">
            <div className="font-Poppins font-semibold text-base text-manageTitle leading-6">Repository</div>
            <div className="font-Poppins font-semibold text-base text-slimGray leading-6 capitalize"> {repository ? repository : 'Not Selected'}</div>
          </div>
        </div>

        <div className="py-6">
          <div className="mt-5 flex flex-col w-80" onClick={() => setIsRepositoryActive(!isRepositoryActive)}>
            <label htmlFor="name" className="text-base font-Poppins text-infoBlack font-medium leading-1.31">
              Select Repository
            </label>
            <div className="relative w-20.5 2xl:w-full h-3.06 app-result-card-border flex items-center px-3 mt-2 shadow-ChannelInput rounded-0.3 font-Poppins font-normal text-trial text-thinGray leading-1.31 cursor-pointer ">
              {repository ? repository : 'Select'}
              <div className="absolute right-4">
                <img src={dropdownIcon} alt="" className={isRepositoryActive ? 'rotate-0' : 'rotate-180'} />
              </div>
            </div>
            {isRepositoryActive && (
              <div className="flex flex-col app-result-card-border box-border w-20.5 rounded-0.3 shadow-reportInput z-10 cursor-pointer bg-white min-h-[50px] max-h-60 overflow-auto">
                {repositoryDetails.map((options: GithubRepositories) => (
                  <ul
                    className="cursor-pointer hover:bg-signUpDomain  transition ease-in duration-100 "
                    onClick={() => {
                      selectRepository(options?.repoName);
                    }}
                    key={`${options?.repoId + Math.random()}`}
                  >
                    <li value={repository} className="text-searchBlack font-Poppins font-normal leading-1.31 text-trial p-3 capitalize">
                      {options?.repoName}
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* <div className="pt-8 font-Poppins font-semibold text-action text-infoBlack left-8">Actions</div>
        <div className="pt-[0.4375rem] font-Poppins font-semibold text-search left-5 max-w-[904px]">
          Remove{' '}
          <span className="font-normal">
            the reddit integration from this comunify workspace. See the docs on how to uninstall the reddit integration from a particular channel.
          </span>
        </div> */}
        <div className="flex justify-end pt-4">
          <Button
            text="Complete Setup"
            type="submit"
            disabled={isLoading ? true : false}
            onClick={() => {
              if (!repository) {
                showErrorToast('Please select a repository');
              } else {
                githubCompleteSetup();
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

export default GithubIntegration;
