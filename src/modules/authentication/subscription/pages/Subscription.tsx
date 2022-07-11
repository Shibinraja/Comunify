import Button from "common/button";
import Input from "common/input";
import bgSubscriptionImage from "../../../../assets/images/bg-sign.svg";
import cardNumberIcon from "../../../../assets/images/card.svg";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { SubscriptionValues } from 'modules/authentication/interface/authentication.interface';


const Subscription : React.FC  = () => {
  const navigate = useNavigate();

  const initialValues: SubscriptionValues = {
    username: "",
    password: "",
    card_holder: "",
    cardnumber: "",
    cvv: "",
  };

  const handleSubmit = (values: SubscriptionValues): void => {
    navigate("/create-workspace");
  };

  return (
    <div className="w-full flex flex-col subscription-wrapper">
      <div className="flex w-full relative">
        <div className="w-1/2 subscription-cover-bg bg-no-repeat bg-left rounded-lg  bg-thinBlue flex items-center justify-center py-20 fixed">
          <img src={bgSubscriptionImage} alt="" />
        </div>
        <div className="w-1/2 flex  flex-col pl-7.5 mt-2.53   overflow-y-auto no-scroll-bar absolute right-0 pb-3.75">
          <h1 className="font-Inter font-bold text-neutralBlack text-signIn leading-2.8">
            Subscription
          </h1>
          <p className="mt-0.78 font-Inter font-normal text-desc max-w-sm leading-1.8 text-lightGray">
            Get Comunified with your communities. Create your account now.
          </p>
          <div className="form mt-1.8">
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                  className="w-25.9 "
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div className="card-holder-name">
                    <Input
                      type="text"
                      placeholder="Card Holder Name"
                      label="Card Holder Name"
                      id="card-holder"
                      name="card_holder"
                      className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.card_holder}
                    />
                  </div>
                  <div className="card  relative mt-1.258">
                    <Input
                      type="text"
                      placeholder="Card Number"
                      label="Card Number"
                      id="cardnumber"
                      name="cardnumber"
                      className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.cardnumber}
                    />
                    <img
                      className="absolute icon-holder left-96 cursor-pointer"
                      src={cardNumberIcon}
                      alt=""
                    />
                  </div>
                  <div className="flex mt-1.258">
                    <div className="w-1/2">
                      <Input
                        type="text"
                        placeholder="Expiration Date"
                        label="Expiration Date"
                        id="expire"
                        name="expire"
                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.username}
                      />
                    </div>
                    <div className="w-1/2 pl-5">
                      <Input
                        type="text"
                        placeholder="CVV"
                        label="CVV"
                        id="cvv"
                        name="cvv"
                        className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.cvv}
                      />
                    </div>
                  </div>
                  <div className="country mt-1.258">
                    <Input
                      type="text"
                      placeholder="Country"
                      label="Country"
                      id="country"
                      name="country"
                      className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.username}
                    />
                  </div>
                  <div className="pb-10">
                    <Button
                      text="Submit"
                      type="submit"
                      className="font-Poppins rounded-lg text-base font-semibold text-white mt-1.8 h-3.6 w-full hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <div className="py-1.9"></div>
    </div>
  );
};

export default Subscription;
