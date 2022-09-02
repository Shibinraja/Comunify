/* eslint-disable @typescript-eslint/no-non-null-assertion */
import useDebounce from '@/hooks/useDebounce';
import { useAppSelector } from '@/hooks/useRedux';
import Button from 'common/button';
import Input from 'common/input';
import { TabPanel } from 'common/tabs/TabPanel';
import settingsSlice from 'modules/settings/store/slice/settings.slice';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import * as Yup from 'yup';
import deleteBtn from '../../../../assets/images/delete.svg';
import nextIcon from '../../../../assets/images/next-page-icon.svg';
import prevIcon from '../../../../assets/images/previous-page-icon.svg';
import './Tags.css';
// import { TagResponse } from 'modules/settings/interface/settings.interface';
Modal.setAppElement('#root');

type Props = {
  hidden: boolean;
};

const Tags: React.FC<Props> = ({ hidden }) => {
  const dispatch = useDispatch();
  const { workspaceId } = useParams();
  const [searchText, setSearchText] = useState<string>('');
  const [tagName, setTagName] = useState<string>('');
  const [edit, setEdit] = useState<{
    isEdit: boolean;
    tagId: string;
  }>({
    isEdit: false,
    tagId: ''
  });
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | unknown>('');

  const { TagFilterResponse } = useAppSelector((state) => state.settings);

  const debouncedValue = useDebounce(searchText, 300);
  const TagNameValidation = Yup.string()
    .min(2, 'Tag Name must be atleast 2 characters')
    .max(50, 'Tag Name should not exceed above 50 characters')
    .required('Tag Name is a required field')
    .nullable(true);

  useEffect(() => {
    getTagsList('');
  }, []);

  // Returns the debounced value of the search text.
  useEffect(() => {
    if (debouncedValue) {
      getTagsList(debouncedValue);
    }
  }, [debouncedValue]);

  const getTagsList = (text: string): void => {
    dispatch(
      settingsSlice.actions.tagFilterData({
        settingsQuery: {
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
    if (searchText === '') {
      getTagsList('');
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

  const handleTagModalOpen = (tagName?: string, id?: string) => {
    setTagName(tagName as string);
    setEdit({ isEdit: true, tagId: id as string });
    setTagModalOpen((prev) => !prev);
    setErrorMessage('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (errorMessage) {
      //
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
    dispatch(
      settingsSlice.actions.deleteTags({
        tagId,
        workspaceId: workspaceId!
      })
    );
  };

  // const tagOptions = ['op1', 'op2', 'op3', 'op4', 'op5', 'op1', 'op2', 'op3', 'op4', 'op5'];

  return (
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
                      {/* <div className="bg-white absolute top-20 w-[20.625rem] max-h-full app-input-card-border rounded-lg overflow-scroll z-40 hidden">
                        {TagFilterResponse.map((data:TagResponse) => (
                          <div
                            key={data.id}
                            className="p-2 text-searchBlack cursor-pointer font-Poppins font-normal text-trial leading-1.31 hover:font-medium hover:bg-signUpDomain transition ease-in duration-300"
                          >
                            {data.name}
                          </div>
                        ))}
                      </div> */}
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
                      {TagFilterResponse.map((data, i) => (
                        <tr className="border" key={i}>
                          <td className="px-6 py-3">
                            <div className="flex ">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.name}</div>
                            </div>
                          </td>

                          <td className="px-6 py-3">
                            <div className="flex ">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                                {data.viewName}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex">
                              <Button
                                type="submit"
                                text="Edit"
                                className="edit-btn w-6.25 h-2.87 mr-2.5 cursor-pointer text-masterCard font-Poppins font-medium text-trial leading-1.31 rounded box-border shadow-deleteButton"
                                onClick={() => handleTagModalOpen(data.name, data.id)}
                              />
                              <div className="flex items-center justify-center delete-btn cursor-pointer w-3.12 h-2.87 rounded box-border shadow-deleteButton">
                                <img src={deleteBtn} alt="" onClick={() => handleDeleteTagName(data.id)} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg bg-white bottom-0">
          <div className="pagination w-1.51 h-1.51 box-border rounded flex items-center justify-center cursor-pointer">
            <img src={prevIcon} alt="" />
          </div>
          <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">1</div>
          <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">2</div>
          <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">3</div>
          <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">4</div>
          <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">...</div>
          <div className="font-Lato font-normal text-error leading-4 text-pagination cursor-pointer">10</div>
          <div className="pagination w-1.51 h-1.51 box-border rounded flex items-center justify-center cursor-pointer">
            <img src={nextIcon} alt="" />
          </div>
          <div className="font-Lato font-normal text-pageNumber leading-4 text-pagination cursor-pointer">Go to page:</div>
          <div>
            <Input name="pagination" id="page" type="text" className="page-input focus:outline-none px-0.5 rounded box-border w-1.47 h-1.51" />
          </div>
        </div>
      </div>
    </TabPanel>
  );
};

export default Tags;
