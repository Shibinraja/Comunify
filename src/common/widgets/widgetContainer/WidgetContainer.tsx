import React, { Suspense, useCallback, useState } from 'react';

import ReactGridLayout, { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import Skeleton from 'react-loading-skeleton';

import SidePanelWidgets from 'common/widgetLayout/SidePanelWidgets';
import WidgetComponents from 'common/widgets';

import noWidgetIcon from '../../../assets/images/no-widget.svg';

import '../../../../node_modules/react-grid-layout/css/styles.css';

import { PanelWidgetsType, WidgetComponentProps, WidgetContainerProps } from 'common/widgetLayout/WidgetTypes';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

export default function WidgetContainer(props: WidgetContainerProps) {
  const { isManageMode, widgets, setWidgets, setTransformedWidgetData } = props;

  const [widgetKey, setWidgetKey] = useState<string | null>(null);
  const [widgetRemoved, setWidgetRemoved] = React.useState<string>();

  const renderWidget = (widgetLocation: string, props: React.PropsWithoutRef<WidgetComponentProps>) => {
    /* @vite-ignore */
    // use this while developing because vite doesn't hot reload dynamically imported components
    const Widget = WidgetComponents[widgetLocation];

    // Use dynamic import while pushing to prod
    // const Widget = lazy(() => import(`../../../common/widgets/${widgetLocation}/${widgetLocation}`));
    return (
      <Suspense
        fallback={
          <div>
            <Skeleton width={800} height={300} count={1} />
          </div>
        }
      >
        <Widget {...props} />
      </Suspense>
    );
  };

  const onDrop = useCallback(
    (items: Layout[], item: Layout, e: DragEvent) => {
      if (setWidgets) {
        const raw = e.dataTransfer?.getData('droppableWidget');
        if (!raw) {
          return;
        }
        const droppableWidget: any = JSON.parse(raw);
        setWidgetKey(droppableWidget?.widget?.widgetLocation);

        const newWidgetArray = [...widgets];
        const droppedWidget: PanelWidgetsType = {
          layout: { ...droppableWidget.layout },
          widget: { ...droppableWidget.widget },
          isAssigned: { ...droppableWidget.isAssigned }
        };
        newWidgetArray.push(droppedWidget);

        setWidgets(newWidgetArray);
      }
    },
    [widgets]
  );

  const removeWidgetFromDashboard = (selectedWidget: PanelWidgetsType) => {
    if (setWidgets) {
      setWidgetRemoved(selectedWidget?.widget?.widgetLocation);
      const newWidgetArray = widgets?.filter((data) => data?.widget?.widgetLocation !== selectedWidget.widget.widgetLocation);

      setWidgets(newWidgetArray);
    }
  };

  const onLayoutChange = useCallback(
    (currentLayout: ReactGridLayout.Layout[]) => {
      if (setTransformedWidgetData) {
        const widgetsToBeSaved = currentLayout.map((layout: Layout) => {
          const existingWidget = widgets.find((widget) => layout.i === widget.id);
          return {
            id: existingWidget?.id,
            widgetId: existingWidget?.widget?.widgetId || layout.i,
            status: 'Active',
            order: 1,
            config: {
              ...layout
            }
          };
        });

        setTransformedWidgetData(widgetsToBeSaved);
      }
    },
    [widgets]
  );

  const widgetProps = {
    isManageMode,
    removeWidgetFromDashboard,
    widget: {}
  };
  return (
    <>
      {isManageMode && <SidePanelWidgets widgetKey={widgetKey !== null ? widgetKey : ''} widgetRemoved={widgetRemoved ? widgetRemoved : ''} />}
      <ResponsiveReactGridLayout
        autoSize={true}
        preventCollision={false}
        useCSSTransforms
        isDroppable={true}
        measureBeforeMount={false}
        compactType={'vertical'}
        onDrop={onDrop}
        allowOverlap={false}
        isDraggable={isManageMode}
        isResizable={isManageMode}
        rowHeight={10}
        isBounded
        // breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        // margin={[0, 30]}
        onLayoutChange={onLayoutChange}
        resizeHandles={['ne']}
        style={{
          minHeight: `${isManageMode ? '160vh' : '0'}`,
          width: '100%'
        }}
      >
        {widgets?.map((widget) => {
          widgetProps.widget = widget;
          return (
            <div key={widget?.layout?.i} data-grid={widget?.layout}>
              {renderWidget(widget?.widget?.widgetLocation, widgetProps as unknown as WidgetComponentProps)}
            </div>
          );
        })}
      </ResponsiveReactGridLayout>
      {!widgets?.length && !isManageMode && (
        <div className="flex flex-col items-center justify-center fixWidgetNoDataHeight {">
          <img src={noWidgetIcon} alt="" className="w-[3.8125rem] h-[3.8125rem]" />
          <div className="font-Poppins font-medium text-tableDuration text-noReports leading-10 pt-5">No widgets added</div>
        </div>
      )}
    </>
  );
}
