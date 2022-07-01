import Input from "common/input/Input";
import Button from "common/button/Button";
import eyeIcon from "../../../../assets/images/eye.svg";
import closeEyeIcon from "../../../../assets/images/closeeye.png";
import socialLogo from "../../../../assets/images/Social.svg";
import bgSignUpImage from "../../../../assets/images/bg-sign.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignUp: React.FC = () => {
  const [passwordType, setPasswordType] = useState("password");
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  return (
    <div className="w-full flex flex-col  h-screen ">
      <div className="flex w-full relative">
        <div className="w-full md:w-1/2 signup-cover-bg bg-no-repeat pt-20 bg-left rounded-lg  bg-thinBlue flex items-center justify-center fixed pb-80">
          <img src={bgSignUpImage} alt="signup-image" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col lg:pl-48  overflow-y-auto no-scroll-bar absolute right-0 pb-20">
          {" "}
          <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">
            Sign up{" "}
          </h3>{" "}
          <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
            Get Comunified with your communities. Create your account now.
          </p>
          <form
            className="flex flex-col pb-10 mt-1.8 w-25.9 "
            autoComplete="off"
          >
            <div className="username">
              <Input
                type="text"
                placeholder="User Name"
                label="Username"
                id="username"
                name="username"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
            </div>
            <div className="email mt-1.258">
              <Input
                type="email"
                placeholder="Email"
                label="Email"
                id="email"
                name="email"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
              <p className="text-lightRed font-normal text-error font-Inter mt-0.287 hidden">
                Invalid email id
              </p>
            </div>
            <div className="flex items-center relative password mt-1.258 w-25.9">
              <Input
                type={passwordType}
                placeholder="Create Password"
                label="Password"
                id="password"
                name="password"
                className="h-4.5 w-25.9   rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
              <div className="absolute  right-5" onClick={togglePassword}>
              {passwordType === "password" ? (
                  <img
                    className="cursor-pointer "
                    src={eyeIcon}
                    alt=""
                  />
                ) : (
                  <img
                    className="cursor-pointer "
                    src={closeEyeIcon}
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="cname mt-1.258">
              <Input
                type="text"
                placeholder="Company Name"
                label="Company Name"
                id="cname"
                name="companyName"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
            </div>
            <div className="domain mt-1.258">
              <Input
                type="text"
                placeholder="Domain"
                label="Domain"
                id="domain"
                name="domain"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
            </div>
            <Button
              text="Sign Up"
              type="submit"
              className="font-Poppins rounded-lg text-base text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
            />
            <div className="relative flex items-center pt-2.4">
              <div className="borders flex-grow border-t"></div>
              <span className="font-Inter text-secondaryGray mx-6 flex-shrink">
                or
              </span>
              <div className="borders flex-grow border-t"></div>
            </div>
            <div className="google-signin h-3.3 mt-2.47 font-Inter text-lightBlue box-border flex text-desc  cursor-pointer items-center justify-center rounded-lg font-normal leading-2.8">
              <img src={socialLogo} alt="" className="pr-0.781" />
              Continue with Google
            </div>
            <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-1.8  text-signLink">
              Already have an account?{" "}
              <Link to="/" className="text-blue-500 underline">
                {" "}
                Let’s Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="py-1.9"></div>
      <div className="footer"></div>
    </div>
  );
};

export default SignUp;
