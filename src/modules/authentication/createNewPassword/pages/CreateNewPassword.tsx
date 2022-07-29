import React, {useEffect, useState} from 'react';
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
    if (token) {dispatch(authSlice.actions.verifyForgotEmail({id:token}));}
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
    const newValues = {...values};
    newValues['token'] = token;
    dispatch(authSlice.actions.resetPassword(newValues));
  };

  return (
    <div className="create-password">
      <div className="flex w-full height-calc">
        <div className="w-1/2 rounded-r-lg  bg-thinBlue flex items-center password-cover-bg  justify-center p-28 signup-cover-bg bg-no-repeat bg-left overflow-hidden">
          <img src={bgSignInImage} alt="" className="object-cover" />
        </div>
        <div className="flex flex-col w-1/2 pt-13.1 pl-7.5 overflow-scroll">
          <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">
            Forgot Password
          </h1>
          <p className="mt-0.78 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
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
              touched,
              values
            }): JSX.Element => (
              <Form className="w-25.9 mt-1.9 " autoComplete="off">
                <div className="password relative">
                  <Input
                    type={password}
                    placeholder="New Password"
                    label="New Password"
                    id="password"
                    name="password"
                    className="h-4.5 rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    errors={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                  <div onClick={togglePassword1} className="absolute top-7 right-[28.87px]">
                    {password === 'password' ? (
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
                    type={confirmPassword}
                    placeholder="Confirm Password"
                    label="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="h-4.5 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    errors={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword}
                  />
                  <div onClick={togglePassword2} className="absolute top-7 right-[28.87px]">
                    {confirmPassword === 'password' ? (
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
    </div>
  );
};

const confirmPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be atleast 8 characters')
    .matches(
      password_regex,
      'Password must have one uppercase , one lowercase , a digit and specialcharacters'
    ),
  confirmPassword: Yup.string()
    .min(8, 'Password must be atleast 8 characters')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    // .matches(
    //   password_regex,
    //   "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    // )
    .required('Confirm Password is required')
});
export default CreateNewPassword;
