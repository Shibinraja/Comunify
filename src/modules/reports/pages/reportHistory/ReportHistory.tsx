import { reportData } from '../ReportTableData';
import Button from 'common/button';
import Pagination from 'common/pagination/pagination';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getLocalWorkspaceId } from '@/lib/helper';

const ReportHistory: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);

  const workSpaceId = getLocalWorkspaceId() !== null && getLocalWorkspaceId();
  const navigateToCreateReport = () => {
    navigate(`/${workSpaceId}/reports/create-report`);
  };
  return (
    <div className="report-history pt-[4.445rem]">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="font-Poppins font-semibold text-infoData text-infoBlack leading-2.18 w-full">History</h3>
          <div className="">
            <Button
              type="button"
              text="create report"
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
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray ">
                      Report Name
                    </th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">Date</th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray">
                      Report Status
                    </th>
                    <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-tableHeaderGray w-6.25">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((data, i) => (
                    <tr className="border-b" key={i}>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.reportName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">{data.date}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex ">
                          <div className="py-3 font-Poppins font-medium text-trial text-infoBlack leading-1.31 cursor-pointer">
                            {data.reportStatus}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Button
                          text="Download"
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
              <Pagination currentPage={page} totalPages={10} limit={10} onPageChange={(page) => setPage(Number(page))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportHistory;
