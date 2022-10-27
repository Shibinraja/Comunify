/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-vars */
import { useAppSelector } from '@/hooks/useRedux';
import Button from 'common/button';
import MemberSuggestionLoader from 'common/Loader/MemberSuggestionLoader';
import MergeModal from 'common/modals/MergeModal';
import { MergeModalPropsEnum } from 'common/modals/MergeModalTypes';
import { showSuccessToast } from 'common/toast/toastFunctions';
import { width_90 } from 'constants/constants';
import { MergeMembersDataResponse, MergeMembersDataResult } from 'modules/members/interface/members.interface';
import { getMergedMemberList, mergeMembers, unMergeMembers } from 'modules/members/services/members.services';
import { memberSuggestionType } from 'modules/members/services/service.types';
import membersSlice from 'modules/members/store/slice/members.slice';
import { ChangeEvent, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import closeIcon from '../../../../assets/images/close-member.svg';
import { MergeMemberModal } from './MergeMemberModal';

const MergedMembers: React.FC = () => {
  const { workspaceId, memberId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memberProfileCardData = JSON.parse(localStorage.getItem('primaryMemberId')!);
  const { memberProfileCardData: memberProfileCardDataResult } = useAppSelector((state) => state.members);

  const [loading, setLoading] = useState<{ mergedListLoader: boolean; confirmationLoader: boolean }>({
    mergedListLoader: false,
    confirmationLoader: false
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [checkedId, setCheckedId] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<{ UnMergeModalOpen: boolean; ChangePrimaryMember: boolean; isConfirmPrimaryMember: boolean }>({
    UnMergeModalOpen: false,
    ChangePrimaryMember: false,
    isConfirmPrimaryMember: false
  });

  const [activityNextCursor, setActivityNextCursor] = useState<string | null>('');
  const [checkedRadioId, setCheckedRadioId] = useState<Record<string, unknown>>({ [memberProfileCardData[0]?.id]: true });
  const [suggestionList, setSuggestionList] = useState<MergeMembersDataResponse>({
    result: [],
    nextCursor: null
  });
  const [preventLoading, setPreventLoading] = useState<boolean>(false);
  const [unMergeId, setUnMergeId] = useState<string>('');
  const [primaryMemberId, setPrimaryMemberId] = useState<Array<MergeMembersDataResult>>([]);

  // Function to call the api and list the mergedMembersList
  const getMergedMemberSuggestionList = async (props: Partial<memberSuggestionType>) => {
    setLoading((prev) => ({ ...prev, mergedListLoader: true }));
    const data = await getMergedMemberList({
      workspaceId: workspaceId!,
      memberId: memberId!,
      cursor: props.cursor as string | null,
      prop: props.prop as string,
      search: props.search as string,
      suggestionListCursor: props.suggestionListCursor as string | null
    });
    setLoading((prev) => ({ ...prev, mergedListLoader: false }));

    setSuggestionList((prevState) => ({
      result: prevState.result.concat(data?.result as unknown as MergeMembersDataResult[]),
      nextCursor: data?.nextCursor as string | null
    }));
  };

  //useEffect to call the api at initial load.
  useEffect(() => {
    setSuggestionList({
      result: [],
      nextCursor: null
    });
    if (memberId) {
      getMergedMemberSuggestionList({
        cursor: null,
        prop: 'search',
        suggestionListCursor: suggestionList.nextCursor
      });
      dispatch(membersSlice.actions.getMemberProfileCardData({ workspaceId: workspaceId as string, memberId: memberId as string }));
    }
  }, [memberId]);

  // Make an Object based on the result data received form members platform
  useEffect(() => {
    if (primaryMemberId?.length < 1) {
      const memberProfileData = [...memberProfileCardData];
      const platform = memberProfileData[0].platforms;
      memberProfileData[0].platform = { platformLogoUrl: platform[0].platformLogoUrl };
      setPrimaryMemberId(memberProfileData);
      setCheckedRadioId({ [memberProfileData[0]?.id]: true });
    }
  }, [memberProfileCardDataResult]);

  useEffect(() => {
    //Function to concat the api response data with the Member Chosen and filter out the with the primary member selected.
    const filteredDuplicateMembers = suggestionList?.result?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.id !== Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });
    // MergeMembersList?.splice((MergeMembersList).indexOf(filteredMembers as unknown as MergeMembersDataResult), 1);
    setSuggestionList((prevList) => ({
      result: filteredDuplicateMembers,
      nextCursor: prevList.nextCursor
    }));

    //Function to concat the api response data with the Member Chosen and filter out the with the primary member not selected.
    const filteredPrimaryMember = suggestionList?.result?.concat(primaryMemberId).filter((member: MergeMembersDataResult) => {
      if (member.id === Object.keys(checkedRadioId)[0]) {
        return member;
      }
    });

    setPrimaryMemberId(filteredPrimaryMember);

    const mergeList = filteredDuplicateMembers?.map((member: MergeMembersDataResult) => ({
      primaryMemberId: Object.keys(checkedRadioId)[0],
      memberId: member.id
    }));

    mergeList.push({
      primaryMemberId: filteredPrimaryMember[0]?.id,
      memberId: filteredPrimaryMember[0]?.id
    });

    if (filteredPrimaryMember?.length && checkedId) {
      mergeMembers({
        workspaceId: workspaceId!,
        memberId: memberId!,
        mergeList
      }).then(() => {
        if (modalOpen.isConfirmPrimaryMember) {
          showSuccessToast('Primary Member Changed');
          setCheckedId('');
          setModalOpen((prevState) => ({ ...prevState, isConfirmPrimaryMember: false }));
        }
        navigate(`/${workspaceId}/members/${Object.keys(checkedRadioId)[0]}/merged-members`);
      });
    }
  }, [checkedRadioId]);

  // Function to change the Primary Member List
  const handleRadioBtn = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setModalOpen((prevState) => ({ ...prevState, ChangePrimaryMember: true }));
    setCheckedId(checked_id);
  };

  const handleModal = (val: boolean) => {
    setIsModalOpen(val);
  };

  const loaderSetAction = (type: string, loader: boolean) => {
    if (type === 'MergeListLoader') {
      setLoading((prev) => ({ ...prev, mergeListLoader: loader }));
    }

    if (type === 'ConfirmationLoader') {
      setLoading((prev) => ({ ...prev, confirmationLoader: loader }));
    }
  };

  // Function to remove the desired potential duplicate member from the list
  const handleRemoveMember = () => {
    unMergeMembers(
      {
        workspaceId: workspaceId as string,
        memberId: memberId as string,
        unMergeId: unMergeId as string
      },
      loaderSetAction
    ).then((data) => {
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
        showSuccessToast('Member Unmerged');
        setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: false }));
      }
    });
  };

  // function for scroll event
  const handleScroll = async (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 2 && !loading.mergedListLoader) {
      setActivityNextCursor(suggestionList.nextCursor);
      if (suggestionList.nextCursor) {
        setPreventLoading(true);
        await getMergedMemberSuggestionList({
          cursor: suggestionList.nextCursor,
          prop: '',
          suggestionListCursor: null
        });
        setPreventLoading(false);
      }
    }
  };

  //Function to Un-Merge the member from the list.
  const handleUnMergeModal = (memberId: string) => {
    setUnMergeId(memberId);
    setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: true }));
  };

  const handleModalClose = () => {
    if (modalOpen.UnMergeModalOpen) {
      setModalOpen((prevState) => ({ ...prevState, UnMergeModalOpen: false }));
    }

    if (modalOpen.ChangePrimaryMember) {
      setModalOpen((prevState) => ({ ...prevState, ChangePrimaryMember: false }));
    }
  };

  //On Submit functionality
  const handleOnSubmit = () => {
    if (modalOpen.UnMergeModalOpen) {
      handleRemoveMember();
    }
    if (modalOpen.ChangePrimaryMember) {
      setCheckedRadioId({ [checkedId]: true });
      setModalOpen((prevState) => ({ ...prevState, ChangePrimaryMember: false, isConfirmPrimaryMember: true }));
    }
  };

  const MergeModalComponent = useMemo(
    // eslint-disable-next-line max-len
    () => {
      if (isModalOpen) {
        return (
          <MergeModal
            modalOpen={isModalOpen}
            setModalOpen={setIsModalOpen}
            type={MergeModalPropsEnum.MergedMember}
            checkedRadioId={checkedRadioId}
            mergedMemberList={suggestionList.result}
          />
        );
      }
    },
    [isModalOpen]
  );

  return (
    <div className=" mx-auto mt-[3.3125rem] h-full overflow-y-scroll" onScroll={handleScroll}>
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
      <div className="flex flex-col mt-1.8 h-full">
        <div className="relative">
          <h3 className="font-Poppins font-semibold leading-1.56 text-infoBlack text-base">Primary Member</h3>
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center app-input-card-border box-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 ">
              <div className="w-16 h-16">
                {!primaryMemberId?.length ? (
                  <Skeleton circle height="100%" />
                ) : (
                  <img src={primaryMemberId[0]?.profilePictureUrl} alt="" className="w-16 h-16 rounded-full" />
                )}
              </div>
              <div className="flex flex-col pl-3">
                <div className="font-Poppins font-semibold text-trial text-profileBlack leading-1.31">
                  {!primaryMemberId?.length ? <Skeleton width={width_90} /> : primaryMemberId[0]?.name}
                </div>
                <div className="font-Poppins font-normal text-email text-profileBlack leading-1.31">
                  {' '}
                  {!primaryMemberId?.length ? <Skeleton width={width_90} /> : `${primaryMemberId[0]?.email} | ${primaryMemberId[0]?.organization}`}
                </div>
                <div className="flex mt-2.5">
                  <div className="w-1.001 h-1.001 mr-0.34">
                    {!primaryMemberId?.length ? (
                      <Skeleton circle height="100%" />
                    ) : (
                      <div className="flex gap-1 ">
                        {primaryMemberId[0]?.platforms?.map((platform: { id: string; name: string; platformLogoUrl: string }) => (
                          <Fragment key={platform.id}>
                            <img src={platform.platformLogoUrl} alt="" />
                          </Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex absolute left-[20rem] bottom-4 items-center">
                  {!primaryMemberId?.length ? (
                    <Skeleton width={width_90} />
                  ) : (
                    <label htmlFor={primaryMemberId[0]?.id} className="flex items-center">
                      <input
                        type="radio"
                        className="hidden peer"
                        name={primaryMemberId[0]?.id}
                        id={primaryMemberId[0]?.id}
                        value={primaryMemberId[0]?.id}
                        checked={(checkedRadioId[primaryMemberId[0]?.id] as boolean) || false}
                        onChange={handleRadioBtn}
                      />{' '}
                      <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                      Primary
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-2.55">
          <h3 className="font-Poppins text-infoBlack font-semibold text-base leading-1.56">Potential Duplicates</h3>
          <div className="flex flex-wrap gap-5 relative">
            {loading.mergedListLoader && !preventLoading
              ? Array.from({ length: 6 }, (_, i) => i + 1).map((type: number) => (
                  <Fragment key={type}>
                    <MemberSuggestionLoader />
                  </Fragment>
                ))
              : suggestionList?.result?.map((members: MergeMembersDataResult) => (
                  <div key={members.id}>
                    <div className="flex items-center primary-card box-border app-input-card-border w-26.25 h-7.5 shadow-profileCard rounded-0.6 pl-1.313 mt-5 relative">
                      <div className="w-16 h-16">
                        <img src={members.profilePictureUrl} alt="" className="w-16 h-16 rounded-full" />
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
                              value={members.id}
                              name={members.id}
                              checked={(checkedRadioId[members.id] as boolean) || false}
                              onChange={handleRadioBtn}
                            />{' '}
                            <span className="w-3 h-3 mr-1.5 border font-normal font-Poppins text-card leading-1.31 border-[#ddd] rounded-full inline-flex peer-checked:bg-[#ABCF6B]"></span>
                            Primary
                          </label>

                          {/* } */}
                        </div>
                      </div>
                      <div className="absolute right-7 top-5 cursor-pointer">
                        <img src={closeIcon} alt="" onClick={() => handleUnMergeModal(members.id)} />
                      </div>
                    </div>
                  </div>
                ))}

            {loading.mergedListLoader && <MemberSuggestionLoader />}
          </div>
        </div>
      </div>
      {MergeModalComponent}
      <MergeMemberModal
        isOpen={modalOpen}
        isClose={handleModalClose}
        loader={loading.confirmationLoader}
        onSubmit={handleOnSubmit}
        contextText={
          modalOpen.ChangePrimaryMember
            ? 'Are you sure you want to change the primary member?'
            : modalOpen.UnMergeModalOpen
            ? 'Are you sure want to unmerge members?'
            : ''
        }
      />
    </div>
  );
};

export default MergedMembers;
