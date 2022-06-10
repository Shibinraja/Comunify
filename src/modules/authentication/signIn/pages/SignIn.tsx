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
import bgSiginImage from "../../../../assets/images/bg-sign.svg";
import eyeIcon from "../../../../assets/images/eye.svg";

import "./SignIn.css";
import Header from 'common/header';
import Footer from 'common/footer';

const SignIn = () => {
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

  return (
    <div className="w-full flex flex-col justify-between h-screen relative overflow-y-auto no-scroll-bar">
      <Header />
      <div className="flex w-full container mx-auto ">
        <div className="w-full md:w-2/5  mt-5.2 flex flex-col pl-10 ">
          {" "}
          <h3 className="font-Inter text-neutralBlack font-bold not-italic text-signIn leading-2.8">
            Sign in{" "}
          </h3>{" "}
          <p className="text-lightGray font-Inter  max-w-sm font-normal not-italic mt-0.78 text-desc">
            Welcome back to Comunify. Let's get you know your communities better{" "}
          </p>
          <form className="flex flex-col pb-10 mt-1.8 w-25.9 " autoComplete="off">
            <div className="username">
              <Input
                type="text"
                placeholder="User Name/Email"
                label="Username"
                id="username"
                name="username"
              />
            </div>
            <div className="password mt-1.13 relative ">
              <Input
                type="password"
                placeholder="Password"
                label="Password"
                id="password"
                name="password"
              />
              <img
                className="absolute icon-holder left-96 cursor-pointer "
                src={eyeIcon}
                alt=""
              />
            </div>
            <Button
              text="Sign In"
              type="submit"
              className="font-Poppins rounded-lg text-base text-white mt-1.8 h-3.6 button-hover transition ease-in duration-300"
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
              <a href=""> Forgot your password?</a>
            </div>
            <div className="font-Inter text-secondaryGray text-center text-base font-normal mt-5  text-signLink">
              Don’t have an account yet?{" "}
              <a href="" className="text-blue-500 underline">
                {" "}
                Let’s Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
      <div className="container mx-auto fixed right-0 flex items-center justify-center">
        <div className="pb-80 w-full md:w-3/5 login-cover-bg bg-no-repeat bg-right rounded-lg  bg-thinBlue flex items-center justify-center absolute top-20 right-0 mt-5 py-20 ">
          <img src={bgSiginImage} alt="" />
        </div>
      </div>
      <div className="py-1.9"></div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default SignIn;
