import React, { useEffect, useState } from 'react';
import Button from 'common/button';
import { TabPanel } from 'common/tabs/TabPanel';
import { getBillingHistoryData, getBillingInvoice } from 'modules/settings/services/settings.services';
import Pagination from 'common/pagination/pagination';
import { BillingHistoryData, BillingHistoryQuery, BillingHistoryResponse } from 'modules/settings/interface/settings.interface';
import { format } from 'date-fns';
import { showSuccessToast } from 'common/toast/toastFunctions';
import { useNavigate } from 'react-router';
import { getLocalWorkspaceId } from '@/lib/helper';
import noActivityIcon from '../../../../assets/images/no-reports.svg';

type Props = {
  hidden: boolean;
  selectedTab: string;
  loadingToastCondition: string;
  clearLoadingToastCondition: () => void;
};

const BillingHistory: React.FC<Props> = ({ hidden, selectedTab, loadingToastCondition, clearLoadingToastCondition }) => {
  const navigate = useNavigate();
  const workspaceId = getLocalWorkspaceId();
  const limit = 10;

  const [fetchLoader, setFetchLoader] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [billingHistoryList, setBillingHistoryList] = useState<BillingHistoryResponse>({
    data: [],
    totalPages: 0,
    previousPage: 0,
    nextPage: 0
  });

  useEffect(() => {
    getBillingHistory({ limit, page });
  }, [page]);

  useEffect(() => {
    if (selectedTab === 'billing_history') {
      getBillingHistory({ limit, page });
    }
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === 'billing_history' && loadingToastCondition === 'showLoadingToast') {
      showSuccessToast('Billing invoice is being generated...');
      setTimeout(() => {
        getBillingHistory({ limit, page });
        showSuccessToast('Billing history list updated');
        clearLoadingToastCondition();
      }, 5000);
      // Clear the state in the location object to avoid incorrect redirection and toast messages
      navigate(`/${workspaceId}/settings`, {
        state: { selectedTab: '', loadingToastCondition: '' }
      });
    }
  }, [selectedTab]);

  // eslint-disable-next-line space-before-function-paren
  const getBillingHistory = async (params: BillingHistoryQuery) => {
    const response = await getBillingHistoryData({
      limit: params.limit,
      page: params.page
    });

    setBillingHistoryList({
      data: response?.data as BillingHistoryData[],
      totalPages: response?.totalPages,
      nextPage: response?.nextPage,
      previousPage: response?.previousPage
    });
  };

  // eslint-disable-next-line space-before-function-paren
  const downloadInvoice = async (invoiceId: string, invoiceDate: string) => {
    setFetchLoader(true);
    const decode = await getBillingInvoice(invoiceId);
    setFetchLoader(false);
    const response = new Blob([decode], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(response);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `invoice-${new Date(invoiceDate).toLocaleDateString('default', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })}.pdf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };
  return (
    <TabPanel hidden={hidden}>
      <div className="relative">
        {billingHistoryList.data?.length > 0 ? (
          <div className="billingTable mt-1.8">
            <h3 className="text-infoBlack font-Poppins font-semibold text-base leading-1.56 dark:text-white">Billing History</h3>
            <div className="py-2 overflow-x-auto mt-1.868">
              <div className="inline-block min-w-full overflow-hidden dark:border-[#dbd8fc1a] align-middle w-61.68 rounded-t-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto h-screen sticky top-0 fixBillingTableHead min-h-[31.25rem]">
                <table className="min-w-full relative  rounded-t-0.6  ">
                  <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
                    <tr className="min-w-full">
                      <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white dark:bg-thirdDark border-b dark:border-[#dbd8fc1a]">
                        Plan Name
                      </th>
                      <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white border-b dark:border-[#dbd8fc1a] dark:bg-thirdDark">
                        Purchase Date
                      </th>
                      <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white border-b dark:border-[#dbd8fc1a] dark:bg-thirdDark ">
                        Amount
                      </th>
                      <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white border-b dark:border-[#dbd8fc1a] dark:bg-thirdDark">
                        Validity
                      </th>
                      <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black dark:text-white  bg-white border-b dark:border-[#dbd8fc1a] dark:bg-thirdDark"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistoryList.data.map((data, i) => (
                      <tr className="border-b dark:border-[#dbd8fc1a]" key={i}>
                        <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium dark:bg-secondaryDark dark:text-white">
                          {data.planName}
                        </td>
                        <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium dark:bg-secondaryDark dark:text-white">
                          {data?.date ? format(new Date(data?.date), 'dd MMM yyyy') : '--'}
                        </td>
                        <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium dark:bg-secondaryDark dark:text-white">
                          ${(data?.amount / 100).toFixed(0) || 0}
                        </td>
                        <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium dark:bg-secondaryDark dark:text-white">
                          {data.validity} Days
                        </td>
                        <td className="dark:bg-secondaryDark">
                          <Button
                            type="button"
                            aria-disabled={fetchLoader}
                            disabled={fetchLoader}
                            text="Invoice"
                            className="w-[4.4375rem] h-[1.625rem] border-none text-white font-Poppins btn-save-modal font-medium leading-1.31 text-error rounded cursor-pointer"
                            onClick={() => downloadInvoice(data.invoiceId, new Date(data.date).toISOString())}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full fixActivityTableHead">
            <div>
              <img src={noActivityIcon} alt="" />
            </div>
            <div className="pt-5 font-Poppins font-medium text-greyDark text-[28px] leading-10">No billing history available</div>
          </div>
        )}
        <div className="px-6 py-6 flex items-center justify-center gap-0.66 w-full rounded-b-lg bg-white bottom-0">
          <Pagination currentPage={page} totalPages={billingHistoryList.totalPages} limit={limit} onPageChange={(page) => setPage(Number(page))} />
        </div>
      </div>
    </TabPanel>
  );
};

export default BillingHistory;
