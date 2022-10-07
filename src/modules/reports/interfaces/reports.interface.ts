/* eslint-disable */

import { Dispatch, SetStateAction } from 'react';

export enum ReportFilterDropDownEnum {
  platform = 'platform',
  status = 'status',
  activeBetween = 'activeBetween'
}

export enum ActionDropDownEnum {
  Edit = 'Edit',
  Generate = 'Generate',
  Remove = 'Remove',
  'Schedule Off' = 'Schedule Off'
}

export enum ScheduleReportsEnum {
  Yes = 'Yes',
  No = 'No'
}

export enum CustomReportDateType {
  Day = '1day',
  Week = '7day',
  Month = '1month',
  Year = '1year'
}

export type customReportDateLinkProps = {
  '1day': boolean;
  '7day': boolean;
  '1month': boolean;
  '1year': boolean;
};

export const ReportOptions = [
  {
    id: 1,
    name: 'Daily'
  },
  {
    id: 2,
    name: 'Weekly'
  },
  {
    id: 3,
    name: 'Monthly'
  }
];

export enum ScheduleReportDateType {
  'No Schedule' = 1,
  Weekdays = 2,
  Daily = 3,
  Weekly = 4,
  Monthly = 5,
  Yearly = 6
}

export enum ReportStatusEnum {
  Active = 'Active',
  InActive = 'InActive'
}

enum WidgetsDataEnum {
  Active,
  Disabled
}

export type createReportInitialValues = {
  name: string;
  description: string;
  emails: Array<string>;
  schedule: string;
  platform: Array<string>;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export type WidgetPreviewType = {
  isOpen:boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  widgets:any[]
}

//request body

export type ReportsListServiceProps = {
  workspaceId: string;
  reportId:string;
  body: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    emails: Array<string>;
    schedule: number;
    platform: Array<string>;
    widgetsData: [
      {
        widgetId: string;
        config: Record<string, unknown>;
        order: number;
        status: WidgetsDataEnum.Active;
      }
    ];
  };
};

//response body
type reportPlatformType = {
  userWorkspaceReportSettingsId: string;
  workspacePlatformId: string;
  createdAt: string;
  workspacePlatforms: {
    platform: {
      id: string;
      createdAt: string;
      updatedAt: string;
      name: string;
      platformLogoUrl: string;
      status: string;
      errorMessage: string;
      isActive: true;
    };
  };
};

type workspaceReportSettingsType = {
  id: string;
  userWorkspaceReportId: string;
  scheduleRepeat: number;
  isScheduleActive: boolean;
  emailRecipients: {
    email: string;
  };
  reportStartAt: string;
  reportEndAt: string;
  createdAt: string;
  updatedAt: string;
  reportPlatforms: Array<reportPlatformType>;
};

export type ReportListServiceResponsePropsData = {
    id: string;
    name: string;
    description: string;
    userId: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    workspaceReportSettings: Array<workspaceReportSettingsType>;
};

export type getReportsListServiceResponseProps = {
  data: Array<ReportListServiceResponsePropsData>;
  totalPages: string;
  previousPage: string;
  nextPage: string;
};
export interface createReportsListServiceResponseProps {
  report: {
    id: string;
    name: string;
    description: string;
    userId: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
  };
  reportSettings: {
    id: string;
    userWorkspaceReportId: string;
    scheduleRepeat: number;
    isScheduleActive: boolean;
    emailRecipients: {
      email: string;
    };
    reportStartAt: string;
    reportEndAt: string;
    createdAt: string;
    updatedAt: string;
  };
  reportUrl: string;
};

export interface updateReportsListServiceResponseProps extends createReportsListServiceResponseProps {
  reportWidgets: {
    id: string,
    createdAt: string,
    updatedAt: string,
    widgetId: string,
    workspaceId: string,
    userId: string,
    config: {},
    order: number,
    status: string,
    widget: {
      invocationType: number,
      widgetLocation: string,
      name: string
    }
  }
};

export type deleteReportServiceResponseProps = {
  id: string;
  name: string;
  description: string;
  userId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};

export type scheduleReportServiceResponseProps = {
  id: string;
  userWorkspaceReportId: string;
  scheduleRepeat: number;
  isScheduleActive: boolean;
  emailRecipients: {
    email: string;
  }[];
  reportStartAt: string;
  reportEndAt: string;
  createdAt: string;
  updatedAt: string;
  userWorkSpaceReport: {
    id: string;
    name: string;
    description: string;
    userId: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
  };
};
export type ReportsHistoryListServiceData = {
  id: string;
  userWorkspaceReportId: string;
  reportPath: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  userWorkspaceReport: {
    id: string;
    name: string;
    description: string;
    userId: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    workspaceReportSettings: [
      {
        scheduleRepeat: number;
      }
    ];
  };
}

export type getReportsHistoryListServiceResponseProps = {
  data: Array<ReportsHistoryListServiceData>;
  totalPages: string;
  previousPage: string;
  nextPage: string;
};

export type getReportsWidgetListServiceResponseProps ={
  result: [
    {
      id: string,
      createdAt: string,
      updatedAt: string,
      widgetId: string,
      workspaceId: string,
      userId: string,
      config: {},
      order: number,
      status: string,
      widget: {
        invocationType: number,
        widgetLocation: string,
        name: string
      }
    }
  ],
  nextCursor: string
}

export type generateInstantReportResponseProp = {
  data:ReportsHistoryListServiceData,
  reportUrl:string
}

export type reportHistoryDetailsResponseProp = {
  history: {
    startAt: string,
    endAt: string,
},
report: {
  id: string,
  name: string,
  description: string,
  workspaceReportSettings: Array<workspaceReportSettingsType>
}
}
