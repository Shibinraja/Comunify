/* eslint-disable max-len */
import React, { useEffect, useRef } from 'react';
import Button from 'common/button';
import Input from 'common/input';
import './ForgotPassword.css';
import bgForgotImage from '../../../../assets/images/bg-sign.svg';
import { AppDispatch } from '../../../../store/index';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { EmailFormValues } from 'modules/authentication/interface/auth.interface';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { email_regex } from 'constants/constants';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const { clearFormikValue: resetValue } = useAppSelector((state) => state.auth);
  const formikRef: any = useRef();

  const initialValues: EmailFormValues = {
    email: ''
  };

  useEffect(() => {
    if (resetValue) {
      formikRef?.current?.resetForm({ values: initialValues });
    }
  }, [resetValue]);

  const handleSubmit = (values: EmailFormValues): void => {
    const newValues = { ...values };
    newValues['email'] = values.email.toLocaleLowerCase();
    dispatch(authSlice.actions.forgotPassword(values));
  };

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">
        <div className="w-3/5 2xl:w-1/2 auth-layout-section flex items-center justify-center 3xl:justify-end pr-0   3xl:pr-16 py-10">
          <div className="flex items-center justify-center">
            <img src={bgForgotImage} alt="" className="w-9/12 xl:w-[621px] 3xl:w-full object-cover" />
          </div>
        </div>
        <div className="flex justify-center w-1/2 3xl:items-center 3xl:justify-start  pl-0 3xl:pl-16">
          <div className="flex flex-col  justify-center">
            <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">Forgot Password</h3>{' '}
            <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
              Enter your email address to reset your password.
            </p>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validationSchema={forgotPasswordSchema}
            >
              {({ errors, handleBlur, handleChange, handleSubmit, touched, values }): JSX.Element => (
                <Form className="w-25.9 mt-1.9" autoComplete="off" onSubmit={handleSubmit}>
                  <div className="email">
                    <Input
                      type="email"
                      placeholder="Email"
                      label="Email"
                      id="email"
                      name="email"
                      className={`h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${
                        touched.email && errors.email
                          ? 'boder-lightRed h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                          : ''
                      }`}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      errors={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </div>
                  <Button
                    text="Submit"
                    type="submit"
                    className="font-Poppins rounded-lg text-base font-semibold text-white transition ease-in duration-300 w-full mt-8 h-3.6 hover:shadow-buttonShadowHover btn-gradient"
                  />
                </Form>
              )}
            </Formik>
            {/* <div className="font-Inter text-secondaryGray text-sm text-center font-normal leading-2.8 transition ease-in duration-300 pt-4">
              <Link to="forgot-password" className="underline hover:text-letsSignInSignUp hover:underline">
                {' '}
                Resend Link
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').matches(email_regex, 'Must be a valid email').max(255).required('Email is required')
});

export default ForgotPassword;
