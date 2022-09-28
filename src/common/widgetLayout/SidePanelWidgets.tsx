import Button from 'common/button';
import Input from 'common/input';
import React from 'react';
import widgetSearchIcon from '../../assets/images/widget-search.svg';
import Modal from 'react-modal';
import { getLocalWorkspaceId } from '../../lib/helper';
import QuickInfo from '../widgets/quickInfo/QuickInfo';
import HealthCard from '../widgets/healthCard/HealthCard';
import ActivitiesTab from '../widgets/activitiesTab/ActivitiesTab';
import { RequestForWidget, SidePanelWidgetsData, SidePanelWidgetsList } from '../../modules/dashboard/interface/dashboard.interface';
import { PanelWidgetsType, WidgetIdentification } from './WidgetTypes';
import { getSidePanelWidgetsService, requestForWidgetService } from 'modules/dashboard/services/dashboard.services';
import MembersTab from '../widgets/membersTab/MembersTab';
import MemberGrowth from '../widgets/memberGrowth/MemberGrowth';
import ActivityGrowth from '../widgets/activityGrowth/ActivityGrowth';
import useDebounce from '../../hooks/useDebounce';
import { showSuccessToast } from '../toast/toastFunctions';

Modal.setAppElement('#root');

export const widgetList: any = {
  QuickInfo: <QuickInfo />,
  HealthCard: <HealthCard />,
  ActivitiesTab: <ActivitiesTab />,
  MembersTab: <MembersTab />,
  MemberGrowth: <MemberGrowth />,
  ActivityGrowth: <ActivityGrowth />
};

// eslint-disable-next-line no-unused-vars
const SidePanelWidgets: React.FC<WidgetIdentification> = ({ widgetKey }) => {
  const [isWidgetModalOpen, setWidgetModalOpen] = React.useState<boolean>(false);
  const [SidePanelWidgets, setSidePanelWidgets] = React.useState<PanelWidgetsType[] | undefined>([]);
  const [widgetListData, setWidgetListData] = React.useState(widgetList);
  const [searchWidget, setSearchWidget] = React.useState<string>();
  const [requestForWidget, setRequestForWidget] = React.useState<RequestForWidget>({ name: '', description: '' });
  const debouncedSearchTextValue: string | undefined = useDebounce(searchWidget, 300);

  const workspaceId: string = getLocalWorkspaceId();

  React.useEffect(() => {
    if (widgetKey !== '') {
      filterWidgets(widgetKey);
    }
  }, [widgetKey]);

  React.useEffect(() => {
    getWidgetsData();
  }, []);

  React.useEffect(() => {
    if (debouncedSearchTextValue !== undefined) {
      getWidgetsData(debouncedSearchTextValue);
    }
  }, [debouncedSearchTextValue]);

  const filterWidgets = (widgetName: string) => {
    const widgetsListArray = Object.entries(widgetListData);
    const filteredWidgetsList = widgetsListArray.filter(([key]) => key !== widgetName);
    const updatedWidgetList = Object.fromEntries(filteredWidgetsList);
    setWidgetListData(updatedWidgetList);
  };

  // eslint-disable-next-line space-before-function-paren
  const getWidgetsData = async (searchText?: string) => {
    const scope = 1;
    const widgetsData: SidePanelWidgetsList[] = await getSidePanelWidgetsService(scope, workspaceId, searchText);
    const sidePanelWidgetList = widgetsData?.reduce((acc: PanelWidgetsType[], curr: SidePanelWidgetsData) => {
      const widgets = {
        layout: { x: 0, y: 0, w: 0, h: 0, i: curr.id },
        widget: { widgetLocation: curr.widgetLocation, invocationType: curr.invocationType }
      };
      widgets['layout'] = { x: 0, y: 0, w: Number(curr.config.maxW), h: Number(curr.config.height), i: curr.id };
      acc.push(widgets);
      return acc;
    }, []);
    setSidePanelWidgets(sidePanelWidgetList);
  };

  const handleSearch = (searchText: string) => {
    setSearchWidget(searchText);
  };

  // eslint-disable-next-line space-before-function-paren
  const handleRequestForWidget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body: RequestForWidget = {
      name: requestForWidget.name,
      description: requestForWidget.description
    };
    const response = await requestForWidgetService(workspaceId, body);
    setWidgetModalOpen(false);
    if (response) {
      showSuccessToast('Request for widget successful');
    }
  };

  return (
    <div className="w-1/4 xl:w-1/5 widgetDrawerGradient left-0 top-0 pb-2 max-h-[156.25rem] min-h-screen px-7 absolute z-40 opacity-90">
      <div className="flex flex-col">
        <div className="flex flex-col">
          <div className="text-center font-Poppins font-semibold text-2xl pt-24">Add Widget</div>
          <div className="pt-4 relative">
            <Input
              type="text"
              name="search"
              id="searchId"
              placeholder="Search widgets"
              value={searchWidget}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
              className="py-3 bg-white text-xs focus:outline-none px-4 rounded-0.6 pr-8 placeholder:font-Poppins placeholder:font-normal placeholder:text-widgetSearch placeholder:text-xs"
            />
            <div className="absolute top-8 right-5">
              <img src={widgetSearchIcon} alt="" />
            </div>
          </div>
        </div>
        {SidePanelWidgets?.map((component: PanelWidgetsType) => (
          <div
            key={component?.layout?.h + component?.layout?.i + component?.layout?.w}
            draggable={true}
            unselectable="on"
            onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
              e.dataTransfer.setData('droppableWidget', JSON.stringify(component));
              return true;
            }}
          >
            {widgetListData[component?.widget?.widgetLocation as keyof typeof widgetListData]}
          </div>
        ))}
        <Button
          text="Request for a Widget"
          type="submit"
          className="font-Poppins rounded-lg text-base font-semibold text-white py-3.5 mt-7 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
          onClick={() => setWidgetModalOpen(true)}
        />
        <Modal
          isOpen={isWidgetModalOpen}
          shouldCloseOnOverlayClick={false}
          onRequestClose={() => setWidgetModalOpen(false)}
          className="w-24.31 pb-12 mx-auto rounded-lg border-fetching-card bg-white shadow-modal"
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
            <h3 className="text-center font-Inter font-semibold text-xl mt-1.8 text-black leading-6">Request for a Widget</h3>
            <form className="flex flex-col relative  px-1.93 mt-9" onSubmit={handleRequestForWidget}>
              <label htmlFor="name " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                Name
              </label>
              <Input
                type="text"
                name="name"
                id="nameId"
                value={requestForWidget.name}
                className="mt-0.375 inputs app-result-card-border box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                placeholder="Enter Name"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestForWidget((prev) => ({ ...prev, name: e.target.value }))}
              />
              <label htmlFor="description" className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack mt-1.06">
                Description
              </label>
              <textarea
                name=""
                id=""
                value={requestForWidget.description}
                className="mt-0.375 inputs text-area app-result-card-border rounded-0.3 w-20.5 h-6.06 shadow-inputShadow focus:outline-none p-3 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31"
                placeholder="Description"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequestForWidget((prev) => ({ ...prev, description: e.target.value }))}
              ></textarea>
              <div className="flex items-center justify-end mt-1.8">
                <Button
                  text="Cancel"
                  type="submit"
                  className="cancel mr-2.5 text-thinGray font-Poppins text-error font-medium leading-5 cursor-pointer box-border border-cancel  h-2.81 w-5.25  rounded border-none"
                  onClick={() => setWidgetModalOpen(false)}
                />
                <Button
                  text="Save"
                  type="submit"
                  className="text-white font-Poppins text-error font-medium leading-5 btn-save-modal cursor-pointer rounded shadow-contactBtn w-5.25 border-none h-2.81"
                />
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SidePanelWidgets;
