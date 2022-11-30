/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button';
import MemberSuggestionLoader from 'common/Loader/MemberSuggestionLoader';
import { showSuccessToast } from 'common/toast/toastFunctions';
import { MergeMembersDataResponse, MergeMembersDataResult } from 'modules/members/interface/members.interface';
import { getMergedMemberList, mergeMembers } from 'modules/members/services/members.services';
import { memberSuggestionType } from 'modules/members/services/service.types';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import closeIcon from '../../../../assets/images/close-member.svg';
import mergeIcon from '../../../../assets/images/merged.svg';
import { MergeMemberModal } from '../mergedMembers/MergeMemberModal';
import './membersReview.css';
import profileImage from '../../../../assets/images/user-image.svg';

Modal.setAppElement('#root');

enum ModalType {
  Merge = 'Merge',
  unMerge = 'UnMerge'
}
const MembersReview: React.FC = () => {
  const { workspaceId, memberId } = useParams();
  const navigate = useNavigate();
  const memberProfileCardData = JSON.parse(localStorage.getItem('primaryMemberId')!);
  const MergeMembersListData = JSON.parse(localStorage.getItem('merge-membersId')!);
  const [loading, setLoading] = useState<{ mergeListLoader: boolean; confirmationLoader: boolean }>({
    mergeListLoader: false,
    confirmationLoader: false
  });
  const [checkedRadioId, setCheckedRadioId] = useState<Record<string, unknown>>({ [memberProfileCardData[0]?.id]: true });
  const [modalOpen, setModalOpen] = useState<{ UnMergeModalOpen: boolean; confirmMerge: boolean; ChangePrimaryMember: boolean }>({
    UnMergeModalOpen: false,
    confirmMerge: false,
    ChangePrimaryMember: false
  });
  const [checkedId, setCheckedId] = useState<{ UnMergeMemberId: string; ChangePrimaryMemberId: string }>({
    UnMergeMemberId: '',
    ChangePrimaryMemberId: ''
  });
  const [MergeMembersList, setMergeMembersList] = useState<Array<MergeMembersDataResult>>([]);
  const [primaryMemberId, setPrimaryMemberId] = useState<any>([]);
  const [suggestionList, setSuggestionList] = useState<MergeMembersDataResponse>({
    result: [],
    nextCursor: null
  });

  // Function to call the api and list the mergedMembersList
  const getMergedMemberSuggestionList = (props: Partial<memberSuggestionType>) => {
    getMergedMemberList(
      {
        workspaceId: workspaceId!,
        memberId: memberId!,
        cursor: props.cursor as string | null,
        prop: props.prop as string,
        search: props.search as string,
        suggestionListCursor: props.suggestionListCursor as string | null
      },
      loaderSetAction
    ).then((data) =>
      setSuggestionList((prevState) => ({
        result: prevState.result.concat(data?.result as unknown as MergeMembersDataResult),
        nextCursor: data?.nextCursor as string | null
      }))
    );
  };

  //useEffect to call the api at initial load.
  useEffect(() => {
    getMergedMemberSuggestionList({
      cursor: null,
      prop: 'search',
      suggestionListCursor: suggestionList.nextCursor
    });
    setMergeMembersList(MergeMembersListData);
  }, []);

  // Make an Object based on the result data received form members platform
  useEffect(() => {
    if (primaryMemberId?.length < 1) {
      const memberProfileData = [...memberProfileCardData];
      const platform = memberProfileData[0].platforms;
      memberProfileData[0].platform = { platformLogoUrl: platform[0].platformLogoUrl };
      delete memberProfileData[0].platforms;
      setPrimaryMemberId(memberProfileData);
    }
  }, [memberProfileCardData]);

  useEffect(() => {
    //Function to concat the api response data with the Member Chosen and filter out the with the primary member selected.
    const filteredDuplicateMembers = MergeMembersList?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.id !== Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);

    //Function to concat the api response data with the Member Chosen and filter out the with the primary member not selected.
    const filteredPrimaryMember = MergeMembersList?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.id === Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });
    if (filteredPrimaryMember?.length) {
      setMergeMembersList(filteredDuplicateMembers);
      setPrimaryMemberId(filteredPrimaryMember);
      setCheckedId((prevId) => ({ ...prevId, ChangePrimaryMemberId: '' }));
    }
  }, [checkedRadioId]);

  const loaderSetAction = (type: string, loader: boolean) => {
    if (type === 'MergeListLoader') {
      setLoading((prev) => ({ ...prev, mergeListLoader: loader }));
    }

    if (type === 'ConfirmationLoader') {
      setLoading((prev) => ({ ...prev, confirmationLoader: loader }));
    }
  };

  const handleModal = (modalType: string) => {
    if (modalType === ModalType.Merge) {
      setModalOpen((prevState) => ({ ...prevState, confirmMerge: true }));
    }

    if (modalType === ModalType.unMerge) {
      setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: true }));
    }
  };

  const handleModalClose = () => {
    if (modalOpen.confirmMerge) {
      setModalOpen((prevState) => ({ ...prevState, confirmMerge: false }));
    }

    if (modalOpen.UnMergeModalOpen) {
      setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: false }));
    }

    if (modalOpen.ChangePrimaryMember) {
      setModalOpen((prevState) => ({ ...prevState, ChangePrimaryMember: false }));
    }
  };

  //On Submit functionality
  const handleOnSubmit = () => {
    if (modalOpen.confirmMerge) {
      handleMergeMembers();
    }
    if (modalOpen.UnMergeModalOpen) {
      handleRemoveMember();
    }
    if (modalOpen.ChangePrimaryMember) {
      setCheckedRadioId({ [checkedId.ChangePrimaryMemberId]: true });
      setModalOpen((prevState) => ({ ...prevState, ChangePrimaryMember: false, isConfirmPrimaryMember: true }));
    }
  };

  // Function to change the Primary Member List
  const handleRadioBtn = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setModalOpen((prevState) => ({ ...prevState, ChangePrimaryMember: true }));
    setCheckedId((prevId) => ({ ...prevId, ChangePrimaryMemberId: checked_id }));
  };

  // Function to remove the desired potential duplicate member from the list
  const handleRemoveMember = () => {
    const filteredMembers = MergeMembersList?.filter((member: MergeMembersDataResult) => {
      if (member.id !== checkedId.UnMergeMemberId) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);
    setMergeMembersList(filteredMembers);
    setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: false }));
    setCheckedId((prevId) => ({ ...prevId, UnMergeMemberId: '' }));
    localStorage.setItem('merge-membersId', JSON.stringify(filteredMembers));
    showSuccessToast('Member Removed');
  };

  // Function to confirm submit the possible list to be merged and call api.
  const handleMergeMembers = () => {
    const mergeList = MergeMembersList.concat(suggestionList.result).map((member: MergeMembersDataResult) => ({
      primaryMemberId: Object.keys(checkedRadioId)[0],
      memberId: member.id
    }));
    mergeList.push({
      primaryMemberId: Object.keys(checkedRadioId)[0],
      memberId: Object.keys(checkedRadioId)[0]
    });

    mergeMembers(
      {
        workspaceId: workspaceId!,
        memberId: memberId!,
        mergeList
      },
      loaderSetAction
    ).then(() => {
      setModalOpen((prevState) => ({ ...prevState, confirmMerge: false }));
      showSuccessToast('Members Merged');
      navigate(`/${workspaceId}/members/${Object.keys(checkedRadioId)[0]}/merged-members`);
    });
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
        <div className="flex justify-between btn-save-modal items-center pr-4 cursor-pointer w-7.81 h-3.06 shadow-contactBtn rounded-0.3 ">
          <div>
            <Button
              type="button"
              text="Merge"
              className={`1border-none text-white font-Poppins text-search font-medium leading-1.31 cursor-pointer w-5.25 h-2.81 rounded ${!MergeMembersList.length ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={() => MergeMembersList.length && handleModal('Merge')}
            />
          </div>
          <div className="">
            <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.3709 0.0396001C0.756347 0.172604 0.244103 0.689408 0.115587 1.30617C0.0805575 1.47433 0.0749902 1.74665 0.0815221 2.97689L0.0893218 4.44672L0.163267 4.55759C0.277121 4.72832 0.411865 4.79829 0.626756 4.79829C0.841647 4.79829 0.976364 4.72834 1.09025 4.55762L1.16419 4.44677L1.17797 2.95145L1.19175 1.45613L1.2671 1.34909C1.30853 1.29022 1.38823 1.21127 1.44418 1.17366L1.54591 1.10527L3.07759 1.09159L4.60928 1.07791L4.71448 1.013C4.77236 0.9773 4.85297 0.89816 4.89363 0.837184C4.95522 0.744804 4.96757 0.695919 4.96757 0.544478C4.96757 0.393036 4.95522 0.344152 4.89363 0.251771C4.85297 0.190795 4.77236 0.111655 4.71448 0.0759559L4.60928 0.0110408L3.07966 0.00592524C1.84748 0.00182188 1.5152 0.0083599 1.3709 0.0396001ZM9.64493 0.0282475C9.51474 0.065506 9.34518 0.244741 9.30701 0.385459C9.24103 0.628651 9.33906 0.884263 9.5477 1.013L9.6529 1.07791L11.1846 1.09159L12.7163 1.10527L12.818 1.17366C12.8739 1.21127 12.9537 1.29022 12.9951 1.34909L13.0704 1.45613L13.0842 2.95145L13.098 4.44677L13.1719 4.55762C13.2862 4.72892 13.4204 4.79829 13.6374 4.79829C13.7878 4.79829 13.8376 4.78582 13.9303 4.7249C13.9918 4.68455 14.0715 4.60453 14.1075 4.54709L14.1729 4.44267L14.1807 2.97487C14.1894 1.32808 14.1841 1.26618 14.0035 0.900102C13.864 0.617408 13.5619 0.317562 13.2771 0.179169C12.9145 0.00297082 12.8581 -0.00192585 11.2101 0.000317318C10.3694 0.0014389 9.69661 0.0134481 9.64493 0.0282475ZM3.58954 4.04032C3.47031 4.0822 3.35056 4.17291 3.27884 4.27564C3.21556 4.36626 3.20371 4.41173 3.20377 4.56344C3.20385 4.72093 3.21479 4.7592 3.29072 4.86783C3.33851 4.93617 3.72037 5.32672 4.13934 5.73575L4.90107 6.47941L2.67231 6.48688L0.44356 6.49435L0.331856 6.56774C0.159216 6.68113 0.0893218 6.8143 0.0893218 7.02978C0.0893218 7.17906 0.10189 7.22844 0.163267 7.32049C0.203919 7.38147 0.284535 7.46061 0.342412 7.49631L0.447611 7.56122L2.6458 7.5749L4.84396 7.58858L4.11134 8.31351C3.7084 8.71222 3.33939 9.09383 3.2913 9.16153C3.21457 9.26956 3.20385 9.30668 3.20377 9.46444C3.20366 9.67525 3.27063 9.7984 3.45173 9.92046C3.54343 9.98229 3.59213 9.99484 3.74112 9.99523C3.89805 9.99564 3.93564 9.98497 4.04429 9.90925C4.1814 9.81369 5.83102 8.17282 5.96483 7.99891C6.16247 7.74202 6.30468 7.32988 6.3038 7.01657C6.30308 6.77269 6.236 6.49487 6.12151 6.26183C6.02816 6.07173 5.95177 5.9878 5.08151 5.11923C4.56491 4.60363 4.09674 4.15048 4.04112 4.11224C3.93581 4.03977 3.69857 4.002 3.58954 4.04032ZM10.3281 4.04897C10.255 4.0706 9.99098 4.31708 9.2375 5.06709C8.31634 5.98403 8.23586 6.07173 8.14144 6.26183C8.02632 6.49361 7.9591 6.77072 7.95838 7.01657C7.9575 7.32988 8.09971 7.74202 8.29735 7.99891C8.43116 8.17282 10.0808 9.81369 10.2179 9.90925C10.3265 9.98497 10.3641 9.99564 10.5211 9.99523C10.6701 9.99484 10.7188 9.98229 10.8104 9.92046C10.9915 9.7984 11.0585 9.67525 11.0584 9.46444C11.0583 9.30668 11.0476 9.26956 10.9709 9.16153C10.9228 9.09383 10.5538 8.71222 10.1508 8.31351L9.41822 7.58858L11.6184 7.5749L13.8186 7.56122L13.9304 7.48783C14.1024 7.37482 14.1729 7.24111 14.1729 7.02779C14.1729 6.81447 14.1024 6.68075 13.9303 6.56774L13.8186 6.49435L11.5899 6.48688L9.36111 6.47941L10.1228 5.73575C10.5418 5.32672 10.9237 4.93617 10.9715 4.86783C11.0473 4.75926 11.0583 4.72088 11.0584 4.56377C11.0585 4.41701 11.0458 4.36539 10.9896 4.28299C10.8459 4.07257 10.5738 3.97625 10.3281 4.04897ZM0.439646 9.24554C0.315788 9.28316 0.140475 9.46395 0.105059 9.59061C0.0862075 9.65793 0.0759549 10.1949 0.0761754 11.1038C0.0765336 12.6785 0.0824868 12.7435 0.25871 13.1008C0.39814 13.3834 0.700233 13.6833 0.985046 13.8217C1.35461 14.0014 1.41312 14.0062 3.10491 13.9975L4.61336 13.9898L4.72507 13.9164C4.89707 13.8034 4.96757 13.6697 4.96757 13.4564C4.96757 13.2431 4.8971 13.1094 4.72509 12.9963L4.61342 12.9229L3.07933 12.9093L1.54525 12.8956L1.4374 12.8208C1.37809 12.7797 1.29855 12.7006 1.26065 12.645L1.19175 12.5441L1.17797 11.0648L1.16419 9.58555L1.09879 9.48113C0.968812 9.27361 0.683256 9.17155 0.439646 9.24554ZM13.4643 9.24168C13.348 9.27897 13.2319 9.37179 13.162 9.48346L13.098 9.58555L13.0842 11.0648L13.0704 12.5441L13.0015 12.645C12.9636 12.7006 12.8841 12.7797 12.8248 12.8208L12.7169 12.8956L11.1828 12.9093L9.64876 12.9229L9.53709 12.9963C9.3645 13.1098 9.29461 13.2429 9.29461 13.4584C9.29461 13.6077 9.30718 13.657 9.36855 13.7491C9.40921 13.8101 9.48982 13.8892 9.5477 13.9249L9.6529 13.9898L11.1593 13.9975C12.8489 14.0062 12.9076 14.0013 13.2771 13.8217C13.5619 13.6833 13.864 13.3834 14.0035 13.1008C14.1839 12.735 14.1894 12.6713 14.1807 11.0396L14.1729 9.58555L14.1075 9.48113C14.014 9.33199 13.8648 9.24259 13.6867 9.22902C13.6054 9.22281 13.5054 9.22853 13.4643 9.24168Z" fill="white" />
            </svg>

          </div>
        </div>
      </div>
      <div className="flex flex-col mt-1.8">
        <div className="relative">
          <h3 className="font-Poppins font-semibold leading-1.56 text-infoBlack text-base">Primary Member</h3>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6  mt-5 p-5">
              <div className="w-1/5">
                <img src={primaryMemberId[0]?.profilePictureUrl ? primaryMemberId[0]?.profilePictureUrl : profileImage} alt="profileImage" className="w-16 h-16 rounded-full" />
              </div>
              <div className="flex flex-col w-4/5 relative">
                <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31 capitalize">{primaryMemberId[0]?.name}</div>
                <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">
                  {' '}
                  {primaryMemberId[0]?.email} | {primaryMemberId[0]?.organization}
                </div>
                <div className="flex mt-1">
                  <div className="w-1.001 h-1.001 mr-0.34">
                    <img src={primaryMemberId[0]?.platform.platformLogoUrl} alt="platformUrl" />
                  </div>
                </div>
                <div className="flex justify-end items-center absolute right-0 -bottom-4">
                  <label htmlFor={primaryMemberId[0]?.id} className="flex items-center  font-normal font-Poppins text-card">
                    <input
                      type="radio"
                      className="hidden peer"
                      name={primaryMemberId[0]?.id}
                      id={primaryMemberId[0]?.id}
                      value={primaryMemberId[0]?.id}
                      checked={(checkedRadioId[primaryMemberId[0]?.id] as boolean) || false}
                      onChange={handleRadioBtn}
                    />{' '}
                    <div className="w-3 h-3 border border-[#ABCF6B] rounded-full mr-1 flex justify-center items-center">
                      <span className="w-2 h-2  rounded-full check-circle peer-checked:check-circle"></span>
                    </div>
                    Primary
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2.55">
          <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.56 mb-5">Potential Duplicates</h3>
          <div className="flex flex-wrap gap-5 relative">
            {loading.mergeListLoader
              ? Array.from({ length: MergeMembersList?.length }, (_, i) => i + 1).map((type: number) => (
                <Fragment key={type}>
                  <MemberSuggestionLoader />
                </Fragment>
              ))
              : MergeMembersList &&
              MergeMembersList.map((members: MergeMembersDataResult) => (
                <div key={members.id}>
                  <div className="flex items-center primary-card box-border border border-borderPrimary w-26.25 h-7.5 shadow-profileCard rounded-0.6 py-[28px] px-[21px]  ">
                    <div className="w-1/5">
                      <img src={members.profilePictureUrl ? members.profilePictureUrl : profileImage} alt="profileImage" className="w-16 h-16 rounded-full" />
                    </div>
                    <div className="flex flex-col  w-4/5 relative">
                      <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31 capitalize">{members.name}</div>
                      <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">
                        {members.email} | {members.organization}
                      </div>
                      <div className="flex mt-1">
                        <div className="w-1.001 h-1.001 mr-0.34">
                          <img src={members.platform.platformLogoUrl} alt="" />
                        </div>
                      </div>
                      <div className="flex absolute right-0 -bottom-4 items-center">
                        <label htmlFor={members.id} className="flex items-center text-xs text-greyDark">
                          <input
                            type="radio"
                            className="hidden peer"
                            id={members.id}
                            value={members.id}
                            name={members.id}
                            checked={(checkedRadioId[members.id] as boolean) || false}
                            onChange={handleRadioBtn}
                          />{' '}
                          <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#7D7D7D] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                          Primary
                        </label>
                      </div>
                      <div className="absolute -right-2 -top-4 cursor-pointer">
                        <img className='w-10px h-10px'
                          src={closeIcon}
                          alt=""
                          onClick={() => {
                            handleModal('UnMerge');
                            setCheckedId((prevId) => ({ ...prevId, UnMergeMemberId: members.id }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <MergeMemberModal
        isOpen={modalOpen}
        isClose={handleModalClose}
        loader={loading.confirmationLoader}
        onSubmit={handleOnSubmit}
        contextText={
          modalOpen.confirmMerge
            ? 'Are you sure want to merge members?'
            : modalOpen.UnMergeModalOpen
              ? 'Are you sure you want to remove the member?'
              : modalOpen.ChangePrimaryMember
                ? 'Are you sure you want to change the primary member?'
                : ''
        }
      />
    </div>
  );
};

export default MembersReview;
