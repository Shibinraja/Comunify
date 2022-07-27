import './account.css';
import profileImage from '../../../assets/images/profile-member.svg';
import { useState } from 'react';
import dropdownIcon from '../../../assets/images/Vector.svg';
import Input from 'common/input';
import Button from 'common/button';


const Account = () => {
    const [isDropDownActive, setDropDownActive] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>('');
    const options = ['Sales', 'Marketing', 'Customer Service'];

    const handleDropDownActive = (): void => {
        setDropDownActive(prev => !prev);
    };

    return (
        <div className="container mx-auto profile pb-10">
            <div className="flex">
                <div className="w-full">
                    <div className="h-44.5 box-border bg-white rounded-0.6 app-input-card-border shadow-contactCard">
                        <div className="flex flex-col mt-1.16 px-1.56">
                            <div className="flex flex-col">
                                <h3 className="font-Poppins font-semibold text-accountBlack text-base leading-2.12">
                                    Account
                                </h3>
                                <form className="flex flex-col relative h-[400px] mt-1.8">
                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label
                                                htmlFor="fullname"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                Full Name
                                            </label>
                                            <Input
                                                type="text"
                                                name="fullname"
                                                id="nameId"
                                                className="shadow-inputShadow mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white w-18.75 h-2.81 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                                                placeholder="Enter Name"
                                            />
                                        </div>
                                        <div className="flex flex-col pl-5">
                                            <label
                                                htmlFor="username"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                Username
                                            </label>
                                            <Input
                                                type="text"
                                                name="username"
                                                id="usernameId"
                                                className="shadow-inputShadow mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white w-18.75 h-2.81 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex flex-col mt-1.08">
                                            <label
                                                htmlFor="email"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                Email
                                            </label>
                                            <Input
                                                type="text"
                                                name="email"
                                                id="emailId"
                                                className="shadow-inputShadow mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white w-18.75 h-2.81 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                                                placeholder="example@mail.com"
                                            />
                                        </div>
                                        <div className="flex flex-col pl-5 mt-1.08">
                                            <label
                                                htmlFor="organization"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                Organization
                                            </label>
                                            <Input
                                                type="text"
                                                name="organization"
                                                id="organizationId"
                                                className="shadow-inputShadow mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white w-18.75 h-2.81 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                                                placeholder="Organisation Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex ">
                                        <div className="flex flex-col mt-1.08 ">
                                            <label
                                                htmlFor="domain"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                Domain
                                            </label>
                                            <div className="flex flex-col ">
                                                <div className="cursor-pointer" onClick={handleDropDownActive}>
                                                    <div className="flex items-center  justify-between p-2 app-result-card-border bg-white w-18.75 h-2.81 box-border shadow-inputShadow  rounded-0.3 mt-0.40 font-Poppins text-thinGray font-normal leading-1.31 text-trial">
                                                        <div className="">{selected ? selected : 'Select'}</div>
                                                        <img src={dropdownIcon} alt="" className={isDropDownActive ? 'rotate-180' : 'rotate-0'} />
                                                    </div>
                                                </div>
                                                {isDropDownActive && <div className="app-input-card-border bg-white shadow-integrationCardShadow rounded-0.6" onClick={handleDropDownActive}>
                                                    {options.map((option: string) =>
                                                        <div className="flex flex-col p-2 hover:bg-signUpDomain transition ease-in duration-300 cursor-pointer " key={option} onClick={() => setSelected(option)}>
                                                            <div className="text-searchBlack font-Poppins font-normal text-trial leading-1.31" >{option}</div>
                                                        </div>
                                                    )}
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex absolute right-1 top-72  items-center">
                                        <Button
                                            type="button"
                                            text="CANCEL"
                                            className="cancel box-border  h-2.81 w-5.25 border-cancel rounded mr-2.5 cursor-pointer font-Poppins font-medium leading-5 text-error text-thinGray"
                                        />
                                        <Button
                                            type="button"
                                            text="SAVE"
                                            className="h-2.81 w-5.25 border-none box-border rounded shadow-contactBtn btn-save-modal cursor-pointer font-Poppins font-medium leading-5 text-error text-white"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="flex flex-col ">
                                <h3 className="font-Poppins font-semibold text-infoBlack text-base leading-6">
                                    Password
                                </h3>
                                <form className="flex flex-col relative mt-1.8 pb-5">
                                    <div className="flex">
                                        <div className="flex flex-col">
                                            <label
                                                htmlFor="currentPassword"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                Current Password
                                            </label>
                                            <Input
                                                type="password"
                                                name="password"
                                                id="passwordId"
                                                className="shadow-inputShadow mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white w-18.75 h-2.81 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                                                placeholder="Enter Current Password"
                                            />
                                        </div>
                                        <div className="flex flex-col pl-5">
                                            <label
                                                htmlFor="newPassword"
                                                className="font-Poppins text-trial text-infoBlack font-normal leading-1.31"
                                            >
                                                New Password
                                            </label>
                                            <Input
                                                type="password"
                                                name="newPassword"
                                                id="newPasswordId"
                                                className="shadow-inputShadow mt-0.40 px-3 app-result-card-border focus:outline-none box-border bg-white w-18.75 h-2.81 rounded-0.3 placeholder:text-thinGray placeholder:font-Poppins placeholder:font-normal placeholder:leading-1.31 placeholder:text-trial"
                                                placeholder="Enter New Password"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex absolute left-0 top-[120px]  items-center">
                                            <a
                                                href=""
                                                className="underline font-Inter font-normal leading-1.56 text-skipGray text-reset"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <div className="flex absolute right-0 top-28  items-center">
                                            <Button
                                                type="button"
                                                text="CANCEL"
                                                className="mr-2.5 cancel box-border  h-2.81 w-5.25 border-cancel rounded border-none cursor-pointer font-Poppins font-medium leading-5 text-error text-thinGray"
                                            />
                                            <Button
                                                type="button"
                                                text="UPDATE PASSWORD"
                                                className="border-none rounded h-2.81 w-10.25 btn-save-modal shadow-contactBtn cursor-pointer font-Poppins font-medium leading-5 text-error text-white"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-[40%]">
                    <div className="w-full pl-2.06 flex flex-col ">
                        <div className="app-input-card-border items-center bg-red-500 justify-center btn-save-modal rounded-t-0.6 w-full shadow-contactCard box-border h-6.438"></div>
                        <div className="flex flex-col app-input-card-border items-center justify-center bg-white rounded-b-0.6 w-full shadow-contactCard box-border h-11.06">
                            <div className="-mt-24 ">
                                <img src={profileImage} alt="profileImage" className="bg-cover " />
                            </div>
                            <div className="mt-0.688 text-profileBlack font-semibold font-Poppins leading-1.31 text-trial">
                                Dmitry Kargaev
                            </div>
                            <div className="mt-1.125">
                                <Button
                                    type="button"
                                    text="CHOOSE PHOTO"
                                    className="border-none shadow-contactBtn btn-save-modal w-8.25 h-8 rounded font-Poppins font-medium text-error leading-5 text-white cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center items-center app-input-card-border mt-2.063 shadow-contactCard rounded-0.6 bg-white box-border w-full h-12.063">
                            <h3 className="font-Poppins font-semibold text-contact text-infoBlack leading-2.06">
                                Have a question?
                            </h3>
                            <div className="mt-2 text-slimGray font-Poppins font-normal text-trial leading-1.31">
                                We can help you
                            </div>
                            <div className="mt-5">
                                <Button
                                    type="button"
                                    text="CONTACT US"
                                    className="shadow-contactBtn w-32 h-2.81 bg-black rounded border-none text-white font-Poppins font-medium text-error leading-5 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account;