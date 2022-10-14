/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { generateDateAndTime } from '@/lib/helper';
import Button from 'common/button';
import Pagination from 'common/pagination/pagination';
import { width_90 } from 'constants/constants';
import { getReportsHistoryListServiceResponseProps, ReportsHistoryListServiceData, ScheduleReportDateType } from 'modules/reports/interfaces/reports.interface';
import { getReportsHistoryListService } from 'modules/reports/services/reports.service';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router';

const ReportHistory: React.FC = () => {
  const limit = 10;
  const navigate = useNavigate();
  const { workspaceId, reportId } = useParams();
  const [page, setPage] = useState<number>(1);
  const [reportsList, setReportsList] = useState<getReportsHistoryListServiceResponseProps>({
    data: [],
    totalPages: '0',
    previousPage: '0',
    nextPage: '0'
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getReportsHistoryList = async(props: any) => {
    setLoading(true);
    const data = await getReportsHistoryListService({
      workspaceId: workspaceId!,
      reportId: reportId as string,
      params: {
        page: props.page,
        limit: props.limit
      }
    });
    setLoading(false);
    setReportsList(data as getReportsHistoryListServiceResponseProps);
  };

  useEffect(() => {
    getReportsHistoryList({
      page,
      limit
    });
  }, [page]);

  const navigateToCreateReport = () => {
    navigate(`/${workspaceId}/reports/create-report`);
  };

  const handleNavigateToReportPreview = (reportId:string, startDate:string, endDate:string) => {
    window.open(`/${workspaceId}/reports/${reportId}/report-details?startDate=${startDate}&endDate=${endDate}`, '_blank');
  };

  return (
    <div className="report-history pt-[4.445rem]">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full">History</h3>
          <div className="">
            <Button
              type="button"
              text="Create Report"
              className="btn-save-modal border-none text-white w-8.37 font-Poppins font-medium shadow-contactBtn rounded leading-1.12 h-3.06 text-error cursor-pointer transition ease-in duration-300 hover:shadow-buttonShadowHover"
              onClick={navigateToCreateReport}
            />
          </div>
        </div>
        <div className="relative">
          <div className="py-2 overflow-x-auto mt-1.868">
            <div className="inline-block min-w-full align-middle rounded-0.6 border-table no-scroll-bar  overflow-y-auto h-screen sticky top-0 fixReportHistoryTableHead min-h-[31.25rem]">
              <table className="min-w-full relative  rounded-t-0.6 ">
                <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky z-40">
                  <tr className="min-w-full">
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Generated Date</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">From Date</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">To Date</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                      Schedule Type
                    </th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray w-6.25">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportsList?.data?.map((data:ReportsHistoryListServiceData, i) => (
                    <tr className="border-b" key={i}>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 ">
                            {loading ? <Skeleton width={width_90} /> : generateDateAndTime(`${data?.createdAt}`, 'MM-DD-YYYY')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 ">
                            {loading ? <Skeleton width={width_90} /> : generateDateAndTime(`${data?.startAt}`, 'MM-DD-YYYY')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 ">
                            {loading ? <Skeleton width={width_90} /> : generateDateAndTime(`${data?.endAt}`, 'MM-DD-YYYY')}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 ">
                            {loading ? <Skeleton width={width_90} /> : ScheduleReportDateType[`${data?.userWorkspaceReport?.workspaceReportSettings[0]?.scheduleRepeat}`] === 'NoSchedule' ? 'No Schedule': ScheduleReportDateType[data?.userWorkspaceReport?.workspaceReportSettings[0]?.scheduleRepeat]}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Button
                          text="View"
                          onClick={() => handleNavigateToReportPreview(data.id, data.startAt, data.endAt)}
                          className="font-Poppins text-sm font-medium text-download leading-5 border-download w-[6.5625rem] h-10 rounded-[0.1875rem] hover:border-infoBlack transition ease-in-out duration-300"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="p-6">
                    <td className="p-6 "></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg bg-white bottom-0">
              <Pagination currentPage={page} totalPages={Number(reportsList.totalPages)} limit={10} onPageChange={(page) => setPage(Number(page))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
