import React, { useState } from 'react';
import Button from 'common/button';
import Input from 'common/input';
import bgSubscriptionImage from '../../../../assets/images/bg-sign.svg';
import { SubscriptionValues } from 'modules/authentication/interface/auth.interface';
import { Formik, Form } from 'formik';
import { SubscriptionProps } from 'interface/interface';
import CheckoutForm from '../../../settings/pages/subscription/CheckoutForm';
import { BillingDetails } from '../../../settings/interface/settings.interface';
import * as Yup from 'yup';
import { email_regex, whiteSpace_single_regex } from '../../../../constants/constants';

export const PaymentCard: React.FC<SubscriptionProps> = ({ subscriptionData }) => {
  const initialValues: SubscriptionValues = { billingName: '', billingEmail: '' };
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({ billingName: '', billingEmail: '' });
  const [submitForm, SetSubmitForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // eslint-disable-next-line space-before-function-paren
  const handleSubmit = async (values: SubscriptionValues) => {
    setIsLoading(true);
    setBillingDetails({ billingName: values.billingName, billingEmail: values.billingEmail });
    SetSubmitForm(true);
  };

  const disableButtonLoader = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-auto layout-height">
      <div className=" flex h-full overflow-auto ">
        <div className="w-3/5 2xl:w-1/2 auth-layout-section flex items-center justify-center 3xl:justify-end pr-0   3xl:pr-16 py-10">
          <div className="flex items-center justify-center">
            <img src={bgSubscriptionImage} alt="" className="w-9/12 xl:w-[621px] 3xl:w-full object-cover" />
          </div>
        </div>

        <div className="flex justify-center xl:items-center 3xl:justify-start  pl-0 3xl:pl-16 pb-16">
          <div className="flex flex-col pt-24 pb-6 ">
            <div className="w-25.9">
              <h1 className="font-Inter font-bold text-signIn text-neutralBlack leading-2.8">Subscription</h1>{' '}
              <p className="mt-0.81 text-desc font-normal leading-1.8 font-Inter text-lightGray max-w-sm">
                Get Comunified with your communities. Create your account now.
              </p>
              <div className="subscriptionCard  mx-auto  w-25.9 h-[417px] mt-6">
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange validationSchema={billingDetailsScheme}>
                  {({ errors, handleBlur, handleChange, handleSubmit, touched, values }): JSX.Element => (
                    <Form className="w-25.9 " autoComplete="off" onSubmit={handleSubmit}>
                      <div className="card-holder-name mb-3">
                        <Input
                          type="text"
                          placeholder="Billing Name"
                          label="Billing Name"
                          id="card-holder"
                          name="billingName"
                          className="h-4.5 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.billingName}
                          errors={Boolean(touched.billingName && errors.billingName)}
                          helperText={touched.billingName && errors.billingName}
                        />
                      </div>
                      <div className="card-holder-email">
                        <Input
                          type="text"
                          placeholder="Billing Email"
                          label="Billing Email"
                          id="billing-email"
                          name="billingEmail"
                          className="h-4.5 mt-2 rounded-lg bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.billingEmail}
                          errors={Boolean(touched.billingEmail && errors.billingEmail)}
                          helperText={touched.billingEmail && errors.billingEmail}
                        />
                      </div>
                      <div>
                        <CheckoutForm
                          redirectCondition="signup-card"
                          billingDetails={billingDetails}
                          subscriptionId={subscriptionData?.id}
                          submitForm={submitForm}
                          disableButtonLoader={disableButtonLoader}
                        />
                      </div>
                      <div className="pb-10">
                        <Button
                          text="Submit"
                          disabled={isLoading ? true : false}
                          type="submit"
                          className={`font-Poppins rounded-lg text-base font-semibold ${
                            isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          }  text-white mt-1.8 h-3.6 w-full hover:shadow-buttonShadowHover transition ease-in duration-300 btn-gradient`}
                        />
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const billingDetailsScheme = Yup.object().shape({
  billingName: Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(4, 'Billing Name must be at least 4 characters')
    .max(25, 'Billing Name should not exceed above 25 characters')
    .matches(whiteSpace_single_regex, 'White spaces are not allowed')
    .required('Billing Name is a required field')
    .nullable(true),
  billingEmail: Yup.string()
    .email('Must be a valid email')
    .matches(email_regex, 'Must be a valid email')
    .max(100)
    .required('Billing Email is required')
});
