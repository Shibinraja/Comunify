import { useAppDispatch } from '@/hooks/useRedux';
import Button from 'common/button/Button';
import Input from 'common/input/Input';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import bgWorkSpaceImage from '../../../../assets/images/bg-sign.svg';
import { setRefreshToken } from '../../../../lib/helper';
import { AppDispatch } from '../../../../store/index';
import './CreateWorkSpace.css';
import cookie from 'react-cookies';
import { DecodeToken } from '../../interface/auth.interface';
import { decodeToken } from '../../../../lib/decodeToken';
import { NavigateFunction, useNavigate } from 'react-router';

const CreateWorkSpace: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);
  const workspaceId = localStorage.getItem('workspaceId') !== null && localStorage.getItem('workspaceId');

  const [errorMessage, setErrorMessage] = useState<string | unknown>('');

  const workspaceNameRef: React.MutableRefObject<string> = useRef('');

  const workspaceNameValidation = Yup.string()
    .min(4, 'Workspace Name must be at least 4 characters')
    .max(15, 'Workspace Name cannot exceed 15 characters');

  useEffect(() => {
    setRefreshToken();
    if (decodedToken?.isWorkSpaceCreated) {
      navigate(`/${workspaceId}/dashboard`);
    }
  }, []);

  const handleWorkspaceName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    workspaceNameRef.current = e.target.value;
    try {
      workspaceNameValidation.validateSync(workspaceNameRef.current);
      setErrorMessage('');
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage) {
      return;
    }
    dispatch(authSlice.actions.createWorkspace({ workspaceName: workspaceNameRef.current }));
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
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
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
                    ref={workspaceNameRef}
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
