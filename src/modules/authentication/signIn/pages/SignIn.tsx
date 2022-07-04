import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "common/button/Button";
import Input from "common/input/Input";
import { useAppDispatch } from "@/hooks/useRedux";
import useLoading from "@/hooks/useLoading";
import { LOGIN } from "../../store/actions/auth.actions";
import authSlice from "../../store/slices/auth.slice";
import { signInInput } from "../interface/signIn.interface";
import { loginSchema } from "@/lib/validation";
import socialLogo from "../../../../assets/images/Social.svg";
import bgSignInImage from "../../../../assets/images/bg-sign.svg";
import eyeIcon from "../../../../assets/images/eye.svg";
import closeEyeIcon from "../../../../assets/images/closeeye.png";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "./SignIn.css";
import { useState } from "react";

const SignIn: React.FC = () => {
  //   const dispatch = useAppDispatch();
  //   const isLoading = useLoading(LOGIN);
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<LoginBody>({ resolver: yupResolver(loginSchema) });

  //   const onSubmit: SubmitHandler<LoginBody> = (data) => {
  //     dispatch(authSlice.actions.login(data));
  //   };
  interface FormValues {
    username: string;
  }

  const initialValues: FormValues = {
    username: "",
  };

  const handleSubmit = (values: FormValues): void => {
    console.log(JSON.stringify(values));
  };

  const signInSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(5, "Username should be more than 5 character long")
      .max(30, "Username should not exceed 30 characters")
      .trim(),
  });

  const [passwordType, setPasswordType] = useState("password");
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
            Sign in{" "}
          </h3>{" "}
          <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
            Welcome back to Comunify. Let's get you know your communities better{" "}
          </p>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={signInSchema}
          >
            {(formik) => (
              <Form
                className="flex flex-col  mt-1.8 w-25.9 "
                autoComplete="off"
              >
                <div className="username">
                  <Input
                    type="text"
                    placeholder="User Name/Email"
                    label="Username"
                    id="username"
                    name="username"
                    className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
                  />
                </div>
                <div className="password mt-1.13 relative ">
                  <div className="flex items-center relative password mt-1.258 w-25.9">
                    <Input
                      type={passwordType}
                      placeholder="Password"
                      label="Password"
                      id="password"
                      name="password"
                      className="h-4.5 w-25.9   rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 font-Inter box-border"
                    />
                    <div className="absolute  right-5" onClick={togglePassword}>
                      {passwordType === "password" ? (
                        <img className="cursor-pointer " src={eyeIcon} alt="" />
                      ) : (
                        <img
                          className="cursor-pointer "
                          src={closeEyeIcon}
                          alt=""
                        />
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  text="Sign In"
                  type="button"
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
                <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-1.8 leading-2.8 text-signLink">
                  <Link to="forgot-password">
                    <h3>Forgot your password?</h3>
                  </Link>
                </div>
                <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-5  text-signLink ">
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

export default SignIn;
