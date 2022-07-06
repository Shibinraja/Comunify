import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "common/button/Button";
import Input from "common/input/Input";
import { useAppDispatch } from "@/hooks/useRedux";
import useLoading from "@/hooks/useLoading";
import { LOGIN } from "../../store/actions/auth.actions";
import authSlice from "../../store/slices/auth.slice";
import { FormValues, signInInput } from "../interface/signIn.interface";
import { loginSchema } from "@/lib/validation";
import socialLogo from "../../../../assets/images/Social.svg";
import bgSignInImage from "../../../../assets/images/bg-sign.svg";
import eyeIcon from "../../../../assets/images/eye.svg";
import closeeye from '../../../../assets/images/closeeye.png';
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./SignIn.css";
import { useState } from "react";
import { Password_regex } from "../../../../constants/constants";
import { AppDispatch } from '../../../../store/index';


const SignIn: React.FC = () => {
  const dispatch: AppDispatch = useAppDispatch();

  const initialValues: FormValues = {
    email: "",
    password: "",
  };

  const [passwordType, setPasswordType] = useState<string>("password");

  const handleSubmit = (values: FormValues): void => {
    dispatch(authSlice.actions.login(values))
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  return (
    <div className="w-full flex flex-col justify-between  relative overflow-y-auto no-scroll-bar">
      <div className="flex w-full container mx-auto ">
        <div className="w-full md:w-2/5  mt-5.2 flex flex-col pl-10 ">
          {" "}
          <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">
            Sign In{" "}
          </h3>{" "}
          <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
            Welcome back to Comunify. Let's get you know your communities better{" "}
          </p>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={signInSchema}
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
                className="flex flex-col  mt-1.8 w-25.9 "
                autoComplete="off"
              >
                <div className="username">
                  <Input
                    type="text"
                    placeholder="Email"
                    label="Email"
                    id="username"
                    name="email"
                    className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    errors={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
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
                  <div onClick={togglePassword} className="absolute top-7 right-5">
                    {passwordType === "password" ? (
                      <img
                        className="cursor-pointer "
                        src={eyeIcon}
                        alt=""
                      />
                    ) : (
                      <img
                        className="cursor-pointer "
                        src={closeeye}
                        alt=""
                      />
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
                  <span className="font-Inter text-secondaryGray mx-6 flex-shrink">
                    or
                  </span>
                  <div className="borders flex-grow border-t"></div>
                </div>
                <div className="google-signin h-3.3 mt-2.47 font-Inter text-lightBlue box-border flex text-desc  cursor-pointer items-center justify-center rounded-lg font-normal leading-2.8">
                  <img src={socialLogo} alt="" className="pr-0.781" />
                  Continue with Google
                </div>
                <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-1.8 leading-2.8 text-signLink">
                  <Link to="forgot-password">
                    <h3>Forgot your password?</h3>
                  </Link>
                </div>
                <div className="font-Poppins text-secondaryGray text-center text-base font-normal mt-5  text-signLink ">
                  Don’t have an account yet?{" "}
                  <Link to="signup" className="text-blue-500 underline">
                    {" "}
                    Let’s Sign Up
                  </Link>
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
  // userName: Yup.string()
  //   .required("Username is required")
  //   .min(5, "Username should be more than 5 character long")
  //   .max(30, "Username should not exceed 30 characters")
  //   .trim(),
  email: Yup.string()
  .email("Must be a valid email")
  .max(255)
  .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be atleast 8 characters")
    .matches(
      Password_regex,
      "Password must have one uppercase , one lowercase , a digit and specialcharacters"
    ),
});

export default SignIn;
