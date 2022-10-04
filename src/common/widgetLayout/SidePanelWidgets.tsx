import Button from 'common/button';
import Input from 'common/input';
import React, { Suspense } from 'react';
import widgetSearchIcon from '../../assets/images/widget-search.svg';
import Modal from 'react-modal';
import { getLocalWorkspaceId } from '../../lib/helper';
import { RequestForWidget, SidePanelWidgetsData, SidePanelWidgetsList } from '../../modules/dashboard/interface/dashboard.interface';
import { PanelWidgetsType, WidgetComponentProps, WidgetIdentification } from './WidgetTypes';
import { getSidePanelWidgetsService, requestForWidgetService } from 'modules/dashboard/services/dashboard.services';
import useDebounce from '../../hooks/useDebounce';
import { showSuccessToast } from '../toast/toastFunctions';
// Temporarily imported for development
import WidgetComponents from 'common/widgets';
import Skeleton from 'react-loading-skeleton';

Modal.setAppElement('#root');

const SidePanelWidgets: React.FC<WidgetIdentification> = ({ widgetKey, widgetRemoved }) => {
  const [isWidgetModalOpen, setWidgetModalOpen] = React.useState<boolean>(false);
  const [sidePanelWidgetsData, setSidePanelWidgetsData] = React.useState<SidePanelWidgetsList[] | undefined>([]);
  const [sidePanelWidgets, setSidePanelWidgets] = React.useState<PanelWidgetsType[] | undefined>([]);
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

  React.useEffect(() => {
    if (widgetRemoved) {
      handleWidgetRemovedFromDashboard(widgetRemoved);
    }
  }, [widgetRemoved]);

  const filterWidgets = (widgetName: string) => {
    if (widgetName && sidePanelWidgets?.length) {
      const sidePanelWidgetList = [...sidePanelWidgets];
      const filteredWidgetsList = sidePanelWidgetList.filter((widget) => widget.widget.widgetLocation !== widgetName);
      setSidePanelWidgets(filteredWidgetsList);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const getWidgetsData = async (searchText?: string) => {
    const scope = 1;
    const widgetsData: SidePanelWidgetsList[] = await getSidePanelWidgetsService(scope, workspaceId, searchText);
    setSidePanelWidgetsData(widgetsData);
    const sidePanelWidgetList = widgetsData?.reduce((acc: PanelWidgetsType[], curr: SidePanelWidgetsData) => {
      const widgets = {
        layout: { x: 0, y: 0, w: 0, h: 0, i: curr.id, minW: 0, minH: 0 },
        widget: { widgetLocation: curr.widgetLocation, invocationType: curr.invocationType, widgetId: curr.id },
        isAssigned: curr?.isAssigned
      };
      widgets['layout'] = {
        x: 0,
        y: 0,
        i: curr.id,
        w: handleWidgetWidth(curr?.widgetLocation, curr?.config?.width),
        h: handleWidgetHeight(curr?.widgetLocation, curr?.config?.height),
        minW: 4,
        minH: 2
      };
      acc.push(widgets);
      return acc;
    }, []);
    setSidePanelWidgets(sidePanelWidgetList);
  };

  const handleSearch = (searchText: string) => {
    setSearchWidget(searchText);
  };

  const handleWidgetWidth = (widgetLocation: string, width: number) => {
    if (widgetLocation === 'QuickInfo') {
      return width + 6;
    } else if (widgetLocation === 'HealthCard') {
      return width + 3;
    }
    return width;
  };

  const handleWidgetHeight = (widgetLocation: string, height: number) => {
    if (
      widgetLocation === 'MembersTab' ||
      widgetLocation === 'MemberGrowth' ||
      widgetLocation === 'ActivityGrowth' ||
      widgetLocation === 'ActivitiesTab'
    ) {
      return height + 2;
    }
    return height;
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
    setRequestForWidget({ name: '', description: '' });
    if (response) {
      showSuccessToast('Request for widget successful');
    }
  };

  const renderWidget = (widgetLocation: string, isAssigned: boolean, props: React.PropsWithoutRef<WidgetComponentProps>) => {
    // use this while developing because vite doesn't hot reload dynamically imported components
    const Widget = WidgetComponents[widgetLocation];

    // Use dynamic import while pushing to prod
    // const Widget = React.lazy(() => import(`../../common/widgets/${widgetLocation}/${widgetLocation}`));
    return (
      <Suspense
        fallback={<Skeleton width={400} height={300} highlightColor={'#e5e7eb'} style={{ backgroundColor: 'white' }} count={1} enableAnimation />}
      >
        {!isAssigned && <Widget {...props} />}
      </Suspense>
    );
  };

  const widgetProps = {
    isManageMode: false,
    removeWidgetFromDashboard: () => null,
    widget: {},
    isShrunk: true
  };

  const handleWidgetRemovedFromDashboard = (widgetData: string) => {
    const widgetToBeAppended: SidePanelWidgetsList[] | undefined = sidePanelWidgetsData?.filter((data) => data?.widgetLocation === widgetData);
    if (widgetToBeAppended) {
      const newWidgetDataArray: PanelWidgetsType[] = widgetToBeAppended?.reduce((acc: PanelWidgetsType[], curr: SidePanelWidgetsList) => {
        const widgets = {
          layout: { x: 0, y: 0, w: 0, h: 0, i: curr.id },
          widget: { widgetLocation: curr.widgetLocation, invocationType: curr.invocationType, widgetId: curr.id },
          isAssigned: false
        };
        widgets['layout'] = { x: 0, y: 0, w: Number(curr.config.width), h: Number(curr.config.height), i: curr.id };
        acc.push(widgets);
        return acc;
      }, []);
      const newWidgetData = newWidgetDataArray[0];
      sidePanelWidgets?.push(newWidgetData);
    }
  };

  return (
    <div className="w-1/4 xl:w-1/5 widgetDrawerGradient left-0 top-0 pb-2 max-h-[156.25rem] min-h-screen px-7 absolute z-40 opacity-90">
      <div className="flex flex-col">
        <div className="flex flex-col pb-2">
          <div className="text-center font-Poppins font-semibold text-2xl pt-24">Add Widget</div>
          <div className="pt-4 relative">
            <Input
              type="text"
              name="search"
              id="searchId"
              placeholder="Search widgets"
              value={searchWidget}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e?.target?.value)}
              className="py-3 bg-white text-xs focus:outline-none px-4 rounded-0.6 pr-8 placeholder:font-Poppins placeholder:font-normal placeholder:text-widgetSearch placeholder:text-xs"
            />
            <div className="absolute top-8 right-5">
              <img src={widgetSearchIcon} alt="" />
            </div>
          </div>
        </div>
        {!sidePanelWidgets?.length && (
          <div className="flex justify-center items-center font-Poppins font-semibold text-lg mt-3 text-infoBlack">No Widgets to be displayed</div>
        )}
        <div className="overflow-scroll widget-height overflow-x-hidden">
          {sidePanelWidgets?.map((component: PanelWidgetsType) => {
            widgetProps.widget = component;
            return (
              <div
                key={component?.layout?.h + component?.layout?.i + component?.layout?.w}
                draggable={true}
                // eslint-disable-next-line react/no-unknown-property
                unselectable="on"
                onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                  e?.dataTransfer.setData('droppableWidget', JSON.stringify(component));
                  return true;
                }}
                className={''}
              >
                {renderWidget(
                  component?.widget?.widgetLocation as string,
                  component?.isAssigned as boolean,
                  widgetProps as unknown as WidgetComponentProps
                )}
              </div>
            );
          })}
          <Button
            text="Request for a Widget"
            type="submit"
            className="font-Poppins rounded-lg sticky bottom-0  w-full text-base font-semibold text-white py-3.5 mt-7 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
            onClick={() => setWidgetModalOpen(true)}
          />
        </div>
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRequestForWidget((prev) => ({ ...prev, name: e?.target?.value }))}
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequestForWidget((prev) => ({ ...prev, description: e?.target?.value }))}
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
