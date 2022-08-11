import React, { useState } from 'react';
import Button from 'common/button';
import Input from 'common/input';
import { TabPanel } from 'common/tabs/TabPanel';
import nextIcon from '../../../../assets/images/next-page-icon.svg';
import prevIcon from '../../../../assets/images/previous-page-icon.svg';
import deleteBtn from '../../../../assets/images/delete.svg';
import './Tags.css';
import { tagData } from './TagData';
import Modal from 'react-modal';
Modal.setAppElement('#root');

type Props = {
  hidden: boolean;
};

const Tags: React.FC<Props> = ({ hidden }) => {
  const [isTagModalOpen, setTagModalOpen] = useState<boolean>(false);
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
                  />
                </div>
                <div className="pl-6 ">
                  <Button
                    type="button"
                    text="Add Tag"
                    className="h-3.06 w-7.68 border-none btn-save-modal  rounded font-Poppins font-medium text-white shadow-contactBtn text-error leading-1.31 cursor-pointer"
                    onClick={() => setTagModalOpen(true)}
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
                    <form className="flex flex-col relative px-1.93 mt-9">
                      <label htmlFor="billingName " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                        Tag Name
                      </label>
                      <input
                        type="text"
                        className="mt-0.375 inputs box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-trial placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                        placeholder="Enter Tag Name"
                      />
                      <div className="flex absolute right-1 top-24 pr-6 items-center">
                        <Button
                          type="button"
                          text="CANCEL"
                          className="mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  px-2 py-3 rounded border-none"
                          onClick={() => setTagModalOpen(false)}
                        />
                        <Button
                          type="button"
                          text="SAVE"
                          className="save text-white font-Poppins text-error font-medium leading-5 cursor-pointer rounded shadow-contactBtn px-5 py-3 border-none btn-save-modal"
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
                      {tagData.map((data, i) => (
                        <tr className="border" key={i}>
                          <td className="px-6 py-3">
                            <div className="flex ">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                                {data.tagName}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3">
                            <div className="flex ">
                              <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.type}</div>
                            </div>
                          </td>
                          {data.type === 'Custom' && (
                            <td>
                              <div className="flex">
                                <Button
                                  type="button"
                                  text="Edit"
                                  className="edit-btn w-6.25 h-2.87 mr-2.5 cursor-pointer text-masterCard font-Poppins font-medium text-trial leading-1.31 rounded box-border shadow-deleteButton"
                                />
                                <div className="flex items-center justify-center delete-btn cursor-pointer w-3.12 h-2.87 rounded box-border shadow-deleteButton">
                                  <img src={deleteBtn} alt="" />
                                </div>
                              </div>
                            </td>
                          )}
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
