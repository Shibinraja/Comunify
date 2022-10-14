import React from 'react';
import Modal from 'react-modal';
import Button from 'common/button';
import { ModalDrawerTypes } from './ModalDrawerTypes';

Modal.setAppElement('#root');

export const ModalDrawer: React.FC<ModalDrawerTypes> = ({ isOpen, isClose, onSubmit, contextText, loader, iconSrc }) => (
  <Modal
    isOpen={isOpen}
    shouldCloseOnOverlayClick={false}
    onRequestClose={isClose}
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
        <img src={iconSrc} alt="" />
      </div>
      <div className="mt-5 leading-6 text-black font-Inter font-semibold text-xl w-2/3 text-center">{contextText}</div>
      <div className="flex mt-1.8">
        <Button
          type="button"
          text="NO"
          className="border-none border-cancel h-2.81 w-5.25 box-border rounded cursor-pointer font-Poppins font-medium text-error leading-5 text-thinGray "
          onClick={isClose}
        />
        <Button
          type="button"
          disabled={loader}
          text="YES"
          // eslint-disable-next-line max-len
          className={`border-none ml-2.5 yes-btn h-2.81 w-5.25 box-border rounded shadow-contactBtn cursor-pointer font-Poppins font-medium text-error leading-5 text-white btn-save-modal ${
            loader ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onSubmit}
        />
      </div>
    </div>
  </Modal>
);
