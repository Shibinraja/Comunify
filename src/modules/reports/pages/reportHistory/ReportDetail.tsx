/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import WidgetContainer from 'common/widgets/widgetContainer/WidgetContainer';
import { format, parseISO } from 'date-fns';
import authSlice from 'modules/authentication/store/slices/auth.slice';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { reportHistoryDetailsResponseProp, ScheduleReportDateType } from '../../interfaces/reports.interface';
import { getReportHistoryDetailsListService, getReportWidgetsListService } from '../../services/reports.service';

const ReportDetail = () => {
  const limit = 10;
  const page = 1;
  const dispatch = useDispatch();
  const { workspaceId, reportHistoryId } = useParams();
  const [isManageMode, setIsManageMode] = useState<boolean>(true);
  const [widgets, setWidgets] = useState<any[] | []>([]);
  const [saveHistoryDetail, setSaveHistoryDetail] = useState<reportHistoryDetailsResponseProp>();
  const [platformIds, setPlatformIds] = useState<Array<string>>([]);
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate') || '';

  // Function to call the api and list the membersSuggestionList
  const getReportWidgetsList = async(props: { page: number; limit: number; reportId: string }) => {
    // setLoading(true);
    const data = await getReportWidgetsListService({
      workspaceId: workspaceId!,
      reportId: props.reportId,
      params: {
        page: props.page,
        limit: props.limit
      }
    });
    // setLoading(false);
    const widgetDataArray = data?.result.map((widget) => ({
      id: widget?.id,
      layout: { ...widget.config, i: widget?.id },
      widget: { ...widget?.widget, widgetId: widget?.widgetId }
    }));
    setWidgets(widgetDataArray as any[]);
  };

  useEffect(() => {
    setIsManageMode(false);
    if (reportHistoryId) {
      getReportHistoryDetailsListService({
        workspaceId: workspaceId!,
        reportHistoryId: reportHistoryId!
      }).then((reportHistory) => {
        setSaveHistoryDetail(reportHistory);

        reportHistory?.report.workspaceReportSettings[0].reportPlatforms.forEach((platformId) =>
          setPlatformIds((prevId) => [...prevId, platformId.workspacePlatform.platformSettings.platforms.id])
        );
        dispatch(authSlice.actions.setWorkspaceId({ workspaceId: reportHistory?.report.workspaceId as string }));
        getReportWidgetsList({
          limit,
          page,
          reportId: reportHistory?.report.id as string
        });
      });
    }
  }, [reportHistoryId]);

  return (
    <div className="flex flex-col font-Popins  shadow-modal">
      <header className="bg-[#141010] px-[30px] py-[35px]  h-[164px] text-white">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-semibold text-2xl capitalize">{saveHistoryDetail?.report.name}</span>
            <div className="font-medium text-sm pt-1">
              {saveHistoryDetail?.history.startAt ? `Start Date: ${format(parseISO(saveHistoryDetail?.history.startAt), 'dd MMM yyyy')}` : '--'}
              <span className="pl-3">
                {saveHistoryDetail?.history.endAt ? `End Date: ${format(parseISO(saveHistoryDetail?.history.endAt), 'dd MMM yyyy')}` : '--'}
              </span>
            </div>
          </div>
          <div className="bg-[#E5F6FF] rounded-md text-xs font-medium text-[#0A0A0A] py-2 px-4 capitalize">
            <span>{`Report Status : ${
              ScheduleReportDateType[saveHistoryDetail?.report.workspaceReportSettings[0].scheduleRepeat as unknown as number]
            }`}</span>
          </div>
        </div>

        <div className="flex items-center pt-6">
          <span className="text-sm font-medium ">Platform Selected :</span>
          {saveHistoryDetail?.report?.workspaceReportSettings[0]?.reportPlatforms?.map((platform) => (
            <div className="flex items-center ml-3" key={platform.workspacePlatform.platformSettings.platforms.id}>
              <img src={platform.workspacePlatform.platformSettings.platforms.platformLogoUrl} alt="" className="w-[21px] h-[21px] rounded-full" />
              <span className="text-xs font-semibold capitalize ml-2">{platform.workspacePlatform.platformSettings.platforms.name}</span>
            </div>
          ))}
        </div>
      </header>

      <div className="px-[30px] py-[35px]">
        <WidgetContainer isManageMode={isManageMode} widgets={widgets} filters={{ startDate, endDate, platformId: platformIds }} />
      </div>

      <footer className="px-[30px] py-[35px]">
        <div className="flex justify-end w-full">
          <div className="flex">
            {/* <Button
                type="button"
                text="Back"
                className="cancel cursor-pointer font-Poppins font-medium text-error leading-5 border-cancel text-thinGray box-border rounded w-6.875 h-3.12"
              /> */}
            {/* <Button
              type="button"
              text="Save & Download"
              // onClick={handleGenerateReport}
              className="ml-2.5 cursor-pointer font-Poppins font-medium text-error leading-5 btn-save-modal text-white w-[161px] h-3.12 border-none rounded shadow-contactBtn"
            /> */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReportDetail;
