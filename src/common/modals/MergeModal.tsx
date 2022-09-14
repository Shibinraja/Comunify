import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import searchIcon from '../../assets/images/search.svg';
import slackIcon from '../../assets/images/slack.svg';
import unsplashIcon from '../../assets/images/unsplash_mj.svg';
import Modal from 'react-modal';
import Button from 'common/button';

type MergeModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

const MergeModal: React.FC<MergeModalProps> = ({ modalOpen, setModalOpen }) => {
  const { workspaceId, memberId } = useParams();
  const navigate = useNavigate();

  const navigateToReviewMerge = () => {
    navigate(`${workspaceId}/members/${memberId}/members-review`);
  };

  return (
    <Modal
      isOpen={modalOpen}
      shouldCloseOnOverlayClick={false}
      onRequestClose={() => setModalOpen(false)}
      className="w-24.31 pb-28 mx-auto  mt-32 rounded-lg modals-tag bg-white shadow-modal "
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
      <div className="flex flex-col ml-1.8 pt-9 ">
        <h3 className="font-Inter font-semibold text-xl leading-1.43">Merge Members</h3>
        <div className="flex relative items-center mt-1.43">
          <input
            type="text"
            className="input-merge-search focus:outline-none px-3 pr-8 box-border w-20.5 h-3.06 rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
            placeholder="Search Members"
          />
          <div className="absolute right-12 w-0.78 h-3 z-40">
            <img src={searchIcon} alt="" />
          </div>
        </div>
        <div className="flex flex-col overflow-scroll overflow-y-scroll member-section mt-1.8 height-member-activity">
          <div className="flex">
            <div className="mr-0.34">
              <input type="checkbox" className="checkbox" />
            </div>
            <div className="flex flex-col">
              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
              <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mr-0.34">
              <input type="checkbox" className="checkbox" />
            </div>
            <div className="flex flex-col">
              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
              <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mr-0.34">
              <input type="checkbox" className="checkbox" />
            </div>
            <div className="flex flex-col">
              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
              <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mr-0.34">
              <input type="checkbox" className="checkbox" />
            </div>
            <div className="flex flex-col">
              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
              <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mr-0.34">
              <input type="checkbox" className="checkbox" />
            </div>
            <div className="flex flex-col">
              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
              <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="mr-0.34">
              <input type="checkbox" className="checkbox" />
            </div>
            <div className="flex flex-col">
              <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">Emerson Schleifer</div>
              <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">dmrity125@mail.com | neoito technologies</div>
              <div className="flex mt-2.5">
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={unsplashIcon} alt="" />
                </div>
                <div className="mr-0.34 w-1.001 h-1.001">
                  <img src={slackIcon} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex right-8 mt-1.8">
            <Button
              type="button"
              text="CANCEL"
              className="mr-2.5 font-Poppins text-error font-medium border-cancel  leading-1.31 text-thinGray cursor-pointer w-5.25 h-2.81 rounded box-border"
              onClick={() => setModalOpen(false)}
            />
            <Button
              type="button"
              text="SUBMIT"
              className="submit border-none text-white font-Poppins text-error font-medium leading-1.31 cursor-pointer w-5.25 h-2.81 rounded shadow-contactBtn btn-save-modal"
              onClick={navigateToReviewMerge}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MergeModal;
