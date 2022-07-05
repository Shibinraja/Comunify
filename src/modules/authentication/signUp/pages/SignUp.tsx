import Input from "common/input/Input";
import Button from "common/button/Button";
import eyeIcon from "../../../../assets/images/eye.svg";
import closeeye from '../../../../assets/images/closeeye.png';
import socialLogo from "../../../../assets/images/Social.svg";
import bgSignUpImage from "../../../../assets/images/bg-sign.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Password_regex,
  WhiteSpace_regex,
  username_regex,
  companyName_regex,
} from "../../../../constants/constants";
import { useAppDispatch } from '@/hooks/useRedux';
import authSlice from "../../store/slices/auth.slice";
import { signUpFormValues } from '../interface/signup.interface';

const SignUp = () => {
  const [passwordType, setPasswordType] = useState("password");

  const dispatch = useAppDispatch();

  const initialValues: signUpFormValues = {
    userName: "",
    email: "",
    password: "",
    companyName: "",
    domainSector: "",
  };

  const handleSubmit = (values: signUpFormValues): void => {
    dispatch(authSlice.actions.signup(values))
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  return (
    <div className="w-full flex flex-col  h-screen ">
      <div className="flex w-full relative">
        <div className="w-full md:w-1/2 signup-cover-bg bg-no-repeat pt-20 bg-left rounded-lg  bg-thinBlue flex items-center justify-center fixed pb-80">
          <img src={bgSignUpImage} alt="signup-image" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col lg:pl-48  overflow-y-auto no-scroll-bar absolute right-0 pb-20">
          {" "}
          <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">
            Sign up{" "}
          </h3>{" "}
          <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
            Get Comunified with your communities. Create your account now.
          </p>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validationSchema={signUpSchema}
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
              <Form
                className="flex flex-col pb-10 mt-1.8 w-25.9"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <div className="username">
                  <Input
                    type="text"
                    placeholder="User Name"
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
                  <div onClick={togglePassword} className="m-0 p-0">
                    {passwordType === "password" ? (
                      <img
                        className="absolute icon-holder left-96 cursor-pointer "
                        src={eyeIcon}
                        alt=""
                      />
                    ) : (
                      <img
                        className="absolute icon-holder left-96 cursor-pointer "
                        src={closeeye}
                        alt=""
                      />
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
                  <Input
                    type="text"
                    placeholder="Domain"
                    label="Domain"
                    id="domain"
                    name="domainSector"
                    className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.domainSector}
                    errors={Boolean(touched.domainSector && errors.domainSector)}
                    helperText={touched.domainSector && errors.domainSector}
                  />
                </div>
                <Button
                  text="Sign Up"
                  type="submit"
                  className="font-Poppins rounded-lg text-base text-white mt-1.8 h-3.6 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
                />
                <div className="relative flex items-center pt-2.4">
                  <div className="borders flex-grow border-t"></div>
                  <span className="font-Inter text-secondaryGray mx-6 flex-shrink">
                    or
                  </span>
                  <div className="borders flex-grow border-t"></div>
                </div>
                <div className="google-signin h-3.3 mt-2.47 font-Inter text-lightBlue box-border flex text-desc  cursor-pointer items-center justify-center rounded-lg font-normal leading-2.8">
                  <img src={socialLogo} alt="" className="pr-0.781" />
                  Continue with Google
                </div>
                <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-1.8  text-signLink">
                  Already have an account?{" "}
                  <Link to="/" className="text-blue-500 underline">
                    {" "}
                    Let’s Sign In
                  </Link>
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
    .matches(WhiteSpace_regex, "Whitespaces are not allowed")
    .matches(username_regex, "UserName is not valid")
    .trim(),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(
      Password_regex,
      "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    ),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  domainSector: Yup.string().required("Domain is required"),
  companyName: Yup.string()
    .max(25, "CompanyName should not exceed 25 characters")
    .matches(companyName_regex, "CompanyName is not valid"),
});

export default SignUp;
