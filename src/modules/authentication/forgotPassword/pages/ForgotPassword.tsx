import Button from 'common/button';
import Input from 'common/input';
import './ForgotPassword.css';
import bgForgotImage from '../../../../assets/images/bg-sign.svg';
import { AppDispatch } from '../../../../store/index';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { EmailFormValues } from 'modules/authentication/interface/authentication.interface';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import { useEffect, useRef } from 'react';
import { email_regex } from 'constants/constants';

const ForgotPassword: React.FC = () => {
    const dispatch: AppDispatch = useAppDispatch();
    const resetValue = useAppSelector(state => state.auth.clearFormikValue);
    const formikRef: any = useRef();

    const initialValues: EmailFormValues = {
        email: '',
    };

    useEffect(() => {
        if (resetValue) formikRef?.current?.resetForm({ values: initialValues });
    }, [resetValue]);

    const handleSubmit = (values: EmailFormValues): void => {
        const newValues = {...values};
        newValues['email'] =  values.email.toLocaleLowerCase();
        dispatch(authSlice.actions.forgotPassword(values));
    };

    return (
        <div className="w-full flex flex-col forgot-password-wrapper">
            <div className="flex w-full relative">
                <div className="w-1/2 password-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed">
                    <img src={bgForgotImage} alt="" />
                </div>
                <div className="w-1/2 flex pl-7.5 mt-13.1 flex-col overflow-y-auto no-scroll-bar absolute right-0 ">
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
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
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
            <div className="py-1.9"></div>
            <div className="footer"></div>
        </div>
    );
};

const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email') .matches(email_regex, 'Must be a valid email').max(255).required('Email is required'),
});

export default ForgotPassword;
