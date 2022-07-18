import Input from 'common/input/Input';
import Button from 'common/button/Button';
import eyeIcon from '../../../../assets/images/eye.svg';
import closeEyeIcon from '../../../../assets/images/closeEyeIcon.svg';
import socialLogo from "../../../../assets/images/Social.svg";
import bgSignUpImage from "../../../../assets/images/bg-sign.svg";
import dropdownIcon from "../../../../assets/images/signup-domain-downArrow.svg";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  password_regex,
  whiteSpace_regex,
  userName_regex,
  companyName_regex,
  email_regex,
} from "../../../../constants/constants";
import cookie from 'react-cookies';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { AppDispatch } from '../../../../store/index';
import authSlice from '../../store/slices/auth.slice';
import { SignUpFormValues } from 'modules/authentication/interface/authentication.interface';
import { API_ENDPOINT, auth_module } from '@/lib/config';

const SignUp : React.FC = () => {
    const [passwordType, setPasswordType] = useState<string>('password');
    const [isDropDownActive, setDropDownActive] = useState<boolean>(false);
    const [selectedDomainSector, setSelectedDomainSector] = useState<string>('Domain');
    const formikRef: any = useRef();

    const options = ['Marketing', 'Sales', 'Customer Support', 'Customer Success', 'Others'];

    const dispatch: AppDispatch = useAppDispatch();
    const resetValue = useAppSelector((state) => state.auth.clearFormikValue);

    const initialValues: SignUpFormValues = {
        userName: '',
        email: '',
        password: '',
        companyName: '',
        domainSector: '',
    };
      
    // useEffect(()=>{
    //     if(resetValue) formikRef?.current?.resetForm({values:initialValues})
    //   },[resetValue])

    const handleDomainSectorChange = (option: string): void => {
        // Formik ref to enable to make the custom dropdown with field touch and set the value for the fields.
        formikRef?.current?.setFieldTouched('domainSector');
        formikRef?.current?.setFieldValue('domainSector', option, true);
        setSelectedDomainSector(option);
    };

    const handleSubmit = (values: SignUpFormValues): void => {
        const newValues = {...values};
        newValues['email'] =  values.email.toLocaleLowerCase();
        dispatch(authSlice.actions.signup(newValues));
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
        <div className="w-full flex flex-col  h-screen">
            <div className="flex w-full relative">
                <div className="w-full md:w-1/2 signup-cover-bg bg-no-repeat pt-20 bg-left rounded-lg  bg-thinBlue flex items-center justify-center fixed pb-80">
                    <img src={bgSignUpImage} alt="signup-image" />
                </div>
                <div className="w-full md:w-1/2 flex flex-col lg:pl-48  overflow-y-auto no-scroll-bar absolute right-0 pb-20">
                    {' '}
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
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }): JSX.Element => (
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
                                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border "
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        errors={Boolean(touched.password && errors.password)}
                                        helperText={touched.password && errors.password}
                                    />
                                    <div onClick={togglePassword} className="absolute top-7 right-[26.87px]">
                                        {passwordType === 'password' ? (
                                            <img className="cursor-pointer " src={eyeIcon} alt="" />
                                        ) : (
                                            <img className="cursor-pointer " src={closeEyeIcon} alt="" />
                                        )}
                                    </div>
                                </div>
                                <div className="cname mt-1.258">
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
                                <div className="domain mt-1.258">
                                    <div className="cursor-pointer relative">
                                        <div
                                            className="flex items-center w-full  justify-between app-result-card-border  box-border rounded-lg h-4.5  bg-white p-2.5 focus:outline-none font-normal text-secondaryGray text-base leading-6 font-Inter shadow-trialButtonShadow"
                                            onClick={e => setDropDownActive(!isDropDownActive)}
                                        >
                                            <div className={selectedDomainSector === 'Domain' ? 'text-secondaryGray' : 'text-black'}>
                                                {selectedDomainSector ? selectedDomainSector : 'Domain'}
                                            </div>
                                            <img src={dropdownIcon} alt="" className={isDropDownActive ? 'rotate-180' : 'rotate-0'} />
                                        </div>

                                        {isDropDownActive && (
                                            <div className="absolute w-full bg-white app-result-card-border box-border rounded-0.3 shadow-reportInput">
                                                {options.map((options: string) => (
                                                    <div
                                                        id="domain"
                                                        className="flex flex-col justify-center"
                                                        key={options.toString()}
                                                        onClick={() => {
                                                            handleDomainSectorChange(options);
                                                            setDropDownActive(false);
                                                        }}
                                                    >
                                                        <div className="h-3.06 font-Poppins font-normal text-searchBlack text-trial leading-1.31 flex items-center p-3 hover:bg-signUpDomain transition ease-in duration-100">
                                                            {options}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {Boolean(touched.domainSector && errors.domainSector) && (
                                        <p className="text-lightRed font-normal text-error font-Inter mt-0.287 ">{errors?.domainSector}</p>
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
                                <div className="google-signin h-3.3 mt-2.47 font-Inter text-lightBlue box-border flex text-desc  cursor-pointer items-center justify-center rounded-lg font-normal leading-2.8" onClick={navigateToGoogleSignIn}>
                                    <img src={socialLogo} alt="" className="pr-0.781" />
                                    Continue with Google
                                </div>
                                <div className="font-Poppins text-secondaryGray text-center text-base font-normal mt-1.8  text-signLink">
                                    <h3>Already have an account? <Link to="/"> <span className="text-letsSignInSignUp underline">Let’s Sign In</span></Link> </h3>
                                </div>
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

const signUpSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .min(5, "Username should be more than 5 character long")
    .max(25, "Username should not exceed 25 characters")
    .matches(whiteSpace_regex, "Whitespaces are not allowed")
    .matches(userName_regex, "UserName is not valid")
    .trim(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(
      password_regex,
      "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    ),
  email: Yup.string()
    .email("Must be a valid email")
    .matches(email_regex, 'Must be a valid email')
    .max(255)
    .required("Email is required"),
  domainSector: Yup.string().required("Domain is required"),
  companyName: Yup.string()
  .min(2, "CompanyName must be atleast 2 characters")
  .max(15, "CompanyName should not exceed 15 characters")
  .strict(true)
  .matches(companyName_regex, "CompanyName is not valid")
  .trim("Whitespaces are not allowed"),
});

export default SignUp;
