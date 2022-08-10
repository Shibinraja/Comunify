/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import type { AxiosResponse } from 'axios';

export interface AjaxResponse<T extends unknown = unknown> {
  config?: T;
  data?: T;
  headers?: T;
  request?: T;
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
  headers: T;
  config: T;
};

export type AxiosError<T> = {
  code: string;
  config: T;
  message: string;
  name: string;
  request: XMLHttpRequest;
  response: NetworkResponse<T>;
};

export type ServerResponse<T extends unknown = unknown> = AxiosResponse<SuccessResponse<T>>;

export type GeneratorResponse<T extends unknown = unknown> = Generator<Promise<ServerResponse<T>>, SuccessResponse<T>, ServerResponse<T>>;
