/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-vars */
import { useAppSelector } from '@/hooks/useRedux';
import { getAxiosRequest, postAxiosRequest, unMergeMembers } from '@/lib/axiosRequest';
import Button from 'common/button';
import MergeModal from 'common/modals/MergeModal';
import { MergeModalPropsEnum } from 'common/modals/MergeModalTypes';
import { MemberProfileCard, MergeMembersDataResponse, MergeMembersDataResult } from 'modules/members/interface/members.interface';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import closeIcon from '../../../../assets/images/close-member.svg';
import modalMergeIcon from '../../../../assets/images/merge.svg';
import Modal from 'react-modal';
import membersSlice from 'modules/members/store/slice/members.slice';
import { useDispatch } from 'react-redux';

const MergedMembers: React.FC = () => {
  const { workspaceId, memberId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberProfileCardData = JSON.parse(localStorage.getItem('primaryMemberId')!);
  const { memberProfileCardData: memberProfileCardDataResult } = useAppSelector((state) => state.members);

  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [UnMergeModalOpen, setUnMergeModalOpen] = useState<boolean>(false);
  const [activityNextCursor, setActivityNextCursor] = useState<string | null>('');
  const [checkedRadioId, setCheckedRadioId] = useState<Record<string, unknown>>({ [memberProfileCardData[0]?.comunifyMemberId]: true });
  const [suggestionList, setSuggestionList] = useState<MergeMembersDataResponse>({
    result: [],
    nextCursor: null
  });
  const [unMergeId, setUnMergeId] = useState<string>('');

  const [primaryMemberId, setPrimaryMemberId] = useState<any>([]);

  // Function to call the api and list the membersSuggestionList
  const getMergedMemberSuggestionList = (cursor: string | null, prop: string) => {
    getAxiosRequest(
      `/v1/${workspaceId}/members/${memberId}/merged-list?page=1&limit=10${
        cursor ? `&cursor=${cursor}` : suggestionList.nextCursor ? `&cursor=${prop ? '' : suggestionList.nextCursor}` : ''
      }`,
      setLoading
    ).then((data) =>
      setSuggestionList((prevState) => ({
        result: prevState.result.concat(data?.result as unknown as MergeMembersDataResult),
        nextCursor: data?.nextCursor as string | null
      }))
    );
  };

  useEffect(() => {
    setSuggestionList({
      result: [],
      nextCursor: null
    });
    getMergedMemberSuggestionList(null, 'search');
    dispatch(membersSlice.actions.getMemberProfileCardData({ workspaceId: workspaceId as string, memberId: memberId as string }));
  }, [memberId]);

  useEffect(() => {
    if (primaryMemberId?.length < 1) {
      const memberProfileData = [...memberProfileCardData];
      const platform = memberProfileData[0].platforms;
      memberProfileData[0].platform = { platformLogoUrl: platform[0].platformLogoUrl };
      delete memberProfileData[0].platforms;
      setPrimaryMemberId(memberProfileData);
    }
    // setCheckedRadioId({ [memberProfileCardDataResult[0]?.comunifyMemberId]: true });
  }, [memberProfileCardDataResult]);

  useEffect(() => {
    const filteredDuplicateMembers = suggestionList?.result?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.comunifyMemberId !== Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);
    setSuggestionList((prevList) => ({
      result: filteredDuplicateMembers,
      nextCursor: prevList.nextCursor
    }));

    const filteredPrimaryMember = suggestionList?.result?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.comunifyMemberId === Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });

    setPrimaryMemberId(filteredPrimaryMember);

    const mergeList = filteredDuplicateMembers?.map((member: MergeMembersDataResult) => ({
      primaryMemberId: Object.keys(checkedRadioId)[0],
      memberId: member.comunifyMemberId
    }));

    mergeList.push({
      primaryMemberId: filteredPrimaryMember[0]?.comunifyMemberId,
      memberId: filteredPrimaryMember[0]?.comunifyMemberId
    });

    if (filteredPrimaryMember?.length) {
      postAxiosRequest(
        `/v1/${workspaceId}/members/${memberId}/merge`,
        {
          mergeList
        }
        // eslint-disable-next-line no-unused-vars
      ).then((data) => {
        navigate(`/${workspaceId}/members/${Object.keys(checkedRadioId)[0]}/merged-members`);
      });
    }
  }, [checkedRadioId]);

  const handleRadioBtn = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setCheckedRadioId({ [checked_id]: event.target.checked });
  };

  const handleModal = (val: boolean) => {
    setIsModalOpen(val);
  };

  // Function to remove the desired potential duplicate member from the list
  const handleRemoveMember = () => {
    unMergeMembers({
      workspaceId,
      memberId,
      unMergeId
    }).then((data) => {
      if (!data?.error) {
        const filteredMembers = suggestionList?.result?.filter((member: MergeMembersDataResult) => {
          if (member.id !== unMergeId) {
            return member;
          }
        });
        // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);
        setSuggestionList((prevList) => ({
          result: filteredMembers,
          nextCursor: prevList.nextCursor
        }));
      }
      setUnMergeModalOpen(false);
    });
  };

  // function for scroll event
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setActivityNextCursor(suggestionList.nextCursor);
      if (suggestionList.nextCursor !== null && !loading) {
        getMergedMemberSuggestionList(suggestionList.nextCursor, '');
      }
    }
  };

  const handleUnMergeModal = (memberId: string) => {
    setUnMergeModalOpen(true);
    setUnMergeId(memberId);
  };

  const MergeModalComponent = useMemo(
    // eslint-disable-next-line max-len
    () => (
      <MergeModal
        modalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        type={MergeModalPropsEnum.MergedMember}
        checkedRadioId={checkedRadioId}
        mergedMemberList={suggestionList.result}
      />
    ),
    [isModalOpen]
  );

  return (
    <div className=" mx-auto mt-[3.3125rem]">
      <div className="flex justify-between items-center border-review pb-5">
        <div className="flex flex-col">
          <h3 className="font-Poppins font-semibold leading-2.18 text-infoData text-infoBlack">Merged Members</h3>
        </div>
        <Button
          type="button"
          text="Add Member"
          className="border-none text-white font-Poppins btn-save-modal text-search font-medium leading-1.31 cursor-pointer  w-[9.625rem] h-3.06 shadow-contactBtn rounded-0.3 "
          onClick={() => handleModal(true)}
        />
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
          <div className="flex flex-wrap gap-5 relative" onScroll={handleScroll}>
            {loading ? (
              <Skeleton width={500} className={'my-4'} count={6} />
            ) : (
              suggestionList?.result &&
              suggestionList?.result?.map((members: MergeMembersDataResult) => (
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
                      <img src={closeIcon} alt="" onClick={() => handleUnMergeModal(members.comunifyMemberId)} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {MergeModalComponent}
      <Modal
        isOpen={UnMergeModalOpen}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setUnMergeModalOpen(false)}
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
          <div className="mt-5 leading-6 text-black font-Inter font-semibold text-xl w-2/3 text-center">Are you sure want to unmerge members</div>
          <div className="flex mt-1.8">
            <Button
              type="button"
              text="NO"
              className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
              onClick={() => setUnMergeModalOpen(false)}
            />
            <Button
              type="button"
              text="YES"
              className="border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal"
              onClick={handleRemoveMember}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MergedMembers;
