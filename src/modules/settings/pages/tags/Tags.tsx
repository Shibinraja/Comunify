/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useRedux';
import Button from 'common/button';
import Input from 'common/input';
import Pagination from 'common/pagination/pagination';
import { TabPanel } from 'common/tabs/TabPanel';
import { showErrorToast } from 'common/toast/toastFunctions';
import { TagResponseData, TagType } from 'modules/settings/interface/settings.interface';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import * as Yup from 'yup';
import deleteBtn from '../../../../assets/images/delete.svg';
import './Tags.css';
Modal.setAppElement('#root');

type Props = {
  hidden: boolean;
};

const Tags: React.FC<Props> = ({ hidden }) => {
  const limit = 10;
  const dispatch = useDispatch();
  const { workspaceId } = useParams();
  const [searchText, setSearchText] = useState<string>('');
  const [tagName, setTagName] = useState<string>('');
  const [tagId, setTagId] = useState<string>('');
  const [edit, setEdit] = useState<{
    isEdit: boolean;
    tagId: string;
  }>({
    isEdit: false,
    tagId: ''
  });
  const [page, setPage] = useState<number>(1);
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | unknown>('');

  const {
    TagFilterResponse: { data: TagFilterResponseData, totalPages },
    clearValue
  } = useAppSelector((state) => state.settings);

  const debouncedValue = useDebounce(searchText, 300);
  const TagNameValidation = Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(2, 'Tag Name must be atleast 2 characters')
    .max(20, 'Tag Name should not exceed above 20 characters')
    .required('Tag Name is a required field')
    .nullable(true);

  useEffect(() => {
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: {
          page,
          limit,
          tags: {
            checkedTags: '',
            searchedTags: ''
          }
        },
        workspaceId: workspaceId!
      })
    );
  }, [page]);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getTagsList(1, debouncedValue);
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (tagId !== '') {
      setIsDeleteModalOpen(true);
      dispatch(settingsSlice.actions.resetValue(false));
      setPage(1);
    }
  }, [tagId]);

  useEffect(() => {
    if (clearValue) {
      setIsDeleteModalOpen(false);
      setTagId('');
    }
  }, [clearValue]);

  const getTagsList = (pageNumber: number, text: string): void => {
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: {
          page: pageNumber,
          limit,
          tags: {
            checkedTags: '',
            searchedTags: text
          }
        },
        workspaceId: workspaceId!
      })
    );
  };

  const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchText: string = event.target.value;
    if (!searchText) {
      getTagsList(1, '');
    }
    setSearchText(searchText);
  };

  const createTags = (event: ChangeEvent<HTMLInputElement>) => {
    const tagsName = event.target.value;
    setTagName(tagsName);
    try {
      TagNameValidation.validateSync(tagsName);
      setErrorMessage('');
    } catch ({ message }) {
      setErrorMessage(message);
    }
  };

  const handleTagModalOpen = (tagName?: string, id?: string, isEditable?: boolean) => {
    if (isEditable) {
      showErrorToast('Not authorized to edit the tag');
    }
    if (!isEditable) {
      setTagName(tagName as string);
      setEdit({ isEdit: true, tagId: id as string });
      setTagModalOpen((prev) => !prev);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage || !tagName) {
      setErrorMessage(errorMessage || 'TagName is a required field');
    } else {
      if (edit.isEdit && edit.tagId) {
        dispatch(
          settingsSlice.actions.updateTags({
            tagId: edit.tagId,
            tagBody: {
              name: tagName,
              viewName: tagName
            },
            workspaceId: workspaceId!
          })
        );
      } else {
        dispatch(
          settingsSlice.actions.createTags({
            tagBody: {
              name: tagName,
              viewName: tagName
            },
            workspaceId: workspaceId!
          })
        );
      }
      handleTagModalOpen();
    }
  };

  const handleDeleteTagName = (tagId: string): void => {
    setTagId(tagId);
  };

  const handleCancelConfirmationModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirmationModal = () => {
    dispatch(
      settingsSlice.actions.deleteTags({
        tagId,
        workspaceId: workspaceId!
      })
    );
  };

  return (
    <>
      <TabPanel hidden={hidden}>
        {' '}
        <div className="relative">
          <div className="tagTable mt-[2.625rem] ">
            <div className="flex flex-col">
              <div className="flex items-center w-full">
                <div className="font-Poppins font-semibold text-base text-infoBlack leading-1.43 w-full">Tags</div>
                <div className="flex justify-end">
                  <div className="w-full">
                    <input
                      type="text"
                      className="input-search  h-3.06 box-border focus:outline-none px-3 rounded-0.6 shadow-profileCard placeholder:font-Poppins placeholder:font-normal placeholder:text-card placeholder:leading-1.31 placeholder:text-searchGray"
                      placeholder="Search By Name"
                      onChange={handleSearchTextChange}
                    />
                  </div>
                  <div className="pl-6 ">
                    <Button
                      type="button"
                      text="Add Tag"
                      className="h-3.06 w-7.68 border-none btn-save-modal  rounded font-Poppins font-medium text-white shadow-contactBtn text-error leading-1.31 cursor-pointer"
                      onClick={() => handleTagModalOpen()}
                    />
                  </div>
                  <Modal
                    isOpen={isTagModalOpen}
                    shouldCloseOnOverlayClick={false}
                    className="w-24.31 h-18.75 mx-auto rounded-lg modals-tag bg-white shadow-modal"
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
                    <div className="flex flex-col">
                      <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Add Tag</h3>
                      <form className="flex flex-col relative px-1.93 mt-9" onSubmit={(e) => handleSubmit(e)}>
                        <label htmlFor="billingName " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                          Tag Name
                        </label>
                        <Input
                          type="text"
                          className="mt-0.375 inputs box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                          placeholder="Enter Tag Name"
                          id="tags"
                          name="tags"
                          label="Tags"
                          onChange={createTags}
                          value={tagName}
                          errors={Boolean(errorMessage)}
                          helperText={errorMessage}
                        />
                        <div className="flex justify-end pt-10 items-center">
                          <Button
                            type="button"
                            text="CANCEL"
                            className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  w-5.25 h-2.81  rounded border-none"
                            onClick={() => handleTagModalOpen()}
                          />
                          <Button
                            type="submit"
                            text="SAVE"
                            className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn w-5.25 h-2.81  border-none btn-save-modal"
                          />
                        </div>
                      </form>
                    </div>
                  </Modal>
                </div>
              </div>
              {TagFilterResponseData?.length > 0 ? (
                <div className="billingTable mt-1.8">
                  <div className="py-2 overflow-x-auto mt-1.868">
                    <div className="inline-block min-w-full overflow-hidden align-middle w-61.68 rounded-t-0.6  no-scroll-bar overflow-x-auto overflow-y-auto h-screen sticky top-0 fixTagsTableHead min-h-[31.25rem]">
                      <table className="min-w-full relative  rounded-t-0.6 ">
                        <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
                          <tr className="min-w-full">
                            <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white  bg-tableHeaderGray">
                              Tag Name
                            </th>
                            <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white  bg-tableHeaderGray">
                              Type
                            </th>
                            <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white  bg-tableHeaderGray">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TagFilterResponseData?.map((data: TagResponseData, i) => (
                            <>
                              <tr className="border" key={i}>
                                <td className="px-6 py-3">
                                  <div className="flex ">
                                    <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                                      {data.name}
                                    </div>
                                  </div>
                                </td>

                                <td className="px-6 py-3">
                                  <div className="flex ">
                                    <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                                      {data.type}
                                    </div>
                                  </div>
                                </td>
                                {data.type !== TagType.Default && (
                                  <td>
                                    <div className="flex">
                                      <Button
                                        type="button"
                                        text="Edit"
                                        className="edit-btn w-6.25 h-2.87 mr-2.5 cursor-pointer text-masterCard font-Poppins font-medium text-trial leading-1.31 rounded box-border shadow-deleteButton"
                                        onClick={() => handleTagModalOpen(data.name, data.id)}
                                      />
                                      <div className="flex items-center justify-center delete-btn cursor-pointer w-3.12 h-2.87 rounded box-border shadow-deleteButton">
                                        <img src={deleteBtn} alt="" onClick={() => handleDeleteTagName(data.id)} />
                                      </div>
                                    </div>
                                  </td>
                                )}
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg bg-white bottom-0">
            <Pagination currentPage={page} totalPages={totalPages} limit={limit} onPageChange={(page) => setPage(Number(page))} />
          </div>
        </div>
      </TabPanel>
      <Modal
        isOpen={isDeleteModalOpen}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setIsDeleteModalOpen(false)}
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
          <div className="mt-5 leading-6 text-black font-Inter font-semibold text-xl w-2/3 text-center">Are you sure want to delete tags</div>
          <div className="flex mt-1.8">
            <Button
              type="button"
              text="NO"
              className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
              onClick={handleCancelConfirmationModal}
            />
            <Button
              type="button"
              text="YES"
              onClick={handleDeleteConfirmationModal}
              className="border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Tags;
