/* eslint-disable space-before-function-paren */
import './account.css';
import profileImage from '../../../assets/images/user-image.svg';
import { KeyboardEvent, ChangeEvent, useEffect, useRef, useState } from 'react';
import dropdownIcon from '../../../assets/images/Vector.svg';
import Input from 'common/input';
import Button from 'common/button';
import closeEyeIcon from '../../../assets/images/closeEyeIcon.svg';
import eyeIcon from '../../../assets/images/eye.svg';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { companyName_regex, password_regex, userName_regex, whiteSpace_regex } from 'constants/constants';
import accountSlice from '../store/slice/account.slice';
import { ChangePassword, profilePicInput, userProfileDataInput } from '../interfaces/account.interface';
import { useDispatch } from 'react-redux';
import { decodeToken } from '@/lib/decodeToken';
import { DecodeToken } from 'modules/authentication/interface/auth.interface';
import { showErrorToast } from 'common/toast/toastFunctions';
import { userProfileDataService } from '../services/account.services';
import cookie from 'react-cookies';
import { getLocalWorkspaceId } from '@/lib/helper';
import { NavLink } from 'react-router-dom';

const Account = () => {
  const initialValues: ChangePassword = {
    currentPassword: '',
    newPassword: ''
  };

  const userInitialValues: userProfileDataInput = {
    id: '',
    name: '',
    userName: '',
    fullName: '',
    domainSector: '',
    email: '',
    profilePhotoUrl: '',
    displayUserName: '',
    createdAt: '',
    updatedAt: '',
    organization: ''
  };

  const [isDropDownActive, setDropDownActive] = useState<boolean>(false);
  const [profileUploadImage, setProfileUploadImage] = useState<string>('');
  const workspaceId = getLocalWorkspaceId();
  const options = ['Marketing', 'Sales', 'Customer Support', 'Customer Success', 'Others'];
  const [currentPassword, setPasswordType1] = useState<string>('password');
  const [newPassword, setPasswordType2] = useState<string>('password');
  const [profileData, setProfileData] = useState<userProfileDataInput>(userInitialValues);
  const [cursor, setCursor] = useState<number>(0);
  const [selectedDomainSector, setSelectedDomainSector] = useState<string>('Select');

  const accessToken = localStorage.getItem('accessToken') || cookie.load('x-auth-cookie');
  const decodedToken: DecodeToken = accessToken && decodeToken(accessToken);
  const formikRef: any = useRef();
  const passwordFormikRef: any = useRef();
  const imageRef = useRef<HTMLInputElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const domainRef = useRef<HTMLLIElement>(null);

  const dispatch = useDispatch();

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropDownRef && dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
      setDropDownActive(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isDropDownActive) {
      domainRef?.current?.focus();
    }
  }, [isDropDownActive]);

  const fetchProfileData = async () => {
    try {
      const userId = decodedToken.id.toString();
      const response = await userProfileDataService(userId);
      setProfileData(response);
      formikRef.current.resetForm({
        values: {
          name: response.name,
          fullName: response.fullName || '',
          userName: response.userName,
          email: response.email,
          organization: response.organization?.name,
          domainSector: response.domainSector,
          profilePhotoUrl: response.profilePhotoUrl,
          displayUserName: response.displayUserName
        }
      });
      if (response.domainSector) {
        setSelectedDomainSector(response.domainSector);
      }
    } catch {
      showErrorToast('Failed to load Profile Data');
    }
  };

  const togglePassword1 = () => {
    if (currentPassword === 'currentPassword') {
      setPasswordType1('text');
      return;
    }
    setPasswordType1('currentPassword');
  };

  const togglePassword2 = () => {
    if (newPassword === 'currentPassword') {
      setPasswordType2('text');
      return;
    }
    setPasswordType2('currentPassword');
  };

  const imageUploadHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files?.[0];
    setProfileUploadImage(URL.createObjectURL(imageFile as Blob));
    const base64: any = await convertBase64(imageFile);
    const uploadData = { profilePic: base64?.toString() || '', fileName: imageFile?.name || 'file' };
    dispatch(accountSlice.actions.uploadProfilePic(uploadData as profilePicInput));
  };

  const convertBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

  const handleDomainSectorChange = (option: string): void => {
    // Formik ref to enable to make the custom dropdown with field touch and set the value for the fields.
    formikRef?.current?.setFieldTouched('domainSector');
    formikRef?.current?.setFieldValue('domainSector', option, true);
    setSelectedDomainSector(option);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    // arrow up/down button should select next/previous list element
    if (e.keyCode === 38 && cursor > 0) {
      setCursor((prevState: number) => prevState - 1);
    }
    if (e.keyCode === 40 && cursor < options.length - 1) {
      setCursor((prevState: number) => prevState + 1);
    }
    if (e.keyCode === 13) {
      handleDomainSectorChange(options[cursor]);
      setDropDownActive(false);
    }
  };

  const handleSubmit = async (values: ChangePassword): Promise<void> => {
    const newValues = { ...values };
    dispatch(accountSlice.actions.changePassword(newValues));
    passwordFormikRef.current.resetForm({
      values: {
        currentPassword: '',
        newPassword: ''
      }
    });
  };

  const handleUserDataSubmit = async (values: userProfileDataInput): Promise<void> => {
    const userUpdateData = {
      fullName: values.fullName,
      userName: values.userName,
      organization: values.organization,
      domainSector: values.domainSector
    };
    dispatch(accountSlice.actions.userProfileUpdateData(userUpdateData));
  };

  return (
    <div className="profile pt-16 pb-10">
      <div className="flex">
        <div className="w-full md:w-[60%] xl:w-[70%]">
          <div className="pb-10 box-border bg-white rounded-0.6 app-input-card-border shadow-contactCard">
            <div className="flex flex-col mt-1.16 px-1.56">
              <div className="flex flex-col">
                <h3 className="font-Poppins font-semibold text-accountBlack text-base leading-2.12">Account</h3>
                <Formik
                  onSubmit={handleUserDataSubmit}
                  validateOnChange={true}
                  validationSchema={profileUpdateSchema}
                  initialValues={userInitialValues}
                  innerRef={formikRef}
                >
                  {({ errors, handleBlur, handleChange, touched, values }): JSX.Element => (
                    <Form className="w-full mt-1.9 relative " autoComplete="off">
                      <div className="">
                        <div className="flex w-full">
                          <div className="flex flex-col w-1/2">
                            <label htmlFor="fullName" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31">
                              Full Name
                            </label>
                            <Input
                              type="text"
                              name="fullName"
                              id="fullName"
                              className="shadow-inputShadow mt-0.40 px-3 h-2.81 app-result-card-border focus:outline-none box-border bg-white w-full py-2 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                              placeholder="Enter Name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.fullName || ''}
                              errors={Boolean(touched.fullName && errors.fullName)}
                              helperText={touched.fullName && errors.fullName}
                            />
                          </div>
                          <div className="flex flex-col pl-5 w-1/2">
                            <label htmlFor="userName" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31">
                              Username
                            </label>
                            <Input
                              type="text"
                              name="userName"
                              id="userName"
                              className="shadow-inputShadow mt-0.40 px-3 h-2.81 app-result-card-border focus:outline-none box-border bg-white w-full py-2 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                              placeholder="Username"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.userName}
                              errors={Boolean(touched.userName && errors.userName)}
                              helperText={touched.userName && errors.userName}
                            />
                          </div>
                        </div>
                        <div className="flex w-full">
                          <div className="flex flex-col mt-1.08 w-1/2">
                            <label htmlFor="email" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31">
                              Email
                            </label>
                            <Input
                              type="text"
                              name="email"
                              id="emailId"
                              className="shadow-inputShadow bg-[#EBF8FF] h-2.81 mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white cursor-not-allowed	 w-full py-2 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                              placeholder="example@mail.com"
                              // onBlur={handleBlur}
                              // onChange={handleChange}
                              value={values.email}
                              disabled
                              errors={Boolean(touched.email && errors.email)}
                              helperText={touched.email && errors.email}
                            />
                          </div>
                          <div className="flex flex-col pl-5 mt-1.08 w-1/2">
                            <label htmlFor="organization" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31">
                              Organization
                            </label>
                            <Input
                              type="text"
                              name="organization"
                              id="organizationId"
                              className="shadow-inputShadow mt-0.40 h-2.81 px-3 app-result-card-border focus:outline-none box-border bg-white w-full py-2 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                              placeholder="Organization Name"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values?.organization}
                              errors={Boolean(touched.organization && errors.organization)}
                              helperText={touched.organization && errors.organization}
                            />
                          </div>
                        </div>
                        <div className="flex w-full">
                          <div className="flex flex-col mt-1.08 w-1/2">
                            <label htmlFor="domain" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31">
                              Domain
                            </label>
                            <div className="flex flex-col relative w-full">
                              <div className="cursor-pointer" ref={dropDownRef} onClick={() => setDropDownActive(!isDropDownActive)}>
                                <div className="flex items-center w-full  justify-between p-2 app-result-card-border bg-white  py-2 box-border shadow-inputShadow  rounded-0.3 mt-0.40 font-Poppins text-thinGray font-normal leading-1.31 text-trial">
                                  <div className={selectedDomainSector === 'Select' ? 'text-secondaryGray' : 'text-black'}>
                                    {selectedDomainSector ? selectedDomainSector : 'Select'}
                                  </div>
                                  <img src={dropdownIcon} alt="" className={isDropDownActive ? 'rotate-180' : 'rotate-0'} />
                                </div>
                              </div>
                              {isDropDownActive && (
                                <div className="app-input-card-border w-full bg-white shadow-integrationCardShadow rounded-0.6 absolute top-12 z-40">
                                  {options.map((option: string, index: number) => (
                                    <li
                                      ref={domainRef}
                                      className={`${cursor === index ? 'bg-signUpDomain' : null
                                      } flex flex-col p-2 hover:bg-signUpDomain transition ease-in duration-300 cursor-pointer`}
                                      onKeyDown={handleKeyDown}
                                      tabIndex={0}
                                      key={option}
                                      defaultValue={values.domainSector ? values.domainSector : 'Select'}
                                      onClick={() => {
                                        handleDomainSectorChange(option);
                                        setDropDownActive(false);
                                      }}
                                    >
                                      <div className="text-searchBlack font-Poppins font-normal text-trial leading-1.31">{option}</div>
                                    </li>
                                  ))}
                                </div>
                              )}
                            </div>

                          </div>
                        </div>

                        <div className="py-7">
                          <div className="flex items-center justify-end w-full">
                            <NavLink to={`${workspaceId}/dashboard`} className="p-0 m-0 mr-2">
                              <Button
                                type="button"
                                text="Cancel"
                                className="cancel box-border py-2 px-5 h-[45px] w-[84px] border-cancel rounded  cursor-pointer font-Poppins font-medium leading-5 text-error text-thinGray"
                              />
                            </NavLink>
                            <Button
                              type="submit"
                              text="Save"
                              className="py-2 px-5 h-[45px] w-[84px] border-none box-border rounded shadow-contactBtn btn-save-modal cursor-pointer font-Poppins font-medium leading-5 text-error text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="flex flex-col  w-full">
                <div className="report-border"></div>
                <h3 className="font-Poppins font-semibold text-infoBlack text-base leading-6 pt-7">Password</h3>
                <Formik
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                  validateOnChange={true}
                  validationSchema={changePasswordSchema}
                  innerRef={passwordFormikRef}
                >
                  {({ errors, handleBlur, handleChange, touched, values }): JSX.Element => (
                    <Form className="w-full mt-1.9 " autoComplete="off">
                      <div className="flex justify-between">
                        <div
                          className={`currentPassword relative w-1/2 ${errors.currentPassword === 'Password must have one uppercase, one lowercase, a digit and special characters'
                            ? 'cr-currentPassword '
                            : ''
                          }`}
                        >
                          <label htmlFor="currentPassword" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31 pb-1">
                            Current Password
                          </label>
                          <Input
                            type={currentPassword}
                            placeholder="Current Password"
                            label="Current Password"
                            id="currentPassword"
                            name="currentPassword"
                            // eslint-disable-next-line max-len
                            className={`h-2.81 relative  rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${touched.currentPassword && errors.currentPassword
                              ? 'border-lightRed h-2.81 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                              : ''
                            }`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.currentPassword}
                            errors={Boolean(touched.currentPassword && errors.currentPassword)}
                            helperText={touched.currentPassword && errors.currentPassword}
                          />
                          <div onClick={togglePassword1} className="absolute top-[2.6rem] right-4">
                            {currentPassword === 'currentPassword' ? (
                              <img className="cursor-pointer w-[13.39px] h-[9.47px]" src={eyeIcon} alt="" />
                            ) : (
                              <img className="cursor-pointer w-[13.39px] h-[9.47px]" src={closeEyeIcon} alt="" />
                            )}
                          </div>
                        </div>
                        <div
                          className={`currentPassword relative w-1/2 pl-[19px] ${errors.newPassword === 'Password must have one uppercase, one lowercase, a digit and special characters'
                            ? 'cr-currentPassword '
                            : ''
                          }`}
                        >
                          <label htmlFor="currentPassword" className="font-Poppins text-trial text-infoBlack font-normal leading-1.31 ">
                            New Password
                          </label>
                          <Input
                            type={newPassword}
                            placeholder="New Password"
                            label="New Password"
                            id="newPassword"
                            name="newPassword"
                            // eslint-disable-next-line max-len
                            className={`h-2.81 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border ${touched.newPassword && errors.newPassword
                              ? 'border-lightRed h-2.81 relative rounded-lg pr-3.12 bg-white p-2.5 focus:outline-none placeholder:font-normal placeholder:text-secondaryGray placeholder:text-base placeholder:leading-6 placeholder:font-Inter font-Inter box-border'
                              : ''
                            }`}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.newPassword}
                            errors={Boolean(touched.newPassword && errors.newPassword)}
                            helperText={touched.newPassword && errors.newPassword}
                          />
                          <div onClick={togglePassword2} className="absolute top-[2.6rem] right-4">
                            {newPassword === 'currentPassword' ? (
                              <img className="cursor-pointer w-[13.39px] h-[9.47px]" src={eyeIcon} alt="" />
                            ) : (
                              <img className="cursor-pointer w-[13.39px] h-[9.47px]" src={closeEyeIcon} alt="" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-11">
                        <div className="flex  items-center">
                          <a href="/forgot-password" className="underline font-Inter font-normal leading-1.56 text-skipGray text-reset">
                            Forgot your password?
                          </a>
                        </div>
                        <div className="flex   items-center">
                          <NavLink to={`${workspaceId}/dashboard`} className="p-0 m-0 mr-2">
                            <Button
                              type="button"
                              text="Cancel"
                              className=" cancel box-border px-3 h-[45px]  w-[84px] py-2 border-cancel rounded border-none cursor-pointer font-Poppins font-medium leading-5 text-error text-thinGray"
                            />
                          </NavLink>
                          <Button
                            type="submit"
                            text="Update Password"
                            className="border-none rounded h-[45px] py-2 px-3 w-[164px] btn-save-modal shadow-contactBtn cursor-pointer font-Poppins font-medium leading-5 text-error text-white"
                          />
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-[40%] xl:w-[30%]">
          <div className="w-full pl-2.06 flex flex-col ">
            <div className="app-input-card-border items-center bg-red-500 justify-center btn-save-modal rounded-t-0.6 w-full shadow-contactCard box-border h-6.438"></div>
            <div className="flex flex-col app-input-card-border items-center justify-center bg-white rounded-b-0.6 w-full shadow-contactCard box-border h-11.06">
              <div className="-mt-24 ">
                <img
                  className="bg-cover bg-center border-5 border-white rounded-full w-100 h-100"
                  // src={`${profileData?.profilePhotoUrl ? profileData?.profilePhotoUrl : profileImage}`}
                  src={`${profileData?.profilePhotoUrl ? (profileUploadImage ? profileUploadImage : profileData?.profilePhotoUrl) : profileImage}`}
                  onClick={() => {
                    imageRef.current?.click();
                  }}
                  alt="profileImage"
                />
              </div>
              <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial capitalize">
                {profileData?.displayUserName}
              </div>
              <div className="mt-1.125" onClick={() => imageRef.current?.click()}>
                <Button
                  type="button"
                  text="Choose Photo"
                  className="border-none shadow-contactBtn btn-save-modal w-[132px] h-[32px] rounded font-Poppins font-medium text-error  text-white cursor-pointer"
                />
                <input
                  type="file"
                  className="hidden absolute top-0 left-0 w-full flex-grow"
                  placeholder="uplaod image"
                  id="inputFile"
                  ref={imageRef}
                  accept="image/*"
                  onChange={(e) => imageUploadHandler(e)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center app-input-card-border mt-2.063 shadow-contactCard rounded-0.6 bg-white box-border w-full p-8">
              <h3 className="font-Poppins font-semibold text-contact text-infoBlack leading-2.06">Have a question?</h3>
              <div className=" text-sm font-Poppins font-normal text-tableDuration leading-1.31">We can help you</div>
              <div className="mt-5">
                <Button
                  onClick={() => window.open('https://comunifyllc.com/#getin')}
                  type="button"
                  text="Contact Us"
                  className="shadow-contactBtn py-2 bg-black rounded border-none text-white font-Poppins font-medium text-error leading-5 cursor-pointer w-[128px] h-[45px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const profileUpdateSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Full Name is required')
    .min(2, 'Full Name must be at least 2 alphabets')
    .max(50, 'Full Name should not exceed above 50 characters'),
  userName: Yup.string()
    .min(5, 'Username should be more than 5 character long')
    .max(25, 'Username should not exceed 25 characters')
    .matches(whiteSpace_regex, 'White spaces are not allowed')
    .matches(userName_regex, 'Username is not valid')
    .trim(),
  organization: Yup.string()
    .min(2, 'Company Name must be at least 2 characters')
    .max(15, 'Company Name should not exceed 15 characters')
    .strict(true)
    .matches(companyName_regex, 'Company Name is not valid')
    .trim('White spaces are not allowed')
});

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required('Current Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(password_regex, 'Password must have one uppercase, one lowercase, a digit and special characters'),
  newPassword: Yup.string()
    .required('New Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(password_regex, 'Password must have one uppercase, one lowercase, a digit and special characters')
});

export default Account;
