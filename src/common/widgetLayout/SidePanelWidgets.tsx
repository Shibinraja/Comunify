import Button from 'common/button';
import Input from 'common/input';
import React, { Suspense } from 'react';
import widgetSearchIcon from '../../assets/images/widget-search.svg';
import Modal from 'react-modal';
import { getLocalWorkspaceId } from '../../lib/helper';
import {
  RequestForWidget,
  RequestForWidgetResponse,
  SidePanelWidgetsData,
  SidePanelWidgetsList
} from '../../modules/dashboard/interface/dashboard.interface';
import { PanelWidgetsType, WidgetComponentProps, WidgetIdentification } from './WidgetTypes';
import { getSidePanelWidgetsService, requestForWidgetService } from 'modules/dashboard/services/dashboard.services';
import useDebounce from '../../hooks/useDebounce';
import { showSuccessToast } from '../toast/toastFunctions';
// Temporarily imported for development
import WidgetComponents from 'common/widgets';
import Skeleton from 'react-loading-skeleton';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { whiteSpace_single_regex } from '../../constants/constants';
import TextArea from '../textArea/TextArea';

Modal.setAppElement('#root');

const SidePanelWidgets: React.FC<WidgetIdentification> = ({ widgetKey, widgetRemoved }) => {
  const [isWidgetModalOpen, setWidgetModalOpen] = React.useState<boolean>(false);
  const [sidePanelWidgetsData, setSidePanelWidgetsData] = React.useState<SidePanelWidgetsList[] | undefined>([]);
  const [sidePanelWidgets, setSidePanelWidgets] = React.useState<PanelWidgetsType[] | undefined>([]);
  const [searchWidget, setSearchWidget] = React.useState<string>();
  const debouncedSearchTextValue: string | undefined = useDebounce(searchWidget, 300);
  const [isButtonLoading, setIsButtonLoading] = React.useState<boolean>(false);

  const workspaceId: string = getLocalWorkspaceId();
  React.useEffect(() => {
    if (widgetKey.length) {
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

  const filterWidgets = (widgetName: string[]) => {
    if (widgetName && sidePanelWidgets?.length) {
      const sidePanelWidgetList = [...sidePanelWidgets];
      const filteredWidgetsList = sidePanelWidgetList.filter((widget) => !widgetName.includes(widget?.widget?.widgetLocation));
      setSidePanelWidgets(filteredWidgetsList);
    }
  };

  // eslint-disable-next-line space-before-function-paren
  const getWidgetsData = async (searchText?: string) => {
    const scope = window.location.href.includes('/reports') ? [1, 2] : window.location.href.includes('/dashboard') ? [1, 3] : [];
    const widgetsData: SidePanelWidgetsList[] = await getSidePanelWidgetsService(scope.toString(), workspaceId, searchText);
    setSidePanelWidgetsData(widgetsData);
    const sidePanelWidgetList = widgetsData?.reduce((acc: PanelWidgetsType[], curr: SidePanelWidgetsData) => {
      const widgets = {
        layout: { x: 0, y: 0, w: 0, h: 0, i: curr?.id, minW: 0, minH: 0, maxH: 0 },
        widget: { widgetLocation: curr?.widgetLocation, invocationType: curr?.invocationType, widgetId: curr?.id },
        isAssigned: curr?.isAssigned
      };
      widgets['layout'] = {
        x: 0,
        y: 0,
        i: curr?.id,
        w: curr?.config?.w,
        h: curr?.config?.h,
        minW: curr?.config?.minW,
        minH: curr?.config?.minH,
        maxH: curr?.config?.maxH || 0
      };
      acc.push(widgets);
      return acc;
    }, []);
    const filteredWidgetsList = sidePanelWidgetList.filter((widget) => !widgetKey.includes(widget?.widget?.widgetLocation));
    setSidePanelWidgets(filteredWidgetsList);
  };

  const handleSearch = (searchText: string) => {
    setSearchWidget(searchText);
  };

  const renderWidget = (widgetLocation: string, isAssigned: boolean, props: React.PropsWithoutRef<WidgetComponentProps>) => {
    // use this while developing because vite doesn't hot reload dynamically imported components
    const Widget = WidgetComponents[widgetLocation];
    // Use dynamic import while pushing to prod
    // const Widget = React.lazy(() => import(`../../common/widgets/${widgetLocation}/${widgetLocation}`));
    return <Suspense fallback={<Skeleton width={400} height={300} count={1} enableAnimation />}>{<Widget {...props} />}</Suspense>;
  };

  const widgetProps = {
    isSidePanelOpen: true,
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
          widget: { widgetLocation: curr?.widgetLocation, invocationType: curr?.invocationType, widgetId: curr?.id },
          isAssigned: false
        };
        widgets['layout'] = { x: 0, y: 0, w: Number(curr?.config?.w), h: Number(curr.config?.h), i: curr?.id };
        acc.push(widgets);
        return acc;
      }, []);
      const newWidgetData = newWidgetDataArray[0];
      sidePanelWidgets?.push(newWidgetData);
    }
  };

  const initialValues: RequestForWidget = {
    name: '',
    description: ''
  };

  // eslint-disable-next-line space-before-function-paren
  const handleRequestForWidgetSubmit = async (values: RequestForWidget) => {
    setIsButtonLoading(true);
    const response: RequestForWidgetResponse = await requestForWidgetService(workspaceId, values);
    if (response) {
      showSuccessToast('Request for widget successful');
      setWidgetModalOpen(false);
      setIsButtonLoading(false);
    } else {
      setWidgetModalOpen(false);
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="w-[28%] xl:w-[23%] 3xl:w-[22%] 4xl:w-[21%]  widgetDrawerGradient left-0 top-0 pb-2 max-h-[156.25rem] min-h-screen px-7 absolute z-40 ">
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

        <div className="overflow-scroll widget-height overflow-x-hidden">
          {!sidePanelWidgets?.length && (
            <div className="flex justify-center items-center font-Poppins font-semibold text-lg mt-3 text-infoBlack">No Widgets to be displayed</div>
          )}
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
                className="translate-x-0 translate-y-0"
              >
                {renderWidget(
                  component?.widget?.widgetLocation as string,
                  component?.isAssigned as boolean,
                  widgetProps as unknown as WidgetComponentProps
                )}
              </div>
            );
          })}

        </div>
        <Button
          text="Request for a Widget"
          type="submit"
          className="font-Poppins rounded-lg sticky bottom-0  w-full text-base font-semibold text-white py-3.5 transition ease-in duration-300 hover:shadow-buttonShadowHover btn-gradient"
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
            <Formik initialValues={initialValues} onSubmit={handleRequestForWidgetSubmit} validateOnChange={true} validationSchema={widgetSchema}>
              {({ errors, handleBlur, handleChange, handleSubmit, touched, values }): JSX.Element => (
                <Form className="flex flex-col relative  px-1.93 mt-9" onSubmit={handleSubmit}>
                  <label htmlFor="name " className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack ">
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="nameId"
                    value={values.name}
                    className="mt-0.375 inputs app-result-card-border box-border bg-white shadow-inputShadow rounded-0.3 h-2.81 w-20.5 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31 focus:outline-none px-3"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                  <label htmlFor="description" className="leading-1.31 font-Poppins font-normal text-trial text-infoBlack mt-1.06">
                    Description
                  </label>
                  <TextArea
                    name="description"
                    id="descriptionId"
                    value={values.description}
                    className="mt-0.375 inputs text-area app-result-card-border rounded-0.3 w-20.5 h-6.06 shadow-inputShadow focus:outline-none p-3 placeholder:font-Poppins placeholder:text-sm placeholder:text-thinGray placeholder:leading-1.31"
                    placeholder="Description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    errors={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
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
                      disabled={isButtonLoading ? true : false}
                      className={`text-white font-Poppins text-error font-medium leading-5 btn-save-modal rounded shadow-contactBtn w-5.25 ${
                        isButtonLoading ? 'opacity-50 cursor-not-allowed ' : 'cursor-pointer'
                      } border-none h-2.81`}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
      </div>
    </div>
  );
};

const widgetSchema = Yup.object().shape({
  name: Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(4, 'Widget Name must be at least 4 characters')
    .max(25, 'Widget Name should not exceed above 25 characters')
    .matches(whiteSpace_single_regex, 'White spaces are not allowed')
    .required('Widget Name is a required field')
    .nullable(true),

  description: Yup.string()
    .trim('WhiteSpaces are not allowed')
    .min(4, 'Widget Description must be at least 4 characters')
    .max(100, 'Widget Description should not exceed above 100 characters')
    .matches(whiteSpace_single_regex, 'White spaces are not allowed')
    .required('Widget Description is a required field')
    .nullable(true)
});

export default SidePanelWidgets;
