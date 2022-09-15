import profileImage from '../../../../assets/images/profile-member.svg';
import slackIcon from '../../../../assets/images/slack.svg';
import unsplashIcon from '../../../../assets/images/unsplash_mj.svg';
import closeIcon from '../../../../assets/images/close-member.svg';
import Button from 'common/button';

const MergedMembers: React.FC = () => (
  <div className=" mx-auto mt-[3.3125rem]">
    <div className="flex justify-between items-center border-review pb-5">
      <div className="flex flex-col">
        <h3 className="font-Poppins font-semibold leading-2.18 text-infoData text-infoBlack">Merged Members</h3>
      </div>
      <Button
        type="button"
        text="Add Member"
        className="border-none text-white font-Poppins btn-save-modal text-search font-medium leading-1.31 cursor-pointer  w-[9.625rem] h-3.06 shadow-contactBtn rounded-0.3 "
      />
    </div>
    <div className="flex flex-col mt-1.8">
      <div className="relative">
        <h3 className="font-Poppins font-semibold leading-1.56 text-infoBlack text-base">Primary Member</h3>
        <div className="flex flex-wrap gap-5">
          <div className="flex items-center app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 ">
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
      </div>
      <div className="flex flex-col mt-2.55">
        <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.56">Potential Duplicates</h3>
        <div className="flex flex-wrap gap-5 relative">
          <div>
            <div className="flex items-center primary-card app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 relative">
              <div className="w-16 h-16">
                <img src={profileImage} alt="" />
              </div>
              <div className="flex flex-col pl-3">
                <div className="font-Poppins font-semibold text-trial  text-profileBlack leading-1.31">Sam Winchester</div>
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
          <div className="relative">
            <div className="flex items-center primary-card box-border app-input-card-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 relative">
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

export default MergedMembers;
