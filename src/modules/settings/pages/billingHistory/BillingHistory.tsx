import React from 'react';
import Button from 'common/button';
import Input from 'common/input';
import { TabPanel } from 'common/tabs/TabPanel';
import nextIcon from '../../../../assets/images/next-page-icon.svg';
import prevIcon from '../../../../assets/images/previous-page-icon.svg';
import { billingHistoryData } from './BillingHistoryTableData';

type Props = {
  hidden: boolean;
};

const BillingHistory: React.FC<Props> = ({ hidden }) => (
  <TabPanel hidden={hidden}>
    <div className="billingTable mt-1.8">
      <h3 className="text-infoBlack font-Poppins font-semibold text-base leading-1.56">Billing History</h3>
      <div className="py-2 overflow-x-auto mt-1.868">
        <div className="inline-block min-w-full overflow-hidden align-middle w-61.68 rounded-t-0.6 border-table no-scroll-bar overflow-x-auto overflow-y-auto h-screen sticky top-0 fixBillingTableHead">
          <table className="min-w-full relative  rounded-t-0.6 ">
            <thead className="h-3.25  top-0 w-61.68 no-scroll-bar sticky ">
              <tr className="min-w-full">
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white border-b">Plan Name</th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white border-b">Date</th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white border-b">Amount</th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white border-b">Validity</th>
                <th className="px-6 py-3  text-left font-Poppins font-medium text-card leading-1.12 text-black  bg-white border-b"></th>
              </tr>
            </thead>
            <tbody>
              {billingHistoryData.map((data, i) => (
                <tr className="border-b" key={i}>
                  <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium">{data.planName}</td>
                  <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium">{data.date}</td>
                  <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium">{data.amount}</td>
                  <td className="px-6 py-4 font-Poppins leading-1.31 text-trial text-infoBlack font-medium">{data.validity}</td>
                  <td>
                    <Button
                      type="button"
                      text="Invoice"
                      className="w-[4.4375rem] h-[1.625rem] border-none text-white font-Poppins btn-save-modal font-medium leading-1.31 text-error rounded cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-6 flex items-center gap-0.66 pl-[30%] w-full rounded-b-lg fixed bg-white bottom-0">
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
      </div>
    </div>
  </TabPanel>
);

export default BillingHistory;
