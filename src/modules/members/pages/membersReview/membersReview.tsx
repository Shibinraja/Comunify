/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button';
import { showSuccessToast } from 'common/toast/toastFunctions';
import { MergeMembersDataResponse, MergeMembersDataResult } from 'modules/members/interface/members.interface';
import { getMergedMemberList, mergeMembers } from 'modules/members/services/members.services';
import { memberSuggestionType } from 'modules/members/services/service.types';
import React, { ChangeEvent, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import closeIcon from '../../../../assets/images/close-member.svg';
import mergeIcon from '../../../../assets/images/merged.svg';
import { MergeMemberModal } from '../mergedMembers/MergeMemberModal';
import './membersReview.css';

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
  const [loading, setLoading] = useState<boolean>(false);
  const [checkedRadioId, setCheckedRadioId] = useState<Record<string, unknown>>({ [memberProfileCardData[0]?.comunifyMemberId]: true });
  const [modalOpen, setModalOpen] = useState<{ UnMergeModalOpen: boolean; confirmMerge: boolean }>({
    UnMergeModalOpen: false,
    confirmMerge: false
  });
  const [checkedId, setCheckedId] = useState<string>('');
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
      setLoading
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
      if (member.comunifyMemberId !== Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);

    //Function to concat the api response data with the Member Chosen and filter out the with the primary member not selected.
    const filteredPrimaryMember = MergeMembersList?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.comunifyMemberId === Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });
    if (filteredPrimaryMember?.length) {
      setMergeMembersList(filteredDuplicateMembers);
      setPrimaryMemberId(filteredPrimaryMember);
    }
  }, [checkedRadioId]);

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
  };

  //On Submit functionality
  const handleOnSubmit = () => {
    if (modalOpen.confirmMerge) {
      handleMergeMembers();
    }
    if (modalOpen.UnMergeModalOpen) {
      handleRemoveMember();
    }
  };

  // Function to change the Primary Member List
  const handleRadioBtn = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setCheckedRadioId({ [checked_id]: event.target.checked });
  };

  // Function to remove the desired potential duplicate member from the list
  const handleRemoveMember = () => {
    const filteredMembers = MergeMembersList?.filter((member: MergeMembersDataResult) => {
      if (member.id !== checkedId) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);
    setMergeMembersList(filteredMembers);
    setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: false }));
    localStorage.setItem('merge-membersId', JSON.stringify(filteredMembers));
  };

  // Function to confirm submit the possible list to be merged and call api.
  const handleMergeMembers = () => {
    const mergeList = MergeMembersList.concat(suggestionList.result).map((member: MergeMembersDataResult) => ({
      primaryMemberId: Object.keys(checkedRadioId)[0],
      memberId: member.comunifyMemberId
    }));
    mergeList.push({
      primaryMemberId: Object.keys(checkedRadioId)[0],
      memberId: Object.keys(checkedRadioId)[0]
    });

    mergeMembers({
      workspaceId: workspaceId!,
      memberId: memberId!,
      mergeList
    }).then(() => {
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
        <div className="flex justify-between btn-save-modal items-center px-4 cursor-pointer w-7.81 h-3.06 shadow-contactBtn rounded-0.3 ">
          <div>
            <Button
              type="button"
              text="Merge"
              className={`1border-none text-white font-Poppins text-search font-medium leading-1.31 cursor-pointer w-5.25 h-2.81 rounded ${
                !MergeMembersList.length ? 'cursor-not-allowed' : ''
              }`}
              onClick={() => MergeMembersList.length && handleModal('Merge')}
            />
          </div>
          <div className="">
            <img src={mergeIcon} alt="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-1.8">
        <div className="relative">
          <h3 className="font-Poppins font-semibold leading-1.56 text-infoBlack text-base">Primary Member</h3>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 ">
              <div className="w-16 h-16">
                <img src={primaryMemberId[0]?.profileUrl} alt="" className="w-16 h-16 rounded-full" />
              </div>
              <div className="flex flex-col pl-3">
                <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31">{primaryMemberId[0]?.name}</div>
                <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">
                  {' '}
                  {primaryMemberId[0]?.email} | {primaryMemberId[0]?.organization}
                </div>
                <div className="flex mt-2.5">
                  <div className="w-1.001 h-1.001 mr-0.34">
                    <img src={primaryMemberId[0]?.platform.platformLogoUrl} alt="" />
                  </div>
                </div>
                <div className="flex absolute left-[20rem] bottom-4 items-center">
                  <label htmlFor={primaryMemberId[0]?.id} className="flex items-center">
                    <input
                      type="radio"
                      className="hidden peer"
                      name={primaryMemberId[0]?.comunifyMemberId}
                      id={primaryMemberId[0]?.id}
                      value={primaryMemberId[0]?.comunifyMemberId}
                      checked={(checkedRadioId[primaryMemberId[0]?.comunifyMemberId] as boolean) || false}
                      onChange={handleRadioBtn}
                    />{' '}
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
            {loading ? (
              <Skeleton width={500} className={'my-4'} count={6} />
            ) : (
              MergeMembersList &&
              MergeMembersList.map((members: MergeMembersDataResult) => (
                <div key={members.id}>
                  <div className="flex items-center primary-card box-border app-input-card-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 relative">
                    <div className="w-16 h-16">
                      <img src={members.profileUrl} alt="" className="w-16 h-16 rounded-full" />
                    </div>
                    <div className="flex flex-col pl-3">
                      <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31">{members.name}</div>
                      <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">
                        {members.email} | {members.organization}
                      </div>
                      <div className="flex mt-2.5">
                        <div className="w-1.001 h-1.001 mr-0.34">
                          <img src={members.platform.platformLogoUrl} alt="" />
                        </div>
                      </div>
                      <div className="flex absolute right-8 bottom-4 items-center">
                        <label htmlFor={members.id} className="flex items-center">
                          <input
                            type="radio"
                            className="hidden peer"
                            id={members.id}
                            value={members.comunifyMemberId}
                            name={members.comunifyMemberId}
                            checked={(checkedRadioId[members.comunifyMemberId] as boolean) || false}
                            onChange={handleRadioBtn}
                          />{' '}
                          <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                          Primary
                        </label>
                      </div>
                    </div>
                    <div className="absolute right-7 top-5 cursor-pointer">
                      <img
                        src={closeIcon}
                        alt=""
                        onClick={() => {
                          handleModal('UnMerge');
                          setCheckedId(members.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <MergeMemberModal
        isOpen={modalOpen}
        isClose={handleModalClose}
        onSubmit={handleOnSubmit}
        contextText={
          modalOpen.confirmMerge
            ? 'Are you sure want to merge members'
            : modalOpen.UnMergeModalOpen
              ? 'Are you sure you want to remove the member?'
              : ''
        }
      />
    </div>
  );
};

export default MembersReview;
