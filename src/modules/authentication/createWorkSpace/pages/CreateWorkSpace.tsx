import Input from "common/input/Input";
import Button from "common/button/Button";
import bgWorkSpaceImage from "../../../../assets/images/bg-sign.svg";
import "./CreateWorkSpace.css";


const CreateWorkSpace: React.FC = () => {
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
          >
            <div className="workspace">
              <Input
                type="text"
                placeholder="Enter the Workspace Name"
                label="Workspace"
                id="workspace"
                name="workspace"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter shadow-trialButtonShadow font-Inter box-border"
              />
            </div>
            <Button
              text="Confirm"
              type="submit"
              className="font-Poppins rounded-lg text-base text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
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
