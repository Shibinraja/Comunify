/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import useDebounce from '@/hooks/useDebounce';
import { getAxiosRequest } from '@/lib/axiosRequest';
import Button from 'common/button';
import { MergeMembersDataResponse, MergeMembersDataResult } from 'modules/members/interface/members.interface';
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import Modal from 'react-modal';
import { useNavigate, useParams } from 'react-router-dom';
import searchIcon from '../../assets/images/search.svg';

type MergeModalProps = {
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

const MergeModal: React.FC<MergeModalProps> = ({ modalOpen, setModalOpen }) => {
  const { workspaceId, memberId } = useParams();
  const navigate = useNavigate();
  const [searchSuggestion, setSearchSuggestion] = useState<string>('');
  const [activityNextCursor, setActivityNextCursor] = useState<string | null>('');
  const [suggestionList, setSuggestionList] = useState<MergeMembersDataResponse>({
    result: [],
    nextCursor: null
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [duplicateMembers, setDuplicateMembers] = useState<Array<MergeMembersDataResult>>([]);
  const [checkedMemberId, setCheckedMemberId] = useState<Record<string, unknown>>({});

  const debouncedValue = useDebounce(searchSuggestion, 300);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    const checked_id: string = event.target.name;
    setCheckedMemberId((prevValue) => ({ ...prevValue, [checked_id]: event.target.checked }));
  };

  // Function to call the api and list the membersSuggestionList
  const getMemberSuggestionList = (cursor: string | null, prop: string) => {
    getAxiosRequest(
      `/v1/${workspaceId}/members/${memberId}/merge-suggestion-list?page=1&limit=10${
        cursor ? `&cursor=${cursor}` : suggestionList.nextCursor ? `&cursor=${prop ? '' : suggestionList.nextCursor}` : ''
      }${debouncedValue ? `&search=${debouncedValue}` : ''}`,
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
    getMemberSuggestionList(null, 'search');
  }, [debouncedValue]);

  useEffect(() => {
    //To Check the selected memberId to which we need to merge with the primaryMemberId;
    if (Object.keys(checkedMemberId).length > 0) {
      Object.keys(checkedMemberId).map((memberId: string) => {
        if (checkedMemberId[memberId] === true) {
          suggestionList.result.filter((memberList: MergeMembersDataResult) => {
            if (memberList.id === memberId) {
              setDuplicateMembers((prevMembers) => [...prevMembers, memberList]);
            }
          });
        }
      });
    }
  }, [checkedMemberId]);

  // function to listen for scroll event
  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    event.preventDefault();
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setActivityNextCursor(suggestionList.nextCursor);
      if (suggestionList.nextCursor !== null && !loading) {
        getMemberSuggestionList(suggestionList.nextCursor, '');
      }
    }
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      setSearchSuggestion('');
      getMemberSuggestionList(null, 'search');
    }
    setSearchSuggestion(searchText);
  };

  const navigateToReviewMerge = () => {
    localStorage.setItem('merge-membersId', JSON.stringify([...new Set(duplicateMembers)]));
    navigate(`/${workspaceId}/members/${memberId}/members-review`);
  };

  return (
    <Modal
      isOpen={modalOpen}
      shouldCloseOnOverlayClick={false}
      onRequestClose={() => setModalOpen(false)}
      className="w-24.31 mx-auto  mt-32 rounded-lg modals-tag bg-white shadow-modal "
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
      <div className="flex flex-col ml-1.8 pt-9">
        <h3 className="font-Inter font-semibold text-xl leading-1.43">Merge Members</h3>
        <div className="flex relative items-center mt-1.43">
          <input
            type="text"
            className="input-merge-search focus:outline-none px-3 pr-8 box-border w-20.5 h-3.06 rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
            placeholder="Search Members"
            onChange={handleSearchTextChange}
          />
          <div className="absolute right-12 w-0.78 h-3 z-40">
            <img src={searchIcon} alt="" />
          </div>
        </div>
        <div className="flex flex-col gap-5 overflow-scroll overflow-y-scroll member-section mt-1.8 height-member-merge" onScroll={handleScroll}>
          {loading ? (
            <Skeleton width={500} className={'my-4'} count={6} />
          ) : (
            suggestionList?.result &&
            suggestionList?.result?.map((member: MergeMembersDataResult) => (
              <div className="flex" key={member.id}>
                <div className="mr-0.34">
                  <input
                    type="checkbox"
                    className="checkbox"
                    id={member.id}
                    name={member.id}
                    checked={(checkedMemberId[member.id] as boolean) || false}
                    onChange={handleCheckBox}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="font-Poppins font-medium text-trial text-infoBlack leading-1.31">{member.name}</div>
                  <div className="text-tagEmail font-Poppins font-normal leading-1.31 text-email pl-1">
                    {member.email} | {member.organization}
                  </div>
                  <div className="flex mt-2.5">
                    <div className="mr-0.34 w-1.001 h-1.001">
                      <img src={member.platform.platformLogoUrl} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-end pr-6 mt-1.8 pb-[3.3094rem]">
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
    </Modal>
  );
};

export default MergeModal;
