/* eslint-disable @typescript-eslint/no-non-null-assertion */
import usePlatform from '@/hooks/usePlatform';
import Button from 'common/button';
import WidgetContainer from 'common/widgets/widgetContainer/WidgetContainer';
import { format, parseISO } from 'date-fns';
import { ConnectedPlatforms } from 'modules/settings/interface/settings.interface';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from 'react-modal';
import { ScheduleReportDateType, WidgetPreviewType } from '../../interfaces/reports.interface';

Modal.setAppElement('#root');

const WidgetPreview: React.FC<WidgetPreviewType> = ({ isOpen, setIsOpen, filters, transformData, setManageMode }) => {
  const { PlatformsConnected } = usePlatform();
  const [isManageMode, setIsManageMode] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const reportValuesData = JSON.parse(localStorage.getItem('reportValues')!);

  useEffect(() => {
    setIsManageMode(false);
    setIsOpen(true);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick={false}
      onRequestClose={() => setIsOpen(false)}
      className="w-10/12 mx-auto rounded-lg modals-tag bg-white shadow-modal flex items-center justify-center"
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
      <div className="flex flex-col   font-Popins w-full">
        <header className="bg-[#141010] px-[30px] py-[35px] rounded-tl-lg rounded-tr-lg h-[164px] text-white">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="font-semibold text-2xl capitalize">{reportValuesData.name}</span>
              <div className="font-medium text-sm pt-1">
                {startDate && `Date : ${format(parseISO(startDate as string), 'dd MMM yyyy')}`}
                <span className="pl-3">{endDate && `To : ${format(parseISO(endDate as string), 'dd MMM yyyy')}`}</span>
              </div>
            </div>
            {reportValuesData.schedule !== ScheduleReportDateType.NoSchedule && (
              <div className="bg-[#E5F6FF] rounded-md text-xs font-medium text-[#0A0A0A] py-2 px-4 capitalize">
                <span>{`Report Status : ${ScheduleReportDateType[reportValuesData.schedule as unknown as number]}`}</span>
              </div>
            )}
          </div>

          <div className="flex items-center pt-6">
            <span className="text-sm font-medium ">Platform Selected :</span>
            {reportValuesData
              ? reportValuesData?.platform?.map((platformId: string) =>
                PlatformsConnected.map((platform: ConnectedPlatforms) => {
                  if (platform.id === platformId) {
                    return (
                      <div className="flex items-center ml-3" key={platform.id}>
                        <img src={platform?.platformLogoUrl} alt="" className="w-[21px] h-[21px] rounded-full" />
                        <span className="text-xs font-semibold capitalize ml-2">{platform.id === platformId ? platform.name : ''}</span>
                      </div>
                    );
                  }
                })
              )
              : null}
          </div>
        </header>

        <div className="px-[30px] py-[10px] preview-box overflow-auto">
          <WidgetContainer isManageMode={isManageMode} widgets={transformData} filters={filters} />
        </div>

        <footer className="px-[30px] py-[35px]">
          <div className="flex justify-end w-full">
            <div className="flex">
              <Button
                type="button"
                text="Back"
                onClick={() => {
                  setManageMode(true);
                  setIsOpen(false);
                }}
                className="cancel cursor-pointer font-Poppins font-medium text-error leading-5 border-cancel text-thinGray box-border rounded w-6.875 h-3.12"
              />
              {/* <Button
                type="button"
                text="Save & Download"
                onClick={handleGenerateReport}
                className="ml-2.5 cursor-pointer font-Poppins font-medium text-error leading-5 btn-save-modal text-white w-[161px] h-3.12 border-none rounded shadow-contactBtn"
              /> */}
            </div>
          </div>
        </footer>
      </div>
    </Modal>
  );
};

export default WidgetPreview;
