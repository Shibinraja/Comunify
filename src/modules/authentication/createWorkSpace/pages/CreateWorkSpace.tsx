import { useAppDispatch } from '@/hooks/useRedux';
import Button from 'common/button/Button';
import Input from 'common/input/Input';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import React, { useState } from 'react';
import * as Yup from 'yup';
import bgWorkSpaceImage from '../../../../assets/images/bg-sign.svg';
import { AppDispatch } from '../../../../store/index';
import './CreateWorkSpace.css';

const CreateWorkSpace: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();

  const [workspaceName, setWorkspaceName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | unknown>('');
  const workspaceNameValidation = Yup.string().min(4, 'Workspace Name must be atleast 4 characters');

  const handleWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const workspace_name = e.target.value;
    setWorkspaceName(workspace_name);
    try {
      workspaceNameValidation.validateSync(workspace_name);
      setErrorMessage('');
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage) {
      //
    } else {
      dispatch(authSlice.actions.createWorkspace({ workspaceName }));
    }
  };

  return (
    <div className="create-workspace">
      <div className="auth-layout-workspace">
        <div className="flex w-full height-calc container mx-auto">
          <div className="w-1/2 rounded-r-lg flex items-center justify-center p-28 bg-left overflow-hidden">
            <img src={bgWorkSpaceImage} alt="" className="object-cover" />
          </div>
          <div className="flex justify-center items-center  w-1/2 ">
            <div className="flex flex-col overflow-scroll">
              {' '}
              <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">Create Workspace </h3>{' '}
              <form
                className="flex flex-col pb-10 mt-1.8 w-25.9 "
                autoComplete="off"
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <div className="workspace">
                  <Input
                    type="text"
                    placeholder="Enter the Workspace Name"
                    label="Workspace"
                    id="workspaceName"
                    name="workspaceName"
                    value={workspaceName}
                    errors={Boolean(errorMessage)}
                    helperText={errorMessage}
                    className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter shadow-trialButtonShadow font-Inter box-border"
                    onChange={handleWorkspaceName}
                  />
                </div>
                <Button
                  text="Confirm"
                  type="submit"
                  className="font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkSpace;
