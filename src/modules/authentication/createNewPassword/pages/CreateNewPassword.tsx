/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { AppDispatch } from '../../../../store/index';
import { useAppDispatch } from '@/hooks/useRedux';
import bgSignInImage from '../../../../assets/images/bg-sign.svg';
import openEyeIcon from '../../../../assets/images/eye.svg';
import closeEyeIcon from '../../../../assets/images/closeEyeIcon.svg';

import Input from 'common/input';
import Button from 'common/button';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { password_regex } from '../../../../constants/constants';
import { PasswordFormValues } from 'modules/authentication/interface/auth.interface';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { useSearchParams } from 'react-router-dom';
import './CreateNewPassword.css';

const CreateNewPassword: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token: string | any = searchParams.get('reset') || '';

  const [password, setPasswordType1] = useState<string>('password');
  const [confirmPassword, setPasswordType2] = useState<string>('password');

  const initialValues: PasswordFormValues = {
    password: '',
    confirmPassword: ''
  };

  useEffect(() => {
    if (token) {
      dispatch(authSlice.actions.verifyForgotEmail({ id: token }));
    }
  }, [token]);

  const togglePassword1 = () => {
    if (password === 'password') {
      setPasswordType1('text');
      return;
    }
    setPasswordType1('password');
  };

  const togglePassword2 = () => {
    if (confirmPassword === 'password') {
      setPasswordType2('text');
      return;
    }
    setPasswordType2('password');
  };

  const handleSubmit = (values: PasswordFormValues): void => {
    const newValues = { ...values };
    newValues['token'] = token;
    dispatch(authSlice.actions.resetPassword(newValues));
  };

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">
        <div className="w-3/5 2xl:w-1/2 auth-layout-section flex items-center justify-center 3xl:justify-end pr-0   3xl:pr-16 py-10">
          <div className="flex items-center justify-center">
            <img src={bgSignInImage} alt="" className="w-9/12 xl:w-[621px] 3xl:w-full object-cover" />
          </div>
        </div>
        <div className="flex justify-center w-1/2 3xl:items-center 3xl:justify-start  pl-0 3xl:pl-16">
          <div className="flex flex-col  justify-center">
            <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">Forgot Password</h3>{' '}
            <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">Enter your new password.</p>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange={true} validationSchema={confirmPasswordSchema}>
              {({ errors, handleBlur, handleChange, touched, values }): JSX.Element => (
                <Form className="w-25.9 mt-1.9 " autoComplete="off">
                  <div 
                  className={`password relative ${
                    errors.password === 'Password must have one uppercase, one lowercase, a digit and special characters'
                      ? 'cr-password mb-10'
                      : ''
                  }`}>
                    <Input
                      type={password}
                      placeholder="New Password"
                      label="New Password"
                      id="password"
                      name="password"
                      className={`h-4.5 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${
                        touched.password && errors.password
                          ? 'boder-lightRed h-4.5 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                          : ''
                      }`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      errors={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <div onClick={togglePassword1} className="absolute top-7 right-4">
                      {password === 'password' ? (
                        <img className="cursor-pointer " src={openEyeIcon} alt="" />
                      ) : (
                        <img className="cursor-pointer " src={closeEyeIcon} alt="" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`password relative ${
                      errors.password
                        ? ' mt-8'
                        : 'mt-1.13'
                    }`}
                  >
                    <Input
                      type={confirmPassword}
                      placeholder="Confirm Password"
                      label="Confirm Password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className={`h-4.5 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'boder-lightRed h-4.5 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                          : ''
                      }`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      errors={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                    />
                    <div onClick={togglePassword2} className="absolute top-7 right-4">
                      {confirmPassword === 'password' ? (
                        <img className="cursor-pointer " src={openEyeIcon} alt="" />
                      ) : (
                        <img className="cursor-pointer " src={closeEyeIcon} alt="" />
                      )}
                    </div>
                  </div>
                  <div className={`pb-10 ${
                      errors.password
                        ? ' mt-4'
                        : ''
                    }`}>
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
      </div>
    </div>
  );
};

const confirmPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be atleast 8 characters')
    .matches(password_regex, 'Password must have one uppercase, one lowercase, a digit and special characters'),
  confirmPassword: Yup.string()
    .min(8, 'Password must be atleast 8 characters')
    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
    // .matches(
    //   password_regex,
    //   "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    // )
    .required('Confirm Password is required')
});
export default CreateNewPassword;
