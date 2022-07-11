import Input from "common/input/Input";
import Button from "common/button/Button";
import bgWorkSpaceImage from "../../../../assets/images/bg-sign.svg";
import "./CreateWorkSpace.css";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { AppDispatch } from '../../../../store/index';
import React, { useEffect, useState } from 'react';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import * as Yup from "yup";


const CreateWorkSpace: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { workspaceData } = useAppSelector((state) => state.auth);

  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [errorMessage , setErrorMessage] = useState<string | unknown>("")

  const workspaceNameValidation = Yup.string().min(7,'Workspace Name must be atleast 4 characters')


  useEffect(()=>{
    dispatch(authSlice.actions.getWorkspace())
  },[])

  const handleWorkspaceName = (e:React.ChangeEvent<HTMLInputElement>):void => {
    const workspace_name = e.target.value;
    setWorkspaceName(workspace_name)
    try{
      workspaceNameValidation.validateSync(workspace_name)
      setErrorMessage("")
    }
    catch({message}){
      setErrorMessage(message)
    }
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>):void => {
    e.preventDefault();
    dispatch(authSlice.actions.createWorkspace({workspaceName}))
  }
  
  return (
    <div className="w-full flex flex-col">
      <div className="flex w-full relative">
        <div className="w-full md:w-1/2 workspace-cover-bg bg-no-repeat pt-20 bg-left rounded-lg  bg-thinBlue flex items-center justify-center fixed pb-80">
          <img src={bgWorkSpaceImage} alt="signup-image" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col pl-7.53 mt-6.84  overflow-y-auto no-scroll-bar absolute right-0">
          {" "}
          <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">
            Create Workspace{" "}
          </h3>{" "}
          <form
            className="flex flex-col pb-10 mt-1.8 w-25.9 "
            autoComplete="off"
            onSubmit={(e) => {handleSubmit(e)}}
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
              disabled={Boolean(workspaceData?.length !== 0 ) || Boolean(errorMessage) || !Boolean(workspaceName)}
              text="Confirm"
              type="submit"
              className="font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
            />
          </form>
        </div>
      </div>
      <div className="py-1.9"></div>
      <div className="footer"></div>
    </div>
  );
};

export default CreateWorkSpace;
