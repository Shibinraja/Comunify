/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import type { AxiosResponse } from 'axios';

export interface AjaxResponse<T extends unknown = unknown> {
  config?: any;
  data?: T;
  headers?: any;
  request?: any;
}

export type SuccessResponse<T> = {
  error: boolean;
  data: T;
  message: string;
  version: string;
};

export type NetworkResponse<T> = {
  data: SuccessResponse<T>;
  status: number;
  statusText: string;
  headers: any;
  config: any;
};

export type AxiosError<T> = {
  code: string;
  config: any;
  message: string;
  name: string;
  request: XMLHttpRequest;
  response: NetworkResponse<T>;
};

export type ServerResponse<T extends any = any> = AxiosResponse<SuccessResponse<T>>;

export type GeneratorResponse<T extends unknown = unknown> = Generator<Promise<ServerResponse<T>>, SuccessResponse<T>, ServerResponse<T>>;
