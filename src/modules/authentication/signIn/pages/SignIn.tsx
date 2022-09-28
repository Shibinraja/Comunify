/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import { API_ENDPOINT, auth_module } from '@/lib/config';
import Button from 'common/button/Button';
import Input from 'common/input/Input';
import { showErrorToast, showSuccessToast } from 'common/toast/toastFunctions';
import { Form, Formik } from 'formik';
import { FormValues } from 'modules/authentication/interface/auth.interface';
import { Link, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import bgSignInImage from '../../../../assets/images/bg-sign.svg';
import closeEyeIcon from '../../../../assets/images/closeEyeIcon.svg';
import eyeIcon from '../../../../assets/images/eye.svg';
import socialLogo from '../../../../assets/images/Social.svg';
import { email_regex } from '../../../../constants/constants';
import { AppDispatch } from '../../../../store/index';
import authSlice from '../../store/slices/auth.slice';
import './SignIn.css';

const SignIn: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const google_signIn_error: string = searchParams.get('err') || '';
  const google_signUp_success: string = searchParams.get('success') || '';

  const initialValues: FormValues = {
    userName: '',
    password: ''
  };

  const [passwordType, setPasswordType] = useState<string>('password');

  useEffect(() => {
    if (google_signIn_error) {
      showErrorToast('Signin failed, please try again');
    }
  }, [google_signIn_error]);

  useEffect(() => {
    if (google_signUp_success) {
      showSuccessToast('Account created successfully');
    }
  }, [google_signUp_success]);

  const handleSubmit = (values: FormValues): void => {
    const newValues = { ...values };
    newValues['userName'] = values.userName.includes('@') ? values.userName.toLocaleLowerCase() : values.userName;
    dispatch(authSlice.actions.login(newValues));
  };

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  const navigateToGoogleSignIn = () => {
    window.open(`${API_ENDPOINT}${auth_module}/google/`, '_self');
  };

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">
        <div className="w-2/5 2xl:w-1/2 flex items-center justify-center pr-4 3xl:justify-end 3xl:pr-16 pl-4 2xl:pl-0 pb-24 pt-10">
          <div className=" flex flex-col justify-center items-center ">
            <div className=" flex flex-col ">
              <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn  text-left">Sign In </h3>

              <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
                Welcome back to Comunify. Let's get you know your communities better{' '}
              </p>
            </div>

            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={signInSchema}>
              {({ errors, handleBlur, handleChange, touched, values }): JSX.Element => (
                <Form className="flex flex-col  mt-1.8 w-25.9 xl:ml-8" autoComplete="off">
                  <div className="username">
                    <Input
                      type="text"
                      placeholder="Username/Email"
                      label="Username"
                      id="userName"
                      name="userName"
                      // eslint-disable-next-line max-len
                      className={`h-4.5 pr-10 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${
                        touched.userName && errors.userName
                          ? 'boder-lightRed h-4.5 pr-10 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                          : ''
                      }`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.userName}
                      errors={Boolean(touched.userName && errors.userName)}
                      helperText={touched.userName && errors.userName}
                    />
                  </div>
                  <div className="password mt-1.13 relative ">
                    <Input
                      type={passwordType}
                      placeholder="Password"
                      label="Password"
                      id="password"
                      name="password"
                      // eslint-disable-next-line max-len
                      className={`h-4.5 rounded-lg bg-white p-2.5 pr-10 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${
                        touched.password && errors.password
                          ? 'boder-lightRed h-4.5 rounded-lg bg-white p-2.5 pr-10 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                          : ''
                      }`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      errors={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                    />
                    <div onClick={togglePassword} className="absolute top-7 right-3">
                      {passwordType === 'password' ? (
                        <img className="cursor-pointer " src={eyeIcon} alt="" />
                      ) : (
                        <img className="cursor-pointer " src={closeEyeIcon} alt="" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="mr-2 mt-1">
                        <input type="checkbox" className="checkbox cursor-pointer" />
                      </div>
                      <span className="text-sm text-secondaryGray font-normal font-Inter">Remember me</span>
                    </div>
                    <div className="font-Inter text-secondaryGray text-sm font-normal leading-2.8 transition ease-in duration-300 ">
                      <Link to="forgot-password" className="hover:text-letsSignInSignUp hover:underline">
                        Forgot your password?
                      </Link>
                    </div>
                  </div>

                  <Button
                    text="Sign In"
                    type="submit"
                    className="font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
                  />
                  <div className="relative flex items-center pt-2.4">
                    <div className="borders flex-grow border-t"></div>
                    <span className="font-Inter text-secondaryGray mx-6 flex-shrink">or</span>
                    <div className="borders flex-grow border-t"></div>
                  </div>
                  <div
                    className="google-signin h-3.3 mt-2.47 font-Inter text-lightBlue box-border flex text-desc  cursor-pointer items-center justify-center rounded-lg font-normal leading-2.8"
                    onClick={navigateToGoogleSignIn}
                  >
                    <img src={socialLogo} alt="" className="pr-0.781" />
                    Continue with Google
                  </div>

                  <div className="font-Poppins text-secondaryGray text-center text-base font-normal mt-5  text-signLink ">
                    <h3>
                      Don’t have an account yet?{' '}
                      <Link to="signup">
                        {' '}
                        <span className="text-letsSignInSignUp underline">Let’s Sign Up</span>
                      </Link>{' '}
                    </h3>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="w-3/5 2xl:w-1/2 auth-layout flex items-center justify-center pr-0  3xl:justify-start 3xl:pl-16">
          <div className="flex items-center justify-center">
            <img src={bgSignInImage} alt="" className="w-9/12 xl:w-[640px] 3xl:w-full object-cover" />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

const signInSchema = Yup.object().shape({
  userName: Yup.lazy((value: string) => {
    if (value?.includes('@')) {
      return Yup.string().email('Must be a valid email').max(255).matches(email_regex, 'Must be a valid email').required('Email is required');
    }

    return Yup.string()
      .required('Username/Email is required')
      .min(5, 'Username should be more than 5 character long')
      .max(30, 'Username should not exceed 30 characters')
      .trim();
  }),
  password: Yup.string().required('Password is required')
});

export default SignIn;
