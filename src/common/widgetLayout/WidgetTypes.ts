import { SidePanelWidgetsData } from '../../modules/dashboard/interface/dashboard.interface';

export type WidgetIdentification = {
  widgetKey: string;
  sidePanelWidgetsData?: SidePanelWidgetsData[];
};

export type PanelWidgetsType = {
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
    i: string;
  };
  widget: { widgetLocation: string; invocationType: number };
};

export type WidgetsArrayBody = {
  id: string | undefined;
  widgetId: string;
  config?: {
    minWidth?: string;
    maxWidth?: string;
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
