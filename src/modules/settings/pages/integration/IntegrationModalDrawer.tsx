import React from 'react';
import Modal from 'react-modal';
import { IntegrationModalDrawerTypes } from './IntegrationDrawerTypes';

Modal.setAppElement('#root');

export const IntegrationModalDrawer: React.FC<IntegrationModalDrawerTypes> = ({ isOpen, isClose, contextText, iconSrc }) => (
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
    <div className="loading">
      <div className="flex flex-col items-center justify-center  ">
        <div className=" bg-no-repeat bg-center bg-contain ">
          <img src={iconSrc} alt="" className="rounded-full w-2.68 h-2.68" />
        </div>
        <div className="mt-4 text-integrationGray font-Poppins fomt-normal text-desc leadind-1.68">
          Fetching data from <span className="text-black font-normal">{contextText}</span>
        </div>
        <div className="mt-1.8">
          <div className="dot-pulse">
            <div className="dot-pulse__dot"></div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
);
