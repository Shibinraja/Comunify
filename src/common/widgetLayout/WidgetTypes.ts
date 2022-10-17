/* eslint-disable no-unused-vars */
import { SidePanelWidgetsData } from '../../modules/dashboard/interface/dashboard.interface';
import ReactGridLayout from 'react-grid-layout';

export type WidgetIdentification = {
  widgetKey: string[];
  sidePanelWidgetsData?: SidePanelWidgetsData[];
  widgetRemoved: string;
};

export type PanelWidgetsType = {
  id?: string;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
    minW?: number;
    minH?: number;
    maxH?: number;
  };
  widget: { widgetLocation: string; invocationType: number; widgetId: string };
  isAssigned: boolean;
};

export type WidgetsArrayBody = {
  id: string | undefined;
  widgetId: string;
  config?: {
    minW?: number;
    maxH?: number;
    h?: number;
    w?: number;
    x?: number;
    y?: number;
  };
  order: number;
  status: string;
};

export interface HealthScoreWidgetData {
  title: string;
  percentage: number;
}

export interface WidgetComponentProps {
  isManageMode: boolean | undefined;
  widget: PanelWidgetsType;
  isShrunk?: boolean;
  isSidePanelOpen: boolean;
  filters: WidgetFilters;
  // eslint-disable-next-line no-unused-vars
  removeWidgetFromDashboard: (selectedWidget: PanelWidgetsType) => void;
}

export interface WidgetFilters {
  startDate: string | null;
  endDate: string | null;
  type?: string;
  limit?: number;
  platformId?: string[];
}

export interface WidgetContainerProps {
  isManageMode: boolean | undefined;
  widgets: Array<Omit<PanelWidgetsType, 'isAssigned'>>;
  setWidgets?: React.Dispatch<React.SetStateAction<Array<Omit<PanelWidgetsType, 'isAssigned'>>> | []>;
  setTransformedWidgetData?: React.Dispatch<React.SetStateAction<Array<TransformWidgetDataType>>>;
  filters?: WidgetFilters;
}

export interface TransformWidgetDataType {
  id: string | undefined;
  widgetId: string;
  status: string;
  order: number;
  config: ReactGridLayout.Layout;
  widget: { widgetLocation: string; invocationType: number; widgetId: string } | undefined;
}
