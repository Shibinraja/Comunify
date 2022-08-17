import React, { useRef } from 'react';
import Button from 'common/button';
import Input from 'common/input';
import './ForgotPassword.css';
import bgForgotImage from '../../../../assets/images/bg-sign.svg';
import { AppDispatch } from '../../../../store/index';
import { useAppDispatch } from '@/hooks/useRedux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { EmailFormValues } from 'modules/authentication/interface/auth.interface';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { email_regex } from 'constants/constants';

const ForgotPassword: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const formikRef: any = useRef();

  const initialValues: EmailFormValues = {
    email: ''
  };

  //-----Redundant code as of now-------
  // useEffect(() => {
  //     if (resetValue) formikRef?.current?.resetForm({ values: initialValues });
  // }, [resetValue]);

  const handleSubmit = (values: EmailFormValues): void => {
    const newValues = { ...values };
    newValues['email'] = values.email.toLocaleLowerCase();
    dispatch(authSlice.actions.forgotPassword(values));
  };

  return (
    <div className="forgot-password">
      <div className="auth-layout-forgot">
        <div className="flex w-full height-calc container mx-auto">
          <div className="w-1/2 rounded-r-lg   flex items-center justify-center p-28  bg-left overflow-hidden">
            <img src={bgForgotImage} alt="" className="object-cover" />
          </div>
          <div className="flex items-center w-1/2 justify-center">
            <div className="flex flex-col overflow-scroll pb-5">
              <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">Forgot Password</h1>
              <p className="mt-0.78 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
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
                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
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
                      className="font-Poppins rounded-lg text-base font-semibold text-white transition ease-in duration-300 w-full mt-1.84 h-3.6 hover:shadow-buttonShadowHover btn-gradient"
                    />
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

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Must be a valid email').matches(email_regex, 'Must be a valid email').max(255).required('Email is required')
});

export default ForgotPassword;
