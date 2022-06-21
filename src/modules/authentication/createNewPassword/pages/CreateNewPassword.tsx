/* eslint-disable react/no-unescaped-entities */
import React, { useState } from "react";
import bgSignInImage from "../../../../assets/images/bg-sign.svg";
import eyeIcon from "../../../../assets/images/eye.svg";
import closeeye from '../../../../assets/images/closeeye.png';

import Input from "common/input";
import Button from "common/button";
const CreateNewPassword = () => {
  const [passwordType1, setPasswordType1] = useState("password");
  const [passwordType2, setPasswordType2] = useState("password");

  const togglePassword1 = () => {
    if (passwordType1 === "password") {
      setPasswordType1("text");
      return;
    }
    setPasswordType1("password");
  };

  const togglePassword2 = () => {
    if (passwordType2 === "password") {
      setPasswordType2("text");
      return;
    }
    setPasswordType2("password");
  };
  return (
    <div className="w-full flex flex-col  ">
      <div className="flex w-full relative">
        <div className="w-1/2 password-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed">
          <img src={bgSignInImage} alt="" />
        </div>
        <div className="w-1/2 flex pl-7.5 mt-13.1 flex-col  overflow-y-auto no-scroll-bar absolute right-0 pb-[60px]">
          <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">
            Forgot Password
          </h1>
          <p className="mt-0.78 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
            Enter your new password.
          </p>
          <form className="w-25.9 mt-1.9 " autoComplete="off">
            <div className="password  relative">
              <Input
                type={passwordType1}
                placeholder="New Password"
                label="New Password"
                id="password1"
                name="password1"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
              <div onClick={togglePassword1} className="m-0 p-0">
                {passwordType1 === "password" ? (
                  <img
                    className="absolute icon-holder left-96 cursor-pointer "
                    src={eyeIcon}
                    alt=""
                  />
                ) : (
                  <img
                    className="absolute icon-holder left-96 cursor-pointer "
                    src={closeeye}
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="password relative mt-1.258">
              <Input
                type={passwordType2}
                placeholder="Confirm Password"
                label="Confirm Password"
                id="password2"
                name="password2"
                className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
              />
              <div onClick={togglePassword2} className="m-0 p-0">
                {passwordType2 === "password" ? (
                  <img
                    className="absolute icon-holder left-96 cursor-pointer "
                    src={eyeIcon}
                    alt=""
                  />
                ) : (
                  <img
                    className="absolute icon-holder left-96 cursor-pointer "
                    src={closeeye}
                    alt=""
                  />
                )}
              </div>
            </div>
            <div className="pb-10">
              <Button
                text="Submit"
                type="submit"
                className="font-Poppins rounded-lg text-base text-white mt-1.8 h-3.6  w-full hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
              />
            </div>
          </form>
        </div>
      </div>
      <div className="py-1.9"></div>
      <div className="footer"></div>
    </div>
  );
};
export default CreateNewPassword;
