/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Button from 'common/button/Button';
import { ModalDrawer } from 'common/modals/ModalDrawer';
import { showSuccessToast } from 'common/toast/toastFunctions';
import { PanelWidgetsType, TransformWidgetDataType } from 'common/widgetLayout/WidgetTypes';
import WidgetContainer from 'common/widgets/widgetContainer/WidgetContainer';
import { dispatchReportsListService, dispatchUpdateReportsListService, getReportWidgetsListService } from 'modules/reports/services/reports.service';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import WidgetPreview from '../createReport/WidgetPreview';

const widgetsReports: React.FC = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [isManageMode, setIsManageMode] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<Array<Omit<PanelWidgetsType, 'isAssigned'>>>([]);
  const [transformedWidgetData, setTransformedWidgetData] = React.useState<any>(new Array(null));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewWidgetsData, setPreviewWidgetsData] = useState<Array<Omit<PanelWidgetsType, 'isAssigned'>>>([]);

  const reportValuesData = JSON.parse(localStorage.getItem('reportValues')!);
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get('reportId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate') || '';

  // Function to call the api and list the membersSuggestionList
  const getReportWidgetsList = async(props: { page: number; limit: number }) => {
    setLoading(true);
    const data = await getReportWidgetsListService({
      workspaceId: workspaceId!,
      reportId: reportId!,
      params: {
        page: props.page,
        limit: props.limit
      }
    });
    setLoading(false);
    const widgetDataArray =
      data?.result.map((widget) => ({
        id: widget?.id,
        layout: { ...widget.config, i: widget?.id },
        widget: { ...widget?.widget, widgetId: widget?.widgetId }
      })) || [];
    setWidgets(widgetDataArray as unknown as PanelWidgetsType[]);
  };

  useEffect(() => {
    setIsManageMode(true);
    if (reportId) {
      getReportWidgetsList({
        limit: 10,
        page: 1
      });
    }
  }, [reportId]);

  useEffect(() => {
    if (transformedWidgetData?.length) {
      const newWidgetDataArray = transformedWidgetData?.reduce?.(
        (acc: Array<Omit<PanelWidgetsType, 'isAssigned'>>, curr: TransformWidgetDataType) => {
          const widgets = {
            id: curr?.id,
            layout: { x: 0, y: 0, w: 0, h: 0, i: curr?.id },
            widget: { widgetLocation: curr?.widget?.widgetLocation, invocationType: curr?.widget?.invocationType, widgetId: curr?.widget?.widgetId }
          };
          widgets['layout'] = curr?.config;
          acc.push(widgets);
          return acc;
        },
        []
      );

      setPreviewWidgetsData(newWidgetDataArray);
    }
  }, [transformedWidgetData]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleGenerateReport = () => {
    const newValues = { ...reportValuesData };
    delete newValues['platformId'];

    newValues['widgetsData'] = transformedWidgetData;

    if (!reportId) {
      dispatchReportsListService({
        workspaceId: workspaceId!,
        body: newValues
      }).then((data) => {
        if (data) {
          showSuccessToast('Report Created');
          if (data.reportUrl) {
            window.open(data.reportUrl, '_blank');
            navigate(`/${workspaceId}/reports`);
          } else {
            navigate(`/${workspaceId}/reports`);
          }
        }
      });
    }

    if (reportId) {
      dispatchUpdateReportsListService({
        workspaceId: workspaceId!,
        body: newValues,
        reportId: reportId!
      }).then((data) => {
        if (data) {
          showSuccessToast('Report Updated');
          if (data.reportUrl) {
            window.open(data.reportUrl, '_blank');
            navigate(`/${workspaceId}/reports`);
          } else {
            navigate(`/${workspaceId}/reports`);
          }
        }
      });
    }
  };

  //On Submit functionality
  const handleOnSubmit = () => {
    if (modalOpen) {
      handleGenerateReport();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pl-2.5 relative py-10">
        <h3 className="text-center font-Inter font-semibold text-[23.47px] text-[#08080D] leading-6">Customize your Report</h3>
      </div>
      <WidgetContainer
        isManageMode={isManageMode}
        widgets={widgets}
        setWidgets={setWidgets}
        setTransformedWidgetData={setTransformedWidgetData}
        filters={{ startDate, endDate, platformId: reportValuesData?.platformIds }}
      />

      <div className="flex justify-end pt-10 items-center">
        <Button
          type="button"
          text=""
          className="mr-2.5 w-6.875 h-3.12 border-[#9B9B9B] border-2 items-center px-5 rounded-0.3 shadow-connectButtonShadow "
          onClick={() => navigate(-1)}
        >
          <div className="font-Poppins font-medium text-[#808080] leading-5 text-[13px] ">Back</div>
        </Button>
        <Button
          type="button"
          text=""
          className="mr-2.5 w-6.875 bg-[#161616] border-backBorder h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow"
          onClick={() => setIsOpen(true)}
        >
          <div className="font-Poppins font-medium text-white leading-5 text-[13px] ">Preview</div>
        </Button>
        <Button
          text=""
          type="submit"
          onClick={() => transformedWidgetData.length && setModalOpen(true)}
          className={`justify-between w-11.68 btn-save-modal h-3.12 items-center px-5 rounded-0.3 shadow-connectButtonShadow ${
            !transformedWidgetData.length ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="font-Poppins font-medium text-white leading-5 text-[13px] ">Generate Report</div>
        </Button>
      </div>
      {isOpen && (
        <WidgetPreview
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          filters={{ startDate, endDate, platformId: reportValuesData?.platformId }}
          transformData={previewWidgetsData}
        />
      )}
      <ModalDrawer
        isOpen={modalOpen}
        isClose={handleModalClose}
        loader={loading}
        onSubmit={handleOnSubmit}
        iconSrc={''}
        contextText={'Are you sure you want to generate the report?'}
      />
    </div>
  );
};

export default widgetsReports;
