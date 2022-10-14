import React from 'react';
import yellowDotted from '../../../assets/images/yellow_dotted.svg';
import { TabPanel } from 'common/tabs/TabPanel';
import { ActivitiesWidgetData } from '../../../modules/dashboard/interface/dashboard.interface';
import { generateDateAndTime } from '../../../lib/helper';
import Skeleton from 'react-loading-skeleton';
import { dateActivities, todayActivities, yesterdayActivities } from '../../../modules/dashboard/activitiesTab/pages/NewActivitiesList';
import moment from 'moment';

type Props = {
  hidden: boolean;
  activitiesWidgetData: ActivitiesWidgetData[] | [];
  isLoading: boolean;
  isManageMode?: boolean;
  isSidePanelOpen: boolean;
};

const NewActivitiesList: React.FC<Props> = ({ hidden, activitiesWidgetData, isLoading, isManageMode, isSidePanelOpen }) => {
  //flittering today date from the data
  const todayDate = activitiesWidgetData?.filter(
    (data: { createdAt: moment.MomentInput }) => moment(data.createdAt).format('YYYY-MM-DD') === moment.utc().format('YYYY-MM-DD')
  );

  //flittering yesterday date from the data
  const yesterdayDate = activitiesWidgetData?.filter(
    (data: { createdAt: moment.MomentInput }) => moment(data.createdAt).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')
  );

  //removing today and yesterdayDate from the data
  const allDate = activitiesWidgetData
    ?.filter(
      (data: { createdAt: moment.MomentInput }) =>
        moment(data?.createdAt).isBefore(moment.utc().subtract(1, 'days')) || moment(data?.createdAt).isAfter(moment.utc().add(1, 'days'))
    )
    .sort(
      (a: { createdAt: string | number | Date }, b: { createdAt: string | number | Date }) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  //creating an object after sorting all the dates storing into an object
  const dateMapObj: any = {};
  allDate.forEach((element) => {
    const arr: [] = dateMapObj[moment(element.createdAt).format('YYYY-MM-DD')];
    if (arr) {
      dateMapObj[moment(element.createdAt).format('YYYY-MM-DD')] = [...arr, element];
    } else {
      dateMapObj[moment(element.createdAt).format('YYYY-MM-DD')] = [element];
    }
  });

  return (
    <TabPanel hidden={hidden}>
      {isManageMode === false && !isSidePanelOpen ? (
        <div className="overflow-scroll overflow-y-scroll">
          {!isLoading ? (
            <ul>
              {todayDate.length > 0 && (
                <>
                  <h3 className="font-medium pl-7 text-m font-Poppins py-1"> Today</h3>
                  {todayDate.map((item: ActivitiesWidgetData) => (
                    <>
                      <li key={`${item?.id + item.channelId + Math.random()}`} className="my-1.68 active-list relative">
                        <div className="w-full flex justify-start items-center">
                          <div className="ml-2.024 bottom-line ">
                            {yellowDotted ? <img src={yellowDotted} alt="" /> : <Skeleton width={10} height={10} count={1} />}
                          </div>
                          <div className="ml-0.71 ">
                            <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platformLogoUrl} alt="" />
                          </div>
                          <div className="ml-0.865">
                            <div>
                              <p className="font-medium text-xs font-Poppins">
                                {item?.displayValue ? item?.displayValue : <Skeleton count={1} width={200} height={15} />}
                              </p>
                            </div>
                            <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                              <p>{item?.activityTime ? generateDateAndTime(`${item?.activityTime}`, 'HH:MM') : 'Activity time is not available'}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </>
                  ))}
                </>
              )}
              {yesterdayDate?.length > 0 && (
                <>
                  <h3 className="font-medium pl-7 text-m font-Poppins py-1"> Yesterday</h3>
                  {yesterdayDate.map((item: ActivitiesWidgetData) => (
                    <>
                      <li key={`${item?.id + item.channelId + Math.random()}`} className="my-1.68 active-list relative">
                        <div className="w-full flex justify-start items-center">
                          <div className="ml-2.024 bottom-line ">
                            {yellowDotted ? <img src={yellowDotted} alt="" /> : <Skeleton width={10} height={10} count={1} />}
                          </div>
                          <div className="ml-0.71 ">
                            <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platformLogoUrl} alt="" />
                          </div>
                          <div className="ml-0.865">
                            <div>
                              <p className="font-medium text-xs font-Poppins">
                                {item?.displayValue ? item?.displayValue : <Skeleton count={1} width={200} height={15} />}
                              </p>
                            </div>
                            <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                              <p>{item?.activityTime ? generateDateAndTime(`${item?.activityTime}`, 'HH:MM') : 'Activity time is not available'}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </>
                  ))}
                </>
              )}
              {dateMapObj && (
                <>
                  {Object.entries(dateMapObj).map((item: any) => (
                    <>
                      <h3 className="font-medium pl-7 text-m font-Poppins py-1"> {item[0]}</h3>
                      {item[1].map((item: any) => (
                        <li key={`${item?.id + item.channelId + Math.random()}`} className="my-1.68 active-list relative">
                          <div className="w-full flex justify-start items-center">
                            <div className="ml-2.024 bottom-line ">
                              {yellowDotted ? <img src={yellowDotted} alt="" /> : <Skeleton width={10} height={10} count={1} />}
                            </div>
                            <div className="ml-0.71 ">
                              <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.platformLogoUrl} alt="" />
                            </div>
                            <div className="ml-0.865">
                              <div>
                                <p className="font-medium text-xs font-Poppins">
                                  {item?.displayValue ? item?.displayValue : <Skeleton count={1} width={200} height={15} />}
                                </p>
                              </div>
                              <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                                <p>{item?.activityTime ? generateDateAndTime(`${item?.activityTime}`, 'HH:MM') : 'Activity time is not available'}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </>
                  ))}
                </>
              )}
            </ul>
          ) : (
            <>
              <div className="w-full flex justify-start items-center ">
                <div className="">
                  <Skeleton width={30} height={30} circle />
                </div>
                <div className="ml-2 mt-1">
                  <div>
                    <Skeleton width={150} height={15} />
                  </div>
                  <div className="font-Poppins text-membersCreatedAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                    <Skeleton width={100} height={5} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-scroll overflow-y-scroll">
          <ul>
            {todayActivities.length > 0 && (
              <>
                <h3 className="font-medium pl-7 text-m font-Poppins">Today</h3>
                {todayActivities.map((item) => (
                  <>
                    <li key={`${Math.random()}`} className="my-1.68 active-list relative">
                      <div className="w-full flex justify-start items-center">
                        <div className="ml-2.024 bottom-line ">
                          <img src={yellowDotted} />
                        </div>
                        <div className="ml-0.71 ">
                          <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.url} alt="" />
                        </div>
                        <div className="ml-0.865">
                          <div>
                            <p className="font-medium text-xs font-Poppins">{item?.message}</p>
                          </div>
                          <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                            <p> {generateDateAndTime(`${item?.createdAt}`, 'HH:MM')}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </>
                ))}
              </>
            )}
            {yesterdayActivities.length > 0 && (
              <>
                <h3 className="font-medium pl-7 text-m font-Poppins">Yesterday</h3>
                {yesterdayActivities.map((item) => (
                  <>
                    <li key={`${Math.random()}`} className="my-1.68 active-list relative">
                      <div className="w-full flex justify-start items-center">
                        <div className="ml-2.024 bottom-line ">
                          <img src={yellowDotted} />
                        </div>
                        <div className="ml-0.71 ">
                          <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.url} alt="" />
                        </div>
                        <div className="ml-0.865">
                          <div>
                            <p className="font-medium text-xs font-Poppins">{item?.message}</p>
                          </div>
                          <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                            <p> {generateDateAndTime(`${item?.createdAt}`, 'HH:MM')}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </>
                ))}
              </>
            )}
            {dateActivities && (
              <>
                {Object.entries(dateActivities).map((item: any) => (
                  <>
                    <h3 className="font-medium pl-7 text-m font-Poppins"> {item[0] ? item[0] : ''}</h3>

                    {item[1].map((item: any) => (
                      <li key={`${Math.random()}`} className="my-1.68 active-list relative">
                        <div className="w-full flex justify-start items-center">
                          <div className="ml-2.024 bottom-line ">
                            <img src={yellowDotted} />
                          </div>
                          <div className="ml-0.71 ">
                            <img className="h-[1.835rem] w-[1.9175rem] rounded-full" src={item?.url} alt="" />
                          </div>
                          <div className="ml-0.865">
                            <div>
                              <p className="font-medium text-xs font-Poppins">{item?.message}</p>
                            </div>
                            <div className="font-Poppins text-createdAt not-italic font-normal text-createdAtGrey dark:text-greyDark">
                              <p> {generateDateAndTime(`${item?.createdAt}`, 'HH:MM')}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </>
                ))}
              </>
            )}
          </ul>
        </div>
      )}
    </TabPanel>
  );
};

export default NewActivitiesList;
