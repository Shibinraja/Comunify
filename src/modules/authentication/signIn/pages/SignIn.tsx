import { useAppDispatch } from '@/hooks/useRedux';
import { API_ENDPOINT, auth_module } from '@/lib/config';
import Button from 'common/button/Button';
import Input from 'common/input/Input';
import { Form, Formik } from 'formik';
import { FormValues } from 'modules/authentication/interface/authentication.interface';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import bgSignInImage from '../../../../assets/images/bg-sign.svg';
import closeEyeIcon from '../../../../assets/images/closeEyeIcon.svg';
import eyeIcon from '../../../../assets/images/eye.svg';
import socialLogo from '../../../../assets/images/Social.svg';
import { email_regex, password_regex } from '../../../../constants/constants';
import { AppDispatch } from '../../../../store/index';
import authSlice from '../../store/slices/auth.slice';
import './SignIn.css';

const SignIn: React.FC = () => {
    const dispatch: AppDispatch = useAppDispatch();

    const initialValues: FormValues = {
        userName: '',
        password: '',
    };

    const [passwordType, setPasswordType] = useState<string>('password');

    const handleSubmit = (values: FormValues): void => {
        const newValues = {...values};
        newValues['userName'] =  values.userName.includes('@') ? values.userName.toLocaleLowerCase() : values.userName;
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
        <div className="w-full flex flex-col justify-between  relative overflow-y-auto no-scroll-bar">
            <div className="flex w-full container x-auto ">
                <div className="w-full md:w-2/5  mt-5.2 flex flex-col pl-10 ">
                    {' '}
                    <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">Sign In </h3>{' '}
                    <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
                        Welcome back to Comunify. Let's get you know your communities better{' '}
                    </p>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={signInSchema}>
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
                            <Form className="flex flex-col  mt-1.8 w-25.9 " autoComplete="off">
                                <div className="username">
                                    <Input
                                        type="text"
                                        placeholder="Username / Email"
                                        label="UserName"
                                        id="userName"
                                        name="userName"
                                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
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
                                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        errors={Boolean(touched.password && errors.password)}
                                        helperText={touched.password && errors.password}
                                    />
                                    <div onClick={togglePassword} className="absolute top-7 right-[28.87px]">
                                        {passwordType === 'password' ? (
                                            <img className="cursor-pointer " src={eyeIcon} alt="" />
                                        ) : (
                                            <img className="cursor-pointer " src={closeEyeIcon} alt="" />
                                        )}
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
                                <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-1.8 leading-2.8 text-signLink">
                                    <Link to="forgot-password">
                                        <h3>Forgot your password?</h3>
                                    </Link>
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
            <div className="container mx-auto fixed right-0 flex items-center justify-center top-0 bg-no-repeat">
                <div className="pb-80 w-full md:w-3/5 login-cover-bg bg-no-repeat bg-right rounded-lg  bg-thinBlue flex items-center justify-center absolute top-20 right-0 mt-5 py-20 ">
                    <img src={bgSignInImage} alt="signin-image" />
                </div>
            </div>
            <div className="py-1.9"></div>
            <div className="footer"></div>
        </div>
    );
};

const signInSchema = Yup.object().shape({
    userName: Yup.lazy((value): any => {
        if (value?.includes('@')) {
            return Yup.string().email('Must be a valid email').max(255).matches(email_regex, 'Must be a valid email').required('Email is required');
        }

        return Yup.string()
            .required('Username is required')
            .min(5, 'Username should be more than 5 character long')
            .max(30, 'Username should not exceed 30 characters')
            .trim();
    }),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be atleast 8 characters')
        .matches(password_regex, 'Password must have one uppercase , one lowercase , a digit and specialcharacters'),
});

export default SignIn;
