import { SuccessResponse } from '@/lib/api';
import { SubscriptionPackages } from '../../interface/authentication.interface';

export type VoidGenerator<T = unknown, TNext = unknown> = Generator<T, void, TNext>;

export interface InitialState {
    isAuthenticated: boolean;
    subscriptionData: SubscriptionPackages[];
    workspaceData: Array<[]>;
    clearFormikValue: boolean;
    authorizedToken:string
}

export type NetworkResponse<T> = {
    data: SuccessResponse<T>;
    status: number;
    statusText: string;
    headers: {};
    config: {};
};

export type AxiosError<T> = {
    code: string;
    config: {};
    message: string;
    name: string;
    request: XMLHttpRequest;
    response: NetworkResponse<T>;
};
