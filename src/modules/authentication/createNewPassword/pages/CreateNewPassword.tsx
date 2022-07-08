/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import bgSignInImage from '../../../../assets/images/bg-sign.svg';
import openEyeIcon from '../../../../assets/images/eye.svg';
import closeEyeIcon from '../../../../assets/images/closeEyeIcon.svg';

import Input from 'common/input';
import Button from 'common/button';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Password_regex } from "../../../../constants/constants";
import { passwordFormValues } from 'modules/authentication/interface/authentication.interface';



const CreateNewPassword = () => {
  const [passwordType1, setPasswordType1] = useState<string>('password');
  const [passwordType2, setPasswordType2] = useState<string>('password');

  const initialValues: passwordFormValues = {
    password1: "",
    password2: "",
  };

  const handleSubmit = (values: passwordFormValues): void => {
    console.log(JSON.stringify(values));
  };

  const togglePassword1 = () => {
    if (passwordType1 === 'password') {
      setPasswordType1('text');
      return;
    }
    setPasswordType1('password');
  };

  const togglePassword2 = () => {
    if (passwordType2 === 'password') {
      setPasswordType2('text');
      return;
    }
    setPasswordType2('password');
  };
  return (
    <div className='w-full flex flex-col  '>
      <div className='flex w-full relative'>
        <div className='w-1/2 password-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed'>
          <img src={bgSignInImage} alt='' />
        </div>
        <div className='w-1/2 flex pl-7.5 mt-13.1 flex-col  overflow-y-auto no-scroll-bar absolute right-0 pb-[60px]'>
          <h1 className='font-Inter font-bold text-signIn text-neutralBlack leading-2.8'>
            Forgot Password
          </h1>
          <p className='mt-0.78 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm'>
            Enter your new password.
          </p>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validationSchema={confirmPasswordSchema}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }): JSX.Element => (
              <Form className="w-25.9 mt-1.9 " autoComplete="off">
                <div className="password relative">
                  <Input
                    type={passwordType1}
                    placeholder="New Password"
                    label="New Password"
                    id="password1"
                    name="password1"
                    className=" h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border "
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password1}
                    errors={Boolean(touched.password1 && errors.password1)}
                    helperText={touched.password1 && errors.password1}
                  />
                  <div onClick={togglePassword1} className="absolute top-7 right-5">
                    {passwordType1 === "password" ? (
                      <img
                        className="cursor-pointer "
                        src={openEyeIcon}
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
                <div className="password relative mt-1.258">
                  <Input
                    type={passwordType2}
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    id="password2"
                    name="password2"
                    className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password2}
                    errors={Boolean(touched.password2 && errors.password2)}
                    helperText={touched.password2 && errors.password2}
                  />
                  <div onClick={togglePassword2} className="absolute top-7 right-5">
                    {passwordType2 === "password" ? (
                      <img
                        className="cursor-pointer "
                        src={openEyeIcon}
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
                <div className="pb-10">
                  <Button
                    text="Submit"
                    type="submit"
                    className="font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6  w-full hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className='py-1.9'></div>
      <div className='footer'></div>
    </div>
  );
};

const confirmPasswordSchema = Yup.object().shape({
  password1: Yup.string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(
      Password_regex,
      "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    ),
  password2: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .oneOf([Yup.ref("password1"), null], "Passwords must match")
    .matches(
      Password_regex,
      "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    )
    .required("Confirm Password is required"),
});
export default CreateNewPassword;
