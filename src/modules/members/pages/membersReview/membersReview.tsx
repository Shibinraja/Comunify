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
import modalMergeIcon from '../../../../assets/images/merge.svg';
import mergeIcon from '../../../../assets/images/merged.svg';
import './membersReview.css';

Modal.setAppElement('#root');

const MembersReview: React.FC = () => {
  const { workspaceId, memberId } = useParams();
  const navigate = useNavigate();
  const memberProfileCardData = JSON.parse(localStorage.getItem('primaryMemberId')!);
  const MergeMembersListData = JSON.parse(localStorage.getItem('merge-membersId')!);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkedRadioId, setCheckedRadioId] = useState<Record<string, unknown>>({ [memberProfileCardData[0]?.comunifyMemberId]: true });
  const handleModal = (val: boolean) => {
    setIsModalOpen(val);
  };
  const [MergeMembersList, setMergeMembersList] = useState<Array<MergeMembersDataResult>>([]);
  const [primaryMemberId, setPrimaryMemberId] = useState<any>([]);
  const [suggestionList, setSuggestionList] = useState<MergeMembersDataResponse>({
    result: [],
    nextCursor: null
  });
  const [loading, setLoading] = useState<boolean>(false);

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

  // Function to change the Primary Member List
  const handleRadioBtn = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setCheckedRadioId({ [checked_id]: event.target.checked });
  };

  // Function to remove the desired potential duplicate member from the list
  const handleRemoveMember = (memberId: string) => {
    const filteredMembers = MergeMembersList?.filter((member: MergeMembersDataResult) => {
      if (member.id !== memberId) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);
    setMergeMembersList(filteredMembers);
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
      setIsModalOpen(false);
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
            onRequestClose={() => setIsModalOpen(false)}
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
                  onClick={() => setIsModalOpen(false)}
                />
                <Button
                  type="button"
                  text="YES"
                  className="border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal"
                  onClick={handleMergeMembers}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <div className="flex flex-col mt-1.8">
        <div className="relative">
          <h3 className="font-Poppins font-semibold leading-1.56 text-infoBlack text-base">Primary Member</h3>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 ">
              <div className="w-16 h-16">
                <img src={primaryMemberId[0]?.profileUrl} alt="" />
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
                      <img src={members.profileUrl} alt="" />
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
                      <img src={closeIcon} alt="" onClick={() => handleRemoveMember(members.id)} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersReview;
