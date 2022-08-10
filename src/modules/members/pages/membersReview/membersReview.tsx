import React, { useState } from 'react';
import mergeIcon from '../../../../assets/images/merged.svg';
import modalMergeIcon from '../../../../assets/images/merge.svg';

import profileImage from '../../../../assets/images/profile-member.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import unsplashIcon from '../../../../assets/images/unsplash_mj.svg';
import closeIcon from '../../../../assets/images/close-member.svg';
import Button from 'common/button';
import Modal from 'react-modal';
import './membersReview.css';

Modal.setAppElement('#root');

const MembersReview: React.FC = () => {
  const [isModalOpen, setisModalOpen] = useState<boolean>(false);
  const handleModal = (val: boolean) => {
    setisModalOpen(val);
  };
  return (
    <div className=" mx-auto mt-[3.3125rem]">
      <div className="flex justify-between items-center border-review pb-5">
        <div className="flex flex-col">
          <h3 className="font-Poppins font-semibold leading-2.18 text-infoData text-infoBlack">Review Merge Suggestions</h3>
          <p className="mt-0.313 font-Poppins font-normal leading-1.31 text-error">
            Merge members to combine two or more duplicate profiles into one
          </p>
        </div>
        <div className="flex justify-between btn-save-modal items-center px-4 cursor-pointer w-7.81 h-3.06 shadow-contactBtn rounded-0.3 ">
          <div>
            <Button
              type="button"
              text="Merge"
              className="border-none text-white font-Poppins text-search font-medium leading-1.31 cursor-pointer w-5.25 h-2.81 rounded  "
              onClick={() => handleModal(true)}
            />
          </div>
          <div className="">
            <img src={mergeIcon} alt="" />
          </div>
          <Modal
            isOpen={isModalOpen}
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => setisModalOpen(false)}
            className="w-24.31 h-18.43 mx-auto rounded-lg modals-tag bg-white shadow-modal flex items-center justify-center"
            style={{
              overlay: {
                display: 'flex',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                alignItems: 'center'
              }
            }}
          >
            <div className="flex flex-col items-center justify-center ">
              <div className="bg-cover">
                <img src={modalMergeIcon} alt="" />
              </div>
              <div className="mt-5 leading-6 text-black font-Inter font-semibold text-xl w-2/3 text-center">Are you sure want to merge members</div>
              <div className="flex mt-1.8">
                <Button
                  type="button"
                  text="NO"
                  className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
                  onClick={() => setisModalOpen(false)}
                />
                <Button
                  type="button"
                  text="YES"
                  className="border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal"
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="flex flex-col mt-1.8">
        <div className="relative">
          <h3 className="font-Poppins font-semibold leading-1.56 text-infoBlack text-base">Primary Member</h3>
          <div className="flex items-center app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5">
            <div className="w-16 h-16">
              <img src={profileImage} alt="" />
            </div>
            <div className="flex flex-col pl-3">
              <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31">Sam Winchester</div>
              <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="w-1.001 h-1.001 mr-0.34">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="w-1.001 h-1.001 mr-0.34">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="w-1.001 h-1.001 mr-0.34">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
              <div className="flex absolute left-[20rem] bottom-4 items-center">
                <label htmlFor="opt1" className="flex items-center">
                  <input type="radio" className="hidden peer" name="radio" id="opt1" />{' '}
                  <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                  Primary
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2.55">
          <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.56">Potential Duplicates</h3>
          <div className="flex relative">
            <div>
              <div className="flex items-center primary-card box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 relative">
                <div className="w-16 h-16">
                  <img src={profileImage} alt="" />
                </div>
                <div className="flex flex-col pl-3">
                  <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31">Sam Winchester</div>
                  <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">dmrity125@mail.com | neoito technologies</div>
                  <div className="flex mt-2.5">
                    <div className="w-1.001 h-1.001 mr-0.34">
                      <img src={slackIcon} alt="" />
                    </div>
                    <div className="w-1.001 h-1.001 mr-0.34">
                      <img src={unsplashIcon} alt="" />
                    </div>
                    <div className="w-1.001 h-1.001 mr-0.34">
                      <img src={slackIcon} alt="" />
                    </div>
                  </div>
                  <div className="flex absolute right-8 bottom-4 items-center">
                    <label htmlFor="opt2" className="flex items-center">
                      <input type="radio" className="hidden peer" name="radio" id="opt2" />{' '}
                      <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                      Primary
                    </label>
                  </div>
                </div>
                <div className="absolute right-7 top-5 cursor-pointer">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
            </div>
            <div className="pl-5 relative">
              <div className="flex items-center primary-card box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 relative">
                <div className="w-16 h-16">
                  <img src={profileImage} alt="" />
                </div>
                <div className="flex flex-col pl-3">
                  <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31">Sam Winchester</div>
                  <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">dmrity125@mail.com | neoito technologies</div>
                  <div className="flex mt-2.5">
                    <div className="w-1.001 h-1.001 mr-0.34">
                      <img src={slackIcon} alt="" />
                    </div>
                    <div className="w-1.001 h-1.001 mr-0.34">
                      <img src={unsplashIcon} alt="" />
                    </div>
                    <div className="w-1.001 h-1.001 mr-0.34">
                      <img src={slackIcon} alt="" />
                    </div>
                  </div>
                  <div className="flex absolute right-8 bottom-4 items-center">
                    <label htmlFor="opt3" className="flex items-center">
                      <input type="radio" className="hidden peer" name="radio" id="opt3" />{' '}
                      <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                      Primary
                    </label>
                  </div>
                </div>
                <div className="absolute right-7 top-5 cursor-pointer">
                  <img src={closeIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersReview;
