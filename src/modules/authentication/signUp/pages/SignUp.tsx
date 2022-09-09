/* eslint-disable max-len */
import { useAppDispatch } from '@/hooks/useRedux';
import { API_ENDPOINT, auth_module } from '@/lib/config';
import Button from 'common/button/Button';
import Input from 'common/input/Input';
import { Form, Formik } from 'formik';
import { SignUpFormValues } from 'modules/authentication/interface/auth.interface';
import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import bgSignUpImage from '../../../../assets/images/bg-sign.svg';
import closeEyeIcon from '../../../../assets/images/closeEyeIcon.svg';
import eyeIcon from '../../../../assets/images/eye.svg';
import dropdownIcon from '../../../../assets/images/signup-domain-downArrow.svg';
import socialLogo from '../../../../assets/images/Social.svg';
import { companyName_regex, email_regex, password_regex, userName_regex, whiteSpace_regex } from '../../../../constants/constants';
import { AppDispatch } from '../../../../store/index';
import authSlice from '../../store/slices/auth.slice';
import './SignUp.css';

const SignUp: React.FC = () => {
  const [passwordType, setPasswordType] = useState<string>('password');
  const [isDropDownActive, setDropDownActive] = useState<boolean>(false);
  const [selectedDomainSector, setSelectedDomainSector] = useState<string>('Domain');
  const [cursor, setCursor] = useState<number>(0);
  const formikRef: any = useRef();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const domainRef = useRef<HTMLLIElement>(null);

  const options = ['Marketing', 'Sales', 'Customer Support', 'Customer Success', 'Others'];

  const dispatch: AppDispatch = useAppDispatch();

  const initialValues: SignUpFormValues = {
    userName: '',
    email: '',
    password: '',
    companyName: '',
    domainSector: ''
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setDropDownActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isDropDownActive) {
      domainRef?.current?.focus();
    }
  }, [isDropDownActive]);

  const handleDomainSectorChange = (option: string): void => {
    // Formik ref to enable to make the custom dropdown with field touch and set the value for the fields.
    formikRef?.current?.setFieldTouched('domainSector');
    formikRef?.current?.setFieldValue('domainSector', option, true);
    setSelectedDomainSector(option);
  };

  const handleSubmit = (values: SignUpFormValues): void => {
    const newValues = { ...values };
    newValues['email'] = values.email.toLocaleLowerCase();
    dispatch(authSlice.actions.signup(newValues));
  };

  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
      return;
    }
    setPasswordType('password');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      setCursor((prevState: number) => prevState - 1);
    }
    if (e.keyCode === 40 && cursor < options.length - 1) {
      setCursor((prevState: number) => prevState + 1);
    }
    if (e.keyCode === 13) {
      handleDomainSectorChange(options[cursor]);
      setDropDownActive(false);
    }
  };

  const navigateToGoogleSignIn = () => {
    window.open(`${API_ENDPOINT}${auth_module}/google/`, '_self');
  };

  return (
    <div className="sign-up">
      <div className="auth-layout-signUp">
        <div className="flex w-full height-calc container mx-auto">
          <div className="w-1/2 rounded-r-lg flex items-center justify-center p-28 overflow-hidden">
            <img src={bgSignUpImage} alt="" className="object-cover" />
          </div>
          <div className="flex justify-center w-1/2 3xl:items-center">
            <div className="flex flex-col overflow-scroll no-scrollbar-firefox ">
              <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">Sign Up </h3>{' '}
              <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
                Get Comunified with your communities. Create your account now.
              </p>
              <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validationSchema={signUpSchema}
              >
                {({ errors, handleBlur, handleChange, handleSubmit, touched, values }): JSX.Element => (
                  <Form className="flex flex-col pb-10 mt-1.8 w-25.9" autoComplete="off" onSubmit={handleSubmit}>
                    <div className="username">
                      <Input
                        type="text"
                        placeholder="Username"
                        label="Username"
                        id="username"
                        name="userName"
                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.userName}
                        errors={Boolean(touched.userName && errors.userName)}
                        helperText={touched.userName && errors.userName}
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
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.email}
                        errors={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    </div>
                    <div className="w-full password mt-1.258 relative">
                      <Input
                        type={passwordType}
                        placeholder="Create Password"
                        label="Password"
                        id="password"
                        name="password"
                        className="h-4.5 rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border "
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        errors={Boolean(touched.password && errors.password)}
                      />
                      <div onClick={togglePassword} className="absolute top-7 right-[26.87px]">
                        {passwordType === 'password' ? (
                          <img className="cursor-pointer " src={eyeIcon} alt="" />
                        ) : (
                          <img className="cursor-pointer " src={closeEyeIcon} alt="" />
                        )}
                      </div>
                      <div className="transition-all ease-in-out duration-300 delay-75 ">
                        <p
                          className={`text-lightRed font-normal text-error font-Inter pl-1 ${
                            !errors.password?.includes('Password must have one uppercase, one lowercase') ? 'absolute' : ''
                          }`}
                        >
                          {touched.password && errors.password}
                        </p>
                      </div>
                    </div>
                    <div className={`cname  ${!errors.password?.includes('Password must have one uppercase, one lowercase') ? 'mt-1.258' : ''}`}>
                      <Input
                        type="text"
                        placeholder="Company Name"
                        label="Company Name"
                        id="cname"
                        name="companyName"
                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.companyName}
                        errors={Boolean(touched.companyName && errors.companyName)}
                        helperText={touched.companyName && errors.companyName}
                      />
                    </div>
                    <div className="domain mt-1.258 relative">
                      <div className="cursor-pointer ">
                        <div
                          className="flex items-center w-full  justify-between app-result-card-border  box-border rounded-lg h-4.5  bg-white p-2.5 focus:outline-none font-normal text-secondaryGray text-base leading-6 font-Inter shadow-trialButtonShadow relative"
                          ref={dropDownRef}
                          onClick={() => setDropDownActive(!isDropDownActive)}
                        >
                          <div className={selectedDomainSector === 'Domain' ? 'text-secondaryGray' : 'text-black'}>
                            {selectedDomainSector ? selectedDomainSector : 'Domain'}
                          </div>
                          <img src={dropdownIcon} alt="" className={isDropDownActive ? 'rotate-180' : 'rotate-0'} />
                        </div>

                        {isDropDownActive && (
                          <div className="absolute w-full bg-white app-result-card-border box-border rounded-0.3 shadow-reportInput z-10">
                            <ul id="domain" className="flex flex-col justify-center">
                              {options.map((options: string, index: number) => (
                                <li
                                  ref={domainRef}
                                  onKeyDown={handleKeyDown}
                                  tabIndex={0}
                                  key={options}
                                  onClick={() => {
                                    handleDomainSectorChange(options);
                                    setDropDownActive(false);
                                  }}
                                  className={`${
                                    cursor === index ? 'bg-signUpDomain' : null
                                  } h-3.06 font-Poppins font-normal text-searchBlack text-trial leading-1.31 flex items-center p-3 hover:bg-signUpDomain transition ease-in duration-100 focus:outline-none`}
                                >
                                  {options}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {Boolean(touched.domainSector && errors.domainSector) && (
                        <p className="text-lightRed font-normal text-error absolute font-Inter mt-0.287  pl-1">{errors?.domainSector}</p>
                      )}
                    </div>
                    <Button
                      text="Sign Up"
                      type="submit"
                      className="font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
                    />
                    <div className="relative flex items-center pt-2.4 -z-40">
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
                    <div className="font-Poppins text-secondaryGray text-center text-base font-normal mt-1.8  text-signLink">
                      <h3>
                        Already have an account?{' '}
                        <Link to="/">
                          {' '}
                          <span className="text-letsSignInSignUp underline">Let’s Sign In</span>
                        </Link>{' '}
                      </h3>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const signUpSchema = Yup.object().shape({
  userName: Yup.string()
    .required('Username is required')
    .min(5, 'Username should be more than 5 character long')
    .max(25, 'Username should not exceed 25 characters')
    .matches(whiteSpace_regex, 'Whitespaces are not allowed')
    .matches(userName_regex, 'Username is not valid')
    .trim(),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be atleast 8 characters')
    .matches(password_regex, 'Password must have one uppercase, one lowercase, a digit and special characters'),
  email: Yup.string().email('Must be a valid email').matches(email_regex, 'Must be a valid email').max(255).required('Email is required'),
  domainSector: Yup.string().required('Domain is required'),
  companyName: Yup.string()
    .min(2, 'Company Name must be atleast 2 characters')
    .max(15, 'Company Name should not exceed 15 characters')
    .strict(true)
    .matches(companyName_regex, 'Company Name is not valid')
    .trim('Whitespaces are not allowed')
});

export default SignUp;
